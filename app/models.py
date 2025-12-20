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
    badge = db.Column(db.String(128))
    description = db.Column(db.Text)
    
    # Hero Section
    heroTitle = db.Column(db.String(255))
    heroSubtitle = db.Column(db.String(255))
    heroBgImage = db.Column(db.Text)
    heroExpandedDesc = db.Column(db.Text)
    
    # Stats
    statsBedrooms = db.Column(db.String(64))
    statsPremier = db.Column(db.String(64))
    
    # JSON Fields for Lists
    teamMembersJson = db.Column(db.Text)  # List of {name, role, image}
    teamGalleryJson = db.Column(db.Text)  # List of {type, url}
    
    activitiesIntro = db.Column(db.Text)
    activitiesJson = db.Column(db.Text)   # List of strings or objects
    activityImagesJson = db.Column(db.Text) # List of {type, url}
    activitiesModalDesc = db.Column(db.Text)
    
    facilitiesIntro = db.Column(db.Text)
    facilitiesListJson = db.Column(db.Text) # List of {icon, title}
    detailedFacilitiesJson = db.Column(db.Text) # List of {title, icon, description}
    facilitiesGalleryJson = db.Column(db.Text) # List of {type, url}
    
    featured = db.Column(db.Boolean, default=False)
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)

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
