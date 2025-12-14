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
    createdAt = db.Column(db.DateTime, default=datetime.utcnow)
