"""
Session Management Module
Handles session timeout and inactivity checking
"""

from datetime import datetime, timedelta
from functools import wraps
from flask import session, g, request, jsonify

# Session configuration
SESSION_TIMEOUT_MINUTES = 30
SESSION_WARNING_MINUTES = 25

class SessionManager:
    """Manages user sessions and timeouts"""
    
    @staticmethod
    def init_session(user_id, username, role):
        """Initialize a new session"""
        session['user_id'] = user_id
        session['username'] = username
        session['role'] = role
        session['created_at'] = datetime.utcnow().isoformat()
        session['last_activity'] = datetime.utcnow().isoformat()
        session.permanent = True
        return session
    
    @staticmethod
    def update_activity():
        """Update last activity timestamp"""
        if 'user_id' in session:
            session['last_activity'] = datetime.utcnow().isoformat()
    
    @staticmethod
    def check_timeout():
        """Check if session has timed out"""
        if 'user_id' not in session:
            return False, None
        
        last_activity_str = session.get('last_activity')
        if not last_activity_str:
            return False, None
        
        try:
            last_activity = datetime.fromisoformat(last_activity_str)
            now = datetime.utcnow()
            elapsed = (now - last_activity).total_seconds() / 60  # minutes
            
            if elapsed > SESSION_TIMEOUT_MINUTES:
                return True, elapsed  # Session timed out
            
            if elapsed > SESSION_WARNING_MINUTES:
                return False, elapsed  # Warn but don't logout
            
            return False, elapsed
        except:
            return False, None
    
    @staticmethod
    def get_session_info():
        """Get current session information"""
        if 'user_id' not in session:
            return None
        
        created_at = datetime.fromisoformat(session.get('created_at', ''))
        last_activity = datetime.fromisoformat(session.get('last_activity', ''))
        now = datetime.utcnow()
        
        return {
            'user_id': session.get('user_id'),
            'username': session.get('username'),
            'role': session.get('role'),
            'created_at': created_at.isoformat(),
            'last_activity': last_activity.isoformat(),
            'elapsed_minutes': (now - last_activity).total_seconds() / 60,
            'timeout_minutes': SESSION_TIMEOUT_MINUTES
        }
    
    @staticmethod
    def clear_session():
        """Clear session data"""
        session.clear()

def require_valid_session(f):
    """Decorator to check for valid, non-expired session"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check if user is logged in
        if 'user_id' not in session:
            return {
                'status': 'error',
                'message': 'Not authenticated',
                'code': 'SESSION_EXPIRED'
            }, 401
        
        # Check session timeout
        timed_out, elapsed = SessionManager.check_timeout()
        
        if timed_out:
            SessionManager.clear_session()
            return {
                'status': 'error',
                'message': 'Session expired due to inactivity',
                'code': 'SESSION_TIMEOUT',
                'elapsed_minutes': elapsed
            }, 401
        
        # Update activity timestamp
        SessionManager.update_activity()
        
        # Store session info in g for this request
        g.session_info = SessionManager.get_session_info()
        
        return f(*args, **kwargs)
    
    return decorated_function

def get_session_expiry_warning():
    """Check if session is about to expire and return warning"""
    session_info = SessionManager.get_session_info()
    if not session_info:
        return None
    
    timed_out, elapsed = SessionManager.check_timeout()
    if timed_out:
        return {
            'warning': 'Session expired',
            'code': 'SESSION_TIMEOUT',
            'elapsed_minutes': int(elapsed)
        }
    
    if elapsed and elapsed > SESSION_WARNING_MINUTES:
        minutes_remaining = SESSION_TIMEOUT_MINUTES - int(elapsed)
        return {
            'warning': f'Session will expire in {minutes_remaining} minutes',
            'code': 'SESSION_WARNING',
            'minutes_remaining': minutes_remaining
        }
    
    return None
