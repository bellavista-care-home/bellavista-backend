# Bellavista Backend (Flask + Postgres/SQLite)

## Environments
The backend supports `development`, `testing`, and `production` environments.
Configuration is handled via `config.py` and environment variables.

### Setup
1. Create environment files based on your needs:
   - `.env.development` (default)
   - `.env.test`
   - `.env.production`

   See `.env.example` or the created `.env.development` for reference.

2. Set the `FLASK_CONFIG` environment variable to switch environments:
   - `development` (default if unset)
   - `testing`
   - `production`

### Local Development (SQLite)
1. Install dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```
2. Run the application (defaults to development):
   ```bash
   # Windows PowerShell
   $env:FLASK_APP="wsgi.py"
   flask run --host=0.0.0.0 --port=8000
   ```
   Or explicitly:
   ```bash
   $env:FLASK_CONFIG="development"
   flask run --host=0.0.0.0 --port=8000
   ```

### Testing
To run in testing mode (uses a separate SQLite DB by default):
```bash
$env:FLASK_CONFIG="testing"
flask run
```

### Production
For production, ensure you have a proper WSGI server (like Gunicorn) and use the production config:
```bash
$env:FLASK_CONFIG="production"
gunicorn wsgi:app
```

## Docker Compose
Requires Docker Desktop:
```bash
docker compose up --build -d
```
The `docker-compose.yml` should be configured to pass the appropriate `FLASK_CONFIG`.
