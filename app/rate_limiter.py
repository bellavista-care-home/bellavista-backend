"""
Rate Limiting Module
Implements rate limiting for sensitive endpoints like login to prevent brute force attacks
"""

from flask import request
from datetime import datetime, timedelta
from functools import wraps

# In-memory store for rate limiting (in production, use Redis)
rate_limit_store = {}

class RateLimiter:
    def __init__(self, max_attempts=5, window_seconds=900):  # 5 attempts per 15 minutes
        self.max_attempts = max_attempts
        self.window_seconds = window_seconds
    
    def get_identifier(self):
        """Get unique identifier for the request (IP address or user)"""
        # Use X-Forwarded-For header if available (for proxies), otherwise use remote_addr
        if request.headers.get('X-Forwarded-For'):
            return request.headers.get('X-Forwarded-For').split(',')[0].strip()
        return request.remote_addr
    
    def is_rate_limited(self):
        """Check if request exceeds rate limit"""
        identifier = self.get_identifier()
        now = datetime.utcnow()
        
        # Clean up old entries
        if identifier in rate_limit_store:
            rate_limit_store[identifier] = [
                timestamp for timestamp in rate_limit_store[identifier]
                if now - timestamp < timedelta(seconds=self.window_seconds)
            ]
        
        # Check current count
        if identifier not in rate_limit_store:
            rate_limit_store[identifier] = []
        
        if len(rate_limit_store[identifier]) >= self.max_attempts:
            return True
        
        return False
    
    def record_attempt(self):
        """Record a new attempt"""
        identifier = self.get_identifier()
        now = datetime.utcnow()
        
        if identifier not in rate_limit_store:
            rate_limit_store[identifier] = []
        
        rate_limit_store[identifier].append(now)
    
    def get_remaining_attempts(self):
        """Get remaining attempts for this identifier"""
        identifier = self.get_identifier()
        
        if identifier not in rate_limit_store:
            return self.max_attempts
        
        now = datetime.utcnow()
        recent_attempts = [
            timestamp for timestamp in rate_limit_store[identifier]
            if now - timestamp < timedelta(seconds=self.window_seconds)
        ]
        
        return max(0, self.max_attempts - len(recent_attempts))
    
    def get_reset_time(self):
        """Get time when rate limit resets"""
        identifier = self.get_identifier()
        
        if identifier not in rate_limit_store or not rate_limit_store[identifier]:
            return None
        
        oldest_attempt = min(rate_limit_store[identifier])
        reset_time = oldest_attempt + timedelta(seconds=self.window_seconds)
        return reset_time

def rate_limit(max_attempts=5, window_seconds=900):
    """Decorator for rate limiting endpoints"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            limiter = RateLimiter(max_attempts=max_attempts, window_seconds=window_seconds)
            
            if limiter.is_rate_limited():
                reset_time = limiter.get_reset_time()
                return {
                    'status': 'error',
                    'message': 'Too many attempts. Please try again later.',
                    'retry_after': int((reset_time - datetime.utcnow()).total_seconds()) if reset_time else window_seconds
                }, 429
            
            # Record the attempt
            limiter.record_attempt()
            
            # Call the actual function
            return f(*args, **kwargs)
        
        return decorated_function
    
    return decorator
