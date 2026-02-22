# DATABASE SCHEMA DESIGN FOR BARRY (AND ALL HOMES)
# This file documents the database changes needed for the inline editing system

"""
=============================================================================
NEW MODEL: PageSection - For drag-drop section ordering
=============================================================================
"""

class PageSection:
    """
    Stores the order and visibility of sections for each home page.
    Allows admins to drag-drop reorder sections and hide/show them.
    """
    id = String(primary_key=True)  # UUID
    homeId = String(ForeignKey('home.id'))  # Which home this belongs to
    sectionKey = String(64)  # hero, about, whyChoose, services, facilities, activities, team, testimonials, news, contact
    order = Integer  # 0, 1, 2, 3... determines display order
    visible = Boolean(default=True)  # Can hide sections without deleting
    customTitle = String(255)  # Override default section title
    createdAt = DateTime
    updatedAt = DateTime

"""
=============================================================================
SECTION KEYS (standardized across all homes)
=============================================================================
"""
SECTION_KEYS = [
    'hero',         # Hero banner with title, stats, images
    'about',        # Welcome section with care philosophy
    'whyChoose',    # Why Choose Us bullet points
    'services',     # Our Services list
    'facilities',   # Facilities gallery and icons
    'activities',   # Activities list and gallery
    'team',         # Staff members
    'testimonials', # Reviews and ratings
    'news',         # Latest news (from NewsItem table)
    'contact'       # Contact info and quick facts
]

"""
=============================================================================
EXTENDED HOME MODEL FIELDS
=============================================================================
Add these fields to the existing Home model:
"""

# ========================
# HERO SECTION
# ========================
heroTitle = String(255)           # "Nursing Home in Barry"
heroSubtitle = String(500)        # "Bellavista Nursing Home Barry - stunning views..."
heroDescription = Text            # Main hero paragraph
statsBedrooms = String(64)        # "48 Bedrooms" or "39" 
statsLocationBadge = String(128)  # "Barry Seaside"
statsQualityBadge = String(128)   # "Quality Care"
statsTeamBadge = String(128)      # "Expert Team"
ciwReportUrl = Text               # CIW report PDF link
newsletterUrl = Text              # Newsletter PDF link
bannerImagesJson = Text           # [{url, alt, showOnPage}]

# ========================
# ABOUT/WELCOME SECTION
# ========================
aboutTitle = String(255)          # "Welcome to Bellavista Barry"
aboutIntro = Text                 # First paragraph
aboutParagraph2 = Text            # Second paragraph (39-bedded home...)
carePhilosophyTitle = String(255) # "Our Care Philosophy"
carePhilosophy = Text             # Care philosophy paragraph
locationTitle = String(255)       # "Our Location"
locationDescription = Text        # Location paragraph

# ========================
# WHY CHOOSE US SECTION
# ========================  
whyChooseTitle = String(255)      # "Why Choose Bellavista Barry"
whyChooseSubtitle = String(255)   # "Why Choose Us"
whyChooseListJson = Text          # ["Exceptional care...", "Specialist nursing...", ...]
whyChooseClosing = Text           # Closing paragraph

# ========================
# SERVICES SECTION
# ========================
servicesTitle = String(255)       # "Our Services"
servicesSubtitle = String(255)    # "High Quality Care"  
servicesIntro = Text              # Intro paragraph
servicesListJson = Text           # ["High-Level Dementia Nursing", "General Nursing", ...]
servicesClosing = Text            # Closing paragraph
servicesCta = String(255)         # "Find Out More About Our Care"
servicesCtaLink = String(255)     # "/care/bellavista-barry"

# ========================
# FACILITIES SECTION
# ========================
facilitiesTitle = String(255)     # "Modern & Safe Environment"
facilitiesSubtitle = String(255)  # "Facilities"
facilitiesIntro = Text            # Intro paragraph
facilitiesListJson = Text         # [{icon, title}] - icon grid items
facilitiesGalleryJson = Text      # [{url, alt, title, shortDescription, fullDescription, showOnPage}]

# ========================
# ACTIVITIES SECTION
# ========================
activitiesTitle = String(255)     # "Activities Barry"
activitiesSubtitle = String(255)  # "Life at Bellavista"
activitiesIntro = Text            # Intro paragraph
activitiesListJson = Text         # ["Flower arranging", "Arts and Crafts", ...]
activitiesGalleryJson = Text      # [{url, alt, title, description, showOnPage}]

# ========================
# TEAM SECTION
# ========================
teamTitle = String(255)           # "Our Team"
teamSubtitle = String(255)        # "Dedicated Staff"
teamIntro = Text                  # Intro paragraph
teamIntro2 = Text                 # Second paragraph
teamMembersJson = Text            # [{name, role, image, bio}]

# ========================
# TESTIMONIALS SECTION
# ========================
testimonialsTitle = String(255)   # "Trusted by Residents. Valued by Families."
googleRating = String(16)         # "4.8"
googleReviewCount = Integer       # 85
carehomeRating = String(16)       # "9.3"
carehomeReviewCount = Integer     # 62
testimonialsIntro = Text          # Intro text
# Reviews come from Review table, filtered by location

# ========================
# NEWS SECTION
# ========================
newsTitle = String(255)           # "Latest News from Barry"
newsSubtitle = String(255)        # "Updates"
# News items come from NewsItem table, filtered by location

# ========================
# CONTACT SECTION
# ========================
contactTitle = String(255)        # "Contact & Information"
contactSubtitle = String(255)     # "Get in Touch"
contactAddress = Text             # "106-108 Tynewydd Road, Barry, CF62 8BB"
contactPhone = String(64)         # "01446 743893"
contactEmail = String(255)        # "admin@bellavistanursinghome.com"
contactMapUrl = Text              # Google Maps embed URL

# Quick Facts
quickFactBeds = String(64)        # "62"
quickFactLocation = String(128)   # "Barry"
quickFactCareType = String(128)   # "Dementia Care"
quickFactParking = String(64)     # "Available"

# Social/Review Links
googleReviewUrl = Text            # Google review page link
carehomeUrl = Text                # Carehome.co.uk page link


"""
=============================================================================
MIGRATION STRATEGY
=============================================================================
1. Add new columns to Home model (SQLAlchemy will handle this)
2. Create PageSection table
3. Run migration: flask db migrate && flask db upgrade
4. Seed default section order for each home
"""

"""
=============================================================================
API ENDPOINTS NEEDED
=============================================================================
"""
# GET  /api/homes/:id/sections          - Get all sections with order
# PUT  /api/homes/:id/sections/order    - Update section order (drag-drop)
# PUT  /api/homes/:id/sections/:key     - Update specific section content
# PUT  /api/homes/:id/section/:key/visibility - Toggle section visibility
