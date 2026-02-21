from datetime import datetime
from . import db

class ScheduledTour(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(64), nullable=False)
    preferredDate = db.Column(db.String(64))
    preferredTime = db.Column(db.String(64))
    location = db.Column(db.String(128))
    message = db.Column(db.Text)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(64), default='requested')

class Home(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255))
    adminEmail = db.Column(db.String(255))
    image = db.Column(db.Text)
    cardImage2 = db.Column(db.Text)
    badge = db.Column(db.String(128))
    description = db.Column(db.Text)
    
    # ========================
    # HERO SECTION
    # ========================
    heroTitle = db.Column(db.String(255))
    heroSubtitle = db.Column(db.String(500))
    heroBgImage = db.Column(db.Text)
    heroDescription = db.Column(db.Text)
    heroExpandedDesc = db.Column(db.Text)
    statsLocationBadge = db.Column(db.String(128))
    statsQualityBadge = db.Column(db.String(128))
    statsTeamBadge = db.Column(db.String(128))
    
    # Documents
    ciwReportUrl = db.Column(db.Text)
    newsletterUrl = db.Column(db.Text)
    
    # Scrolling Banner
    bannerImagesJson = db.Column(db.Text) # List of {url, alt, showOnPage}
    
    # Stats
    statsBedrooms = db.Column(db.String(64))
    statsPremier = db.Column(db.String(64))
    
    # ========================
    # ABOUT/WELCOME SECTION
    # ========================
    aboutTitle = db.Column(db.String(255))
    aboutIntro = db.Column(db.Text)
    aboutParagraph2 = db.Column(db.Text)
    carePhilosophyTitle = db.Column(db.String(255))
    carePhilosophy = db.Column(db.Text)
    locationTitle = db.Column(db.String(255))
    locationDescription = db.Column(db.Text)
    contentBlocksJson = db.Column(db.Text)  # JSON array of dynamic content blocks
    
    # ========================
    # WHY CHOOSE US SECTION
    # ========================
    whyChooseTitle = db.Column(db.String(255))
    whyChooseSubtitle = db.Column(db.String(255))
    whyChooseListJson = db.Column(db.Text)  # JSON array of strings
    whyChooseClosing = db.Column(db.Text)
    
    # ========================
    # SERVICES SECTION
    # ========================
    servicesTitle = db.Column(db.String(255))
    servicesSubtitle = db.Column(db.String(255))
    servicesIntro = db.Column(db.Text)
    servicesListJson = db.Column(db.Text)  # JSON array of strings
    servicesClosing = db.Column(db.Text)
    servicesCta = db.Column(db.String(255))
    servicesCtaLink = db.Column(db.String(255))
    
    # ========================
    # FACILITIES SECTION
    # ========================
    facilitiesTitle = db.Column(db.String(255))
    facilitiesSubtitle = db.Column(db.String(255))
    facilitiesIntro = db.Column(db.Text)
    facilitiesListJson = db.Column(db.Text) # List of {icon, title}
    detailedFacilitiesJson = db.Column(db.Text) # List of {title, icon, description}
    facilitiesGalleryJson = db.Column(db.Text) # List of {type, url}
    
    # ========================
    # ACTIVITIES SECTION
    # ========================
    activitiesTitle = db.Column(db.String(255))
    activitiesSubtitle = db.Column(db.String(255))
    activitiesIntro = db.Column(db.Text)
    activitiesJson = db.Column(db.Text)   # List of strings or objects
    activityImagesJson = db.Column(db.Text) # List of {type, url}
    activitiesModalDesc = db.Column(db.Text)
    
    # ========================
    # TEAM SECTION
    # ========================
    teamTitle = db.Column(db.String(255))
    teamSubtitle = db.Column(db.String(255))
    teamIntro = db.Column(db.Text)
    teamIntro2 = db.Column(db.Text)
    teamMembersJson = db.Column(db.Text)  # List of {name, role, image, bio}
    teamGalleryJson = db.Column(db.Text)  # List of {type, url}
    
    # ========================
    # TESTIMONIALS SECTION
    # ========================
    testimonialsTitle = db.Column(db.String(255))
    googleRating = db.Column(db.String(16))
    googleReviewCount = db.Column(db.Integer)
    carehomeRating = db.Column(db.String(16))
    carehomeReviewCount = db.Column(db.Integer)
    testimonialsIntro = db.Column(db.Text)
    
    # ========================
    # NEWS SECTION
    # ========================
    newsTitle = db.Column(db.String(255))
    newsSubtitle = db.Column(db.String(255))
    
    # ========================
    # CONTACT SECTION
    # ========================
    contactTitle = db.Column(db.String(255))
    contactSubtitle = db.Column(db.String(255))
    contactAddress = db.Column(db.Text)
    contactPhone = db.Column(db.String(64))
    contactEmail = db.Column(db.String(255))
    contactMapUrl = db.Column(db.Text)
    quickFactBeds = db.Column(db.String(64))
    quickFactLocation = db.Column(db.String(128))
    quickFactCareType = db.Column(db.String(128))
    quickFactParking = db.Column(db.String(64))
    googleReviewUrl = db.Column(db.Text)
    carehomeUrl = db.Column(db.Text)
    
    # ========================
    # CARE SECTION (existing)
    # ========================
    careIntro = db.Column(db.Text)
    careServicesJson = db.Column(db.Text) # List of {title, description, image}
    careSectionsJson = db.Column(db.Text) # List of {title, description, images}
    careGalleryJson = db.Column(db.Text) # List of {url, type}

    featured = db.Column(db.Boolean, default=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)


class PageSection(db.Model):
    """Stores the order and visibility of sections for each home page."""
    id = db.Column(db.String, primary_key=True)
    homeId = db.Column(db.String, db.ForeignKey('home.id'), nullable=False)
    sectionKey = db.Column(db.String(64), nullable=False)  # hero, about, whyChoose, etc.
    order = db.Column(db.Integer, default=0)
    visible = db.Column(db.Boolean, default=True)
    customTitle = db.Column(db.String(255))  # Override default section title
    customCssClass = db.Column(db.String(255))  # Custom styling class
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CareEnquiry(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(64), nullable=False)
    enquiryType = db.Column(db.String(128))
    location = db.Column(db.String(128))
    message = db.Column(db.Text)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(64), default='received')

class NewsItem(db.Model):
    id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    excerpt = db.Column(db.Text, nullable=False)
    fullDescription = db.Column(db.Text)
    image = db.Column(db.Text)
    category = db.Column(db.String(128), nullable=False)
    date = db.Column(db.String(64), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    author = db.Column(db.String(128))
    badge = db.Column(db.String(128))
    important = db.Column(db.Boolean, default=False)
    galleryJson = db.Column(db.Text)
    videoUrl = db.Column(db.Text)
    videoDescription = db.Column(db.Text)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

class Event(db.Model):
    id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.String(64), nullable=False) # YYYY-MM-DD
    time = db.Column(db.String(64))
    startTime = db.Column(db.String(64))
    endTime = db.Column(db.String(64))
    location = db.Column(db.String(255))
    image = db.Column(db.Text)
    category = db.Column(db.String(128))
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

class FAQ(db.Model):
    id = db.Column(db.String, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    order = db.Column(db.Integer, default=0)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

class Vacancy(db.Model):
    id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    image = db.Column(db.Text)
    shortDescription = db.Column(db.Text)
    detailedDescription = db.Column(db.Text)
    location = db.Column(db.String(255))
    salary = db.Column(db.String(128))
    type = db.Column(db.String(128))
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

class JobApplication(db.Model):
    id = db.Column(db.String, primary_key=True)
    vacancyId = db.Column(db.String, db.ForeignKey('vacancy.id'))
    firstName = db.Column(db.String(128), nullable=False)
    lastName = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    jobRole = db.Column(db.String(255))
    cvUrl = db.Column(db.Text)
    marketingConsent = db.Column(db.Boolean, default=False)
    privacyConsent = db.Column(db.Boolean, default=False)
    status = db.Column(db.String(64), default='received')
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
class KioskCheckIn(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(64))
    location = db.Column(db.String(128), nullable=False)  # Which home/location
    visitPurpose = db.Column(db.String(255))  # Why visiting
    personVisiting = db.Column(db.String(255))  # Who they're visiting
    checkInTime = db.Column(db.DateTime, default=datetime.utcnow)
    checkOutTime = db.Column(db.DateTime)
    status = db.Column(db.String(64), default='checked-in')  # checked-in, checked-out
    notes = db.Column(db.Text)

class Review(db.Model):
    id = db.Column(db.String, primary_key=True)
    location = db.Column(db.String(255), nullable=False)  # Home name or 'Bellavista Nursing Homes'
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    reviewText = db.Column(db.Text, nullable=False)
    source = db.Column(db.String(64), default='website')  # website, kiosk, imported, etc.
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

class ManagementMember(db.Model):
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    image = db.Column(db.Text)
    order = db.Column(db.Integer, default=0)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

class User(db.Model):
    id = db.Column(db.String, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(64), default='home_admin') # 'superadmin' or 'home_admin'
    home_id = db.Column(db.String, db.ForeignKey('home.id'), nullable=True) # Null for superadmin
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

class CareService(db.Model):
    id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    imagesJson = db.Column(db.Text) # List of image URLs
    icon = db.Column(db.String(128))
    order = db.Column(db.Integer, default=0)
    slug = db.Column(db.String(128))
    showOnPage = db.Column(db.Boolean, default=True)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

class MealPlan(db.Model):
    id = db.Column(db.String, primary_key=True)
    homeId = db.Column(db.String, db.ForeignKey('home.id'), nullable=False)
    dayOfWeek = db.Column(db.String(64), nullable=False)  # Monday-Sunday
    mealType = db.Column(db.String(64), nullable=False)  # Breakfast, Lunch, Snack, Dinner
    mealName = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    ingredients = db.Column(db.Text)  # JSON array as string
    allergyInfo = db.Column(db.Text)  # JSON array (gluten-free, vegan, dairy-free, etc.)
    imageUrl = db.Column(db.Text)
    nutritionalInfo = db.Column(db.Text)  # JSON (calories, protein, carbs, fat, fiber)
    tags = db.Column(db.Text)  # JSON array (vegetarian, high-protein, etc.)
    isSpecialMenu = db.Column(db.Boolean, default=False)  # For holiday/special occasion menus
    effectiveDate = db.Column(db.String(64))  # YYYY-MM-DD format, null = recurring weekly
    isActive = db.Column(db.Boolean, default=True)
    order = db.Column(db.Integer, default=0)  # For sorting meals in a day
    createdBy = db.Column(db.String, db.ForeignKey('user.id'), nullable=True)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
