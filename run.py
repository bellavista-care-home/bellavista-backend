from app import create_app
import os

app = create_app(os.getenv('FLASK_CONFIG') or 'development')

if __name__ == '__main__':
    # Run on port 8000 as requested
    app.run(port=8000, debug=True)
