import os
import json
import uuid
import boto3
import smtplib
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Blueprint, request, jsonify, current_app
from . import db
from .models import ScheduledTour, CareEnquiry, NewsItem, Home, FAQ, Vacancy, JobApplication, KioskCheckIn, Review
from .image_processor import ImageProcessor
from .auth import login_user, require_auth, require_admin
from .validators import validate_and_sanitize, validate_news, validate_home, validate_faq, validate_vacancy, validate_review, create_error_response
from .rate_limiter import rate_limit
from .audit_log import log_action, log_login_attempt, log_unauthorized_access, setup_audit_logging

api_bp = Blueprint('api', __name__)
s3_bucket = os.environ.get('S3_BUCKET')

def send_email_sync(to_emails, subject, body):
    if not isinstance(to_emails, list):
        to_emails = [to_emails]

    # 1. Try AWS SES
    aws_access = os.environ.get('AWS_ACCESS_KEY_ID')
    aws_secret = os.environ.get('AWS_SECRET_ACCESS_KEY')
    sender_email = os.environ.get('MAIL_SENDER') or os.environ.get('MAIL_USERNAME')

    if aws_access and aws_secret and sender_email and os.environ.get('USE_SES', 'false').lower() == 'true':
        try:
            client = boto3.client(
                'ses',
                aws_access_key_id=aws_access,
                aws_secret_access_key=aws_secret,
                region_name=os.environ.get('AWS_REGION', 'eu-west-2')
            )
            client.send_email(
                Source=sender_email,
                Destination={'ToAddresses': to_emails},
                Message={
                    'Subject': {'Data': subject},
                    'Body': {'Text': {'Data': body}}
                }
            )
            print(f"SES Email sent to {to_emails}")
            return True
        except Exception as e:
            print(f"SES Failed: {e}")
            # Fallback to SMTP below

    # 2. Fallback to SMTP (Gmail/Others)
    smtp_user = os.environ.get('MAIL_USERNAME')
    smtp_pass = os.environ.get('MAIL_PASSWORD')
    
    if not smtp_user or not smtp_pass:
        print("SMTP configuration missing")
        return False
        
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = ", ".join(to_emails)
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, to_emails, msg.as_string())
        server.quit()
        print(f"SMTP Email sent to {to_emails}")
        return True
    except Exception as e:
        print(f"SMTP Failed: {e}")
        return False

def send_email(to_emails, subject, body):
    # Run email sending in a background thread to not block the API
    thread = threading.Thread(target=send_email_sync, args=(to_emails, subject, body))
    thread.start()
    return True

def upload_file_helper(file_or_path, filename, content_type=None):
    if not s3_bucket:
        return None
        
    try:
        s3 = boto3.client(
            's3',
            aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
            region_name=os.environ.get('AWS_REGION', 'eu-west-2')
        )

        if isinstance(file_or_path, str):
            # It's a file path
            with open(file_or_path, 'rb') as data:
                s3.upload_fileobj(
                    data, 
                    s3_bucket, 
                    filename,
                    ExtraArgs={'ContentType': content_type or 'image/jpeg', 'ACL': 'public-read'}
                )
        else:
            # It's a FileStorage object
            file_or_path.seek(0)
            s3.upload_fileobj(
                file_or_path,
                s3_bucket,
                filename,
                ExtraArgs={'ContentType': content_type or file_or_path.content_type, 'ACL': 'public-read'}
            )
            
        return f"https://{s3_bucket}.s3.amazonaws.com/{filename}"
    except Exception as e:
        print(f"S3 Upload Error: {e}")
        return None

def generate_unique_filename(original_filename):
    ext = original_filename.rsplit('.', 1)[1].lower() if '.' in original_filename else 'jpg'
    unique_id = str(uuid.uuid4())[:8]
    return f"{unique_id}.{ext}"

@api_bp.route('/upload', methods=['POST'])
def upload_file_route():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
            
        # Strict File Type Validation (Security)
        # We must prevent uploading of executable files or scripts
        ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
        ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'mov', 'webm'}
        ALLOWED_EXTENSIONS = ALLOWED_IMAGE_EXTENSIONS | ALLOWED_VIDEO_EXTENSIONS
        
        ext = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
        if ext not in ALLOWED_EXTENSIONS:
            return jsonify({'error': 'File type not allowed. Only images and videos (mp4, mov, webm) are accepted.'}), 400
            
        # Use existing helper or save locally
        filename = generate_unique_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        
        # Ensure upload folder exists
        os.makedirs(upload_folder, exist_ok=True)
        
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)

        # CRITICAL SECURITY: Verify content type
        if ext in ALLOWED_IMAGE_EXTENSIONS:
            # Image Magic Bytes Check
            try:
                from PIL import Image
                with Image.open(filepath) as img:
                    img.verify() # Verify it's an image
                    if img.format.lower() not in ['jpeg', 'jpg', 'png', 'gif', 'webp']:
                         os.remove(filepath)
                         return jsonify({'error': 'Invalid image format detected (Content Mismatch)'}), 400
            except Exception as e:
                os.remove(filepath)
                print(f"Security Check Failed: {e}")
                return jsonify({'error': 'Invalid file content. Not a valid image.'}), 400
        
        elif ext in ALLOWED_VIDEO_EXTENSIONS:
            # Basic Video Header Check (Magic Bytes)
            # We check the first few bytes to ensure it matches common video signatures
            try:
                with open(filepath, 'rb') as f:
                    header = f.read(12)
                    valid_video = False
                    
                    # MP4/MOV usually start with ftyp at offset 4
                    # Common signatures: ....ftypisom, ....ftypmp42, ....ftypqt  
                    if ext in ['mp4', 'mov']:
                        if len(header) >= 12 and header[4:8] == b'ftyp':
                            valid_video = True
                            
                    # WebM (Matroska) starts with 1A 45 DF A3
                    elif ext == 'webm':
                        if len(header) >= 4 and header[0:4] == b'\x1A\x45\xDF\xA3':
                            valid_video = True
                            
                    if not valid_video:
                         os.remove(filepath)
                         return jsonify({'error': 'Invalid video format detected (Content Mismatch)'}), 400
                         
            except Exception as e:
                os.remove(filepath)
                print(f"Video Security Check Failed: {e}")
                return jsonify({'error': 'Invalid file content. Not a valid video.'}), 400

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
        s3_url = upload_file_helper(final_filepath, final_filename, file.content_type)
        
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

def to_dict_review(r):
    return {
        "id": r.id,
        "location": r.location,
        "name": r.name,
        "rating": r.rating,
        "review": r.reviewText,
        "source": r.source,
        "createdAt": r.createdAt.isoformat() if r.createdAt else None
    }

@api_bp.post('/reviews')
@rate_limit(max_attempts=10, window_seconds=3600)
def create_review():
    return jsonify({"error": "Direct review submission is disabled"}), 403

    # data = request.get_json(force=True)
    # result = validate_and_sanitize(data, validate_review)
    # if not result['valid']:
    #     return create_error_response(result['errors'], 400)

    # cleaned = result['data']
    # rid = str(uuid.uuid4())

    # review = Review(
    #     id=rid,
    #     location=cleaned.get('location'),
    #     name=cleaned.get('name'),
    #     email=cleaned.get('email'),
    #     rating=int(cleaned.get('rating')),
    #     reviewText=cleaned.get('review'),
    #     source=cleaned.get('source') or 'website'
    # )

    # db.session.add(review)
    # db.session.commit()

    # log_action('create_review', details={'id': rid, 'location': review.location})

    # return jsonify({"ok": True, "id": rid}), 201

@api_bp.get('/reviews')
def list_reviews():
    location = request.args.get('location')
    query = Review.query
    if location:
        query = query.filter(Review.location.ilike(f"%{location}%"))

    items = query.order_by(Review.createdAt.desc()).limit(200).all()
    return jsonify([to_dict_review(r) for r in items])

from .tasks import LOCATIONS

@api_bp.post('/reviews/import-google')
@require_auth
@require_admin
def import_google_reviews():
    """
    Import reviews from Google Places API.
    Requires 'place_id' OR 'location_name' in body.
    """
    data = request.get_json(force=True)
    place_id = data.get('place_id')
    location_name = data.get('location_name', 'Bellavista Nursing Homes')
    
    # If place_id is not provided, look it up from LOCATIONS
    if not place_id:
        found_loc = next((loc for loc in LOCATIONS if loc["name"] == location_name), None)
        if found_loc:
            place_id = found_loc["place_id"]
            print(f"DEBUG: Found Place ID for {location_name}: {place_id}")
        else:
            return jsonify({"error": f"No Place ID configured for '{location_name}'. Please enter one manually."}), 400
    
    if not place_id:
        return jsonify({"error": "place_id is required"}), 400
        
    api_key = os.environ.get('GOOGLE_PLACES_API_KEY')
    if not api_key:
        return jsonify({"error": "Google Places API Key not configured"}), 500
        
    # Google Places Details API URL
    url = f"https://maps.googleapis.com/maps/api/place/details/json?place_id={place_id}&fields=reviews&key={api_key}"
    
    try:
        import urllib.request
        with urllib.request.urlopen(url) as response:
            result = json.loads(response.read().decode())
            
        if result.get('status') != 'OK':
            return jsonify({"error": f"Google API Error: {result.get('status')}", "details": result.get('error_message')}), 400
            
        google_reviews = result.get('result', {}).get('reviews', [])
        imported_count = 0
        
        for g_review in google_reviews:
            # Check if review already exists (naive check by author and text snippet)
            # A better way would be to store Google's review ID if we updated the model
            existing = Review.query.filter(
                Review.name == g_review.get('author_name'),
                Review.reviewText == g_review.get('text')
            ).first()
            
            if not existing:
                # Convert Google timestamp (epoch) to datetime
                import datetime
                created_at = datetime.datetime.fromtimestamp(g_review.get('time')) if g_review.get('time') else datetime.datetime.utcnow()
                
                new_review = Review(
                    id=str(uuid.uuid4()),
                    location=location_name,
                    name=g_review.get('author_name'),
                    email="google-import@bellavista.com", # Placeholder email
                    rating=g_review.get('rating'),
                    reviewText=g_review.get('text'),
                    source='google',
                    createdAt=created_at
                )
                db.session.add(new_review)
                imported_count += 1
                
        db.session.commit()
        return jsonify({"ok": True, "imported": imported_count, "total_found": len(google_reviews)})
        
    except Exception as e:
        print(f"Import Error: {e}")
        return jsonify({"error": str(e)}), 500

@api_bp.delete('/reviews/<id>')
@require_admin
def delete_review(id):
    review = Review.query.get(id)
    if not review:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(review)
    db.session.commit()
    log_action('delete_review', details={'id': id, 'location': review.location})
    return jsonify({"ok": True})

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

    # Send Email Notifications
    try:
        # Find home to get admin email
        print(f"DEBUG: Processing tour for location: {tour.location}")
        home = Home.query.filter(Home.name == tour.location).first()
        
        # If not found, try fuzzy match (e.g. "Barry" matches "Bellavista Barry")
        if not home and tour.location:
            home = Home.query.filter(Home.name.ilike(f"%{tour.location}%")).first()
            
        home_admin_email = home.adminEmail if home else None
        print(f"DEBUG: Found home: {home.name if home else 'None'}, Admin Email: {home_admin_email}")
        
        # Build recipient list for admin notifications
        # Main office email + respective home email
        main_office_email = "bellavistacarehomegit@gmail.com"
        admin_recipients = [main_office_email]
        if home_admin_email and home_admin_email.strip() and home_admin_email != main_office_email:
            admin_recipients.append(home_admin_email.strip())
            
        # Subject and body for admin notification
        subject = f"New Tour Booking Request - {tour.location}"
        admin_body = f"""
=== NEW TOUR BOOKING REQUEST ===

Visitor Information:
  Name: {tour.name}
  Email: {tour.email}
  Phone: {tour.phone}

Tour Details:
  Location: {tour.location}
  Preferred Date: {tour.preferredDate}
  Preferred Time: {tour.preferredTime}

Message from Visitor:
  {tour.message if tour.message else '(No message provided)'}

---
Please log in to the admin console to view and manage this booking.
Confirmation Status: {tour.status}
Booking ID: {tid}
"""
        # Send email to admin(s)
        send_email_sync(admin_recipients, subject, admin_body)
        print(f"Admin notification sent to: {admin_recipients}")

        # Send Thank You Email to Visitor
        if tour.email:
            visitor_subject = "Thank You for Your Visit Request - Bellavista Care Homes"
            visitor_body = f"""
Dear {tour.name},

Thank you for your interest in visiting Bellavista Care Homes at {tour.location}!

We have received your tour booking request for:
  📅 Date: {tour.preferredDate}
  🕐 Time: {tour.preferredTime}

Our team will review your request and contact you shortly at {tour.phone} to confirm your appointment.

In the meantime, if you have any questions, feel free to reach out to us.

Best regards,
Bellavista Care Homes Team
www.bellavistacarehomes.co.uk

P.S. We look forward to welcoming you!
"""
            send_email_sync([tour.email], visitor_subject, visitor_body)
            print(f"Thank you email sent to visitor: {tour.email}")

    except Exception as e:
        print(f"[ERROR] Failed to send booking notification emails: {e}")
        # Don't fail the request if email fails - booking should still be saved
        import traceback
        traceback.print_exc()

    return jsonify({"ok": True, "id": tid}), 201

# ============ KIOSK CHECK-IN ENDPOINTS ============

@api_bp.post('/kiosk/check-in')
def kiosk_check_in():
    """
    Visitor check-in via kiosk
    Sends confirmation email to visitor and notification to home staff
    """
    data = request.get_json(force=True)
    check_in_id = str(uuid.uuid4())
    
    check_in = KioskCheckIn(
        id=check_in_id,
        name=data.get('name', ''),
        email=data.get('email', ''),
        phone=data.get('phone', ''),
        location=data.get('location', ''),
        visitPurpose=data.get('visitPurpose', ''),
        personVisiting=data.get('personVisiting', ''),
        notes=data.get('notes', '')
    )
    
    db.session.add(check_in)
    db.session.commit()
    
    # Send Email Notifications
    try:
        # Find home to get admin email
        location = data.get('location', '')
        home = Home.query.filter(Home.name == location).first()
        
        # If not found, try fuzzy match
        if not home and location:
            home = Home.query.filter(Home.name.ilike(f"%{location}%")).first()
        
        home_admin_email = home.adminEmail if home else None
        print(f"[KIOSK] Check-in at: {location}, Admin Email: {home_admin_email}")
        
        # Build recipient list for staff notification
        main_office_email = "bellavistacarehomegit@gmail.com"
        staff_recipients = [main_office_email]
        if home_admin_email and home_admin_email.strip() and home_admin_email != main_office_email:
            staff_recipients.append(home_admin_email.strip())
        
        # Email to staff (Main Office + Home Admin)
        from datetime import datetime
        check_in_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
        
        staff_subject = f"🔔 Visitor Check-In - {location}"
        staff_body = f"""
=== VISITOR CHECK-IN NOTIFICATION ===

Visitor Information:
  Name: {check_in.name}
  Email: {check_in.email}
  Phone: {check_in.phone}

Check-In Details:
  Location: {location}
  Check-In Time: {check_in_time}
  Purpose of Visit: {check_in.visitPurpose if check_in.visitPurpose else '(Not specified)'}
  Visiting: {check_in.personVisiting if check_in.personVisiting else '(Not specified)'}

Additional Notes: {check_in.notes if check_in.notes else '(None)'}

---
Check-In ID: {check_in_id}
Status: Checked In
"""
        send_email_sync(staff_recipients, staff_subject, staff_body)
        print(f"[KIOSK] Staff notification sent to: {staff_recipients}")
        
        # Email to visitor (Thank You)
        if check_in.email:
            visitor_subject = "Welcome to Bellavista Care Homes - Check-In Confirmation"
            visitor_body = f"""
Dear {check_in.name},

Thank you for visiting Bellavista Care Homes at {location}!

Check-In Confirmation:
  Date & Time: {check_in_time}
  Location: {location}

We have registered your check-in. Our staff will ensure you have a wonderful visit.

If you need any assistance during your visit, please don't hesitate to ask our team members.

Thank you for choosing Bellavista Care Homes!

Best regards,
Bellavista Care Homes Team
www.bellavistacarehomes.co.uk
"""
            send_email_sync([check_in.email], visitor_subject, visitor_body)
            print(f"[KIOSK] Visitor confirmation sent to: {check_in.email}")
    
    except Exception as e:
        print(f"[ERROR] Kiosk check-in email failed: {e}")
        import traceback
        traceback.print_exc()
    
    return jsonify({
        "ok": True,
        "id": check_in_id,
        "message": f"Welcome! You have successfully checked in at {data.get('location', 'Bellavista')}.",
        "checkInTime": check_in.checkInTime.isoformat() if check_in.checkInTime else None
    }), 201

@api_bp.get('/kiosk/check-ins')
@require_admin
def list_kiosk_check_ins():
    """Get all kiosk check-ins (admin only)"""
    location = request.args.get('location')
    
    query = KioskCheckIn.query
    if location:
        query = query.filter(KioskCheckIn.location.ilike(f"%{location}%"))
    
    items = query.order_by(KioskCheckIn.checkInTime.desc()).all()
    return jsonify([{
        "id": i.id,
        "name": i.name,
        "email": i.email,
        "phone": i.phone,
        "location": i.location,
        "visitPurpose": i.visitPurpose,
        "personVisiting": i.personVisiting,
        "checkInTime": i.checkInTime.isoformat(),
        "status": i.status,
        "notes": i.notes
    } for i in items])

@api_bp.post('/kiosk/check-out/<check_in_id>')
def kiosk_check_out(check_in_id):
    """Mark visitor as checked out"""
    from datetime import datetime
    
    check_in = KioskCheckIn.query.get(check_in_id)
    if not check_in:
        return jsonify({"error": "Check-in record not found"}), 404
    
    check_in.checkOutTime = datetime.utcnow()
    check_in.status = 'checked-out'
    db.session.commit()
    
    return jsonify({
        "ok": True,
        "message": "Thank you for visiting! Safe travels.",
        "checkOutTime": check_in.checkOutTime.isoformat()
    }), 200

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

@api_bp.put('/scheduled-tours/<tour_id>')
def update_scheduled_tour(tour_id):
    data = request.get_json(force=True)
    tour = ScheduledTour.query.get(tour_id)
    if not tour:
        return jsonify({"error": "Tour not found"}), 404
    
    if 'status' in data:
        tour.status = data['status']
    
    db.session.commit()
    return jsonify({"ok": True, "id": tour.id}), 200

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

    # Send Email Notification
    try:
        # Determine Admin Email based on location
        admin_email = None
        if enquiry.location:
             home = Home.query.filter(Home.name.ilike(f"%{enquiry.location}%")).first()
             if home:
                 admin_email = home.adminEmail

        recipients = ["bellavistacarehomegit@gmail.com"]
        if admin_email and admin_email.strip() and admin_email not in recipients:
            recipients.append(admin_email.strip())

        subject = f"New Care Enquiry: {enquiry.enquiryType}"
        body = f"""New Care Enquiry Received:

Name: {enquiry.name}
Email: {enquiry.email}
Phone: {enquiry.phone}
Type: {enquiry.enquiryType}
Location: {enquiry.location}
Message: {enquiry.message}
"""
        send_email(recipients, subject, body)

        # Send Auto-reply to User
        if enquiry.email:
            user_subject = "Enquiry Confirmation - Bellavista Nursing Home"
            user_body = f"""Dear {enquiry.name},

Thank you for your enquiry regarding {enquiry.location if enquiry.location and enquiry.location != 'Any' else 'our services'}.

We have received your message and our team will get back to you shortly.

Enquiry Details:
Type: {enquiry.enquiryType}
Message: {enquiry.message}

Best regards,
Bellavista Nursing Home Team
"""
            send_email([enquiry.email], user_subject, user_body)

    except Exception as e:
        print(f"Error in enquiry email notification: {e}")

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

# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@api_bp.post('/auth/login')
@rate_limit(max_attempts=5, window_seconds=900)  # 5 attempts per 15 minutes
def login():
    """
    Authenticate admin user and return JWT token.
    Rate limited to 5 attempts per 15 minutes per IP.
    
    Request body:
    {
        "username": "admin",
        "password": "password"
    }
    
    Response:
    {
        "status": "success",
        "message": "Login successful",
        "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "user": {
            "username": "admin",
            "role": "admin"
        }
    }
    """
    try:
        data = request.get_json()
        
        if not data or not data.get('username') or not data.get('password'):
            log_login_attempt(False, 'missing_credentials')
            return jsonify({
                'status': 'error',
                'message': 'Username and password required'
            }), 400
        
        # Sanitize input
        username = data['username'].strip() if isinstance(data['username'], str) else ''
        password = data['password'] if isinstance(data['password'], str) else ''
        
        if not username or not password:
            log_login_attempt(False, 'empty_credentials')
            return jsonify({
                'status': 'error',
                'message': 'Username and password required'
            }), 400
        
        # Authenticate user and get token
        result = login_user(username, password)
        
        if result['status'] == 'error':
            log_login_attempt(False, 'invalid_credentials')
            return jsonify(result), 401
        
        log_login_attempt(True)
        return jsonify(result), 200
    
    except Exception as e:
        print(f"[ERROR] Login endpoint error: {str(e)}")
        log_login_attempt(False, str(e))
        return jsonify({
            'status': 'error',
            'message': 'Login failed'
        }), 500

@api_bp.post('/auth/logout')
def logout():
    """
    Logout endpoint (client-side token deletion is sufficient).
    Returns confirmation message.
    """
    return jsonify({
        'status': 'success',
        'message': 'Logged out successfully'
    }), 200

@api_bp.post('/news')
@require_auth
def create_news():
    data = request.form.to_dict()
    files = request.files
    
    # Validate required fields
    validation_data = {
        'title': data.get('title', ''),
        'content': data.get('fullDescription', ''),
        'author': data.get('author', '')
    }
    
    result = validate_and_sanitize(validation_data, validate_news)
    if not result['valid']:
        return create_error_response(result['errors'], 400)
    
    # Get validated data
    validated = result['data']

    
    # Generate ID: Use provided ID, or slugify title + random suffix to ensure uniqueness
    nid = data.get('id')
    if not nid:
        base_slug = validated['title'].lower().replace(' ','-')[:50]
        # Append random hex to ensure uniqueness (e.g. test-a1b2)
        nid = f"{base_slug}-{uuid.uuid4().hex[:6]}" if base_slug else str(uuid.uuid4())

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
@require_auth
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
@require_auth
def delete_news(id):
    item = NewsItem.query.get(id)
    if not item:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"ok": True})

# VACANCIES ROUTES

@api_bp.get('/vacancies')
def list_vacancies():
    items = Vacancy.query.order_by(Vacancy.createdAt.desc()).all()
    return jsonify([{
        "id": i.id,
        "title": i.title,
        "image": i.image,
        "shortDescription": i.shortDescription,
        "detailedDescription": i.detailedDescription,
        "location": i.location,
        "salary": i.salary,
        "type": i.type,
        "createdAt": i.createdAt.isoformat()
    } for i in items])

@api_bp.post('/vacancies')
@require_auth
def create_vacancy():
    # Support both JSON and multipart/form-data
    if request.content_type and 'multipart/form-data' in request.content_type:
        data = request.form.to_dict()
        files = request.files
    else:
        data = request.get_json(force=True)
        files = {}
    
    vid = str(uuid.uuid4())
    image_url = data.get('image', '')
    
    if 'image' in files:
        f = files['image']
        filename = f"vacancy-{vid}-{uuid.uuid4().hex}.jpg"
        uploaded_url = upload_file_helper(f, filename)
        if uploaded_url:
            image_url = uploaded_url
    
    vacancy = Vacancy(
        id=vid,
        title=data.get('title'),
        shortDescription=data.get('shortDescription'),
        detailedDescription=data.get('detailedDescription'),
        location=data.get('location'),
        salary=data.get('salary'),
        type=data.get('type'),
        image=image_url
    )
    db.session.add(vacancy)
    db.session.commit()
    return jsonify({"ok": True, "id": vid}), 201

@api_bp.put('/vacancies/<vid>')
@require_auth
def update_vacancy(vid):
    vacancy = Vacancy.query.get(vid)
    if not vacancy:
        return jsonify({"error": "Not found"}), 404

    if request.content_type and 'multipart/form-data' in request.content_type:
        data = request.form.to_dict()
        files = request.files
    else:
        data = request.get_json(force=True)
        files = {}

    if 'title' in data:
        vacancy.title = data['title']
    if 'shortDescription' in data:
        vacancy.shortDescription = data['shortDescription']
    if 'detailedDescription' in data:
        vacancy.detailedDescription = data['detailedDescription']
    if 'location' in data:
        vacancy.location = data['location']
    if 'salary' in data:
        vacancy.salary = data['salary']
    if 'type' in data:
        vacancy.type = data['type']
    
    if 'image' in files:
        f = files['image']
        filename = f"vacancy-{vid}-{uuid.uuid4().hex}.jpg"
        uploaded_url = upload_file_helper(f, filename)
        if uploaded_url:
            vacancy.image = uploaded_url
    elif 'image' in data and data['image'] == '':
         # Optional: Handle image removal if sent as empty string
         pass

    db.session.commit()
    return jsonify({"ok": True, "id": vid})

@api_bp.delete('/vacancies/<vid>')
@require_auth
def delete_vacancy(vid):
    vacancy = Vacancy.query.get(vid)
    if not vacancy:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(vacancy)
    db.session.commit()
    return jsonify({"ok": True})

# JOB APPLICATION ROUTE

@api_bp.post('/apply')
def apply_job():
    data = request.form.to_dict()
    files = request.files
    
    aid = str(uuid.uuid4())
    cv_url = ""
    
    if 'cv' in files:
        f = files['cv']
        ext = f.filename.rsplit('.', 1)[1].lower() if '.' in f.filename else 'pdf'
        filename = f"cv-{aid}-{uuid.uuid4().hex}.{ext}"
        uploaded_url = upload_file_helper(f, filename, content_type=f.content_type)
        if uploaded_url:
            cv_url = uploaded_url
            
    application = JobApplication(
        id=aid,
        vacancyId=data.get('vacancyId'),
        firstName=data.get('firstName'),
        lastName=data.get('lastName'),
        email=data.get('email'),
        jobRole=data.get('jobRole'),
        cvUrl=cv_url,
        marketingConsent=data.get('marketingConsent') == 'true',
        privacyConsent=data.get('privacyConsent') == 'true',
        status='received'
    )
    db.session.add(application)
    db.session.commit()
    
    # Send Email Notification
    try:
        subject = f"New Job Application: {application.jobRole}"
        body = f"""New Job Application Received:

Name: {application.firstName} {application.lastName}
Email: {application.email}
Role: {application.jobRole}
Vacancy ID: {application.vacancyId}
CV Link: {cv_url}
"""
        send_email(["bellavistacarehomegit@gmail.com"], subject, body)
    except Exception as e:
        print(f"Error in application email: {e}")
        
    return jsonify({"ok": True, "id": aid}), 201

@api_bp.get('/applications')
def get_applications():
    apps = JobApplication.query.order_by(JobApplication.createdAt.desc()).all()
    return jsonify([{
        "id": a.id,
        "vacancyId": a.vacancyId,
        "firstName": a.firstName,
        "lastName": a.lastName,
        "email": a.email,
        "jobRole": a.jobRole,
        "cvUrl": a.cvUrl,
        "status": a.status,
        "createdAt": a.createdAt.isoformat() if a.createdAt else None
    } for a in apps])

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
        "adminEmail": h.adminEmail,
        "homeImage": h.image,
        "homeBadge": h.badge,
        "homeDesc": h.description,
        "heroTitle": h.heroTitle,
        "heroSubtitle": h.heroSubtitle,
        "heroBgImage": h.heroBgImage,
        "heroExpandedDesc": h.heroExpandedDesc,
        "statsBedrooms": h.statsBedrooms,
        "statsPremier": h.statsPremier,
        "bannerImages": parse_json(h.bannerImagesJson),
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
        "createdAt": h.createdAt.isoformat() if h.createdAt else None
    }

@api_bp.post('/homes')
@require_auth
def create_home():
    data = request.get_json(force=True)
    hid = data.get('id') or str(uuid.uuid4())
    
    home = Home(
        id=hid,
        name=data.get('homeName', ''),
        location=data.get('homeLocation', ''),
        adminEmail=data.get('adminEmail', ''),
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
    try:
        homes = Home.query.order_by(Home.createdAt.asc()).all()
        return jsonify([to_dict_home(h) for h in homes])
    except Exception as e:
        print(f"[ERROR] list_homes failed: {e}")
        return jsonify({"error": str(e)}), 500

@api_bp.get('/homes/<id>')
def get_home(id):
    home = Home.query.get(id)
    if not home:
        return jsonify({"error": "Not found"}), 404
    return jsonify(to_dict_home(home))

@api_bp.put('/homes/<id>')
@require_auth
def update_home(id):
    import sys
    try:
        print(f"[UPDATE HOME] ===== Starting update for home ID: {id} =====", flush=True)
        
        # Check request size
        content_length = request.content_length
        print(f"[UPDATE HOME] Request size: {content_length} bytes ({content_length / 1024 / 1024:.2f} MB)", flush=True)
        
        home = Home.query.get(id)
        if not home:
            print(f"[UPDATE HOME] ERROR: Home not found with ID: {id}", flush=True)
            return jsonify({"error": "Not found"}), 404
        
        print(f"[UPDATE HOME] Parsing JSON data...", flush=True)
        data = request.get_json(force=True)
        
        # Log data size
        data_keys = list(data.keys())
        print(f"[UPDATE HOME] Received {len(data_keys)} fields: {', '.join(data_keys)}", flush=True)
        
        # Update basic fields
        print(f"[UPDATE HOME] Updating basic fields...", flush=True)
        home.name = data.get('homeName', home.name)
        home.location = data.get('homeLocation', home.location)
        home.adminEmail = data.get('adminEmail', home.adminEmail)
        home.image = data.get('homeImage', home.image)
        home.badge = data.get('homeBadge', home.badge)
        home.description = data.get('homeDesc', home.description)
        
        home.heroTitle = data.get('heroTitle', home.heroTitle)
        home.heroSubtitle = data.get('heroSubtitle', home.heroSubtitle)
        home.heroBgImage = data.get('heroBgImage', home.heroBgImage)
        home.heroExpandedDesc = data.get('heroExpandedDesc', home.heroExpandedDesc)
        
        home.statsBedrooms = data.get('statsBedrooms', home.statsBedrooms)
        home.statsPremier = data.get('statsPremier', home.statsPremier)
        
        # Update banner images
        if 'bannerImages' in data:
            print(f"[UPDATE HOME] Updating {len(data['bannerImages'])} banner images...", flush=True)
            home.bannerImagesJson = json.dumps(data['bannerImages'])
        
        # Update team members
        if 'teamMembers' in data:
            team_count = len(data['teamMembers'])
            print(f"[UPDATE HOME] Updating {team_count} team members...", flush=True)
            home.teamMembersJson = json.dumps(data['teamMembers'])
        if 'teamGalleryImages' in data:
            gallery_count = len(data['teamGalleryImages'])
            print(f"[UPDATE HOME] Updating {gallery_count} team gallery images...", flush=True)
            home.teamGalleryJson = json.dumps(data['teamGalleryImages'])
            
        # Update activities
        home.activitiesIntro = data.get('activitiesIntro', home.activitiesIntro)
        if 'activities' in data:
            activity_count = len(data['activities'])
            print(f"[UPDATE HOME] Updating {activity_count} activities...", flush=True)
            home.activitiesJson = json.dumps(data['activities'])
        if 'activityImages' in data:
            activity_img_count = len(data['activityImages'])
            print(f"[UPDATE HOME] Updating {activity_img_count} activity images...", flush=True)
            home.activityImagesJson = json.dumps(data['activityImages'])
        home.activitiesModalDesc = data.get('activitiesModalDesc', home.activitiesModalDesc)
        
        # Update facilities
        home.facilitiesIntro = data.get('facilitiesIntro', home.facilitiesIntro)
        if 'facilitiesList' in data:
            facilities_count = len(data['facilitiesList'])
            print(f"[UPDATE HOME] Updating {facilities_count} facilities list items...", flush=True)
            home.facilitiesListJson = json.dumps(data['facilitiesList'])
        if 'detailedFacilities' in data:
            detailed_count = len(data['detailedFacilities'])
            print(f"[UPDATE HOME] Updating {detailed_count} detailed facilities...", flush=True)
            home.detailedFacilitiesJson = json.dumps(data['detailedFacilities'])
        if 'facilitiesGalleryImages' in data:
            gallery_count = len(data['facilitiesGalleryImages'])
            print(f"[UPDATE HOME] Processing {gallery_count} facilities gallery images...", flush=True)
            
            # Check if images are too large (base64 encoded)
            total_size = 0
            for idx, img in enumerate(data['facilitiesGalleryImages']):
                if isinstance(img, str):
                    img_size = len(img)
                    total_size += img_size
                    if img_size > 500000:  # > 500KB
                        print(f"[UPDATE HOME] WARNING: Image {idx+1} is large: {img_size / 1024:.1f}KB", flush=True)
            
            print(f"[UPDATE HOME] Total gallery images data size: {total_size / 1024 / 1024:.2f}MB", flush=True)
            home.facilitiesGalleryJson = json.dumps(data['facilitiesGalleryImages'])
            print(f"[UPDATE HOME] Successfully serialized facilities gallery", flush=True)
            
        if 'homeFeatured' in data:
            home.featured = data['homeFeatured']
        
        print(f"[UPDATE HOME] Committing changes to database...", flush=True)
        sys.stdout.flush()  # Force flush
        db.session.commit()
        print(f"[UPDATE HOME] ===== Successfully updated home ID: {id} =====", flush=True)
        
        # Invalidate cache after successful update
        invalidate_homes_cache()
        
        result = to_dict_home(home)
        print(f"[UPDATE HOME] Returning response (size: {sys.getsizeof(result)} bytes)", flush=True)
        return jsonify(result)
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        print(f"[UPDATE HOME ERROR] ===== FAILED to update home {id} =====", flush=True)
        print(f"[UPDATE HOME ERROR] Error type: {type(e).__name__}", flush=True)
        print(f"[UPDATE HOME ERROR] Error message: {str(e)}", flush=True)
        print(f"[UPDATE HOME ERROR] Full traceback:\n{error_trace}", flush=True)
        sys.stdout.flush()
        
        db.session.rollback()
        return jsonify({"error": f"Failed to update home: {str(e)}", "type": type(e).__name__}), 500

@api_bp.delete('/homes/<id>')
@require_auth
def delete_home(id):
    home = Home.query.get(id)
    if not home:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(home)
    db.session.commit()
    # Invalidate cache after deletion
    invalidate_homes_cache()
    return jsonify({"ok": True})

def invalidate_homes_cache():
    """Invalidate homes cache (frontend will auto-refresh on next request)"""
    print("[CACHE] Homes cache invalidated - frontend will fetch fresh data", flush=True)

@api_bp.get('/faqs')
def list_faqs():
    items = FAQ.query.order_by(FAQ.order.asc(), FAQ.createdAt.asc()).all()
    return jsonify([{
        "id": i.id,
        "question": i.question,
        "answer": i.answer,
        "order": i.order,
        "createdAt": i.createdAt.isoformat()
    } for i in items])

@api_bp.post('/faqs')
@require_auth
def create_faq():
    data = request.get_json(force=True)
    fid = data.get('id') or str(uuid.uuid4())
    faq = FAQ(
        id=fid,
        question=data.get('question', ''),
        answer=data.get('answer', ''),
        order=data.get('order', 0)
    )
    db.session.add(faq)
    db.session.commit()
    return jsonify({"ok": True, "id": fid}), 201

@api_bp.delete('/faqs/<id>')
@require_auth
def delete_faq(id):
    item = FAQ.query.get(id)
    if not item:
        return jsonify({"error": "Not found"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"ok": True})

@api_bp.route('/seed-homes', methods=['POST', 'GET'])
def seed_homes_route():
    try:
        homes_data = [
            {
                "id": "bellavista-cardiff",
                "name": "Bellavista Cardiff",
                "location": "",
                "image": "/HomeImages/preview_cfnh10-1_425x300_acf_cropped.jpg",
                "badge": "Featured",
                "description": "A homely and friendly purpose-built Nursing Home with overlooking views of Cardiff Bay waterfront. Situated in a sought-after area, it offers a chic, cosmopolitan atmosphere where residents can enjoy the vibrant surroundings.",
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
                "facilitiesList": [{"title": "62 Bedrooms"}, {"title": "Ensuite Facilities"}, {"title": "Cinema/Sensory Room"}],
                "featured": True
            },
            {
                "id": "bellavista-barry",
                "name": "Bellavista Barry",
                "location": "",
                "image": "/HomeImages/preview_b-1_425x300_acf_cropped-2.jpg",
                "badge": "",
                "description": "A long-established quality Nursing Home situated in the seaside town of Barry with spectacular views over the Bristol Channel. Running since 2007, we enable elderly people to live as independently as possible.",
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
                "facilitiesList": [{"title": "39 Bedded Home"}, {"title": "Seaside Views"}, {"title": "Cinema Lounge"}],
                "featured": False
            },
            {
                "id": "waverley-care-centre",
                "name": "Waverley Care Centre",
                "location": "",
                "image": "/HomeImages/preview_wcc-1_425x300_acf_cropped.jpg",
                "badge": "",
                "description": "A family-owned nursing home overlooking the sea and open countryside. We offer a warm, friendly, and professional environment where 'little things make all the difference'.",
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
                "facilitiesList": [{"title": "129 Registered Places"}, {"title": "General Nursing"}, {"title": "EMI & FMI Care"}],
                "featured": False
            },
            {
                "id": "college-fields",
                "name": "College Fields Nursing Home",
                "location": "",
                "image": "/HomeImages/preview_cf-1_425x300_acf_cropped.jpg",
                "badge": "",
                "description": "Priding ourselves on a homely environment where residents truly feel at home. We combine technically correct nursing care with genuine social interaction and a warm, welcoming atmosphere.",
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
                "facilitiesList": [{"title": "Home-cooked Meals"}, {"title": "Personalized Care"}, {"title": "In-house Laundry"}],
                "featured": False
            },
            {
                "id": "baltimore-care-home",
                "name": "Baltimore Care Home",
                "location": "",
                "image": "/HomeImages/preview_bch-1_425x300_acf_cropped.jpg",
                "badge": "",
                "description": "A \"home from home\" style Young Onset Dementia Nursing 24-hour Care provision. Designed for younger dementia registered persons with stunning views of the Vale of Glamorgan.",
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
                "facilitiesList": [{"title": "Young Onset Dementia"}, {"title": "9 Bed Capacity"}, {"title": "Nurse-Led Service"}, {"title": "Rural Country Setting"}, {"title": "Respite Service"}],
                "featured": False
            },
            {
                "id": "meadow-vale-cwtch",
                "name": "Meadow Vale Cwtch",
                "location": "",
                "image": "/HomeImages/preview_mvc-1_425x300_acf_cropped.jpg",
                "badge": "New",
                "description": "A specialized dementia care facility providing a safe, supportive, and home-like environment. Our dedicated team focuses on person-centered care to enhance the quality of life for all residents.",
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
                "facilitiesList": [{"title": "Dementia Care"}, {"title": "Safe Environment"}, {"title": "Person-Centered"}],
                "featured": False
            },
            {
                "id": "bellavista-pontypridd",
                "name": "Bellavista Pontypridd",
                "location": "",
                "image": "https://placehold.co/400x300?text=Bellavista+Pontypridd",
                "badge": "Coming Soon",
                "description": "Our newest location coming soon to Pontypridd. We are excited to bring our high standards of care to this community.",
                "heroTitle": "Welcome to Bellavista Pontypridd",
                "heroSubtitle": "Coming Soon to Pontypridd",
                "heroBgImage": "https://placehold.co/1300x400?text=Coming+Soon",
                "heroExpandedDesc": "We are working hard to prepare our new home...",
                "statsBedrooms": "0",
                "statsPremier": "0",
                "teamMembers": [],
                "activities": [],
                "facilitiesList": [{"title": "Coming Soon"}, {"title": "Nursing Care"}, {"title": "Dementia Care"}],
                "featured": False
            }
        ]

        count = 0
        for data in homes_data:
            existing = Home.query.get(data['id'])
            if not existing:
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
                count += 1
            else:
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
        return jsonify({'message': f'Successfully seeded/updated {len(homes_data)} homes', 'created': count}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

