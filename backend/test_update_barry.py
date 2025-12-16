
import json
from app import create_app, db
from app.models import Home

app = create_app('development')
with app.app_context():
    home = Home.query.get('bellavista-barry')
    if home:
        print(f"Before update: {home.teamMembersJson}")
        
        new_members = [
            {"name": "Test Manager", "role": "Manager", "image": ""}
        ]
        home.teamMembersJson = json.dumps(new_members)
        db.session.commit()
        
        home_updated = Home.query.get('bellavista-barry')
        print(f"After update: {home_updated.teamMembersJson}")
    else:
        print("Home not found")
