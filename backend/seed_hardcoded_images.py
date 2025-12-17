
import json
from app import create_app, db
from app.models import Home

# Default Images (Copied from frontend)
DEFAULT_ACTIVITIES = [
    "Bingo-Activity-150x150.jpg",
    "IMG-20180716-WA0005-150x150.jpg",
    "IMG-20180716-WA0013-150x150.jpg",
    "IMG-20180716-WA0016-150x150.jpg",
    "IMG-20180716-WA0017-150x150.jpg",
    "IMG-20180809-WA0001-150x150.jpg",
    "IMG-20180809-WA0006-150x150.jpg",
    "IMG-20180809-WA0011-1-150x150.jpg",
    "IMG-20180809-WA0016-150x150.jpg",
    "IMG-20180809-WA0017-150x150.jpg",
    "IMG-20180809-WA0019-150x150.jpg",
    "IMG_8298-150x150.jpg",
    "IMG_8332-150x150.jpg",
    "IMG_8340-150x150.jpg"
]

DEFAULT_FACILITIES = [
    "98000815_933014320502979_5416674318329315328_n-150x150.jpg",
    "98005368_933014173836327_3282387137734901760_n-150x150.jpg",
    "98185714_933014203836324_2891158467958013952_n-150x150.jpg",
    "98204419_933014370502974_7682212452494213120_n-150x150.jpg",
    "98316881_933014347169643_7230616531313360896_n-150x150.jpg",
    "Copy-of-lounge-150x150.jpg",
    "IMG9-150x150.jpg",
    "IMG_0344-150x150.jpg",
    "IMG_0357-150x150.jpg",
    "IMG_4114-150x150.jpg",
    "IMG_4115-150x150.jpg",
    "IMG_4121-Copy-150x150.jpg",
    "IMG_4137-150x150.jpg",
    "IMG_4187-150x150.jpg",
    "IMG_4199-150x150.jpg",
    "IMG_4241-150x150.jpg",
    "IMG_4280-150x150.jpg",
    "IMG_4282-150x150.jpg",
    "IMG_4301R-150x150.jpg",
    "IMG_4325-150x150.jpg",
    "IMG_4363-150x150.jpg",
    "IMG_4379-150x150.jpg",
    "IMG_4385-150x150.jpg",
    "IMG_4414-150x150.jpg",
    "IMG_4441-150x150.jpg",
    "IMG_4446-150x150.jpg",
    "IMG_4455-150x150.jpg",
    "IMG_4473-150x150.jpg",
    "IMG_4528-150x150.jpg",
    "IMG_4587-150x150.jpg",
    "IMG_4600-150x150.jpg",
    "IMG_4610-150x150.jpg",
    "IMG_8313-150x150.jpg"
]

DEFAULT_TEAM = [
    "Barry-Teamn-150x150.png",
    "IMG-20180816-WA0019-150x150.jpg",
    "IMG_0324-150x150.jpg",
    "IMG_0367-Copy-150x150.jpg",
    "IMG_0400-150x150.jpg",
    "IMG_0586-150x150.jpg",
    "IMG_46181-547x364-150x150.jpg",
    "IMG_8885-150x150.jpg",
    "b2-150x150.jpg"
]

def seed_images():
    app = create_app('development')
    with app.app_context():
        homes = Home.query.all()
        for home in homes:
            print(f"Checking {home.name}...")
            changed = False
            
            # 1. Activities Gallery
            if not home.activityImagesJson or home.activityImagesJson == '[]':
                # Construct paths with folder
                gallery = [f"/BarryActivitiesGallery/{img}" for img in DEFAULT_ACTIVITIES]
                home.activityImagesJson = json.dumps(gallery)
                changed = True
                print("  Seeded Activities Gallery")
            
            # 2. Facilities Gallery
            if not home.facilitiesGalleryJson or home.facilitiesGalleryJson == '[]':
                gallery = [f"/BarryFacilitiesGalley/{img}" for img in DEFAULT_FACILITIES]
                home.facilitiesGalleryJson = json.dumps(gallery)
                changed = True
                print("  Seeded Facilities Gallery")
                
            # 3. Team Gallery
            if not home.teamGalleryJson or home.teamGalleryJson == '[]':
                gallery = [f"/BarryTeam/{img}" for img in DEFAULT_TEAM]
                home.teamGalleryJson = json.dumps(gallery)
                changed = True
                print("  Seeded Team Gallery")
                
            if changed:
                db.session.add(home)
        
        db.session.commit()
        print("Seeding complete.")

if __name__ == "__main__":
    seed_images()
