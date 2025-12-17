import os
import json
import uuid
import boto3
from flask import Blueprint, request, jsonify, current_app
from . import db
from .models import ScheduledTour, CareEnquiry, NewsItem, Home
from .image_processor import ImageProcessor

api_bp = Blueprint('api', __name__)
s3_bucket = os.environ.get('S3_BUCKET')

def generate_unique_filename(original_filename):
    ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else 'jpg'
    unique_id = str(uuid.uuid4())[:8]
    return f"{unique_id}.{ext}"

def upload_file_helper(file_or_path, filename, content_type=None):
    is_path = isinstance(file_or_path, str)
    
    if s3_bucket:
        try:
            s3_client = boto3.client('s3')
            extra_args = {'ACL': 'public-read'}
            if content_type:
                extra_args['ContentType'] = content_type
            elif not is_path and hasattr(file_or_path, 'content_type'):
                extra_args['ContentType'] = file_or_path.content_type
            
            if is_path:
                s3_client.upload_file(file_or_path, s3_bucket, filename, ExtraArgs=extra_args)
            else:
                file_or_path.seek(0)
                s3_client.upload_fileobj(file_or_path, s3_bucket, filename, ExtraArgs=extra_args)
                file_or_path.seek(0)
                
            region = os.environ.get('AWS_REGION', 'us-east-1')
            return f"https://{s3_bucket}.s3.{region}.amazonaws.com/{filename}"
        except Exception as e:
            print(f"S3 Upload Error: {e}")
            return None
    else:
        # Local Fallback
        if is_path:
            return None # Caller handles local path URL generation
        else:
            try:
                upload_folder = current_app.config['UPLOAD_FOLDER']
                filepath = os.path.join(upload_folder, filename)
                file_or_path.save(filepath)
                file_or_path.seek(0)
                return f"/uploads/{filename}"
            except Exception as e:
                print(f"Local Save Error: {e}")
                return None

@api_bp.route('/upload', methods=['POST'])
def upload_file_route():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        # Use existing helper or save locally
        filename = generate_unique_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        
        # Ensure upload folder exists
        os.makedirs(upload_folder, exist_ok=True)
        
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        # Process if requested
        process_type = request.form.get('process_type', 'none')
        final_filepath = filepath
        final_filename = filename
        processed = False
        
        if process_type == 'resize_crop':
            try:
                # Create processed folder
                processed_folder = os.path.join(upload_folder, 'processed')
                os.makedirs(processed_folder, exist_ok=True)
                
                processor = ImageProcessor(filepath, processed_folder)
                processed_result = processor.process_news_main_card(filepath)
                
                final_filepath = processed_result['output_path']
                final_filename = f"processed/{os.path.basename(final_filepath)}"
                processed = True
            except Exception as e:
                print(f"Processing error: {e}")
                # Fallback to original
                pass
        elif process_type == 'resize_gallery':
            try:
                processed_folder = os.path.join(upload_folder, 'processed')
                os.makedirs(processed_folder, exist_ok=True)
                processor = ImageProcessor(filepath, processed_folder)
                img = processor.resize_with_crop(filepath, (1200, 675), 'center')
                processed_filename = f"{os.path.splitext(filename)[0]}_gallery.jpg"
                final_filepath = os.path.join(processed_folder, processed_filename)
                img.save(final_filepath, format='JPEG', quality=85, optimize=True)
                final_filename = f"processed/{processed_filename}"
                processed = True
            except Exception as e:
                print(f"Processing error: {e}")
                pass
        elif process_type == 'resize_gallery_pad':
            try:
                processed_folder = os.path.join(upload_folder, 'processed')
                os.makedirs(processed_folder, exist_ok=True)
                processor = ImageProcessor(filepath, processed_folder)
                img = processor.resize_with_padding(filepath, (1200, 675), (255, 255, 255))
                processed_filename = f"{os.path.splitext(filename)[0]}_gallery_pad.jpg"
                final_filepath = os.path.join(processed_folder, processed_filename)
                img.save(final_filepath, format='JPEG', quality=85, optimize=True)
                final_filename = f"processed/{processed_filename}"
                processed = True
            except Exception as e:
                print(f"Processing error: {e}")
                pass

        # Check if S3 is enabled
        s3_url = upload_to_s3(final_filepath, final_filename, file.content_type)
        
        if s3_url:
            # If uploaded to S3, return S3 URL and cleanup local files
            result = {
                'url': s3_url,
                'filename': final_filename,
                'processed': processed
            }
            # Optional: Clean up local files if you want to save space
            # os.remove(filepath)
            # if final_filepath != filepath:
            #     os.remove(final_filepath)
        else:
            # Return local URL
            result = {
                'url': f"/uploads/{final_filename}",
                'filename': final_filename,
                'processed': processed
            }
                
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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
        "videoDescription": n.videoDescription,
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
            # Process main image to standard card size
            try:
                if not s3_bucket:  # Only process if using local storage
                    upload_folder = current_app.config['UPLOAD_FOLDER']
                    filepath = os.path.join(upload_folder, filename)
                    processor = ImageProcessor(filepath, upload_folder)
                    result = processor.process_news_main_card(filepath, f"{nid}-main-card.jpg")
                    main_image_url = f"/uploads/{os.path.basename(result['output_path'])}"
            except Exception as e:
                print(f"Image processing error: {e}")
                # Fallback to original
                pass

    gallery_urls = []
    for key in files:
        if key.startswith('gallery'):
            f = files[key]
            filename = f"{nid}-g-{uuid.uuid4().hex}.jpg"
            uploaded_url = upload_file_helper(f, filename)
            if uploaded_url:
                # Process gallery image to standard detail size
                try:
                    if not s3_bucket:  # Only process if using local storage
                        upload_folder = current_app.config['UPLOAD_FOLDER']
                        filepath = os.path.join(upload_folder, filename)
                        processor = ImageProcessor(filepath, upload_folder)
                        result = processor.resize_with_crop(filepath, (1200, 675), 'center')
                        output_name = f"{nid}-gallery-{uuid.uuid4().hex}.jpg"
                        output_path = os.path.join(upload_folder, output_name)
                        result.save(output_path, format='JPEG', quality=85, optimize=True)
                        gallery_urls.append(f"/uploads/{output_name}")
                    else:
                        gallery_urls.append(uploaded_url)
                except Exception as e:
                    print(f"Gallery processing error: {e}")
                    gallery_urls.append(uploaded_url)
    if data.get('gallery'):
        try:
            gallery_urls.extend(json.loads(data.get('gallery')))
        except:
            pass
    video_url = data.get('videoUrl','')
    video_desc = data.get('videoDescription','')
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
        videoUrl=video_url,
        videoDescription=video_desc
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
            # Process main image to standard card size
            try:
                if not s3_bucket:  # Only process if using local storage
                    upload_folder = current_app.config['UPLOAD_FOLDER']
                    filepath = os.path.join(upload_folder, filename)
                    processor = ImageProcessor(filepath, upload_folder)
                    result = processor.process_news_main_card(filepath, f"{id}-main-card.jpg")
                    item.image = f"/uploads/{os.path.basename(result['output_path'])}"
                else:
                    item.image = uploaded_url
            except Exception as e:
                print(f"Image processing error: {e}")
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
                # Process gallery image to standard detail size
                try:
                    if not s3_bucket:  # Only process if using local storage
                        upload_folder = current_app.config['UPLOAD_FOLDER']
                        filepath = os.path.join(upload_folder, filename)
                        processor = ImageProcessor(filepath, upload_folder)
                        result = processor.resize_with_crop(filepath, (1200, 675), 'center')
                        output_name = f"{id}-gallery-{uuid.uuid4().hex}.jpg"
                        output_path = os.path.join(upload_folder, output_name)
                        result.save(output_path, format='JPEG', quality=85, optimize=True)
                        new_gallery_urls.append(f"/uploads/{output_name}")
                    else:
                        new_gallery_urls.append(uploaded_url)
                except Exception as e:
                    print(f"Gallery processing error: {e}")
                    new_gallery_urls.append(uploaded_url)
    
    # Merge old and new gallery
    item.galleryJson = json.dumps(current_gallery + new_gallery_urls)

    if 'videoUrl' in data:
        item.videoUrl = data['videoUrl']
    if 'videoDescription' in data:
        item.videoDescription = data['videoDescription']

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

def to_dict_home(h):
    def parse_json(field):
        try:
            return json.loads(field) if field else []
        except:
            return []

    return {
        "id": h.id,
        "homeName": h.name,
        "homeLocation": h.location,
        "homeImage": h.image,
        "homeBadge": h.badge,
        "homeDesc": h.description,
        "heroTitle": h.heroTitle,
        "heroSubtitle": h.heroSubtitle,
        "heroBgImage": h.heroBgImage,
        "heroExpandedDesc": h.heroExpandedDesc,
        "statsBedrooms": h.statsBedrooms,
        "statsPremier": h.statsPremier,
        "teamMembers": parse_json(h.teamMembersJson),
        "teamGalleryImages": parse_json(h.teamGalleryJson),
        "activitiesIntro": h.activitiesIntro,
        "activities": parse_json(h.activitiesJson),
        "activityImages": parse_json(h.activityImagesJson),
        "activitiesModalDesc": h.activitiesModalDesc,
        "facilitiesIntro": h.facilitiesIntro,
        "facilitiesList": parse_json(h.facilitiesListJson),
        "detailedFacilities": parse_json(h.detailedFacilitiesJson),
        "facilitiesGalleryImages": parse_json(h.facilitiesGalleryJson),
        "homeFeatured": h.featured,
        "createdAt": h.createdAt.isoformat()
    }

@api_bp.post('/homes')
def create_home():
    data = request.get_json(force=True)
    hid = data.get('id') or str(uuid.uuid4())
    
    home = Home(
        id=hid,
        name=data.get('homeName', ''),
        location=data.get('homeLocation', ''),
        image=data.get('homeImage', ''),
        badge=data.get('homeBadge', ''),
        description=data.get('homeDesc', ''),
        heroTitle=data.get('heroTitle', ''),
        heroSubtitle=data.get('heroSubtitle', ''),
        heroBgImage=data.get('heroBgImage', ''),
        heroExpandedDesc=data.get('heroExpandedDesc', ''),
        statsBedrooms=data.get('statsBedrooms', ''),
        statsPremier=data.get('statsPremier', ''),
        teamMembersJson=json.dumps(data.get('teamMembers', [])),
        teamGalleryJson=json.dumps(data.get('teamGalleryImages', [])),
        activitiesIntro=data.get('activitiesIntro', ''),
        activitiesJson=json.dumps(data.get('activities', [])),
        activityImagesJson=json.dumps(data.get('activityImages', [])),
        activitiesModalDesc=data.get('activitiesModalDesc', ''),
        facilitiesIntro=data.get('facilitiesIntro', ''),
        facilitiesListJson=json.dumps(data.get('facilitiesList', [])),
        detailedFacilitiesJson=json.dumps(data.get('detailedFacilities', [])),
        facilitiesGalleryJson=json.dumps(data.get('facilitiesGalleryImages', [])),
        featured=data.get('homeFeatured', False)
    )
    
    db.session.add(home)
    db.session.commit()
    return jsonify({"ok": True, "id": hid}), 201

@api_bp.get('/homes')
def list_homes():
    homes = Home.query.order_by(Home.createdAt.desc()).all()
    return jsonify([to_dict_home(h) for h in homes])

@api_bp.get('/homes/<id>')
def get_home(id):
    home = Home.query.get(id)
    if not home:
        return jsonify({"error": "Not found"}), 404
    return jsonify(to_dict_home(home))

@api_bp.put('/homes/<id>')
def update_home(id):
    home = Home.query.get(id)
    if not home:
        return jsonify({"error": "Not found"}), 404
        
    data = request.get_json(force=True)
    
    # Update fields
    home.name = data.get('homeName', home.name)
    home.location = data.get('homeLocation', home.location)
    home.image = data.get('homeImage', home.image)
    home.badge = data.get('homeBadge', home.badge)
    home.description = data.get('homeDesc', home.description)
    
    home.heroTitle = data.get('heroTitle', home.heroTitle)
    home.heroSubtitle = data.get('heroSubtitle', home.heroSubtitle)
    home.heroBgImage = data.get('heroBgImage', home.heroBgImage)
    home.heroExpandedDesc = data.get('heroExpandedDesc', home.heroExpandedDesc)
    
    home.statsBedrooms = data.get('statsBedrooms', home.statsBedrooms)
    home.statsPremier = data.get('statsPremier', home.statsPremier)
    
    if 'teamMembers' in data:
        home.teamMembersJson = json.dumps(data['teamMembers'])
    if 'teamGalleryImages' in data:
        home.teamGalleryJson = json.dumps(data['teamGalleryImages'])
        
    home.activitiesIntro = data.get('activitiesIntro', home.activitiesIntro)
    if 'activities' in data:
        home.activitiesJson = json.dumps(data['activities'])
    if 'activityImages' in data:
        home.activityImagesJson = json.dumps(data['activityImages'])
    home.activitiesModalDesc = data.get('activitiesModalDesc', home.activitiesModalDesc)
    
    home.facilitiesIntro = data.get('facilitiesIntro', home.facilitiesIntro)
    if 'facilitiesList' in data:
        home.facilitiesListJson = json.dumps(data['facilitiesList'])
    if 'detailedFacilities' in data:
        home.detailedFacilitiesJson = json.dumps(data['detailedFacilities'])
    if 'facilitiesGalleryImages' in data:
        home.facilitiesGalleryJson = json.dumps(data['facilitiesGalleryImages'])
        
    if 'homeFeatured' in data:
        home.featured = data['homeFeatured']
        
    db.session.commit()
    return jsonify(to_dict_home(home))

@api_bp.delete('/homes/<id>')
def delete_home(id):
    home = Home.query.get(id)
    if not home:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(home)
    db.session.commit()
    return jsonify({"ok": True})

