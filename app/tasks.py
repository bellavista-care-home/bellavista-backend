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

def run_carehome_import_job(app):
    """
    Job that runs periodically to fetch carehome.co.uk reviews for all locations.
    """
    print(f"[TASK] Starting scheduled Carehome.co.uk import at {datetime.datetime.now()}...")
    
    # Map location names to carehome.co.uk URLs (Same as in routes.py)
    CAREHOME_URL_MAP = {
        'Bellavista Barry': 'https://www.carehome.co.uk/carehome.cfm/searchazref/72849',
        'Bellavista Cardiff': 'https://www.carehome.co.uk/carehome.cfm/searchazref/20006005BELLB',
        'Waverley Care Centre': 'https://www.carehome.co.uk/carehome.cfm/searchazref/20006005WAVEA',
        'College Fields Nursing Home': 'https://www.carehome.co.uk/carehome.cfm/searchazref/20006005COLLA',
        'Baltimore Care Home': 'https://www.carehome.co.uk/carehome.cfm/searchazref/20006005BALTB',
        'Meadow Vale Cwtch': 'https://www.carehome.co.uk/carehome.cfm/searchazref/20006005MEADF',
        'Bellavista Nursing Homes': 'https://www.carehome.co.uk/care_search_results.cfm/searchgroup/36152005BELLZ'
    }

    import requests
    from bs4 import BeautifulSoup
    import re

    with app.app_context():
        for location_name, url in CAREHOME_URL_MAP.items():
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
                response = requests.get(url, headers=headers)
                if response.status_code != 200:
                    print(f"[TASK] Failed to fetch Carehome page for {location_name}: {response.status_code}")
                    continue

                soup = BeautifulSoup(response.text, 'html.parser')
                review_cards = soup.find_all('div', class_='review-row')
                if not review_cards:
                    review_cards = soup.select('.review-item, .review-block, [itemprop="review"]')

                imported_count = 0
                for card in review_cards:
                    try:
                        author_tag = card.find(class_='review-author') or card.find(itemprop='author')
                        author = author_tag.get_text(strip=True) if author_tag else "Anonymous"
                        
                        text_tag = card.find(class_='review-body') or card.find(itemprop='reviewBody') or card.find('p')
                        text = text_tag.get_text(strip=True) if text_tag else ""
                        
                        rating = 5
                        rating_tag = card.find(class_='overall-rating') or card.find(class_='rating-score')
                        if rating_tag:
                            try:
                                rating_text = rating_tag.get_text(strip=True)
                                rating_match = re.search(r'(\d+(\.\d+)?)', rating_text)
                                if rating_match:
                                    rating = float(rating_match.group(1))
                            except:
                                pass

                        existing = Review.query.filter(
                            Review.name == author,
                            Review.reviewText == text
                        ).first()
                        
                        if not existing and text:
                            new_review = Review(
                                id=str(uuid.uuid4()),
                                location=location_name,
                                name=author,
                                email="carehome-import@bellavista.com",
                                rating=int(round(rating)),
                                reviewText=text,
                                source='carehome.co.uk',
                                createdAt=datetime.datetime.now()
                            )
                            db.session.add(new_review)
                            imported_count += 1
                    except Exception:
                        continue
                
                if imported_count > 0:
                    db.session.commit()
                    print(f"[TASK] Imported {imported_count} Carehome reviews for {location_name}.")
                else:
                    print(f"[TASK] No new Carehome reviews for {location_name}.")

            except Exception as e:
                print(f"[TASK] Error importing Carehome reviews for {location_name}: {e}")

    print("[TASK] Carehome.co.uk import job finished.")

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

        # Schedule Carehome Import: Runs every 24 hours
        scheduler.add_job(
            id='carehome_reviews_import',
            func=run_carehome_import_job,
            args=[app],
            trigger='interval',
            hours=24
        )
