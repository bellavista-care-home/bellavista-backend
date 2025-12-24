import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import config

db = SQLAlchemy()

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_CONFIG', 'default')

    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    allowed_origins = app.config.get('ALLOWED_ORIGINS', '*')
    if isinstance(allowed_origins, str):
        allowed_origins = [o.strip() for o in allowed_origins.split(',') if o.strip()]

    # Security: Restrict CORS to production domain and local development
    # In production, we strictly allow the Amplify domain.
    allowed_origins = [
        "https://master.dxv4enxpqrrf6.amplifyapp.com",  # Production Frontend
        "http://localhost:5173",                       # Local Development
        "http://127.0.0.1:5173"                        # Local Development IP
    ]
    
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)

    # Security Headers
    @app.after_request
    def add_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        return response
    
    db.init_app(app)
    with app.app_context():
        from . import models
        db.create_all()
        from .routes import api_bp
        app.register_blueprint(api_bp, url_prefix='/api')
    
    @app.route('/', methods=['GET'])
    def health_check():
        """Health check endpoint for load balancer"""
        from flask import jsonify
        return jsonify({'status': 'ok'}), 200
    
    @app.route('/uploads/<path:filename>')
    def uploads(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    return app

