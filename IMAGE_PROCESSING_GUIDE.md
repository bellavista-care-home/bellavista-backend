';.# Bellavista Image Processing System

## Overview

The Bellavista Image Processing System provides automated image optimization, resizing, and cropping capabilities specifically designed for the news management system. It ensures consistent image quality and optimal file sizes across all news content.

## Features

### 1. Two-Section News Form
- **Main Card Section**: Optimized for homepage display
  - Single main image (800x450px, 16:9 aspect ratio)
  - Title, date, location, and short description
  - Automatic image validation and cropping
  
- **Detailed Content Section**: Full article content
  - Multiple gallery images
  - Video upload support
  - Large description field
  - Author information

### 2. Image Processing Capabilities

#### Automatic Image Optimization
- **Format Support**: JPG, PNG, WebP, GIF
- **Size Validation**: Maximum 5MB per file
- **Aspect Ratio Detection**: Automatic validation for 16:9 ratio
- **Intelligent Cropping**: Center-focused cropping with position options
- **Web Optimization**: JPEG compression with quality adjustment

#### Recommended Image Sizes
- **News Main Card**: 800x450px (16:9 ratio)
- **News Thumbnail**: 400x225px (16:9 ratio)
- **News Gallery**: 1200x675px (16:9 ratio)
- **Hero Banner**: 1300x400px (custom ratio)
- **Team Member**: 200x200px (square)
- **Facility Thumbnail**: 300x200px (3:2 ratio)

### 3. Image Upload Features

#### Enhanced Image Uploader
- **Drag & Drop**: Intuitive file upload interface
- **Progress Tracking**: Real-time upload progress
- **Preview**: Instant image preview after upload
- **URL Support**: Direct image URL input
- **Crop Modal**: Interactive cropping interface
- **File Validation**: Format and size checking

#### Video Support
- **Multiple Formats**: YouTube, Vimeo, direct MP4 links
- **File Upload**: Direct video file upload
- **Preview**: Video thumbnail preview
- **Management**: Add/remove multiple videos

## Usage Guide

### For Administrators

#### Adding News with Image Processing

1. **Navigate to Admin Console** → "Add News"

2. **Main Card Section**:
   - Upload main image (recommended 800x450px)
   - System will validate aspect ratio (16:9)
   - If ratio is incorrect, crop modal will appear
   - Adjust crop area and apply

3. **Detailed Content Section**:
   - Add multiple gallery images
   - Upload videos or add video URLs
   - Write full article content

4. **Preview**: All images show real-time preview

5. **Save**: System automatically optimizes all images

#### Editing News

1. **Navigate to Admin Console** → "Update News"
2. **Select News Item**: Click on existing news
3. **Edit Images**: Replace or crop existing images
4. **Save Changes**: System updates optimized versions

### For Developers

#### Python Image Processor

```python
from image_processor import ImageProcessor

# Initialize processor
processor = ImageProcessor('input_image.jpg', 'output_folder')

# Process for news main card
result = processor.process_news_main_card('input.jpg')
print(f"Processed: {result['output_path']}")
print(f"Dimensions: {result['dimensions']}")
print(f"File size: {result['file_size_kb']} KB")

# Batch processing
results = processor.process_batch('input_folder/', 'news_main_card')
```

#### API Endpoints

**Upload Image**
```
POST /api/upload
Content-Type: multipart/form-data

Parameters:
- file: Image file
- process_type: 'resize_crop', 'batch', or 'none'
- target_size: 'news_main_card', 'news_thumbnail', etc.

Response:
{
  "original_filename": "input.jpg",
  "filename": "20241216_143022_a1b2c3d4.jpg",
  "url": "/uploads/20241216_143022_a1b2c3d4.jpg",
  "processed_url": "/processed/20241216_143022_a1b2c3d4_main_card.jpg",
  "info": {
    "width": 1920,
    "height": 1080,
    "format": "JPEG",
    "size_kb": 245.3
  }
}
```

**Validate Image**
```
POST /api/validate
Content-Type: application/json

Body:
{
  "image_url": "/uploads/image.jpg",
  "min_width": 800,
  "min_height": 450,
  "aspect_ratio": 1.78,
  "tolerance": 0.1
}

Response:
{
  "valid": true,
  "info": {
    "width": 1920,
    "height": 1080,
    "format": "JPEG"
  },
  "issues": []
}
```

#### Frontend Components

**NewsForm Component**
```jsx
import NewsForm from './components/NewsForm';

// Add news
<NewsForm 
  mode="add"
  onSave={async (newsData) => {
    // Handle save logic
    await createNewsItem(newsData);
  }}
/>

// Edit news
<NewsForm 
  mode="edit"
  initialData={existingNews}
  onSave={async (newsData) => {
    // Handle update logic
    await updateNewsItem(newsData);
  }}
  onCancel={() => setEditing(false)}
/>
```

**Enhanced Image Uploader**
```jsx
import EnhancedImageUploader from './components/EnhancedImageUploader';

<EnhancedImageUploader
  label="Main Card Image"
  aspectRatio={16/9}
  onImageSelected={(url) => handleImageChange(url)}
  showCrop={true}
  maxFileSize={5 * 1024 * 1024} // 5MB
  allowedFormats={['image/jpeg', 'image/png', 'image/webp']}
/>
```

## Image Processing Workflow

### 1. Upload Phase
1. **File Validation**: Check format and size
2. **Upload Progress**: Show real-time progress
3. **Aspect Ratio Check**: Validate against target ratio
4. **Crop Modal**: Show if ratio is incorrect

### 2. Processing Phase
1. **Format Conversion**: Convert to RGB if needed
2. **Intelligent Cropping**: Center-focused cropping
3. **Size Optimization**: Resize to target dimensions
4. **Web Optimization**: JPEG compression
5. **File Generation**: Create optimized version

### 3. Storage Phase
1. **Original Storage**: Keep original for future processing
2. **Processed Storage**: Save optimized version
3. **URL Generation**: Generate accessible URLs
4. **Database Update**: Update news item with new URLs

## Configuration

### Environment Variables
```bash
# Image processing
UPLOAD_FOLDER=uploads
PROCESSED_FOLDER=processed
MAX_FILE_SIZE=5242880  # 5MB in bytes

# Quality settings
JPEG_QUALITY=85
MAX_FILE_SIZE_KB=500
CROP_TOLERANCE=0.1
```

### Supported Formats
- **Images**: JPG, PNG, WebP, GIF
- **Videos**: MP4, WebM (via URL), YouTube, Vimeo
- **Maximum Size**: 5MB per file
- **Recommended Ratios**: 16:9 for news content

## Troubleshooting

### Common Issues

**Image Upload Fails**
- Check file size (max 5MB)
- Verify file format
- Check server storage space
- Review server logs

**Crop Modal Not Appearing**
- Image already has correct aspect ratio
- Check browser console for errors
- Verify JavaScript is enabled

**Processed Images Not Displaying**
- Check file permissions
- Verify output directory exists
- Review processing logs
- Check URL generation

**Performance Issues**
- Consider batch processing for multiple images
- Implement caching for processed images
- Use CDN for image delivery
- Optimize server resources

### Performance Tips

1. **Batch Processing**: Process multiple images together
2. **Caching**: Cache processed images
3. **Lazy Loading**: Load images as needed
4. **CDN Integration**: Use CDN for global delivery
5. **Compression**: Optimize compression settings

## Security Considerations

- **File Validation**: Strict format and size checking
- **Path Sanitization**: Prevent directory traversal
- **Access Control**: Restrict upload access
- **Storage Limits**: Implement storage quotas
- **Backup Strategy**: Regular backup of processed images

## Future Enhancements

- **AI-Powered Cropping**: Smart subject detection
- **Advanced Filters**: Image enhancement options
- **Bulk Operations**: Mass image processing
- **Analytics**: Image performance metrics
- **Mobile Optimization**: Responsive image generation