import os
import json
import uuid
import datetime
import urllib.request
from flask_apscheduler import APScheduler
from .models import Review
from . import db

scheduler = APScheduler()

# Google Place IDs configuration
# You can find these using the Google Place ID Finder: https://developers.google.com/maps/documentation/places/web-service/place-id
LOCATIONS = [
    {
        "name": "Bellavista Barry",
        "place_id": "ChIJH2gGQZIFbkgRhLyFHVTRFSM", # Address: 106-108 Tynewydd Rd, Barry CF62 8BB
    },
    {
        "name": "Bellavista Cardiff",
        "place_id": "ChIJAQA8k0gDbkgRRCbFADCjGfI", # Address: 2 Harrowby Pl, Cardiff CF10 5GB
    },
    {
        "name": "Waverley Care Centre",
        "place_id": "ChIJsWarEp0DbkgRO9KiRBdg4mA", # Address: 122-124 Plymouth Rd, Penarth CF64 5DN
    },
    {
        "name": "College Fields Nursing Home",
        "place_id": "ChIJQdVlhYwFbkgRg6LSXkglnTc", # Address: College Fields Close, Barry CF62 8LE
    },
    {
        "name": "Baltimore Care Home",
        "place_id": "ChIJC1h-f1kPbkgRzZqHkKap-CI", # Address: 1/2 Park Rd, Barry CF62 6NU
    },
    {
        "name": "Meadow Vale Cwtch",
        "place_id": "ChIJAQA8k0gDbkgRRCbFADCjGfI", # Address: 27-29 Cog Road, Sully, Penarth, CF64 5TD
    }
]

def fetch_and_store_google_reviews(app_context, place_id, location_name):
    """
    Logic to fetch reviews from Google and store them in the DB.
    """
    api_key = os.environ.get('GOOGLE_PLACES_API_KEY')
    if not api_key:
        print(f"[TASK] Skipping import for {location_name}: GOOGLE_PLACES_API_KEY not set.")
        return

    if not place_id or "PLACEHOLDER" in place_id:
        print(f"[TASK] Skipping import for {location_name}: Invalid Place ID ({place_id}).")
        return

    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=reviews&key={api_key}"

    try:
        with urllib.request.urlopen(url) as response:
            result = json.loads(response.read().decode())

        if result.get('status') != 'OK':
            print(f"[TASK] Google API Error for {location_name}: {result.get('status')} - {result.get('error_message')}")
            return

        google_reviews = result.get('result', {}).get('reviews', [])
        imported_count = 0
        
        with app_context:
            for g_review in google_reviews:
                # Check if review already exists
                existing = Review.query.filter(
                    Review.name == g_review.get('author_name'),
                    Review.reviewText == g_review.get('text')
                ).first()

                if not existing:
                    created_at = datetime.datetime.fromtimestamp(g_review.get('time')) if g_review.get('time') else datetime.datetime.utcnow()
                    
                    new_review = Review(
                        id=str(uuid.uuid4()),
                        location=location_name,
                        name=g_review.get('author_name'),
                        email="google-import@bellavista.com",
                        rating=g_review.get('rating'),
                        reviewText=g_review.get('text'),
                        source='google',
                        createdAt=created_at
                    )
                    db.session.add(new_review)
                    imported_count += 1
            
            if imported_count > 0:
                db.session.commit()
                print(f"[TASK] Imported {imported_count} reviews for {location_name}.")
            else:
                print(f"[TASK] No new reviews for {location_name}.")

    except Exception as e:
        print(f"[TASK] Exception importing reviews for {location_name}: {e}")

def run_google_import_job(app):
    """
    Job that runs periodically to fetch reviews for all locations.
    """
    print(f"[TASK] Starting scheduled Google Reviews import at {datetime.datetime.now()}...")
    with app.app_context():
        for loc in LOCATIONS:
            fetch_and_store_google_reviews(app.app_context(), loc["place_id"], loc["name"])
    print("[TASK] Google Reviews import job finished.")

def init_scheduler(app):
    if not scheduler.running:
        scheduler.init_app(app)
        scheduler.start()
        
        # Schedule Google Import: Runs every 12 hours
        scheduler.add_job(
            id='google_reviews_import',
            func=run_google_import_job,
            args=[app],
            trigger='interval',
            hours=12
        )
