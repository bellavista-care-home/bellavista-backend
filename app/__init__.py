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
    # Note: Config object might have already set SECRET_KEY
    if not app.config.get('SECRET_KEY') or app.config['SECRET_KEY'] == 'change-me':
        app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
    
    if config_name == 'production':
        if app.config['SECRET_KEY'] in ['change-me', 'dev-secret-key-change-in-production']:
             raise ValueError("CRITICAL SECURITY ERROR: Weak SECRET_KEY in production. Set JWT_SECRET_KEY or SECRET_KEY env var.")

    app.config['SESSION_COOKIE_SECURE'] = True  # Only send over HTTPS in production
    app.config['SESSION_COOKIE_HTTPONLY'] = True  # No JS access to session cookie
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # CSRF protection
    
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Setup audit logging
    try:
        from .audit_log import setup_audit_logging
        setup_audit_logging(app)
        print("[APP] Audit logging setup complete", flush=True)
    except Exception as e:
        print(f"[WARNING] Audit logging setup failed: {e}", flush=True)
        import traceback
        traceback.print_exc()
    
    # Setup security headers
    try:
        from .security_headers import setup_security_headers
        setup_security_headers(app)
        print("[APP] Security headers setup complete", flush=True)
    except Exception as e:
        print(f"[WARNING] Security headers setup failed: {e}", flush=True)
        import traceback
        traceback.print_exc()

    # Security: Restrict CORS to production domain and local development
    # In production, we strictly allow the Amplify domain.
    allowed_origins = [
        "https://www.bellavistanursinghomes.com",      # Custom Domain
        "https://bellavistanursinghomes.com",          # Custom Domain (no-www)
        "https://master.dxv4enxpqrrf6.amplifyapp.com",  # Production Frontend
        "http://localhost:5173",                       # Local Development
        "http://127.0.0.1:5173",                       # Local Development IP
        "http://localhost:3000",                       # Fallback localhost
        "http://127.0.0.1:3000"                        # Fallback localhost IP
    ]
    
    # Enable CORS FIRST before registering routes
    # Flask-CORS will automatically handle OPTIONS preflight requests
    try:
        CORS(app, 
             origins=allowed_origins,
             methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             allow_headers=["Content-Type", "Authorization"],
             expose_headers=["Content-Type"],
             supports_credentials=True,
             max_age=3600)
        print("[APP] CORS configuration complete", flush=True)
    except Exception as e:
        print(f"[ERROR] CORS setup failed: {e}", flush=True)
        import traceback
        traceback.print_exc()
        raise

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
    print("[APP] SQLAlchemy initialized", flush=True)
    
    with app.app_context():
        print("[APP] Entering app context for initialization", flush=True)
        
        try:
            print("[DB] Importing models...", flush=True)
            from . import models
            print("[DB] Models imported successfully", flush=True)
        except Exception as e:
            print(f"[ERROR] Failed to import models: {e}", flush=True)
            import traceback
            traceback.print_exc()
            raise
        
        try:
            db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
            if db_uri.startswith('sqlite:'):
                print("[DB] Creating tables for SQLite database...", flush=True)
                db.create_all()
                print("[DB] Tables created successfully", flush=True)
            else:
                print("[DB] Skipping db.create_all() for non-SQLite database", flush=True)
        except Exception as e:
            print(f"[ERROR] Failed to create database tables: {e}", flush=True)
            import traceback
            traceback.print_exc()
            # Don't exit - allow the app to start in case DB is temporarily unavailable
            # The app can serve the health check endpoint
        
        try:
            print("[APP] Importing routes...", flush=True)
            from .routes import api_bp
            print("[APP] Routes imported successfully", flush=True)
            app.register_blueprint(api_bp, url_prefix='/api')
            print("[APP] API blueprint registered", flush=True)
        except Exception as e:
            print(f"[ERROR] Failed to register API blueprint: {e}", flush=True)
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
            print(f"[HEALTH] Database check failed: {e}", flush=True)
            # Still return 200 so load balancer knows the app is running
            # The database connection will be retried on actual requests
            return jsonify({'status': 'ok', 'db': 'disconnected', 'error': str(e)}), 200
    
    @app.route('/uploads/<path:filename>')
    def uploads(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
    # Initialize Scheduler
    try:
        from .tasks import init_scheduler
        init_scheduler(app)
    except Exception as e:
        print(f"[ERROR] Scheduler initialization failed: {e}", flush=True)

    print("[APP] Application initialization complete!", flush=True)
    return app

