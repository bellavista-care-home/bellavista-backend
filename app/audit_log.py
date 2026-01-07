"""
Audit Logging Module
Logs all admin operations for security audit trail
"""

import json
from datetime import datetime
from flask import request, g
import logging

# Configure audit logger
audit_logger = logging.getLogger('audit')

def setup_audit_logging(app):
    """Setup audit logging when app initializes"""
    # Create audit log file handler
    handler = logging.FileHandler('audit.log')
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    handler.setFormatter(formatter)
    audit_logger.addHandler(handler)
    audit_logger.setLevel(logging.INFO)

def get_current_user():
    """Get current user from Flask g object (set by auth decorator)"""
    if hasattr(g, 'current_user'):
        return g.current_user
    return 'unknown'

def get_user_ip():
    """Get user's IP address"""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    return request.remote_addr

def log_action(action, resource_type, resource_id, changes=None, success=True):
    """
    Log an admin action
    
    Args:
        action: 'create', 'update', 'delete', 'login', 'logout'
        resource_type: 'home', 'news', 'faq', 'vacancy', 'user'
        resource_id: ID of the resource affected
        changes: Dictionary of what changed {field: {old: value, new: value}}
        success: Whether the action succeeded
    """
    user = get_current_user()
    ip_address = get_user_ip()
    timestamp = datetime.utcnow().isoformat()
    
    log_entry = {
        'timestamp': timestamp,
        'action': action,
        'resource_type': resource_type,
        'resource_id': str(resource_id),
        'user': user,
        'ip_address': ip_address,
        'success': success,
        'changes': changes or {}
    }
    
    audit_logger.info(json.dumps(log_entry))

def log_login_attempt(success, reason=None):
    """Log login attempt"""
    ip_address = get_user_ip()
    timestamp = datetime.utcnow().isoformat()
    
    log_entry = {
        'timestamp': timestamp,
        'action': 'login_attempt',
        'success': success,
        'ip_address': ip_address,
        'reason': reason
    }
    
    audit_logger.info(json.dumps(log_entry))

def log_unauthorized_access(resource_type, resource_id, reason='missing_token'):
    """Log unauthorized access attempts"""
    ip_address = get_user_ip()
    timestamp = datetime.utcnow().isoformat()
    
    log_entry = {
        'timestamp': timestamp,
        'action': 'unauthorized_access',
        'resource_type': resource_type,
        'resource_id': str(resource_id),
        'ip_address': ip_address,
        'reason': reason
    }
    
    audit_logger.warning(json.dumps(log_entry))

def log_error(error_type, message, resource_type=None, resource_id=None):
    """Log errors and suspicious activities"""
    ip_address = get_user_ip()
    user = get_current_user()
    timestamp = datetime.utcnow().isoformat()
    
    log_entry = {
        'timestamp': timestamp,
        'error_type': error_type,
        'message': message,
        'resource_type': resource_type,
        'resource_id': str(resource_id) if resource_id else None,
        'user': user,
        'ip_address': ip_address
    }
    
    audit_logger.error(json.dumps(log_entry))
