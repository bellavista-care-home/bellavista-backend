
import json
import uuid
from app import create_app, db
from app.models import Home

def seed_homes():
    app = create_app('development')
    with app.app_context():
        # Clear existing homes to avoid duplicates (optional, or just check if exists)
        # db.session.query(Home).delete()
        
        homes_data = [
            {
                "id": "bellavista-cardiff",
                "name": "Bellavista Cardiff",
                "location": "Cardiff Bay",
                "image": "/HomeImages/preview_cfnh10-1_425x300_acf_cropped.jpg",
                "badge": "Featured",
                "description": "A chic, cosmopolitan atmosphere with views of Cardiff Bay.",
                "heroTitle": "Welcome to Bellavista Cardiff",
                "heroSubtitle": "A chic, cosmopolitan atmosphere with views of Cardiff Bay.",
                "heroBgImage": "/FrontPageBanner/preview_Home_Banner1_1300x400_acf_cropped.png",
                "heroExpandedDesc": "Located in the heart of Cardiff Bay, Bellavista Cardiff offers a modern, vibrant environment...",
                "statsBedrooms": "62",
                "statsPremier": "18",
                "teamMembers": [
                    { "name": "Ceri A Evans", "role": "Home Manager", "image": "" },
                    { "name": "Titty Raj", "role": "Lead Nurse in Charge", "image": "" },
                    { "name": "Zsuzsanna Karkosak", "role": "Accounts Assistant", "image": "" },
                    { "name": "Cerry Davies", "role": "Kitchen In charge", "image": "" },
                    { "name": "Karen Thomas", "role": "RMN in Charge", "image": "" },
                    { "name": "Tania", "role": "Housekeeping In charge", "image": "" }
                ],
                "activities": ["Bingo", "Trips out", "Gardening"],
                "facilitiesList": [{"icon": "fas fa-wifi", "title": "Smart TVs & Wifi"}],
                "featured": True
            },
            {
                "id": "bellavista-barry",
                "name": "Bellavista Barry",
                "location": "Barry",
                "image": "/HomeImages/preview_b-1_425x300_acf_cropped-2.jpg",
                "badge": "",
                "description": "Stunning views of Barry Island and the Bristol Channel.",
                "heroTitle": "Welcome to Bellavista Barry",
                "heroSubtitle": "Stunning views of Barry Island and the Bristol Channel.",
                "heroBgImage": "/FrontPageBanner/preview_Home_Banner2_1300x400_acf_cropped.png",
                "heroExpandedDesc": "Bellavista Barry provides a serene coastal setting...",
                "statsBedrooms": "48",
                "statsPremier": "0",
                "teamMembers": [
                    { "name": "Jacob George", "role": "Home Manager", "image": "" }
                ],
                "activities": ["Arts & Crafts", "Music Therapy"],
                "facilitiesList": [{"icon": "fas fa-utensils", "title": "Fine Dining"}],
                "featured": False
            },
            {
                "id": "waverley-care-centre",
                "name": "Waverley Care Centre",
                "location": "Penarth",
                "image": "/HomeImages/preview_wcc-1_425x300_acf_cropped.jpg",
                "badge": "",
                "description": "A Victorian property with character and charm.",
                "heroTitle": "Welcome to Waverley Care Centre",
                "heroSubtitle": "A Victorian property with character and charm.",
                "heroBgImage": "/FrontPageBanner/preview_Home_Banner3_1300x400_acf_cropped.png",
                "heroExpandedDesc": "Waverley Care Centre combines historic charm with modern care...",
                "statsBedrooms": "35",
                "statsPremier": "5",
                "teamMembers": [
                    { "name": "Home Manager", "role": "Home Manager", "image": "" }
                ],
                "activities": [],
                "facilitiesList": [],
                "featured": False
            },
            {
                "id": "college-fields",
                "name": "College Fields Nursing Home",
                "location": "Barry",
                "image": "/HomeImages/preview_cf-1_425x300_acf_cropped.jpg",
                "badge": "",
                "description": "Surrounded by beautiful gardens and countryside.",
                "heroTitle": "Welcome to College Fields",
                "heroSubtitle": "Surrounded by beautiful gardens and countryside.",
                "heroBgImage": "/FrontPageBanner/preview_Home_Banner4_1300x400_acf_cropped.png",
                "heroExpandedDesc": "College Fields offers a peaceful retreat...",
                "statsBedrooms": "40",
                "statsPremier": "10",
                "teamMembers": [
                    { "name": "Home Manager", "role": "Home Manager", "image": "" }
                ],
                "activities": [],
                "facilitiesList": [],
                "featured": False
            },
            {
                "id": "baltimore-care-home",
                "name": "Baltimore Care Home",
                "location": "Barry",
                "image": "/HomeImages/preview_bch-1_425x300_acf_cropped.jpg",
                "badge": "",
                "description": "A warm, community-focused home in Barry.",
                "heroTitle": "Welcome to Baltimore Care Home",
                "heroSubtitle": "A warm, community-focused home in Barry.",
                "heroBgImage": "/FrontPageBanner/preview_Home_Banner5_1300x400_acf_cropped.png",
                "heroExpandedDesc": "Baltimore Care Home is dedicated to community and comfort...",
                "statsBedrooms": "30",
                "statsPremier": "0",
                "teamMembers": [
                    { "name": "Home Manager", "role": "Home Manager", "image": "" }
                ],
                "activities": [],
                "facilitiesList": [],
                "featured": False
            },
            {
                "id": "meadow-vale-cwtch",
                "name": "Meadow Vale Cwtch",
                "location": "Cardiff",
                "image": "/HomeImages/preview_mvc-1_425x300_acf_cropped.jpg",
                "badge": "New",
                "description": "Specialized dementia care in a home-like setting.",
                "heroTitle": "Welcome to Meadow Vale Cwtch",
                "heroSubtitle": "Specialized dementia care in a home-like setting.",
                "heroBgImage": "/FrontPageBanner/preview_Home_Banner6_1300x400_acf_cropped.png",
                "heroExpandedDesc": "Meadow Vale Cwtch focuses on specialized dementia care...",
                "statsBedrooms": "20",
                "statsPremier": "20",
                "teamMembers": [
                    { "name": "Home Manager", "role": "Home Manager", "image": "" }
                ],
                "activities": [],
                "facilitiesList": [],
                "featured": False
            }
        ]

        for data in homes_data:
            existing = Home.query.get(data['id'])
            if not existing:
                print(f"Creating {data['name']}...")
                home = Home(
                    id=data['id'],
                    name=data['name'],
                    location=data['location'],
                    image=data['image'],
                    badge=data['badge'],
                    description=data['description'],
                    heroTitle=data['heroTitle'],
                    heroSubtitle=data['heroSubtitle'],
                    heroBgImage=data['heroBgImage'],
                    heroExpandedDesc=data['heroExpandedDesc'],
                    statsBedrooms=data['statsBedrooms'],
                    statsPremier=data['statsPremier'],
                    teamMembersJson=json.dumps(data.get('teamMembers', [])),
                    teamGalleryJson=json.dumps([]),
                    activitiesIntro="",
                    activitiesJson=json.dumps(data.get('activities', [])),
                    activityImagesJson=json.dumps([]),
                    activitiesModalDesc="",
                    facilitiesIntro="",
                    facilitiesListJson=json.dumps(data.get('facilitiesList', [])),
                    detailedFacilitiesJson=json.dumps([]),
                    facilitiesGalleryJson=json.dumps([]),
                    featured=data['featured']
                )
                db.session.add(home)
            else:
                print(f"Updating {data['name']}...")
                existing.name = data['name']
                existing.location = data['location']
                existing.image = data['image']
                existing.badge = data['badge']
                existing.description = data['description']
                existing.heroTitle = data['heroTitle']
                existing.heroSubtitle = data['heroSubtitle']
                existing.heroBgImage = data['heroBgImage']
                existing.heroExpandedDesc = data['heroExpandedDesc']
                existing.statsBedrooms = data['statsBedrooms']
                existing.statsPremier = data['statsPremier']
                existing.teamMembersJson = json.dumps(data.get('teamMembers', []))
                existing.activitiesJson = json.dumps(data.get('activities', []))
                existing.facilitiesListJson = json.dumps(data.get('facilitiesList', []))
                existing.featured = data['featured']
                db.session.add(existing)
        
        db.session.commit()
        print("Seed completed!")

if __name__ == '__main__':
    seed_homes()
