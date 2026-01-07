"""
Account Lockout Module
Prevents brute force attacks by locking accounts after failed login attempts
"""

from datetime import datetime, timedelta
from flask import request

# In-memory lockout store (in production, use Redis or database)
failed_attempts = {}
locked_accounts = {}

class AccountLockout:
    """Manages account lockout after failed login attempts"""
    
    MAX_ATTEMPTS = 5
    LOCKOUT_DURATION_MINUTES = 15
    ATTEMPT_WINDOW_MINUTES = 15
    
    @classmethod
    def record_failed_attempt(cls, username):
        """Record a failed login attempt for a username"""
        if username not in failed_attempts:
            failed_attempts[username] = []
        
        now = datetime.utcnow()
        failed_attempts[username].append(now)
        
        # Clean up old attempts (older than attempt window)
        failed_attempts[username] = [
            attempt for attempt in failed_attempts[username]
            if now - attempt < timedelta(minutes=cls.ATTEMPT_WINDOW_MINUTES)
        ]
        
        # Check if account should be locked
        if len(failed_attempts[username]) >= cls.MAX_ATTEMPTS:
            cls.lock_account(username)
    
    @classmethod
    def record_successful_attempt(cls, username):
        """Clear failed attempts after successful login"""
        if username in failed_attempts:
            del failed_attempts[username]
        if username in locked_accounts:
            del locked_accounts[username]
    
    @classmethod
    def lock_account(cls, username):
        """Lock an account due to too many failed attempts"""
        locked_accounts[username] = {
            'locked_at': datetime.utcnow(),
            'duration_minutes': cls.LOCKOUT_DURATION_MINUTES
        }
    
    @classmethod
    def is_account_locked(cls, username):
        """Check if an account is currently locked"""
        if username not in locked_accounts:
            return False
        
        lock_info = locked_accounts[username]
        locked_at = lock_info['locked_at']
        duration = timedelta(minutes=lock_info['duration_minutes'])
        
        if datetime.utcnow() - locked_at > duration:
            # Lock has expired
            del locked_accounts[username]
            if username in failed_attempts:
                del failed_attempts[username]
            return False
        
        return True
    
    @classmethod
    def get_lockout_info(cls, username):
        """Get lockout information for a username"""
        if username not in locked_accounts:
            return None
        
        lock_info = locked_accounts[username]
        locked_at = lock_info['locked_at']
        duration = timedelta(minutes=lock_info['duration_minutes'])
        unlock_time = locked_at + duration
        
        minutes_remaining = (unlock_time - datetime.utcnow()).total_seconds() / 60
        
        return {
            'locked': True,
            'locked_at': locked_at.isoformat(),
            'unlock_time': unlock_time.isoformat(),
            'minutes_remaining': max(0, int(minutes_remaining))
        }
    
    @classmethod
    def get_attempt_count(cls, username):
        """Get current failed attempt count for a username"""
        if username not in failed_attempts:
            return 0
        
        now = datetime.utcnow()
        # Count only recent attempts within the window
        recent_attempts = [
            attempt for attempt in failed_attempts[username]
            if now - attempt < timedelta(minutes=cls.ATTEMPT_WINDOW_MINUTES)
        ]
        
        return len(recent_attempts)
    
    @classmethod
    def get_remaining_attempts(cls, username):
        """Get remaining login attempts before lockout"""
        current_count = cls.get_attempt_count(username)
        remaining = cls.MAX_ATTEMPTS - current_count
        return max(0, remaining)

def check_account_lockout(username):
    """Check if account is locked and return error if so"""
    if AccountLockout.is_account_locked(username):
        lockout_info = AccountLockout.get_lockout_info(username)
        return {
            'status': 'error',
            'message': 'Account temporarily locked due to too many failed login attempts',
            'code': 'ACCOUNT_LOCKED',
            'lockout_info': lockout_info
        }, 429
    
    return None, None
