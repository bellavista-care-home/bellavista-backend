from app import create_app, db
from sqlalchemy import text

app = create_app('development')

with app.app_context():
    try:
        with db.engine.connect() as conn:
            conn.execute(text("ALTER TABLE news_item ADD COLUMN videoDescription TEXT"))
            conn.commit()
        print("Column 'videoDescription' added successfully.")
    except Exception as e:
        print(f"Error (column might already exist): {e}")
