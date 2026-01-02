import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.dirname(__file__))

# Load .env file first
load_dotenv(os.path.join(basedir, '.env'))

# Determine environment
config_name = os.getenv('FLASK_CONFIG') or os.getenv('APP_ENV') or 'development'

# Load specific environment file (overriding .env)
env_file = os.path.join(basedir, f'.env.{config_name}')
if os.path.exists(env_file):
    load_dotenv(env_file, override=True)

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'change-me')

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # Increase max content length to 50MB to handle multiple large images
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH_MB', '50')) * 1024 * 1024
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', os.path.join(basedir, 'uploads'))
    
    # Timeout settings for long-running operations (in seconds)
    REQUEST_TIMEOUT = int(os.getenv('REQUEST_TIMEOUT', '300'))  # 5 minutes for bulk image uploads
    GUNICORN_TIMEOUT = int(os.getenv('GUNICORN_TIMEOUT', '300'))

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///' + os.path.join(basedir, 'instance', 'bellavista-dev.db'))
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*')

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv('TEST_DATABASE_URL', 'sqlite:///' + os.path.join(basedir, 'instance', 'bellavista-test.db'))
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*')
    WTF_CSRF_ENABLED = False

class ProductionConfig(Config):
    DEBUG = False
    uri = os.getenv('DATABASE_URL')
    if uri and uri.startswith('postgres://'):
        uri = uri.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = uri
    ALLOWED_ORIGINS = os.getenv('ALLOWED_ORIGINS', '*')

config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
