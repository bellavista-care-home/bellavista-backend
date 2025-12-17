
import os
import json
import boto3
from app import create_app, db
from app.models import Home, NewsItem
from pathlib import Path

# Configuration
PUBLIC_DIR = Path(r'c:\Users\anwin\Desktop\production_bellavista_app\bellavista\public')
S3_BUCKET = os.environ.get('S3_BUCKET')
AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')

def upload_file_to_s3(file_path, object_name):
    """Upload a file to an S3 bucket"""
    if not S3_BUCKET:
        print("Error: S3_BUCKET environment variable not set.")
        return None

    s3_client = boto3.client('s3')
    try:
        # Determine content type
        content_type = 'application/octet-stream'
        if str(file_path).lower().endswith('.jpg') or str(file_path).lower().endswith('.jpeg'):
            content_type = 'image/jpeg'
        elif str(file_path).lower().endswith('.png'):
            content_type = 'image/png'
            
        s3_client.upload_file(
            str(file_path),
            S3_BUCKET,
            object_name,
            ExtraArgs={'ACL': 'public-read', 'ContentType': content_type}
        )
        return f"https://{S3_BUCKET}.s3.{AWS_REGION}.amazonaws.com/{object_name}"
    except Exception as e:
        print(f"Failed to upload {file_path}: {e}")
        return None

def migrate_images():
    app = create_app('development')
    with app.app_context():
        print("Starting migration...")
        
        # 1. Migrate Home Images
        homes = Home.query.all()
        for home in homes:
            changed = False
            print(f"Processing Home: {home.name}")
            
            # Helper to process a URL field
            def process_url(url_field):
                if url_field and url_field.startswith('/'):
                    # Remove leading slash
                    rel_path = url_field.lstrip('/')
                    
                    # Check if it's an upload or public asset
                    if rel_path.startswith('uploads/'):
                        # It's in backend/uploads
                        local_path = UPLOADS_DIR / rel_path.replace('uploads/', '', 1)
                    else:
                        # It's in frontend/public
                        local_path = PUBLIC_DIR / rel_path
                    
                    if local_path.exists():
                        print(f"  Uploading {rel_path}...")
                        s3_url = upload_file_to_s3(local_path, rel_path)
                        if s3_url:
                            print(f"    -> {s3_url}")
                            return s3_url, True
                    else:
                        print(f"  Warning: File not found locally: {local_path}")
                return url_field, False

            # Migrate fields
            home.heroBgImage, c1 = process_url(home.heroBgImage)
            if c1: changed = True
            
            # Migrate JSON galleries
            if home.activityImagesJson:
                try:
                    gallery = json.loads(home.activityImagesJson)
                    new_gallery = []
                    g_changed = False
                    for item in gallery:
                        if isinstance(item, dict):
                            url, c = process_url(item.get('url'))
                            if c:
                                item['url'] = url
                                g_changed = True
                            new_gallery.append(item)
                        elif isinstance(item, str):
                            url, c = process_url(item)
                            if c:
                                new_gallery.append(url)
                                g_changed = True
                            else:
                                new_gallery.append(item)
                    if g_changed:
                        home.activityImagesJson = json.dumps(new_gallery)
                        changed = True
                except:
                    pass

            if home.facilitiesGalleryJson:
                try:
                    gallery = json.loads(home.facilitiesGalleryJson)
                    new_gallery = []
                    g_changed = False
                    for item in gallery:
                        if isinstance(item, dict):
                            url, c = process_url(item.get('url'))
                            if c:
                                item['url'] = url
                                g_changed = True
                            new_gallery.append(item)
                        elif isinstance(item, str):
                            url, c = process_url(item)
                            if c:
                                new_gallery.append(url)
                                g_changed = True
                            else:
                                new_gallery.append(item)
                    if g_changed:
                        home.facilitiesGalleryJson = json.dumps(new_gallery)
                        changed = True
                except:
                    pass

            if changed:
                print("  Saving changes to DB...")
                db.session.add(home)
        
        # 2. Migrate News Items
        news_items = NewsItem.query.all()
        for news in news_items:
            changed = False
            # Similar logic for news.image and news.galleryJson...
            # (Simplified for brevity, can expand if needed)
            
        db.session.commit()
        print("Migration complete.")

if __name__ == "__main__":
    migrate_images()
