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
    
    # Hero Section
    heroTitle = db.Column(db.String(255))
    heroSubtitle = db.Column(db.String(255))
    heroBgImage = db.Column(db.Text)
    heroDescription = db.Column(db.Text)
    heroExpandedDesc = db.Column(db.Text)
    statsLocationBadge = db.Column(db.String(255))
    statsQualityBadge = db.Column(db.String(255))
    statsTeamBadge = db.Column(db.String(255))
    
    # Documents
    ciwReportUrl = db.Column(db.Text)
    newsletterUrl = db.Column(db.Text)
    
    # Scrolling Banner
    bannerImagesJson = db.Column(db.Text)
    
    # Stats
    statsBedrooms = db.Column(db.Integer)
    statsPremier = db.Column(db.Integer)
    
    # About Section
    aboutTitle = db.Column(db.String(255))
    aboutIntro = db.Column(db.Text)
    aboutParagraph2 = db.Column(db.Text)
    carePhilosophyTitle = db.Column(db.String(255))
    carePhilosophy = db.Column(db.Text)
    locationTitle = db.Column(db.String(255))
    locationDescription = db.Column(db.Text)
    contentBlocksJson = db.Column(db.Text)  # JSON array of dynamic content blocks
    
    # Why Choose Section
    whyChooseTitle = db.Column(db.String(255))
    whyChooseSubtitle = db.Column(db.String(255))
    whyChooseListJson = db.Column(db.Text)
    whyChooseClosing = db.Column(db.Text)
    
    # Services Section
    servicesTitle = db.Column(db.String(255))
    servicesSubtitle = db.Column(db.String(255))
    servicesIntro = db.Column(db.Text)
    servicesListJson = db.Column(db.Text)
    servicesClosing = db.Column(db.Text)
    servicesCta = db.Column(db.String(255))
    servicesCtaLink = db.Column(db.Text)
    servicesContent = db.Column(db.Text)  # Rich text HTML content
    
    # Facilities Section
    facilitiesTitle = db.Column(db.String(255))
    facilitiesSubtitle = db.Column(db.String(255))
    facilitiesIntro = db.Column(db.Text)
    facilitiesListJson = db.Column(db.Text)
    detailedFacilitiesJson = db.Column(db.Text)
    facilitiesGalleryJson = db.Column(db.Text)
    facilitiesContent = db.Column(db.Text)  # Rich text HTML content
    
    # Activities Section
    activitiesTitle = db.Column(db.String(255))
    activitiesSubtitle = db.Column(db.String(255))
    activitiesIntro = db.Column(db.Text)
    activitiesJson = db.Column(db.Text)
    activityImagesJson = db.Column(db.Text)
    activitiesModalDesc = db.Column(db.Text)
    activitiesContent = db.Column(db.Text)  # Rich text HTML content
    
    # Team Section
    teamTitle = db.Column(db.String(255))
    teamSubtitle = db.Column(db.String(255))
    teamIntro = db.Column(db.Text)
    teamIntro2 = db.Column(db.Text)
    teamMembersJson = db.Column(db.Text)
    teamGalleryJson = db.Column(db.Text)
    teamContent = db.Column(db.Text)  # Rich text HTML content
    
    # Testimonials Section
    testimonialsTitle = db.Column(db.String(255))
    googleRating = db.Column(db.Float)
    googleReviewCount = db.Column(db.Integer)
    carehomeRating = db.Column(db.Float)
    carehomeReviewCount = db.Column(db.Integer)
    testimonialsIntro = db.Column(db.Text)
    
    # News Section
    newsTitle = db.Column(db.String(255))
    newsSubtitle = db.Column(db.String(255))
    
    # Contact Section
    contactTitle = db.Column(db.String(255))
    contactSubtitle = db.Column(db.String(255))
    contactAddress = db.Column(db.Text)
    contactPhone = db.Column(db.String(64))
    contactEmail = db.Column(db.String(255))
    contactMapUrl = db.Column(db.Text)
    quickFactBeds = db.Column(db.String(64))
    quickFactLocation = db.Column(db.String(255))
    quickFactCareType = db.Column(db.String(255))
    quickFactParking = db.Column(db.String(128))
    googleReviewUrl = db.Column(db.Text)
    carehomeUrl = db.Column(db.Text)
    
    # Care Section (for detailed care pages)
    careIntro = db.Column(db.Text)
    careServicesJson = db.Column(db.Text)
    careSectionsJson = db.Column(db.Text)
    careGalleryJson = db.Column(db.Text)
    
    featured = db.Column(db.Boolean, default=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)


class PageSection(db.Model):
    """Tracks section order and visibility for each home page"""
    id = db.Column(db.String, primary_key=True)
    homeId = db.Column(db.String, db.ForeignKey('home.id'), nullable=False)
    sectionKey = db.Column(db.String(64), nullable=False)  # hero, about, services, etc.
    order = db.Column(db.Integer, default=0)
    visible = db.Column(db.Boolean, default=True)
    customTitle = db.Column(db.String(255))  # Optional override title
    customCssClass = db.Column(db.String(128))  # Optional custom styling
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


class MealPlan(db.Model):
    """Meal plans for each home - supports weekly menu planning"""
    id = db.Column(db.String, primary_key=True)
    homeId = db.Column(db.String, db.ForeignKey('home.id'), nullable=False)
    dayOfWeek = db.Column(db.Integer, nullable=False)  # 0=Monday, 6=Sunday
    mealType = db.Column(db.String(64), nullable=False)  # breakfast, lunch, dinner, snack
    mealName = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    ingredients = db.Column(db.Text)  # JSON array
    allergyInfo = db.Column(db.Text)  # JSON array
    imageUrl = db.Column(db.Text)
    nutritionalInfo = db.Column(db.Text)  # JSON object
    tags = db.Column(db.Text)  # JSON array
    isSpecialMenu = db.Column(db.Boolean, default=False)
    effectiveDate = db.Column(db.String(32))  # ISO date string
    order = db.Column(db.Integer, default=0)
    isActive = db.Column(db.Boolean, default=True)
    createdBy = db.Column(db.String(128))
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DeletedMedia(db.Model):
    """Soft delete audit log for media files - keeps record of removed images/videos"""
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    homeId = db.Column(db.String, db.ForeignKey('home.id'), nullable=True)  # Made nullable for safety
    galleryType = db.Column(db.String(64), nullable=False)  # banner, facility, activity, team, care
    
    # Original media data (stored as JSON)
    mediaUrl = db.Column(db.Text, nullable=False)
    mediaType = db.Column(db.String(32), default='image')  # image or video
    title = db.Column(db.String(255))
    caption = db.Column(db.Text)
    originalData = db.Column(db.Text)  # Full JSON of original item
    
    # Audit fields
    deletedAt = db.Column(db.DateTime, default=datetime.utcnow)
    deletedBy = db.Column(db.String(128))  # username who deleted
    reason = db.Column(db.String(255))  # optional reason
    
    # Recovery tracking
    recovered = db.Column(db.Boolean, default=False)
    recoveredAt = db.Column(db.DateTime)
    recoveredBy = db.Column(db.String(128))


class DataBackup(db.Model):
    """
    Universal backup/audit table - tracks ALL changes to any record.
    Before any update or delete, the old data is stored here for recovery.
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # What was changed
    tableName = db.Column(db.String(64), nullable=False)  # home, news_item, vacancy, etc.
    recordId = db.Column(db.String(255), nullable=False)  # Primary key of the record
    
    # Change type
    action = db.Column(db.String(32), nullable=False)  # 'update', 'delete', 'create'
    
    # The complete data snapshot (JSON)
    oldData = db.Column(db.Text)  # Data BEFORE the change (null for create)
    newData = db.Column(db.Text)  # Data AFTER the change (null for delete)
    changedFields = db.Column(db.Text)  # JSON list of field names that changed
    
    # Related home (for filtering)
    homeId = db.Column(db.String, db.ForeignKey('home.id'), nullable=True)
    
    # Audit info
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    createdBy = db.Column(db.String(128))  # username who made the change
    ipAddress = db.Column(db.String(64))
    userAgent = db.Column(db.String(512))
    
    # Recovery tracking
    restored = db.Column(db.Boolean, default=False)
    restoredAt = db.Column(db.DateTime)
    restoredBy = db.Column(db.String(128))
    
    # Index for efficient queries
    __table_args__ = (
        db.Index('idx_backup_table_record', 'tableName', 'recordId'),
        db.Index('idx_backup_home', 'homeId'),
        db.Index('idx_backup_date', 'createdAt'),
    )


class Newsletter(db.Model):
    """Monthly newsletters uploaded by admin - viewable by users on the newsletter archive page"""
    id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    fileUrl = db.Column(db.Text, nullable=False)  # S3 URL to the PDF
    coverImage = db.Column(db.Text)  # Optional cover image for the newsletter
    month = db.Column(db.Integer, nullable=False)  # 1-12
    year = db.Column(db.Integer, nullable=False)
    homeId = db.Column(db.String, db.ForeignKey('home.id'), nullable=True)  # Optional: specific home, null=global
    publishedAt = db.Column(db.DateTime, default=datetime.utcnow)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.Index('idx_newsletter_month_year', 'year', 'month'),
    )


class NewsletterSubscriber(db.Model):
    """Email subscribers who receive newsletters via email when admin uploads a new one"""
    id = db.Column(db.String, primary_key=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    name = db.Column(db.String(255))
    homeId = db.Column(db.String, db.ForeignKey('home.id'), nullable=True)  # Optional: subscribe to specific home
    subscribedAt = db.Column(db.DateTime, default=datetime.utcnow)
    isActive = db.Column(db.Boolean, default=True)
    unsubscribedAt = db.Column(db.DateTime)


class CareService(db.Model):
    """Care services offered by the care home - displayed on care page"""
    id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    images = db.Column(db.Text)  # JSON array of image URLs
    showOnPage = db.Column(db.Boolean, default=True)
    order = db.Column(db.Integer, default=0)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
    updatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
