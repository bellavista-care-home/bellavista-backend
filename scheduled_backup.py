"""
Scheduled Database Backup Script for RDS PostgreSQL
Run this daily via AWS Lambda, cron, or GitHub Actions

Usage:
  python scheduled_backup.py

Environment variables required:
  - DATABASE_URL: PostgreSQL connection string
  - S3_BUCKET: Bucket name for backups
  - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY (or use IAM role)
"""

import os
import subprocess
import boto3
from datetime import datetime
from pathlib import Path
import tempfile

# Config
S3_BUCKET = os.environ.get('S3_BUCKET', 'bellavistabackend-assets')
AWS_REGION = os.environ.get('AWS_REGION', 'eu-west-2')
DATABASE_URL = os.environ.get('DATABASE_URL')
BACKUP_RETENTION_DAYS = 30


def parse_database_url(url):
    """Parse PostgreSQL connection URL into components"""
    # Format: postgresql://user:password@host:port/database
    if not url:
        return None
    
    url = url.replace('postgres://', 'postgresql://')
    
    try:
        from urllib.parse import urlparse
        parsed = urlparse(url)
        return {
            'host': parsed.hostname,
            'port': parsed.port or 5432,
            'database': parsed.path.lstrip('/'),
            'user': parsed.username,
            'password': parsed.password
        }
    except Exception as e:
        print(f"Error parsing DATABASE_URL: {e}")
        return None


def backup_postgres_to_s3():
    """Backup PostgreSQL database to S3"""
    if not DATABASE_URL:
        print("Error: DATABASE_URL not set")
        return False
    
    if not S3_BUCKET:
        print("Error: S3_BUCKET not set")
        return False
    
    db_config = parse_database_url(DATABASE_URL)
    if not db_config:
        return False
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = f"bellavista_db_backup_{timestamp}.sql"
    
    # Create temp file for backup
    with tempfile.TemporaryDirectory() as tmpdir:
        backup_path = Path(tmpdir) / backup_filename
        
        # Set password for pg_dump
        env = os.environ.copy()
        env['PGPASSWORD'] = db_config['password']
        
        print(f"📦 Starting backup of {db_config['database']}...")
        
        # Run pg_dump
        try:
            result = subprocess.run([
                'pg_dump',
                '-h', db_config['host'],
                '-p', str(db_config['port']),
                '-U', db_config['user'],
                '-d', db_config['database'],
                '-F', 'c',  # Custom format (compressed)
                '-f', str(backup_path)
            ], env=env, capture_output=True, text=True, timeout=600)
            
            if result.returncode != 0:
                print(f"❌ pg_dump failed: {result.stderr}")
                return False
                
        except FileNotFoundError:
            print("❌ pg_dump not found. Make sure PostgreSQL client tools are installed.")
            return False
        except subprocess.TimeoutExpired:
            print("❌ Backup timed out after 10 minutes")
            return False
        
        # Upload to S3
        print(f"☁️ Uploading to S3://{S3_BUCKET}/backups/{backup_filename}...")
        
        try:
            s3_client = boto3.client('s3', region_name=AWS_REGION)
            s3_client.upload_file(
                str(backup_path),
                S3_BUCKET,
                f"backups/database/{backup_filename}"
            )
            
            # Get file size
            file_size = backup_path.stat().st_size / (1024 * 1024)
            print(f"✅ Backup successful! Size: {file_size:.2f} MB")
            
            return True
            
        except Exception as e:
            print(f"❌ S3 upload failed: {e}")
            return False


def backup_homes_table_json():
    """
    Alternative: Export just the Home table as JSON
    This doesn't require pg_dump and works via SQLAlchemy
    """
    try:
        import sys
        sys.path.insert(0, str(Path(__file__).parent))
        
        from app import create_app, db
        from app.models import Home
        import json
        
        app = create_app()
        
        with app.app_context():
            homes = Home.query.all()
            
            # Export all home data
            backup_data = []
            for home in homes:
                backup_data.append({
                    'id': home.id,
                    'name': home.name,
                    'location': home.location,
                    'bannerImagesJson': home.bannerImagesJson,
                    'teamMembersJson': home.teamMembersJson,
                    'teamGalleryJson': home.teamGalleryJson,
                    'activitiesJson': home.activitiesJson,
                    'activityImagesJson': home.activityImagesJson,
                    'facilitiesListJson': home.facilitiesListJson,
                    'detailedFacilitiesJson': home.detailedFacilitiesJson,
                    'facilitiesGalleryJson': home.facilitiesGalleryJson,
                    'careSectionsJson': home.careSectionsJson,
                    'careGalleryJson': home.careGalleryJson,
                    # Add other fields as needed
                })
            
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"homes_backup_{timestamp}.json"
            
            # Upload to S3
            s3_client = boto3.client('s3', region_name=AWS_REGION)
            s3_client.put_object(
                Bucket=S3_BUCKET,
                Key=f"backups/homes/{filename}",
                Body=json.dumps(backup_data, indent=2),
                ContentType='application/json'
            )
            
            print(f"✅ Homes JSON backup saved: backups/homes/{filename}")
            return True
            
    except Exception as e:
        print(f"❌ Homes backup failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def cleanup_old_backups(days=BACKUP_RETENTION_DAYS):
    """Delete backups older than specified days"""
    try:
        s3_client = boto3.client('s3', region_name=AWS_REGION)
        from datetime import timedelta
        
        cutoff_date = datetime.now() - timedelta(days=days)
        
        # List backups
        response = s3_client.list_objects_v2(
            Bucket=S3_BUCKET,
            Prefix='backups/'
        )
        
        deleted_count = 0
        for obj in response.get('Contents', []):
            if obj['LastModified'].replace(tzinfo=None) < cutoff_date:
                s3_client.delete_object(Bucket=S3_BUCKET, Key=obj['Key'])
                deleted_count += 1
                print(f"🗑️ Deleted old backup: {obj['Key']}")
        
        if deleted_count:
            print(f"✅ Cleaned up {deleted_count} old backups (>{days} days)")
        else:
            print(f"ℹ️ No backups older than {days} days to clean up")
            
    except Exception as e:
        print(f"⚠️ Cleanup failed: {e}")


if __name__ == "__main__":
    print("=" * 50)
    print("🔄 Bellavista Database Backup")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)
    
    # Try pg_dump first (full backup)
    if backup_postgres_to_s3():
        print("\n✅ Full database backup completed")
    else:
        print("\n⚠️ Full backup failed, trying JSON export...")
        backup_homes_table_json()
    
    # Also create JSON backup of homes (quick to restore)
    backup_homes_table_json()
    
    # Cleanup old backups
    cleanup_old_backups()
    
    print("\n" + "=" * 50)
    print("🏁 Backup process completed")
    print("=" * 50)
