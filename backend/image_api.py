#!/usr/bin/env python3
"""
Image Processing API for Bellavista News System
Provides endpoints for image upload, processing, and optimization
"""

from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
import uuid
from datetime import datetime
from image_processor import ImageProcessor
import logging

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

# Create directories
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_unique_filename(original_filename):
    """Generate a unique filename to avoid conflicts"""
    ext = original_filename.rsplit('.', 1)[1].lower()
    unique_id = str(uuid.uuid4())[:8]
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    return f"{timestamp}_{unique_id}.{ext}"

@app.route('/api/upload', methods=['POST'])
def upload_image():
    """Handle image upload and optional processing"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Allowed: PNG, JPG, JPEG, WebP, GIF'}), 400
        
        # Generate unique filename
        filename = generate_unique_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # Save the file
        file.save(filepath)
        
        # Get processing options
        process_type = request.form.get('process_type', 'none')
        target_size = request.form.get('target_size', 'news_main_card')
        
        result = {
            'original_filename': file.filename,
            'filename': filename,
            'url': f"/uploads/{filename}",
            'size': os.path.getsize(filepath)
        }
        
        # Process image if requested
        if process_type != 'none':
            try:
                processor = ImageProcessor(filepath, app.config['PROCESSED_FOLDER'])
                
                if process_type == 'resize_crop':
                    processed_result = processor.process_news_main_card(filepath)
                    result['processed'] = processed_result
                    result['processed_url'] = f"/processed/{os.path.basename(processed_result['output_path'])}"
                
                elif process_type == 'batch':
                    # Process multiple sizes
                    all_sizes = processor.create_size_comparison(filepath)
                    result['all_sizes'] = all_sizes
                    
            except Exception as e:
                logger.error(f"Image processing failed: {str(e)}")
                result['processing_error'] = str(e)
        
        # Get image info
        try:
            info = processor.get_image_info(filepath)
            result['info'] = info
        except:
            pass
        
        logger.info(f"Image uploaded successfully: {filename}")
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Upload failed: {str(e)}")
        return jsonify({'error': 'Upload failed', 'details': str(e)}), 500

@app.route('/api/process', methods=['POST'])
def process_existing_image():
    """Process an existing image"""
    try:
        data = request.get_json()
        image_url = data.get('image_url')
        process_type = data.get('process_type', 'resize_crop')
        target_size = data.get('target_size', 'news_main_card')
        
        if not image_url:
            return jsonify({'error': 'No image URL provided'}), 400
        
        # Extract filename from URL
        filename = os.path.basename(image_url)
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(input_path):
            return jsonify({'error': 'Image not found'}), 404
        
        processor = ImageProcessor(input_path, app.config['PROCESSED_FOLDER'])
        
        if process_type == 'resize_crop':
            result = processor.process_news_main_card(input_path)
        elif process_type == 'info':
            result = {'info': processor.get_image_info(input_path)}
        else:
            return jsonify({'error': 'Invalid process type'}), 400
        
        return jsonify(result), 200
        
    except Exception as e:
        logger.error(f"Processing failed: {str(e)}")
        return jsonify({'error': 'Processing failed', 'details': str(e)}), 500

@app.route('/api/validate', methods=['POST'])
def validate_image():
    """Validate image dimensions and format"""
    try:
        data = request.get_json()
        image_url = data.get('image_url')
        min_width = data.get('min_width', 400)
        min_height = data.get('min_height', 225)
        aspect_ratio = data.get('aspect_ratio', 16/9)
        tolerance = data.get('tolerance', 0.1)
        
        if not image_url:
            return jsonify({'error': 'No image URL provided'}), 400
        
        # Extract filename from URL
        filename = os.path.basename(image_url)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        if not os.path.exists(filepath):
            return jsonify({'error': 'Image not found'}), 404
        
        processor = ImageProcessor(filepath)
        info = processor.get_image_info(filepath)
        
        if 'error' in info:
            return jsonify({'error': info['error']}), 500
        
        # Validate dimensions
        validation_result = {
            'valid': True,
            'info': info,
            'issues': []
        }
        
        if info['width'] < min_width:
            validation_result['valid'] = False
            validation_result['issues'].append(f"Width too small: {info['width']}px (minimum: {min_width}px)")
        
        if info['height'] < min_height:
            validation_result['valid'] = False
            validation_result['issues'].append(f"Height too small: {info['height']}px (minimum: {min_height}px)")
        
        # Check aspect ratio
        actual_ratio = info['width'] / info['height']
        if abs(actual_ratio - aspect_ratio) > tolerance:
            validation_result['valid'] = False
            validation_result['issues'].append(f"Aspect ratio incorrect: {actual_ratio:.2f} (target: {aspect_ratio:.2f})")
        
        return jsonify(validation_result), 200
        
    except Exception as e:
        logger.error(f"Validation failed: {str(e)}")
        return jsonify({'error': 'Validation failed', 'details': str(e)}), 500

# Serve uploaded files
@app.route('/uploads/<filename>')
def serve_upload(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/processed/<filename>')
def serve_processed(filename):
    return send_from_directory(app.config['PROCESSED_FOLDER'], filename)

# Health check endpoint
@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()}), 200

if __name__ == '__main__':
    print("🖼️  Bellavista Image Processing API")
    print(f"📁 Upload folder: {UPLOAD_FOLDER}")
    print(f"📁 Processed folder: {PROCESSED_FOLDER}")
    print(f"📏 Max file size: {MAX_FILE_SIZE / (1024 * 1024)}MB")
    print("🚀 Starting server...")
    
    app.run(host='0.0.0.0', port=5001, debug=True)