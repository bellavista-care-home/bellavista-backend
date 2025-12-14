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
        allowed_origins = allowed_origins.split(',')

    CORS(app, resources={r"/api/*": {"origins": allowed_origins}})
    
    db.init_app(app)
    with app.app_context():
        from . import models
        db.create_all()
        from .routes import api_bp
        app.register_blueprint(api_bp, url_prefix='/api')
    @app.route('/uploads/<path:filename>')
    def uploads(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    return app

