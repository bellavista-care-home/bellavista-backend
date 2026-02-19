"""
Restore Home Gallery Data from S3 Backup
Use this to restore bannerImages, facilitiesGallery, etc. from backup

Usage:
  python restore_homes_from_backup.py [backup_filename]
  
Example:
  python restore_homes_from_backup.py homes_backup_20260219_235900.json

Environment variables:
  - DATABASE_URL: PostgreSQL connection string
  - S3_BUCKET: Bucket name where backups are stored
"""

import os
import sys
import json
import boto3
from datetime import datetime

S3_BUCKET = os.environ.get('S3_BUCKET', 'bellavistabackend-assets')
AWS_REGION = os.environ.get('AWS_REGION', 'eu-west-2')


def list_available_backups():
    """List all available home backups in S3"""
    try:
        s3_client = boto3.client('s3', region_name=AWS_REGION)
        response = s3_client.list_objects_v2(
            Bucket=S3_BUCKET,
            Prefix='backups/homes/'
        )
        
        backups = []
        for obj in response.get('Contents', []):
            backups.append({
                'key': obj['Key'],
                'filename': obj['Key'].split('/')[-1],
                'size': obj['Size'],
                'date': obj['LastModified']
            })
        
        # Sort by date, newest first
        backups.sort(key=lambda x: x['date'], reverse=True)
        return backups
        
    except Exception as e:
        print(f"Error listing backups: {e}")
        return []


def download_backup(filename):
    """Download backup file from S3"""
    try:
        s3_client = boto3.client('s3', region_name=AWS_REGION)
        
        key = f"backups/homes/{filename}" if not filename.startswith('backups/') else filename
        
        response = s3_client.get_object(Bucket=S3_BUCKET, Key=key)
        content = response['Body'].read().decode('utf-8')
        return json.loads(content)
        
    except Exception as e:
        print(f"Error downloading backup: {e}")
        return None


def restore_home_galleries(backup_data, home_ids=None, dry_run=True):
    """
    Restore gallery data to homes
    
    Args:
        backup_data: List of home backup dictionaries
        home_ids: List of specific home IDs to restore (None = all)
        dry_run: If True, only show what would be restored without making changes
    """
    try:
        from pathlib import Path
        sys.path.insert(0, str(Path(__file__).parent))
        
        from app import create_app, db
        from app.models import Home
        
        app = create_app()
        
        with app.app_context():
            restored_count = 0
            
            for backup_home in backup_data:
                home_id = backup_home.get('id')
                
                if home_ids and home_id not in home_ids:
                    continue
                
                home = Home.query.get(home_id)
                if not home:
                    print(f"⚠️ Home not found: {home_id}")
                    continue
                
                print(f"\n📍 {home.name} ({home_id})")
                
                # Fields to potentially restore
                gallery_fields = [
                    ('bannerImagesJson', 'Banner Images'),
                    ('teamMembersJson', 'Team Members'),
                    ('teamGalleryJson', 'Team Gallery'),
                    ('activitiesJson', 'Activities'),
                    ('activityImagesJson', 'Activity Images'),
                    ('facilitiesListJson', 'Facilities List'),
                    ('detailedFacilitiesJson', 'Detailed Facilities'),
                    ('facilitiesGalleryJson', 'Facilities Gallery'),
                    ('careSectionsJson', 'Care Sections'),
                    ('careGalleryJson', 'Care Gallery'),
                ]
                
                changes_made = False
                
                for field_name, field_label in gallery_fields:
                    backup_value = backup_home.get(field_name)
                    current_value = getattr(home, field_name, None)
                    
                    # Parse values to compare
                    try:
                        backup_items = json.loads(backup_value) if backup_value else []
                    except:
                        backup_items = []
                    
                    try:
                        current_items = json.loads(current_value) if current_value else []
                    except:
                        current_items = []
                    
                    backup_count = len(backup_items) if isinstance(backup_items, list) else 0
                    current_count = len(current_items) if isinstance(current_items, list) else 0
                    
                    # Only restore if backup has more data than current
                    if backup_count > current_count:
                        print(f"  ✅ {field_label}: {current_count} → {backup_count} items")
                        
                        if not dry_run:
                            setattr(home, field_name, backup_value)
                            changes_made = True
                    elif backup_count < current_count:
                        print(f"  ⏭️ {field_label}: Keeping current ({current_count} items, backup has {backup_count})")
                    elif backup_count == 0 and current_count == 0:
                        pass  # Both empty, skip
                    else:
                        print(f"  ➡️ {field_label}: No change ({current_count} items)")
                
                if changes_made and not dry_run:
                    db.session.commit()
                    restored_count += 1
            
            if dry_run:
                print(f"\n📋 DRY RUN - No changes made. Run with --execute to apply changes.")
            else:
                print(f"\n✅ Restored {restored_count} homes")
                
    except Exception as e:
        print(f"❌ Restore failed: {e}")
        import traceback
        traceback.print_exc()


def main():
    """Main entry point"""
    print("=" * 60)
    print("🔄 Bellavista Home Gallery Restore Tool")
    print("=" * 60)
    
    # Parse arguments
    backup_filename = None
    execute = False
    
    for arg in sys.argv[1:]:
        if arg == '--execute':
            execute = True
        elif arg == '--list':
            # List available backups
            print("\n📦 Available Backups:")
            backups = list_available_backups()
            if not backups:
                print("  No backups found")
            else:
                for b in backups[:10]:  # Show last 10
                    size_kb = b['size'] / 1024
                    print(f"  • {b['filename']} ({size_kb:.1f} KB) - {b['date'].strftime('%Y-%m-%d %H:%M')}")
            return
        elif not arg.startswith('--'):
            backup_filename = arg
    
    if not backup_filename:
        # Use most recent backup
        backups = list_available_backups()
        if backups:
            backup_filename = backups[0]['filename']
            print(f"\n📂 Using most recent backup: {backup_filename}")
        else:
            print("❌ No backups found in S3")
            return
    
    # Download backup
    print(f"\n⬇️ Downloading backup: {backup_filename}")
    backup_data = download_backup(backup_filename)
    
    if not backup_data:
        print("❌ Failed to download backup")
        return
    
    print(f"📋 Found {len(backup_data)} homes in backup")
    
    # Restore with dry run by default
    print(f"\n{'🔄 EXECUTING RESTORE' if execute else '👀 DRY RUN (preview only)'}:")
    restore_home_galleries(backup_data, dry_run=not execute)
    
    if not execute:
        print("\n💡 To apply changes, run:")
        print(f"   python restore_homes_from_backup.py {backup_filename} --execute")


if __name__ == "__main__":
    main()
