#!/bin/bash
# Startup script for Bellavista Backend with proper Gunicorn configuration

echo "Starting Bellavista Backend..."
echo "Python version: $(python --version)"
echo "Gunicorn version: $(gunicorn --version)"

# Set environment variables
export PYTHONUNBUFFERED=1
export FLASK_ENV=production

# Start Gunicorn with timeout and thread support
exec gunicorn wsgi:app \
  --bind 0.0.0.0:8000 \
  --timeout 300 \
  --workers 2 \
  --threads 4 \
  --worker-class gthread \
  --max-requests 1000 \
  --max-requests-jitter 50 \
  --access-logfile - \
  --error-logfile - \
  --log-level info \
  --capture-output \
  --enable-stdio-inheritance
