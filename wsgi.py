import sys
import traceback

try:
    from app import create_app
    print("[WSGI] Creating Flask application...", file=sys.stderr)
    app = create_app()
    print("[WSGI] Flask application created successfully", file=sys.stderr)
except Exception as e:
    print(f"[WSGI FATAL ERROR] Failed to create app: {e}", file=sys.stderr)
    traceback.print_exc(file=sys.stderr)
    # Create a minimal fallback app that can respond to health checks
    from flask import Flask, jsonify
    app = Flask(__name__)
    
    @app.route('/', methods=['GET'])
    def health_check():
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
    @app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    def catch_all(path):
        return jsonify({'status': 'error', 'message': 'Application failed to initialize'}), 500
