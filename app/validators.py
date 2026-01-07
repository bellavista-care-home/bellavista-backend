"""
Input Validation Module
Provides validation functions for all API endpoints to prevent injection attacks and invalid data
"""

import re
from flask import jsonify

# Constants for validation
MAX_TEXT_LENGTH = 5000
MAX_NAME_LENGTH = 255
MAX_EMAIL_LENGTH = 254
MAX_PHONE_LENGTH = 20
MAX_URL_LENGTH = 2048
MAX_ARRAY_LENGTH = 100

# Patterns
EMAIL_PATTERN = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
PHONE_PATTERN = r'^[\d\s\-\+\(\)]{7,20}$'
URL_PATTERN = r'^https?://'

def sanitize_string(text):
    """Remove or escape potentially dangerous characters"""
    if not isinstance(text, str):
        return ''
    # Remove null bytes
    text = text.replace('\x00', '')
    return text.strip()

def is_valid_email(email):
    """Validate email format"""
    if not email or len(email) > MAX_EMAIL_LENGTH:
        return False
    return re.match(EMAIL_PATTERN, email) is not None

def is_valid_phone(phone):
    """Validate phone number format"""
    if not phone or len(phone) > MAX_PHONE_LENGTH:
        return False
    return re.match(PHONE_PATTERN, phone) is not None

def is_valid_url(url):
    """Validate URL format"""
    if not url or len(url) > MAX_URL_LENGTH:
        return False
    return re.match(URL_PATTERN, url) is not None

def validate_home(data):
    """Validate home/care facility data"""
    errors = []
    
    # Required fields
    if not data.get('name') or not isinstance(data.get('name'), str):
        errors.append('Home name is required and must be a string')
    elif len(data['name']) > MAX_NAME_LENGTH or len(data['name']) < 2:
        errors.append(f'Home name must be between 2 and {MAX_NAME_LENGTH} characters')
    
    if not data.get('location') or not isinstance(data.get('location'), str):
        errors.append('Location is required and must be a string')
    elif len(data['location']) > MAX_NAME_LENGTH or len(data['location']) < 2:
        errors.append(f'Location must be between 2 and {MAX_NAME_LENGTH} characters')
    
    # Optional but should be validated if present
    if data.get('description'):
        if not isinstance(data['description'], str):
            errors.append('Description must be a string')
        elif len(data['description']) > MAX_TEXT_LENGTH:
            errors.append(f'Description must not exceed {MAX_TEXT_LENGTH} characters')
    
    if data.get('phone'):
        if not is_valid_phone(data['phone']):
            errors.append('Invalid phone number format')
    
    if data.get('email'):
        if not is_valid_email(data['email']):
            errors.append('Invalid email format')
    
    return errors

def validate_news(data):
    """Validate news item data"""
    errors = []
    
    # Required fields
    if not data.get('title') or not isinstance(data.get('title'), str):
        errors.append('News title is required and must be a string')
    elif len(data['title']) > MAX_NAME_LENGTH or len(data['title']) < 3:
        errors.append(f'News title must be between 3 and {MAX_NAME_LENGTH} characters')
    
    if not data.get('content') or not isinstance(data.get('content'), str):
        errors.append('News content is required and must be a string')
    elif len(data['content']) > MAX_TEXT_LENGTH or len(data['content']) < 10:
        errors.append(f'News content must be between 10 and {MAX_TEXT_LENGTH} characters')
    
    if not data.get('author') or not isinstance(data.get('author'), str):
        errors.append('Author is required and must be a string')
    elif len(data['author']) > MAX_NAME_LENGTH or len(data['author']) < 2:
        errors.append(f'Author must be between 2 and {MAX_NAME_LENGTH} characters')
    
    # Optional fields
    if data.get('category'):
        valid_categories = ['update', 'event', 'achievement', 'story']
        if data['category'] not in valid_categories:
            errors.append(f'Category must be one of: {", ".join(valid_categories)}')
    
    return errors

def validate_faq(data):
    """Validate FAQ data"""
    errors = []
    
    # Required fields
    if not data.get('question') or not isinstance(data.get('question'), str):
        errors.append('Question is required and must be a string')
    elif len(data['question']) > MAX_TEXT_LENGTH or len(data['question']) < 5:
        errors.append(f'Question must be between 5 and {MAX_TEXT_LENGTH} characters')
    
    if not data.get('answer') or not isinstance(data.get('answer'), str):
        errors.append('Answer is required and must be a string')
    elif len(data['answer']) > MAX_TEXT_LENGTH or len(data['answer']) < 10:
        errors.append(f'Answer must be between 10 and {MAX_TEXT_LENGTH} characters')
    
    # Optional: category
    if data.get('category'):
        if not isinstance(data['category'], str) or len(data['category']) > 50:
            errors.append('Category must be a string (max 50 characters)')
    
    return errors

def validate_vacancy(data):
    """Validate job vacancy data"""
    errors = []
    
    # Required fields
    if not data.get('title') or not isinstance(data.get('title'), str):
        errors.append('Job title is required and must be a string')
    elif len(data['title']) > MAX_NAME_LENGTH or len(data['title']) < 3:
        errors.append(f'Job title must be between 3 and {MAX_NAME_LENGTH} characters')
    
    if not data.get('description') or not isinstance(data.get('description'), str):
        errors.append('Job description is required and must be a string')
    elif len(data['description']) > MAX_TEXT_LENGTH or len(data['description']) < 20:
        errors.append(f'Job description must be between 20 and {MAX_TEXT_LENGTH} characters')
    
    if not data.get('department') or not isinstance(data.get('department'), str):
        errors.append('Department is required and must be a string')
    elif len(data['department']) > MAX_NAME_LENGTH or len(data['department']) < 2:
        errors.append(f'Department must be between 2 and {MAX_NAME_LENGTH} characters')
    
    # Optional but should validate if present
    if data.get('salary_range'):
        if not isinstance(data['salary_range'], str) or len(data['salary_range']) > 50:
            errors.append('Salary range must be a string (max 50 characters)')
    
    if data.get('employment_type'):
        valid_types = ['full-time', 'part-time', 'temporary', 'contract']
        if data['employment_type'] not in valid_types:
            errors.append(f'Employment type must be one of: {", ".join(valid_types)}')
    
    return errors

def validate_and_sanitize(data, validator_func):
    """Validate and sanitize data"""
    if not isinstance(data, dict):
        return {'valid': False, 'errors': ['Invalid request format']}
    
    # Sanitize string fields
    for key, value in data.items():
        if isinstance(value, str):
            data[key] = sanitize_string(value)
    
    # Run validator
    errors = validator_func(data)
    
    return {
        'valid': len(errors) == 0,
        'errors': errors,
        'data': data
    }

def create_error_response(errors, status_code=400):
    """Create a standardized error response"""
    return jsonify({
        'status': 'error',
        'message': 'Validation failed',
        'errors': errors
    }), status_code
