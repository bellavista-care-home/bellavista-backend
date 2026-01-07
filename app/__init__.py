import os
from flask import Flask, send_from_directory, request, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import config

db = SQLAlchemy()

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_CONFIG', 'default')

    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Set secret key for session management
    app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['SESSION_COOKIE_SECURE'] = True  # Only send over HTTPS in production
    app.config['SESSION_COOKIE_HTTPONLY'] = True  # No JS access to session cookie
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # CSRF protection
    
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Setup audit logging
    from .audit_log import setup_audit_logging
    setup_audit_logging(app)
    
    # Setup security headers
    from .security_headers import setup_security_headers
    setup_security_headers(app)

    # Security: Restrict CORS to production domain and local development
    # In production, we strictly allow the Amplify domain.
    allowed_origins = [
        "https://master.dxv4enxpqrrf6.amplifyapp.com",  # Production Frontend
        "http://localhost:5173",                       # Local Development
        "http://127.0.0.1:5173",                       # Local Development IP
        "http://localhost:3000",                       # Fallback localhost
        "http://127.0.0.1:3000"                        # Fallback localhost IP
    ]
    
    # Enable CORS FIRST before registering routes
    # Flask-CORS will automatically handle OPTIONS preflight requests
    CORS(app, 
         origins=allowed_origins,
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"],
         expose_headers=["Content-Type"],
         supports_credentials=True,
         max_age=3600)

    # Security Headers (applied AFTER CORS to avoid conflicts)
    @app.after_request
    def add_security_headers(response):
        # Don't override CORS headers that Flask-CORS has already set
        # Just add the security headers
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        return response
    
    db.init_app(app)
    with app.app_context():
        try:
            from . import models
            print("[DB] Creating tables...")
            db.create_all()
            print("[DB] Tables created successfully")
        except Exception as e:
            print(f"[ERROR] Failed to create database tables: {e}")
            import traceback
            traceback.print_exc()
            # Don't exit - allow the app to start in case DB is temporarily unavailable
            # The app can serve the health check endpoint
        
        try:
            from .routes import api_bp
            app.register_blueprint(api_bp, url_prefix='/api')
            print("[APP] API blueprint registered")
        except Exception as e:
            print(f"[ERROR] Failed to register API blueprint: {e}")
            import traceback
            traceback.print_exc()
            raise  # This is critical, must exit
    
    @app.route('/', methods=['GET'])
    def health_check():
        """Health check endpoint for load balancer"""
        from flask import jsonify
        try:
            # Try to connect to database
            from .models import Home
            Home.query.limit(1).all()
            return jsonify({'status': 'ok', 'db': 'connected'}), 200
        except Exception as e:
            print(f"[HEALTH] Database check failed: {e}")
            # Still return 200 so load balancer knows the app is running
            # The database connection will be retried on actual requests
            return jsonify({'status': 'ok', 'db': 'disconnected', 'error': str(e)}), 200
    
    @app.route('/uploads/<path:filename>')
    def uploads(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    return app

