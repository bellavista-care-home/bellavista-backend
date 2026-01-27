
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
        
    conn.commit()
    conn.close()
    print("Database schema updated successfully.")
except Exception as e:
    print(f"Error: {e}")
