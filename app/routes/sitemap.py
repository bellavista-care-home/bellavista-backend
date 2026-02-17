# Sitemap Generator for Bellavista Nursing Homes
# Dynamic sitemap generation for better SEO

from flask import Blueprint, Response, jsonify
from datetime import datetime, timedelta
import xml.etree.ElementTree as ET
from xml.dom import minidom
from ..models.news import News
from ..models.vacancies import Vacancy
from ..models.events import Event

sitemap_bp = Blueprint('sitemap', __name__)

# Static pages configuration
STATIC_PAGES = [
    {'path': '/', 'priority': 1.0, 'changefreq': 'weekly'},
    {'path': '/about', 'priority': 0.9, 'changefreq': 'monthly'},
    {'path': '/contact', 'priority': 0.9, 'changefreq': 'monthly'},
    {'path': '/services', 'priority': 0.9, 'changefreq': 'monthly'},
    {'path': '/our-homes', 'priority': 0.9, 'changefreq': 'weekly'},
    {'path': '/news', 'priority': 0.8, 'changefreq': 'daily'},
    {'path': '/gallery', 'priority': 0.7, 'changefreq': 'weekly'},
    {'path': '/testimonials', 'priority': 0.7, 'changefreq': 'monthly'},
    {'path': '/faq', 'priority': 0.7, 'changefreq': 'monthly'},
    {'path': '/careers', 'priority': 0.6, 'changefreq': 'weekly'},
    {'path': '/care', 'priority': 0.8, 'changefreq': 'monthly'},
    {'path': '/activities', 'priority': 0.7, 'changefreq': 'monthly'},
    {'path': '/facilities', 'priority': 0.7, 'changefreq': 'monthly'},
    {'path': '/dining-nutrition', 'priority': 0.6, 'changefreq': 'monthly'},
    {'path': '/dementia-care-guide', 'priority': 0.8, 'changefreq': 'monthly'},
    {'path': '/dementia-environment', 'priority': 0.7, 'changefreq': 'monthly'},
    {'path': '/our-vision', 'priority': 0.5, 'changefreq': 'yearly'},
    {'path': '/our-values', 'priority': 0.5, 'changefreq': 'yearly'},
    {'path': '/management-team', 'priority': 0.6, 'changefreq': 'monthly'},
    {'path': '/visitor-policy', 'priority': 0.5, 'changefreq': 'monthly'},
    {'path': '/training-development', 'priority': 0.5, 'changefreq': 'monthly'},
    {'path': '/schedule-tour', 'priority': 0.8, 'changefreq': 'monthly'},
    {'path': '/enquiry', 'priority': 0.8, 'changefreq': 'monthly'},
    {'path': '/care-homes-cardiff', 'priority': 0.8, 'changefreq': 'monthly'},
    {'path': '/bellavista-nursing-home', 'priority': 0.8, 'changefreq': 'monthly'},
    {'path': '/privacy-policy', 'priority': 0.3, 'changefreq': 'yearly'},
    {'path': '/terms-of-service', 'priority': 0.3, 'changefreq': 'yearly'},
]

# Location pages
LOCATION_PAGES = [
    {'path': '/bellavista-barry', 'priority': 0.9, 'changefreq': 'weekly'},
    {'path': '/bellavista-cardiff', 'priority': 0.9, 'changefreq': 'weekly'},
    {'path': '/waverley-care-center', 'priority': 0.9, 'changefreq': 'weekly'},
    {'path': '/college-fields-nursing-home', 'priority': 0.9, 'changefreq': 'weekly'},
    {'path': '/baltimore-care-home', 'priority': 0.9, 'changefreq': 'weekly'},
    {'path': '/meadow-vale-cwtch', 'priority': 0.9, 'changefreq': 'weekly'},
]

SITE_URL = "https://www.bellavistanursinghomes.com"

def create_url_element(path, lastmod=None, changefreq='weekly', priority=0.5):
    """Create a URL element for sitemap"""
    url = ET.Element('url')
    
    # Location
    loc = ET.SubElement(url, 'loc')
    loc.text = f"{SITE_URL}{path}"
    
    # Last modified
    if lastmod:
        lastmod_elem = ET.SubElement(url, 'lastmod')
        lastmod_elem.text = lastmod.strftime('%Y-%m-%d') if isinstance(lastmod, datetime) else lastmod
    
    # Change frequency
    if changefreq:
        changefreq_elem = ET.SubElement(url, 'changefreq')
        changefreq_elem.text = changefreq
    
    # Priority
    priority_elem = ET.SubElement(url, 'priority')
    priority_elem.text = str(priority)
    
    return url

def prettify_xml(elem):
    """Return a pretty-printed XML string for the Element"""
    rough_string = ET.tostring(elem, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

@sitemap_bp.route('/sitemap.xml')
def generate_sitemap():
    """Generate main sitemap.xml"""
    try:
        # Create root element
        urlset = ET.Element('urlset')
        urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
        urlset.set('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
        urlset.set('xsi:schemaLocation', 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd')
        
        # Add static pages
        current_date = datetime.now().strftime('%Y-%m-%d')
        for page in STATIC_PAGES:
            urlset.append(create_url_element(
                page['path'], 
                current_date, 
                page['changefreq'], 
                page['priority']
            ))
        
        # Add location pages
        for page in LOCATION_PAGES:
            urlset.append(create_url_element(
                page['path'], 
                current_date, 
                page['changefreq'], 
                page['priority']
            ))
        
        # Add news articles
        try:
            news_items = News.query.filter_by(published=True).order_by(News.date.desc()).all()
            for news in news_items:
                news_path = f"/news/{news.slug if news.slug else news.id}"
                urlset.append(create_url_element(
                    news_path,
                    news.date,
                    'weekly',
                    0.6
                ))
        except Exception as e:
            print(f"Error adding news to sitemap: {e}")
        
        # Add vacancies
        try:
            vacancies = Vacancy.query.filter_by(active=True).all()
            for vacancy in vacancies:
                vacancy_path = f"/careers/{vacancy.id}"
                urlset.append(create_url_element(
                    vacancy_path,
                    vacancy.created_at,
                    'weekly',
                    0.5
                ))
        except Exception as e:
            print(f"Error adding vacancies to sitemap: {e}")
        
        # Add events
        try:
            events = Event.query.filter(Event.date >= datetime.now() - timedelta(days=30)).all()
            for event in events:
                event_path = f"/events/{event.slug if event.slug else event.id}"
                urlset.append(create_url_element(
                    event_path,
                    event.date,
                    'weekly',
                    0.5
                ))
        except Exception as e:
            print(f"Error adding events to sitemap: {e}")
        
        # Convert to string and remove XML declaration from prettify
        xml_string = prettify_xml(urlset)
        # Remove the XML declaration that prettify adds, we'll add our own
        xml_string = xml_string.replace('<?xml version="1.0" ?>', '').strip()
        
        # Add our own XML declaration with encoding
        final_xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml_string
        
        return Response(final_xml, mimetype='application/xml')
        
    except Exception as e:
        print(f"Error generating sitemap: {e}")
        return Response("Error generating sitemap", status=500)

@sitemap_bp.route('/sitemap-news.xml')
def generate_news_sitemap():
    """Generate Google News sitemap"""
    try:
        # Create root element for news sitemap
        urlset = ET.Element('urlset')
        urlset.set('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')
        urlset.set('xmlns:news', 'http://www.google.com/schemas/sitemap-news/0.9')
        urlset.set('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
        urlset.set('xsi:schemaLocation', 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd')
        
        # Add news articles from last 2 days (Google News requirement)
        two_days_ago = datetime.now() - timedelta(days=2)
        try:
            recent_news = News.query.filter(
                News.published == True,
                News.date >= two_days_ago
            ).order_by(News.date.desc()).all()
            
            for news in recent_news:
                url = ET.SubElement(urlset, 'url')
                
                # Location
                loc = ET.SubElement(url, 'loc')
                news_path = f"/news/{news.slug if news.slug else news.id}"
                loc.text = f"{SITE_URL}{news_path}"
                
                # News specific elements
                news_elem = ET.SubElement(url, 'news:news')
                
                publication = ET.SubElement(news_elem, 'news:publication')
                name = ET.SubElement(publication, 'news:name')
                name.text = 'Bellavista Nursing Homes'
                language = ET.SubElement(publication, 'news:language')
                language.text = 'en'
                
                pub_date = ET.SubElement(news_elem, 'news:publication_date')
                pub_date.text = news.date.strftime('%Y-%m-%d') if isinstance(news.date, datetime) else news.date
                
                title = ET.SubElement(news_elem, 'news:title')
                title.text = news.title
                
                if news.category:
                    keywords = ET.SubElement(news_elem, 'news:keywords')
                    keywords.text = news.category
                
        except Exception as e:
            print(f"Error adding news to news sitemap: {e}")
        
        # Convert to string
        xml_string = prettify_xml(urlset)
        xml_string = xml_string.replace('<?xml version="1.0" ?>', '').strip()
        final_xml = '<?xml version="1.0" encoding="UTF-8"?>\n' + xml_string
        
        return Response(final_xml, mimetype='application/xml')
        
    except Exception as e:
        print(f"Error generating news sitemap: {e}")
        return Response("Error generating news sitemap", status=500)

@sitemap_bp.route('/robots.txt')
def generate_robots_txt():
    """Generate robots.txt dynamically"""
    robots_content = f"""User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin-console
Disallow: /login
Disallow: /api
Disallow: /private
Disallow: /kiosk

# Crawl delay to be respectful to server
Crawl-delay: 1

# Sitemaps
Sitemap: {SITE_URL}/sitemap.xml
Sitemap: {SITE_URL}/sitemap-news.xml

# Allow Googlebot to index all images
User-agent: Googlebot-Image
Allow: /*

# Allow social media crawlers
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit/1.1
Allow: /
"""
    return Response(robots_content, mimetype='text/plain')