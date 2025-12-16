
import json
from app import create_app, db
from app.models import Home

app = create_app('development')
with app.app_context():
    home = Home.query.get('bellavista-barry')
    if home:
        print(f"Home found: {home.name}")
        print(f"Team Members JSON: {home.teamMembersJson}")
        print(f"Parsed Team Members: {json.loads(home.teamMembersJson) if home.teamMembersJson else 'None'}")
    else:
        print("Home 'bellavista-barry' not found.")
