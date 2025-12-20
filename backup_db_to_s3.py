
import os
import boto3
import shutil
from datetime import datetime
from pathlib import Path

# Config
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / 'instance' / 'bellavista-dev.db'
S3_BUCKET = os.environ.get('S3_BUCKET')
AWS_REGION = os.environ.get('AWS_REGION', 'us-east-1')

def backup_db():
    if not S3_BUCKET:
        print("Error: S3_BUCKET not set.")
        return

    if not DB_PATH.exists():
        print(f"Error: DB not found at {DB_PATH}")
        return

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = f"bellavista_db_backup_{timestamp}.db"
    
    print(f"Backing up {DB_PATH} to S3://{S3_BUCKET}/{backup_filename}...")
    
    s3_client = boto3.client('s3')
    try:
        s3_client.upload_file(
            str(DB_PATH),
            S3_BUCKET,
            f"backups/{backup_filename}"
        )
        print("Backup successful.")
    except Exception as e:
        print(f"Backup failed: {e}")

if __name__ == "__main__":
    backup_db()
