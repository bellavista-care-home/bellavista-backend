import os
import json
import uuid
import boto3
from flask import Blueprint, request, jsonify, current_app
from . import db
from .models import ScheduledTour, CareEnquiry, NewsItem

api_bp = Blueprint('api', __name__)

def upload_file_helper(file, filename):
    s3_bucket = os.environ.get('S3_BUCKET')
    
    if s3_bucket:
        try:
            s3 = boto3.client('s3',
                aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
                region_name=os.environ.get('AWS_REGION', 'eu-west-2')
            )
            s3.upload_fileobj(
                file,
                s3_bucket,
                filename,
                ExtraArgs={
                    "ContentType": file.content_type
                }
            )
            return f"https://{s3_bucket}.s3.amazonaws.com/{filename}"
        except Exception as e:
            print(f"S3 Upload Error: {e}")
            return None
    else:
        path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(path)
        return f"/uploads/{filename}"

def to_dict_news(n):
    gallery = []
    if n.galleryJson:
        try:
            gallery = json.loads(n.galleryJson)
        except:
            gallery = []
    return {
        "id": n.id,
        "title": n.title,
        "excerpt": n.excerpt,
        "fullDescription": n.fullDescription,
        "image": n.image,
        "category": n.category,
        "date": n.date,
        "location": n.location,
        "author": n.author,
        "badge": n.badge,
        "important": n.important,
        "gallery": gallery,
        "videoUrl": n.videoUrl,
        "createdAt": n.createdAt.isoformat()
    }

@api_bp.post('/scheduled-tours')
def create_scheduled_tour():
    data = request.get_json(force=True)
    tid = data.get('id') or str(uuid.uuid4())
    tour = ScheduledTour(
        id=tid,
        name=data.get('name',''),
        email=data.get('email',''),
        phone=data.get('phone',''),
        preferredDate=data.get('preferredDate',''),
        preferredTime=data.get('preferredTime',''),
        location=data.get('location',''),
        message=data.get('message',''),
        status=data.get('status','requested')
    )
    db.session.add(tour)
    db.session.commit()
    return jsonify({"ok": True, "id": tid}), 201

@api_bp.get('/scheduled-tours')
def list_scheduled_tours():
    items = ScheduledTour.query.order_by(ScheduledTour.createdAt.desc()).all()
    return jsonify([{
        "id": i.id,
        "name": i.name,
        "email": i.email,
        "phone": i.phone,
        "preferredDate": i.preferredDate,
        "preferredTime": i.preferredTime,
        "location": i.location,
        "message": i.message,
        "createdAt": i.createdAt.isoformat(),
        "status": i.status
    } for i in items])

@api_bp.post('/care-enquiries')
def create_care_enquiry():
    data = request.get_json(force=True)
    eid = data.get('id') or str(uuid.uuid4())
    enquiry = CareEnquiry(
        id=eid,
        name=data.get('name',''),
        email=data.get('email',''),
        phone=data.get('phone',''),
        enquiryType=data.get('enquiryType',''),
        location=data.get('location',''),
        message=data.get('message',''),
        status=data.get('status','received')
    )
    db.session.add(enquiry)
    db.session.commit()
    return jsonify({"ok": True, "id": eid}), 201

@api_bp.get('/care-enquiries')
def list_care_enquiries():
    items = CareEnquiry.query.order_by(CareEnquiry.createdAt.desc()).all()
    return jsonify([{
        "id": i.id,
        "name": i.name,
        "email": i.email,
        "phone": i.phone,
        "enquiryType": i.enquiryType,
        "location": i.location,
        "message": i.message,
        "createdAt": i.createdAt.isoformat(),
        "status": i.status
    } for i in items])

@api_bp.post('/news')
def create_news():
    data = request.form.to_dict()
    files = request.files
    nid = data.get('id') or data.get('title','').lower().replace(' ','-')[:50] or str(uuid.uuid4())
    main_image_url = data.get('image','')
    if 'image' in files:
        f = files['image']
        filename = f"{nid}-main-{uuid.uuid4().hex}.jpg"
        uploaded_url = upload_file_helper(f, filename)
        if uploaded_url:
            main_image_url = uploaded_url

    gallery_urls = []
    for key in files:
        if key.startswith('gallery'):
            f = files[key]
            filename = f"{nid}-g-{uuid.uuid4().hex}.jpg"
            uploaded_url = upload_file_helper(f, filename)
            if uploaded_url:
                gallery_urls.append(uploaded_url)
    if data.get('gallery'):
        try:
            gallery_urls.extend(json.loads(data.get('gallery')))
        except:
            pass
    video_url = data.get('videoUrl','')
    item = NewsItem(
        id=nid,
        title=data.get('title',''),
        excerpt=data.get('excerpt','')[:180],
        fullDescription=data.get('fullDescription'),
        image=main_image_url,
        category=data.get('category','events'),
        date=data.get('date',''),
        location=data.get('location','All Locations'),
        author=data.get('author'),
        badge=data.get('badge'),
        important=data.get('important') in ['true','1', True],
        galleryJson=json.dumps(gallery_urls),
        videoUrl=video_url
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"ok": True, "id": nid}), 201

@api_bp.put('/news/<id>')
def update_news(id):
    item = NewsItem.query.get(id)
    if not item:
        return jsonify({"error":"Not found"}), 404
        
    # Handle multipart/form-data or JSON
    if request.content_type and 'multipart/form-data' in request.content_type:
        data = request.form.to_dict()
        files = request.files
    else:
        data = request.get_json(force=True)
        files = {}

    item.title = data.get('title', item.title)
    item.excerpt = (data.get('excerpt', item.excerpt) or '')[:180]
    item.fullDescription = data.get('fullDescription', item.fullDescription)
    
    if 'image' in files:
        f = files['image']
        filename = f"{id}-main-{uuid.uuid4().hex}.jpg"
        uploaded_url = upload_file_helper(f, filename)
        if uploaded_url:
            item.image = uploaded_url
    elif 'image' in data:
        item.image = data['image']

    item.category = data.get('category', item.category)
    item.date = data.get('date', item.date)
    item.location = data.get('location', item.location)
    item.author = data.get('author', item.author)
    item.badge = data.get('badge', item.badge)
    
    if 'important' in data:
         val = data['important']
         if isinstance(val, str):
             item.important = val.lower() in ['true', '1', 'on']
         else:
             item.important = bool(val)

    current_gallery = []
    if 'gallery' in data:
        try:
            current_gallery = json.loads(data['gallery'])
            if not isinstance(current_gallery, list):
                current_gallery = []
        except:
            pass
            
    new_gallery_urls = []
    for key in files:
        if key.startswith('gallery'):
            f = files[key]
            filename = f"{id}-g-{uuid.uuid4().hex}.jpg"
            uploaded_url = upload_file_helper(f, filename)
            if uploaded_url:
                new_gallery_urls.append(uploaded_url)
    
    # Merge old and new gallery
    item.galleryJson = json.dumps(current_gallery + new_gallery_urls)

    if 'videoUrl' in data:
        item.videoUrl = data['videoUrl']

    db.session.commit()
    return jsonify(to_dict_news(item))

@api_bp.get('/news')
def list_news():
    items = NewsItem.query.order_by(NewsItem.createdAt.desc()).all()
    return jsonify([to_dict_news(i) for i in items])

@api_bp.get('/news/<id>')
def get_news(id):
    item = NewsItem.query.get(id)
    if not item:
        return jsonify({"error": "Not found"}), 404
    return jsonify(to_dict_news(item))

@api_bp.delete('/news/<id>')
def delete_news(id):
    item = NewsItem.query.get(id)
    if not item:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"ok": True})

