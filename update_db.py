
import sqlite3
import os

db_path = 'instance/bellavista-dev.db'
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

print(f"Connecting to {db_path}...")

try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if event table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='event'")
    if not cursor.fetchone():
        print("Creating event table...")
        cursor.execute("""
            CREATE TABLE event (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                date TEXT NOT NULL,
                time TEXT,
                location TEXT,
                image TEXT,
                category TEXT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
    else:
        print("Event table already exists.")
    
    # Add contentBlocksJson column to home table if it doesn't exist
    cursor.execute("PRAGMA table_info(home)")
    columns = [col[1] for col in cursor.fetchall()]
    if 'contentBlocksJson' not in columns:
        print("Adding contentBlocksJson column to home table...")
        cursor.execute("ALTER TABLE home ADD COLUMN contentBlocksJson TEXT")
        print("contentBlocksJson column added successfully.")
    else:
        print("contentBlocksJson column already exists.")
    
    # Add rich text content columns for simplified section editors
    new_content_columns = ['servicesContent', 'facilitiesContent', 'activitiesContent', 'teamContent']
    cursor.execute("PRAGMA table_info(home)")
    columns = [col[1] for col in cursor.fetchall()]
    for col_name in new_content_columns:
        if col_name not in columns:
            print(f"Adding {col_name} column to home table...")
            cursor.execute(f"ALTER TABLE home ADD COLUMN {col_name} TEXT")
            print(f"{col_name} column added successfully.")
        else:
            print(f"{col_name} column already exists.")
        
    conn.commit()
    conn.close()
    print("Database schema updated successfully.")
except Exception as e:
    print(f"Error: {e}")
