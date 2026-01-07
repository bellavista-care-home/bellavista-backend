"""
CSRF Protection Module
Implements Cross-Site Request Forgery (CSRF) protection using token-based validation
"""

import secrets
import hashlib
from datetime import datetime, timedelta
from flask import session, request, g

# In-memory CSRF token store (in production, use Redis or database)
csrf_tokens = {}

class CSRFProtection:
    """CSRF token generation and validation"""
    
    def __init__(self, app=None, token_length=32):
        self.app = app
        self.token_length = token_length
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize CSRF protection with Flask app"""
        self.app = app
        app.config.setdefault('CSRF_TOKEN_LENGTH', 32)
        app.config.setdefault('CSRF_HEADER_NAME', 'X-CSRF-Token')
        app.config.setdefault('CSRF_FIELD_NAME', '_csrf_token')
        
        @app.before_request
        def setup_csrf_protection():
            """Setup CSRF token in session"""
            if 'csrf_token' not in session:
                session['csrf_token'] = self.generate_token()
            g.csrf_token = session.get('csrf_token')
    
    def generate_token(self, session_id=None):
        """Generate a new CSRF token"""
        token = secrets.token_urlsafe(self.token_length)
        
        # Store token with timestamp
        csrf_tokens[token] = {
            'created_at': datetime.utcnow(),
            'session_id': session_id,
            'used': False
        }
        
        # Clean up old tokens (older than 1 hour)
        self._cleanup_old_tokens()
        
        return token
    
    def validate_token(self, token, session_id=None):
        """Validate CSRF token"""
        if not token:
            return False
        
        if token not in csrf_tokens:
            return False
        
        token_data = csrf_tokens[token]
        
        # Check if token is too old (1 hour)
        if datetime.utcnow() - token_data['created_at'] > timedelta(hours=1):
            del csrf_tokens[token]
            return False
        
        # Token is valid
        token_data['used'] = True
        return True
    
    def get_token(self):
        """Get current CSRF token for template"""
        if 'csrf_token' not in session:
            session['csrf_token'] = self.generate_token()
        return session.get('csrf_token')
    
    def _cleanup_old_tokens(self):
        """Remove tokens older than 1 hour"""
        now = datetime.utcnow()
        expired_tokens = [
            token for token, data in csrf_tokens.items()
            if now - data['created_at'] > timedelta(hours=1)
        ]
        for token in expired_tokens:
            del csrf_tokens[token]

def require_csrf_token(f):
    """Decorator to require valid CSRF token on POST/PUT/DELETE requests"""
    def decorated_function(*args, **kwargs):
        if request.method in ['POST', 'PUT', 'DELETE']:
            # Get token from header or form
            token = None
            
            # Check X-CSRF-Token header (preferred for API)
            if 'X-CSRF-Token' in request.headers:
                token = request.headers.get('X-CSRF-Token')
            
            # Check form data
            elif '_csrf_token' in request.form:
                token = request.form.get('_csrf_token')
            
            # Check JSON body
            elif request.is_json:
                data = request.get_json(silent=True) or {}
                token = data.get('_csrf_token')
            
            if not token:
                return {
                    'status': 'error',
                    'message': 'CSRF token missing'
                }, 403
            
            # Get CSRF validator
            csrf = g.get('csrf_protection')
            if not csrf or not csrf.validate_token(token):
                return {
                    'status': 'error',
                    'message': 'Invalid CSRF token'
                }, 403
        
        return f(*args, **kwargs)
    
    return decorated_function
