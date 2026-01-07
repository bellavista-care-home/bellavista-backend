"""
Security Headers Module
Implements HTTP security headers to protect against common attacks
"""

def add_security_headers(response):
    """Add security headers to HTTP response"""
    
    # Content Security Policy - prevent XSS, clickjacking, etc
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; "
        "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; "
        "img-src 'self' data: https: blob:; "
        "font-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com; "
        "connect-src 'self' https:; "
        "frame-ancestors 'self'; "
        "form-action 'self'; "
        "base-uri 'self'"
    )
    
    # Prevent MIME type sniffing
    response.headers['X-Content-Type-Options'] = 'nosniff'
    
    # Prevent clickjacking attacks
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    
    # Enable XSS protection in older browsers
    response.headers['X-XSS-Protection'] = '1; mode=block'
    
    # Force HTTPS
    response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
    
    # Control referrer information
    response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
    
    # Permissions policy (formerly Feature-Policy)
    response.headers['Permissions-Policy'] = (
        'accelerometer=(), camera=(), geolocation=(), gyroscope=(), '
        'magnetometer=(), microphone=(), payment=(), usb=()'
    )
    
    # Remove server header to hide implementation details
    if 'Server' in response.headers:
        del response.headers['Server']
    
    return response

def setup_security_headers(app):
    """Register security headers middleware with Flask app"""
    @app.after_request
    def apply_security_headers(response):
        return add_security_headers(response)
