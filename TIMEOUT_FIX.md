# Worker Timeout Fix for Bulk Image Uploads

## Problem
When updating a home with many images (~30 images), Gunicorn workers were timing out after 30 seconds (default timeout), causing the update to fail with `WORKER TIMEOUT` errors.

## Solution Applied

### 1. Updated Procfile Configuration
**File**: `Procfile`

Changed from:
```
web: gunicorn wsgi:app
```

To:
```
web: gunicorn wsgi:app --timeout 300 --workers 2 --threads 4 --worker-class gthread --max-requests 1000 --max-requests-jitter 50
```

**Explanation**:
- `--timeout 300`: Increases worker timeout to 300 seconds (5 minutes) to handle bulk image processing
- `--workers 2`: Uses 2 worker processes for better reliability
- `--threads 4`: Each worker can handle 4 threads concurrently
- `--worker-class gthread`: Uses threaded workers for better I/O handling
- `--max-requests 1000`: Worker will restart after handling 1000 requests (prevents memory leaks)
- `--max-requests-jitter 50`: Adds randomness to worker restarts to avoid all workers restarting at once

### 2. Updated Configuration
**File**: `config.py`

Added timeout configuration:
```python
# Timeout settings for long-running operations (in seconds)
REQUEST_TIMEOUT = int(os.getenv('REQUEST_TIMEOUT', '300'))  # 5 minutes for bulk image uploads
GUNICORN_TIMEOUT = int(os.getenv('GUNICORN_TIMEOUT', '300'))
```

### 3. Enhanced Error Handling
**File**: `app/routes.py` - `update_home()` function

Added:
- Progress logging for each step of the update process
- Better error handling with try-catch and rollback
- Detailed logging showing how many images are being processed
- Descriptive error messages for troubleshooting

## Deployment Steps

### For Render/Heroku/Similar PaaS:

1. **Commit and push the changes**:
   ```bash
   git add Procfile config.py app/routes.py TIMEOUT_FIX.md
   git commit -m "Fix: Increase worker timeout for bulk image uploads"
   git push origin main
   ```

2. **The platform will automatically detect the Procfile changes and redeploy**

3. **Monitor the deployment logs** to ensure the new configuration is applied:
   - Look for: `gunicorn wsgi:app --timeout 300`
   - Verify no more `WORKER TIMEOUT` errors

### For AWS/EC2/Custom Server:

1. **Update the deployment**:
   ```bash
   git pull origin main
   ```

2. **If using systemd service, update the service file** (if applicable):
   ```ini
   [Service]
   Environment="GUNICORN_TIMEOUT=300"
   Environment="REQUEST_TIMEOUT=300"
   ```

3. **Restart the application**:
   ```bash
   sudo systemctl restart bellavista-backend
   # OR
   pkill gunicorn && gunicorn wsgi:app --timeout 300 --workers 2 --threads 4 --worker-class gthread
   ```

### For Docker:

1. **Rebuild and restart the container**:
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

## Testing

After deployment, test the bulk image upload:

1. **Go to Admin Console**
2. **Select a home to edit**
3. **Upload 30+ images to facilities gallery**
4. **Click "Update Home"**
5. **Monitor the logs**:
   - Should see `[UPDATE HOME] Starting update for home ID: ...`
   - Should see `[UPDATE HOME] Updating X facilities gallery images...`
   - Should complete without `WORKER TIMEOUT` errors
   - Should see `[UPDATE HOME] Successfully updated home ID: ...`

## Environment Variables (Optional)

You can override the timeout values by setting environment variables:

```bash
# In .env or platform settings
REQUEST_TIMEOUT=300
GUNICORN_TIMEOUT=300
```

## Performance Notes

### Current Configuration:
- **Timeout**: 5 minutes (300 seconds)
- **Workers**: 2 processes
- **Threads per worker**: 4
- **Total concurrent requests**: Up to 8 (2 workers × 4 threads)

### When to Adjust:

**If still getting timeouts with 30+ images**:
- Increase timeout: `--timeout 600` (10 minutes)
- Add environment variable: `GUNICORN_TIMEOUT=600`

**If experiencing high load**:
- Increase workers: `--workers 4`
- Note: More workers = more memory usage

**If server has limited memory**:
- Keep workers at 2
- Reduce threads to 2: `--threads 2`

## Troubleshooting

### Still Getting Timeouts?

1. **Check actual timeout in logs**:
   ```bash
   # Should show: --timeout 300
   heroku logs --tail | grep timeout
   # or
   pm2 logs | grep timeout
   ```

2. **Verify Procfile is being used**:
   - Check deployment logs for `gunicorn wsgi:app --timeout 300`

3. **Increase timeout further if needed**:
   - Edit Procfile: `--timeout 600` (10 minutes)

4. **Check image processing performance**:
   - Large images (>5MB) may need compression before upload
   - Consider implementing a progress indicator on frontend

### Memory Issues?

If workers are being killed due to memory:

1. **Reduce concurrent operations**:
   ```
   --workers 1 --threads 2
   ```

2. **Add memory monitoring**:
   ```bash
   heroku logs --tail | grep "Memory"
   ```

## Alternative Solutions (Future Improvements)

For even better performance with very large batches:

1. **Implement Background Job Processing**:
   - Use Celery + Redis for async image processing
   - Return immediately and process images in background
   - Send notification when complete

2. **Batch Upload API**:
   - Accept images one at a time or in small batches
   - Frontend uploads sequentially with progress bar
   - More resilient to failures

3. **Frontend Optimization**:
   - Compress images before upload using browser APIs
   - Show upload progress per image
   - Allow retry of failed uploads

## Related Files
- [Procfile](Procfile)
- [config.py](config.py)
- [app/routes.py](app/routes.py)
- [AWS_PRODUCTION_GUIDE.md](AWS_PRODUCTION_GUIDE.md)
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## Date Applied
January 2, 2026
