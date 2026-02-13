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
    
    # Check if startTime column exists
    cursor.execute("PRAGMA table_info(event)")
    columns = [info[1] for info in cursor.fetchall()]
    
    if 'startTime' not in columns:
        print("Adding startTime column...")
        cursor.execute("ALTER TABLE event ADD COLUMN startTime TEXT")
    else:
        print("startTime column already exists.")
        
    if 'endTime' not in columns:
        print("Adding endTime column...")
        cursor.execute("ALTER TABLE event ADD COLUMN endTime TEXT")
    else:
        print("endTime column already exists.")

    conn.commit()
    conn.close()
    print("Database schema updated successfully.")
except Exception as e:
    print(f"Error: {e}")
