
import json
from app import create_app, db
from app.models import Home

app = create_app('development')
with app.app_context():
    home = Home.query.get('bellavista-barry')
    if home:
        home.teamMembersJson = "[]"
        db.session.commit()
        print("Reverted to empty")
