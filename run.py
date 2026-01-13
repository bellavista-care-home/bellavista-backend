import os
import sys
import traceback

print("[RUN] Starting application initialization...", file=sys.stderr, flush=True)

try:
    from app import create_app
    print("[RUN] Creating Flask app...", file=sys.stderr, flush=True)
    app = create_app(os.getenv('FLASK_CONFIG') or 'development')
    print("[RUN] Flask app created successfully", file=sys.stderr, flush=True)
except Exception as e:
    print(f"[RUN FATAL] Failed to create app: {e}", file=sys.stderr, flush=True)
    traceback.print_exc(file=sys.stderr)
    sys.exit(1)

if __name__ == '__main__':
    # Run on port 8000 as requested
    print("[RUN] Starting Flask development server on port 8000", file=sys.stderr, flush=True)
    app.run(port=8000, debug=True)
