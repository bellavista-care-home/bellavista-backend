"""Add missing columns to home table."""
import sqlite3

db_path = 'instance/bellavista-dev.db'

# All columns that should exist with their types
expected_columns = {
    'id': 'TEXT',
    'name': 'TEXT',
    'location': 'TEXT',
    'adminEmail': 'TEXT',
    'image': 'TEXT',
    'cardImage2': 'TEXT',
    'badge': 'TEXT',
    'description': 'TEXT',
    'heroTitle': 'TEXT',
    'heroSubtitle': 'TEXT',
    'heroBgImage': 'TEXT',
    'heroDescription': 'TEXT',
    'heroExpandedDesc': 'TEXT',
    'statsLocationBadge': 'TEXT',
    'statsQualityBadge': 'TEXT',
    'statsTeamBadge': 'TEXT',
    'ciwReportUrl': 'TEXT',
    'newsletterUrl': 'TEXT',
    'bannerImagesJson': 'TEXT',
    'statsBedrooms': 'INTEGER',
    'statsPremier': 'INTEGER',
    'aboutTitle': 'TEXT',
    'aboutIntro': 'TEXT',
    'aboutParagraph2': 'TEXT',
    'carePhilosophyTitle': 'TEXT',
    'carePhilosophy': 'TEXT',
    'locationTitle': 'TEXT',
    'locationDescription': 'TEXT',
    'whyChooseTitle': 'TEXT',
    'whyChooseSubtitle': 'TEXT',
    'whyChooseListJson': 'TEXT',
    'whyChooseClosing': 'TEXT',
    'servicesTitle': 'TEXT',
    'servicesSubtitle': 'TEXT',
    'servicesIntro': 'TEXT',
    'servicesListJson': 'TEXT',
    'servicesClosing': 'TEXT',
    'servicesCta': 'TEXT',
    'servicesCtaLink': 'TEXT',
    'facilitiesTitle': 'TEXT',
    'facilitiesSubtitle': 'TEXT',
    'facilitiesIntro': 'TEXT',
    'facilitiesListJson': 'TEXT',
    'detailedFacilitiesJson': 'TEXT',
    'facilitiesGalleryJson': 'TEXT',
    'activitiesTitle': 'TEXT',
    'activitiesSubtitle': 'TEXT',
    'activitiesIntro': 'TEXT',
    'activitiesJson': 'TEXT',
    'activityImagesJson': 'TEXT',
    'activitiesModalDesc': 'TEXT',
    'teamTitle': 'TEXT',
    'teamSubtitle': 'TEXT',
    'teamIntro': 'TEXT',
    'teamIntro2': 'TEXT',
    'teamMembersJson': 'TEXT',
    'teamGalleryJson': 'TEXT',
    'testimonialsTitle': 'TEXT',
    'googleRating': 'REAL',
    'googleReviewCount': 'INTEGER',
    'carehomeRating': 'REAL',
    'carehomeReviewCount': 'INTEGER',
    'testimonialsIntro': 'TEXT',
    'newsTitle': 'TEXT',
    'newsSubtitle': 'TEXT',
    'contactTitle': 'TEXT',
    'contactSubtitle': 'TEXT',
    'contactAddress': 'TEXT',
    'contactPhone': 'TEXT',
    'contactEmail': 'TEXT',
    'contactMapUrl': 'TEXT',
    'quickFactBeds': 'TEXT',
    'quickFactLocation': 'TEXT',
    'quickFactCareType': 'TEXT',
    'quickFactParking': 'TEXT',
    'googleReviewUrl': 'TEXT',
    'carehomeUrl': 'TEXT',
    'careIntro': 'TEXT',
    'careServicesJson': 'TEXT',
    'careSectionsJson': 'TEXT',
    'careGalleryJson': 'TEXT',
    'featured': 'INTEGER',
    'createdAt': 'TIMESTAMP',
}

print(f"Connecting to {db_path}...")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get current columns
cursor.execute('PRAGMA table_info(home)')
current_columns = {row[1] for row in cursor.fetchall()}
print(f"Current columns: {len(current_columns)}")

# Add missing columns
added = 0
for col_name, col_type in expected_columns.items():
    if col_name not in current_columns:
        try:
            cursor.execute(f'ALTER TABLE home ADD COLUMN "{col_name}" {col_type}')
            print(f"  Added column: {col_name} ({col_type})")
            added += 1
        except Exception as e:
            print(f"  Error adding {col_name}: {e}")

conn.commit()
conn.close()

print(f"\nMigration complete. Added {added} columns.")
