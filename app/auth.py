"""
Authentication module for Bellavista Care Home API.
Handles JWT token generation, verification, and role-based access control.
"""

import os
import jwt
import uuid
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
from .account_lockout import AccountLockout, check_account_lockout
from .audit_log import log_login_attempt
from . import db
from .models import User

# Load environment variables
load_dotenv()

# Configuration
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-me-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = int(os.getenv('JWT_EXPIRATION_HOURS', 24))
ADMIN_USERNAME = os.getenv('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD', 'password')

# Security check: Ensure we don't use defaults in production
if os.environ.get('FLASK_CONFIG') == 'production':
    if ADMIN_USERNAME == 'admin' and ADMIN_PASSWORD == 'password':
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        print("!! CRITICAL SECURITY WARNING: DEFAULT ADMIN CREDENTIALS IN PRODUCTION !!")
        print("!! Set ADMIN_USERNAME and ADMIN_PASSWORD environment variables immediately !!")
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

def generate_token(user_id, username, role='admin', home_id=None, expires_in_hours=JWT_EXPIRATION_HOURS):
    """
    Generate a JWT token for authenticated user.
    
    Args:
        user_id: Unique user identifier
        username: Username for logging
        role: User role ('superadmin' or 'home_admin')
        home_id: ID of the home (if role is home_admin)
        expires_in_hours: Token expiration time in hours
    
    Returns:
        JWT token string
    """
    try:
        payload = {
            'user_id': user_id,
            'username': username,
            'role': role,
            'home_id': home_id,
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
        tuple: (payload, error_message)
    """
    try:
        # Remove 'Bearer ' prefix if present
        if token.startswith('Bearer '):
            token = token[7:]
        
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload, None
    except jwt.ExpiredSignatureError:
        print("[ERROR] Token has expired")
        return None, "Token has expired"
    except jwt.InvalidTokenError as e:
        print(f"[ERROR] Invalid token: {str(e)}")
        return None, f"Invalid token: {str(e)}"
    except Exception as e:
        print(f"[ERROR] Token verification failed: {str(e)}")
        return None, f"Token verification failed: {str(e)}"

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
            parts = auth_header.split(' ')
            if len(parts) > 1:
                token = parts[1]
            else:
                token = parts[0]
            
            # Verify token
            payload, error = verify_token(token)
            if not payload:
                return jsonify({
                    'status': 'error',
                    'message': error or 'Invalid or expired token'
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

def create_initial_admin():
    """Create the initial superadmin user if no users exist."""
    if User.query.count() == 0:
        print("[AUTH] No users found. Creating initial superadmin from env vars.")
        try:
            admin = User(
                id=str(uuid.uuid4()),
                username=ADMIN_USERNAME,
                password_hash=generate_password_hash(ADMIN_PASSWORD),
                role='superadmin',
                home_id=None
            )
            db.session.add(admin)
            db.session.commit()
            print(f"[AUTH] Created superadmin user: {ADMIN_USERNAME}")
        except Exception as e:
            print(f"[AUTH] Failed to create initial admin: {e}")
            db.session.rollback()

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
    
    # Ensure initial admin exists (migration step)
    create_initial_admin()
    
    # Find user in DB
    user = User.query.filter_by(username=username).first()
    
    if not user or not check_password_hash(user.password_hash, password):
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
    token = generate_token(
        user_id=user.id, 
        username=user.username, 
        role=user.role, 
        home_id=user.home_id
    )
    
    if not token:
        log_login_attempt(False, 'token_generation_failed')
        return {
            'status': 'error',
            'message': 'Token generation failed'
        }
    
    print(f"[SECURITY] Successful login for user: {username} ({user.role})")
    log_login_attempt(True)
    
    return {
        'status': 'success',
        'message': 'Login successful',
        'token': token,
        'user': {
            'username': user.username,
            'role': user.role,
            'homeId': user.home_id
        }
    }

def require_admin(f):
    """
    Decorator to protect routes that require superadmin role.
    Must be used after @require_auth.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not hasattr(request, 'auth_payload'):
            return jsonify({
                'status': 'error',
                'message': 'Authentication required'
            }), 401
        
        # Check for 'superadmin' role (or legacy 'admin' for backward compat if needed)
        role = request.auth_payload.get('role')
        if role != 'superadmin' and role != 'admin':
            return jsonify({
                'status': 'error',
                'message': 'Admin access required'
            }), 403
        
        return f(*args, **kwargs)
    
    return decorated_function
