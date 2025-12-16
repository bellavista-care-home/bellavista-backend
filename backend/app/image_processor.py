#!/usr/bin/env python3
"""
Image Processing Utility for Bellavista News System
Handles automatic image resizing, cropping, and optimization
"""

import os
import sys
import io
from PIL import Image, ImageOps
import argparse
import json
from pathlib import Path

class ImageProcessor:
    """Handles image processing for news system"""
    
    # Recommended dimensions for different use cases
    DIMENSIONS = {
        'news_main_card': (800, 450),      # 16:9 ratio for main card
        'news_thumbnail': (400, 225),      # 16:9 ratio for thumbnails  
        'news_gallery': (1200, 675),       # 16:9 ratio for gallery
        'hero_banner': (1300, 400),        # Hero banner size
        'team_member': (200, 200),         # Square team photos
        'facility_thumb': (300, 200),      # Facility thumbnails
    }
    
    def __init__(self, input_path, output_dir="processed_images"):
        self.input_path = Path(input_path)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
    def validate_image(self, image_path):
        """Validate if the file is a supported image format"""
        try:
            with Image.open(image_path) as img:
                return img.format in ['JPEG', 'PNG', 'WEBP', 'JPG']
        except Exception:
            return False
    
    def get_image_info(self, image_path):
        """Get image dimensions and format information"""
        try:
            with Image.open(image_path) as img:
                return {
                    'width': img.width,
                    'height': img.height,
                    'format': img.format,
                    'mode': img.mode,
                    'size_kb': round(os.path.getsize(image_path) / 1024, 2)
                }
        except Exception as e:
            return {'error': str(e)}
    
    def resize_with_crop(self, image_path, target_size, crop_position='center'):
        """
        Resize image to target dimensions with intelligent cropping
        
        Args:
            image_path: Path to input image
            target_size: Tuple of (width, height)
            crop_position: 'center', 'top', 'bottom', 'left', 'right'
        """
        try:
            with Image.open(image_path) as img:
                # Convert to RGB if necessary
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                target_width, target_height = target_size
                aspect_ratio = target_width / target_height
                
                # Calculate crop dimensions
                if img.width / img.height > aspect_ratio:
                    # Image is wider than target, crop width
                    new_width = int(img.height * aspect_ratio)
                    if crop_position == 'center':
                        left = (img.width - new_width) // 2
                    elif crop_position == 'left':
                        left = 0
                    elif crop_position == 'right':
                        left = img.width - new_width
                    else:
                        left = (img.width - new_width) // 2
                    
                    img = img.crop((left, 0, left + new_width, img.height))
                else:
                    # Image is taller than target, crop height
                    new_height = int(img.width / aspect_ratio)
                    if crop_position == 'center':
                        top = (img.height - new_height) // 2
                    elif crop_position == 'top':
                        top = 0
                    elif crop_position == 'bottom':
                        top = img.height - new_height
                    else:
                        top = (img.height - new_height) // 2
                    
                    img = img.crop((0, top, img.width, top + new_height))
                
                # Resize to exact target dimensions
                img = img.resize(target_size, Image.Resampling.LANCZOS)
                
                return img
                
        except Exception as e:
            raise Exception(f"Error processing image: {str(e)}")
    
    def resize_with_padding(self, image_path, target_size, background_color=(255, 255, 255)):
        """
        Resize image to target dimensions with padding to maintain aspect ratio
        
        Args:
            image_path: Path to input image
            target_size: Tuple of (width, height)
            background_color: RGB tuple for padding color
        """
        try:
            with Image.open(image_path) as img:
                # Convert to RGB if necessary
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                target_width, target_height = target_size
                
                # Calculate scaling factor to fit within target
                scale = min(target_width / img.width, target_height / img.height)
                new_width = int(img.width * scale)
                new_height = int(img.height * scale)
                
                # Resize image
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                
                # Create new image with target size and background color
                new_img = Image.new('RGB', target_size, background_color)
                
                # Paste resized image centered
                x = (target_width - new_width) // 2
                y = (target_height - new_height) // 2
                new_img.paste(img, (x, y))
                
                return new_img
                
        except Exception as e:
            raise Exception(f"Error processing image: {str(e)}")
    
    def optimize_for_web(self, image, quality=85, max_file_size_kb=500):
        """
        Optimize image for web use with compression
        
        Args:
            image: PIL Image object
            quality: JPEG quality (1-100)
            max_file_size_kb: Maximum file size in KB
        """
        # Start with high quality
        output_buffer = io.BytesIO()
        image.save(output_buffer, format='JPEG', quality=quality, optimize=True)
        
        # Reduce quality if file is too large
        while output_buffer.tell() > max_file_size_kb * 1024 and quality > 60:
            quality -= 5
            output_buffer = io.BytesIO()
            image.save(output_buffer, format='JPEG', quality=quality, optimize=True)
        
        output_buffer.seek(0)
        return Image.open(output_buffer)
    
    def process_news_main_card(self, image_path, output_name=None):
        """Process image specifically for news main card (800x450, 16:9)"""
        if not self.validate_image(image_path):
            raise ValueError("Invalid image format")
        
        target_size = self.DIMENSIONS['news_main_card']
        
        # Process with intelligent cropping
        processed_img = self.resize_with_crop(image_path, target_size, 'center')
        
        # Generate output filename
        if not output_name:
            input_name = Path(image_path).stem
            output_name = f"{input_name}_main_card.jpg"
        
        output_path = self.output_dir / output_name
        
        # Save optimized image
        processed_img.save(output_path, format='JPEG', quality=85, optimize=True)
        
        return {
            'output_path': str(output_path),
            'dimensions': target_size,
            'file_size_kb': round(os.path.getsize(output_path) / 1024, 2)
        }
    
    def process_batch(self, input_dir, size_key='news_main_card'):
        """Process multiple images in a directory"""
        input_path = Path(input_dir)
        if not input_path.is_dir():
            raise ValueError("Input path must be a directory")
        
        results = []
        target_size = self.DIMENSIONS.get(size_key)
        if not target_size:
            raise ValueError(f"Unknown size key: {size_key}")
        
        # Supported image extensions
        image_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
        
        for image_file in input_path.glob('*'):
            if image_file.suffix.lower() in image_extensions:
                try:
                    result = self.process_news_main_card(str(image_file))
                    results.append({
                        'input': str(image_file),
                        'output': result['output_path'],
                        'status': 'success'
                    })
                except Exception as e:
                    results.append({
                        'input': str(image_file),
                        'error': str(e),
                        'status': 'failed'
                    })
        
        return results
    
    def create_size_comparison(self, image_path):
        """Create multiple sizes of the same image for comparison"""
        if not self.validate_image(image_path):
            raise ValueError("Invalid image format")
        
        results = {}
        input_name = Path(image_path).stem
        
        for size_name, dimensions in self.DIMENSIONS.items():
            try:
                processed_img = self.resize_with_crop(image_path, dimensions, 'center')
                output_name = f"{input_name}_{size_name}.jpg"
                output_path = self.output_dir / output_name
                
                processed_img.save(output_path, format='JPEG', quality=85, optimize=True)
                
                results[size_name] = {
                    'dimensions': dimensions,
                    'file_size_kb': round(os.path.getsize(output_path) / 1024, 2),
                    'path': str(output_path)
                }
            except Exception as e:
                results[size_name] = {'error': str(e)}
        
        return results

def main():
    parser = argparse.ArgumentParser(description='Process images for Bellavista news system')
    parser.add_argument('input', help='Input image file or directory')
    parser.add_argument('--output-dir', default='processed_images', help='Output directory')
    parser.add_argument('--size', default='news_main_card', choices=list(ImageProcessor.DIMENSIONS.keys()),
                       help='Target size preset')
    parser.add_argument('--mode', choices=['single', 'batch', 'comparison'], default='single',
                       help='Processing mode')
    parser.add_argument('--crop-position', default='center', 
                       choices=['center', 'top', 'bottom', 'left', 'right'],
                       help='Crop position for intelligent cropping')
    parser.add_argument('--info', action='store_true', help='Show image information only')
    
    args = parser.parse_args()
    
    try:
        processor = ImageProcessor(args.input, args.output_dir)
        
        if args.info:
            info = processor.get_image_info(args.input)
            print(json.dumps(info, indent=2))
            return
        
        if args.mode == 'single':
            result = processor.process_news_main_card(args.input)
            print(f"✅ Processed successfully:")
            print(f"   Output: {result['output_path']}")
            print(f"   Dimensions: {result['dimensions']}")
            print(f"   File size: {result['file_size_kb']} KB")
            
        elif args.mode == 'batch':
            results = processor.process_batch(args.input, args.size)
            successful = sum(1 for r in results if r['status'] == 'success')
            failed = len(results) - successful
            
            print(f"📁 Batch processing complete:")
            print(f"   Total files: {len(results)}")
            print(f"   Successful: {successful}")
            print(f"   Failed: {failed}")
            
            if failed > 0:
                print("\n❌ Failed files:")
                for result in results:
                    if result['status'] == 'failed':
                        print(f"   {result['input']}: {result['error']}")
                        
        elif args.mode == 'comparison':
            results = processor.create_size_comparison(args.input)
            print(f"📊 Size comparison created:")
            for size_name, info in results.items():
                if 'error' not in info:
                    print(f"   {size_name}: {info['dimensions']} - {info['file_size_kb']} KB")
                else:
                    print(f"   {size_name}: ❌ {info['error']}")
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    # Only import io if needed for web optimization
    import io
    main()