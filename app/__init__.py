import os
from flask import Flask, send_from_directory, request, session, Response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from config import config

db = SQLAlchemy()

def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_CONFIG', 'default')

    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Set secret key for session management
    # Note: Config object might have already set SECRET_KEY
    if not app.config.get('SECRET_KEY') or app.config['SECRET_KEY'] == 'change-me':
        app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
    
    if config_name == 'production':
        if app.config['SECRET_KEY'] in ['change-me', 'dev-secret-key-change-in-production']:
             raise ValueError("CRITICAL SECURITY ERROR: Weak SECRET_KEY in production. Set JWT_SECRET_KEY or SECRET_KEY env var.")

    app.config['SESSION_COOKIE_SECURE'] = True  # Only send over HTTPS in production
    app.config['SESSION_COOKIE_HTTPONLY'] = True  # No JS access to session cookie
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # CSRF protection
    
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Setup audit logging
    try:
        from .audit_log import setup_audit_logging
        setup_audit_logging(app)
        print("[APP] Audit logging setup complete", flush=True)
    except Exception as e:
        print(f"[WARNING] Audit logging setup failed: {e}", flush=True)
        import traceback
        traceback.print_exc()
    
    # Setup security headers
    try:
        from .security_headers import setup_security_headers
        setup_security_headers(app)
        print("[APP] Security headers setup complete", flush=True)
    except Exception as e:
        print(f"[WARNING] Security headers setup failed: {e}", flush=True)
        import traceback
        traceback.print_exc()

    # Security: Restrict CORS to production domain and local development
    # In production, we strictly allow the Amplify domain.
    allowed_origins = [
        "https://www.bellavistanursinghomes.com",      # Custom Domain
        "https://bellavistanursinghomes.com",          # Custom Domain (no-www)
        "https://master.dxv4enxpqrrf6.amplifyapp.com",  # Production Frontend
        "http://localhost:5173",                       # Local Development
        "http://127.0.0.1:5173",                       # Local Development IP
        "http://localhost:5174",                       # Vite fallback port
        "http://127.0.0.1:5174",                       # Vite fallback port IP
        "http://localhost:5175",                       # Vite fallback port 2
        "http://127.0.0.1:5175",                       # Vite fallback port 2 IP
        "http://localhost:5176",                       # Vite fallback port 3
        "http://127.0.0.1:5176",                       # Vite fallback port 3 IP
        "http://localhost:3000",                       # Fallback localhost
        "http://127.0.0.1:3000"                        # Fallback localhost IP
    ]
    
    # Enable CORS FIRST before registering routes
    # Flask-CORS will automatically handle OPTIONS preflight requests
    try:
        CORS(app, 
             origins=allowed_origins,
             methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             allow_headers=["Content-Type", "Authorization"],
             expose_headers=["Content-Type"],
             supports_credentials=True,
             max_age=3600)
        print("[APP] CORS configuration complete", flush=True)
    except Exception as e:
        print(f"[ERROR] CORS setup failed: {e}", flush=True)
        import traceback
        traceback.print_exc()
        raise

    # Security Headers (applied AFTER CORS to avoid conflicts)
    @app.after_request
    def add_security_headers(response):
        # Don't override CORS headers that Flask-CORS has already set
        # Just add the security headers
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        return response
    
    db.init_app(app)
    print("[APP] SQLAlchemy initialized", flush=True)
    
    with app.app_context():
        print("[APP] Entering app context for initialization", flush=True)
        
        try:
            print("[DB] Importing models...", flush=True)
            from . import models
            print("[DB] Models imported successfully", flush=True)
        except Exception as e:
            print(f"[ERROR] Failed to import models: {e}", flush=True)
            import traceback
            traceback.print_exc()
            raise
        
        try:
            print("[DB] Checking database tables...", flush=True)
            # Ensure tables exist for all database types
            # In a proper production setup, use Flask-Migrate (Alembic)
            # For this setup, we use create_all() which is safe (doesn't overwrite)
            db.create_all()
            
            # --- AUTO MIGRATION FOR PRODUCTION ---
            # Check for missing columns in existing tables and add them
            # This handles the case where tables exist but are missing newer columns
            try:
                from sqlalchemy import text, inspect
                print("[DB] Checking for schema updates...", flush=True)
                
                inspector = inspect(db.engine)
                
                # Helper to add column
                def add_column(table, column, type_def):
                    with db.engine.connect() as conn:
                        try:
                            print(f"[DB] Adding missing column {column} to {table}...", flush=True)
                            conn.execute(text(f'ALTER TABLE "{table}" ADD COLUMN "{column}" {type_def}'))
                            conn.commit()
                            print(f"[DB] Added {column} to {table}", flush=True)
                        except Exception as e:
                            print(f"[DB] Failed to add column {column}: {e}", flush=True)

                # List of columns to check/add [table, column, type]
                # This is a COMPREHENSIVE list of all Home model columns
                columns_to_check = [
                    # Hero Section
                    ('home', 'heroTitle', 'VARCHAR(255)'),
                    ('home', 'heroSubtitle', 'VARCHAR(255)'),
                    ('home', 'heroBgImage', 'TEXT'),
                    ('home', 'heroDescription', 'TEXT'),
                    ('home', 'heroExpandedDesc', 'TEXT'),
                    ('home', 'statsLocationBadge', 'VARCHAR(255)'),
                    ('home', 'statsQualityBadge', 'VARCHAR(255)'),
                    ('home', 'statsTeamBadge', 'VARCHAR(255)'),
                    # Documents
                    ('home', 'ciwReportUrl', 'TEXT'),
                    ('home', 'newsletterUrl', 'TEXT'),
                    # Banner
                    ('home', 'bannerImagesJson', 'TEXT'),
                    # Stats
                    ('home', 'statsBedrooms', 'VARCHAR(64)'),
                    ('home', 'statsPremier', 'VARCHAR(64)'),
                    # About Section
                    ('home', 'aboutTitle', 'VARCHAR(255)'),
                    ('home', 'aboutIntro', 'TEXT'),
                    ('home', 'aboutParagraph2', 'TEXT'),
                    ('home', 'carePhilosophyTitle', 'VARCHAR(255)'),
                    ('home', 'carePhilosophy', 'TEXT'),
                    ('home', 'locationTitle', 'VARCHAR(255)'),
                    ('home', 'locationDescription', 'TEXT'),
                    ('home', 'contentBlocksJson', 'TEXT'),
                    # Why Choose Section
                    ('home', 'whyChooseTitle', 'VARCHAR(255)'),
                    ('home', 'whyChooseSubtitle', 'VARCHAR(255)'),
                    ('home', 'whyChooseListJson', 'TEXT'),
                    ('home', 'whyChooseClosing', 'TEXT'),
                    # Services Section
                    ('home', 'servicesTitle', 'VARCHAR(255)'),
                    ('home', 'servicesSubtitle', 'VARCHAR(255)'),
                    ('home', 'servicesIntro', 'TEXT'),
                    ('home', 'servicesListJson', 'TEXT'),
                    ('home', 'servicesClosing', 'TEXT'),
                    ('home', 'servicesCta', 'VARCHAR(255)'),
                    ('home', 'servicesCtaLink', 'TEXT'),
                    ('home', 'servicesContent', 'TEXT'),
                    # Facilities Section
                    ('home', 'facilitiesTitle', 'VARCHAR(255)'),
                    ('home', 'facilitiesSubtitle', 'VARCHAR(255)'),
                    ('home', 'facilitiesIntro', 'TEXT'),
                    ('home', 'facilitiesListJson', 'TEXT'),
                    ('home', 'detailedFacilitiesJson', 'TEXT'),
                    ('home', 'facilitiesGalleryJson', 'TEXT'),
                    ('home', 'facilitiesContent', 'TEXT'),
                    # Activities Section
                    ('home', 'activitiesTitle', 'VARCHAR(255)'),
                    ('home', 'activitiesSubtitle', 'VARCHAR(255)'),
                    ('home', 'activitiesIntro', 'TEXT'),
                    ('home', 'activitiesJson', 'TEXT'),
                    ('home', 'activityImagesJson', 'TEXT'),
                    ('home', 'activitiesModalDesc', 'TEXT'),
                    ('home', 'activitiesContent', 'TEXT'),
                    # Team Section
                    ('home', 'teamTitle', 'VARCHAR(255)'),
                    ('home', 'teamSubtitle', 'VARCHAR(255)'),
                    ('home', 'teamIntro', 'TEXT'),
                    ('home', 'teamIntro2', 'TEXT'),
                    ('home', 'teamMembersJson', 'TEXT'),
                    ('home', 'teamGalleryJson', 'TEXT'),
                    ('home', 'teamContent', 'TEXT'),
                    # Testimonials Section
                    ('home', 'testimonialsTitle', 'VARCHAR(255)'),
                    ('home', 'googleRating', 'FLOAT'),
                    ('home', 'googleReviewCount', 'INTEGER'),
                    ('home', 'carehomeRating', 'FLOAT'),
                    ('home', 'carehomeReviewCount', 'INTEGER'),
                    ('home', 'testimonialsIntro', 'TEXT'),
                    # News Section
                    ('home', 'newsTitle', 'VARCHAR(255)'),
                    ('home', 'newsSubtitle', 'VARCHAR(255)'),
                    # Contact Section
                    ('home', 'contactTitle', 'VARCHAR(255)'),
                    ('home', 'contactSubtitle', 'VARCHAR(255)'),
                    ('home', 'contactAddress', 'TEXT'),
                    ('home', 'contactPhone', 'VARCHAR(64)'),
                    ('home', 'contactEmail', 'VARCHAR(255)'),
                    ('home', 'contactMapUrl', 'TEXT'),
                    ('home', 'quickFactBeds', 'VARCHAR(64)'),
                    ('home', 'quickFactLocation', 'VARCHAR(255)'),
                    ('home', 'quickFactCareType', 'VARCHAR(255)'),
                    ('home', 'quickFactParking', 'VARCHAR(128)'),
                    ('home', 'googleReviewUrl', 'TEXT'),
                    ('home', 'carehomeUrl', 'TEXT'),
                    # Care Section
                    ('home', 'careIntro', 'TEXT'),
                    ('home', 'careServicesJson', 'TEXT'),
                    ('home', 'careSectionsJson', 'TEXT'),
                    ('home', 'careGalleryJson', 'TEXT'),
                    # Other tables
                    ('review', 'source', 'VARCHAR(64)'),
                ]

                for table, col, dtype in columns_to_check:
                    try:
                        if inspector.has_table(table):
                            # Get existing columns
                            existing_columns = [c['name'] for c in inspector.get_columns(table)]
                            
                            # Check if column is missing
                            if col not in existing_columns:
                                add_column(table, col, dtype)
                    except Exception as e:
                        print(f"[DB] Error checking column {col} in {table}: {e}", flush=True)
                            
                print("[DB] Schema update check complete", flush=True)
            except Exception as e:
                print(f"[WARNING] Schema migration failed (safely ignored if tables fresh): {e}", flush=True)
            
            print("[DB] Tables verified/created successfully", flush=True)
        except Exception as e:
            print(f"[ERROR] Failed to create database tables: {e}", flush=True)
            import traceback
            traceback.print_exc()
            # Don't exit - allow the app to start in case DB is temporarily unavailable
            # The app can serve the health check endpoint
        
        try:
            print("[APP] Importing routes...", flush=True)
            from .routes import api_bp
            print("[APP] Routes imported successfully", flush=True)
            app.register_blueprint(api_bp, url_prefix='/api')
            print("[APP] API blueprint registered", flush=True)
            
            # Register meal plans blueprint
            from .meal_plans import meal_plans_bp
            app.register_blueprint(meal_plans_bp, url_prefix='/api/meal-plans')
            print("[APP] Meal plans blueprint registered", flush=True)
        except Exception as e:
            print(f"[ERROR] Failed to register API blueprint: {e}", flush=True)
            import traceback
            traceback.print_exc()
            raise  # This is critical, must exit
    
    @app.route('/', methods=['GET'])
    def health_check():
        """Health check endpoint for load balancer"""
        from flask import jsonify
        try:
            # Try to connect to database
            from .models import Home
            Home.query.limit(1).all()
            return jsonify({'status': 'ok', 'db': 'connected'}), 200
        except Exception as e:
            print(f"[HEALTH] Database check failed: {e}", flush=True)
            # Still return 200 so load balancer knows the app is running
            # The database connection will be retried on actual requests
            return jsonify({'status': 'ok', 'db': 'disconnected', 'error': str(e)}), 200
    
    @app.route('/uploads/<path:filename>')
    def uploads(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
    @app.route('/sitemap-news.xml', methods=['GET'])
    def sitemap_news():
        from datetime import datetime
        from .models import NewsItem
        
        base_url = "https://www.bellavistanursinghomes.com"
        
        try:
            items = NewsItem.query.order_by(NewsItem.createdAt.desc()).limit(100).all()
        except Exception as e:
            print(f"[SITEMAP-NEWS] Failed to query NewsItem: {e}", flush=True)
            items = []
        
        def format_publication_date(item):
            try:
                if item.createdAt:
                    return item.createdAt.strftime("%Y-%m-%d")
            except Exception:
                pass
            try:
                if item.date:
                    return str(item.date)[:10]
            except Exception:
                pass
            return datetime.utcnow().strftime("%Y-%m-%d")
        
        parts = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">'
        ]
        
        if not items:
            today = datetime.utcnow().strftime("%Y-%m-%d")
            parts.extend([
                '  <url>',
                f'    <loc>{base_url}/news</loc>',
                '    <news:news>',
                '      <news:publication>',
                '        <news:name>Bellavista Nursing Home News</news:name>',
                '        <news:language>en</news:language>',
                '      </news:publication>',
                f'      <news:publication_date>{today}</news:publication_date>',
                '      <news:title>Latest News from Bellavista Nursing Homes</news:title>',
                '      <news:keywords>nursing home, care home, dementia care, elderly care, South Wales</news:keywords>',
                '    </news:news>',
                '  </url>'
            ])
        else:
            for item in items:
                pub_date = format_publication_date(item)
                loc = f"{base_url}/news/{item.id}"
                title = (item.title or "").replace("&", "&amp;")
                
                parts.extend([
                    '  <url>',
                    f'    <loc>{loc}</loc>',
                    '    <news:news>',
                    '      <news:publication>',
                    '        <news:name>Bellavista Nursing Home News</news:name>',
                    '        <news:language>en</news:language>',
                    '      </news:publication>',
                    f'      <news:publication_date>{pub_date}</news:publication_date>',
                    f'      <news:title>{title}</news:title>',
                    '      <news:keywords>nursing home, care home, dementia care, elderly care, South Wales</news:keywords>',
                    '    </news:news>',
                    '  </url>'
                ])
        
        parts.append('</urlset>')
        xml = "\n".join(parts)
        return Response(xml, mimetype="application/xml")
    
    @app.route('/sitemap.xml', methods=['GET'])
    def sitemap_full():
        from datetime import datetime
        from .models import Home, NewsItem
        
        base_url = "https://www.bellavistanursinghomes.com"
        today = datetime.utcnow().strftime("%Y-%m-%d")
        
        static_pages = [
            ("/", "daily", "1.0"),
            ("/our-homes", "daily", "0.9"),
            ("/services", "weekly", "0.9"),
            ("/gallery", "weekly", "0.8"),
            ("/contact", "monthly", "0.7"),
            ("/careers", "weekly", "0.7"),
            ("/enquiry", "weekly", "0.7"),
            ("/schedule-tour", "weekly", "0.8"),
            ("/faq", "monthly", "0.6"),
            ("/testimonials", "monthly", "0.7"),
            ("/news", "daily", "0.7"),
            ("/bellavista-nursing-home", "weekly", "0.8"),
            ("/visitor-policy", "monthly", "0.5"),
            ("/dementia-friendly-environment", "monthly", "0.7"),
            ("/dining-and-nutrition", "monthly", "0.6"),
            ("/our-vision", "monthly", "0.6"),
            ("/our-values", "monthly", "0.6"),
            ("/management-team", "monthly", "0.6"),
            ("/care-homes-cardiff", "monthly", "0.7"),
            ("/dementia-care-guide", "monthly", "0.7"),
            ("/privacy-policy", "yearly", "0.3"),
            ("/terms-of-service", "yearly", "0.3")
        ]
        
        def home_slug_from_name(name):
            if not name:
                return None
            n = name.lower()
            if "cardiff" in n:
                return "/bellavista-cardiff"
            if "barry" in n and "college" not in n and "baltimore" not in n:
                return "/bellavista-barry"
            if "waverley" in n:
                return "/waverley-care-center"
            if "college fields" in n:
                return "/college-fields-nursing-home"
            if "baltimore" in n:
                return "/baltimore-care-home"
            if "meadow vale" in n:
                return "/meadow-vale-cwtch"
            if "pontypridd" in n:
                return "/bellavista-pontypridd"
            return None
        
        urls = []
        
        for path, changefreq, priority in static_pages:
            urls.append({
                "loc": f"{base_url}{path}",
                "lastmod": today,
                "changefreq": changefreq,
                "priority": priority
            })
        
        try:
            homes = Home.query.all()
        except Exception as e:
            print(f"[SITEMAP] Failed to query Home: {e}", flush=True)
            homes = []
        
        for home in homes:
            slug = home_slug_from_name(home.name)
            if not slug:
                continue
            lastmod = home.createdAt.strftime("%Y-%m-%d") if getattr(home, "createdAt", None) else today
            urls.append({
                "loc": f"{base_url}{slug}",
                "lastmod": lastmod,
                "changefreq": "daily",
                "priority": "0.9"
            })
            location_id = slug.lstrip("/")
            urls.append({
                "loc": f"{base_url}/activities/{location_id}",
                "lastmod": lastmod,
                "changefreq": "weekly",
                "priority": "0.7"
            })
            urls.append({
                "loc": f"{base_url}/facilities/{location_id}",
                "lastmod": lastmod,
                "changefreq": "weekly",
                "priority": "0.7"
            })
        
        try:
            news_items = NewsItem.query.order_by(NewsItem.createdAt.desc()).limit(50).all()
        except Exception as e:
            print(f"[SITEMAP] Failed to query NewsItem: {e}", flush=True)
            news_items = []
        
        for item in news_items:
            lastmod = item.createdAt.strftime("%Y-%m-%d") if getattr(item, "createdAt", None) else today
            urls.append({
                "loc": f"{base_url}/news/{item.id}",
                "lastmod": lastmod,
                "changefreq": "daily",
                "priority": "0.6"
            })
        
        parts = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        ]
        
        for u in urls:
            parts.extend([
                "  <url>",
                f"    <loc>{u['loc']}</loc>",
                f"    <lastmod>{u['lastmod']}</lastmod>",
                f"    <changefreq>{u['changefreq']}</changefreq>",
                f"    <priority>{u['priority']}</priority>",
                "  </url>"
            ])
        
        parts.append("</urlset>")
        xml = "\n".join(parts)
        return Response(xml, mimetype="application/xml")
    
    # Initialize Scheduler
    try:
        from . import scheduler
        scheduler.start_scheduler(app)
        print("[SCHEDULER] Google Reviews import job scheduled (every 12 hours).", flush=True)
        # Schedule Carehome.co.uk import job as well (every 24 hours)
        # Note: We are reusing the scheduler started above
    except Exception as e:
        print(f"[WARNING] Scheduler setup failed: {e}", flush=True)

    print("[APP] Application initialization complete!", flush=True)
    return app

