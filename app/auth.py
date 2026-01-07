"""
Authentication module for Bellavista Care Home API.
Handles JWT token generation, verification, and role-based access control.
"""

import os
import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from dotenv import load_dotenv
from .account_lockout import AccountLockout, check_account_lockout
from .audit_log import log_login_attempt

# Load environment variables
load_dotenv()

# Configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-me-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 1))
ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'password')

def generate_token(user_id, username, role='admin', expires_in_hours=JWT_EXPIRATION_HOURS):
    """
    Generate a JWT token for authenticated user.
    
    Args:
        user_id: Unique user identifier
        username: Username for logging
        role: User role (default: 'admin')
        expires_in_hours: Token expiration time in hours
    
    Returns:
        JWT token string
    """
    try:
        payload = {
            'user_id': user_id,
            'username': username,
            'role': role,
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(hours=expires_in_hours)
        }
        token = jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
        return token
    except Exception as e:
        print(f"[ERROR] Token generation failed: {str(e)}")
        return None

def verify_token(token):
    """
    Verify and decode a JWT token.
    
    Args:
        token: JWT token string
    
    Returns:
        Decoded payload if valid, None otherwise
    """
    try:
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
        
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        print("[ERROR] Token has expired")
        return None
    except jwt.InvalidTokenError as e:
        print(f"[ERROR] Invalid token: {str(e)}")
        return None
    except Exception as e:
        print(f"[ERROR] Token verification failed: {str(e)}")
        return None

def require_auth(f):
    """
    Decorator to protect routes requiring authentication.
    Validates JWT token from Authorization header.
    
    Usage:
        @app.route('/api/admin/homes', methods=['POST'])
        @require_auth
        def create_home():
            return jsonify({'status': 'success'})
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header:
            return jsonify({
                'status': 'error',
                'message': 'Missing authorization token'
            }), 401
        
        try:
            # Extract token from "Bearer <token>"
            token = auth_header.split(' ')[-1]
            
            # Verify token
            payload = verify_token(token)
            if not payload:
                return jsonify({
                    'status': 'error',
                    'message': 'Invalid or expired token'
                }), 401
            
            # Store payload in request for use in route handler
            request.auth_payload = payload
            
            return f(*args, **kwargs)
        
        except Exception as e:
            return jsonify({
                'status': 'error',
                'message': f'Authentication failed: {str(e)}'
            }), 401
    
    return decorated_function

def login_user(username, password):
    """
    Authenticate user credentials and generate token.
    Includes account lockout protection after failed attempts.
    
    Args:
        username: Username to authenticate
        password: Password to verify
    
    Returns:
        Dictionary with token if successful, error message otherwise
    """
    # Check if account is locked
    lockout_check = check_account_lockout(username)
    if lockout_check[0]:
        log_login_attempt(False, 'ACCOUNT_LOCKED')
        return lockout_check[0]
    
    # Validate against environment credentials
    if username != ADMIN_USERNAME or password != ADMIN_PASSWORD:
        # Record failed attempt
        AccountLockout.record_failed_attempt(username)
        remaining = AccountLockout.get_remaining_attempts(username)
        
        print(f"[SECURITY] Failed login attempt for user: {username} ({remaining} attempts remaining)")
        log_login_attempt(False, 'invalid_credentials')
        
        return {
            'status': 'error',
            'message': 'Invalid credentials',
            'attempts_remaining': remaining
        }
    
    # Successful login - clear failed attempts
    AccountLockout.record_successful_attempt(username)
    
    # Generate token
    token = generate_token(user_id='1', username=username, role='admin')
    
    if not token:
        log_login_attempt(False, 'token_generation_failed')
        return {
            'status': 'error',
            'message': 'Token generation failed'
        }
    
    print(f"[SECURITY] Successful login for user: {username}")
    log_login_attempt(True)
    
    return {
        'status': 'success',
        'message': 'Login successful',
        'token': token,
        'user': {
            'username': username,
            'role': 'admin'
        }
    }

def require_admin(f):
    """
    Decorator to protect routes that require admin role.
    Must be used after @require_auth.
    
    Usage:
        @app.route('/api/admin/users', methods=['GET'])
        @require_auth
        @require_admin
        def get_users():
            return jsonify({'users': []})
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not hasattr(request, 'auth_payload'):
            return jsonify({
                'status': 'error',
                'message': 'Authentication required'
            }), 401
        
        if request.auth_payload.get('role') != 'admin':
            return jsonify({
                'status': 'error',
                'message': 'Admin access required'
            }), 403
        
        return f(*args, **kwargs)
    
    return decorated_function
