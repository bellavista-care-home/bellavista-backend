
from app import create_app, db
from app.models import Home
import json

def check_db():
    app = create_app('development')
    with app.app_context():
        homes = Home.query.all()
        print(f"Found {len(homes)} homes in DB:")
        for h in homes:
            print(f"ID: {h.id}, Name: {h.name}")
            try:
                tm = json.loads(h.teamMembersJson) if h.teamMembersJson else []
                print(f"  Team Members: {len(tm)}")
                for m in tm:
                    print(f"    - {m.get('name')} ({m.get('role')})")
            except:
                print("  Error parsing teamMembersJson")

if __name__ == "__main__":
    check_db()
