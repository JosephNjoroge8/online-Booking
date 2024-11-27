from dotenv import load_dotenv
from flask import Flask
from flask_session import Session
from .config import Config
from datetime import timedelta
from flask_cors import CORS
from flask_migrate import Migrate 
import os
import logging
from logging.handlers import RotatingFileHandler

migrate = Migrate()


def create_app():
    # Load environment variables from .env file
    load_dotenv()  
    
    # Initialize Flask app
    app = Flask(__name__)
    
    # Configure the app using the Config class
    app.config.from_object(Config)
    
    # Session Configuration (Using File-Based Storage)
    app.config['SESSION_TYPE'] = 'filesystem'  # Use filesystem-based session storage
    app.config['SESSION_FILE_DIR'] = './sessions'  # Directory to store session files (optional)
   
    
    app.config.update(
         
        SESSION_COOKIE_SAMESITE='None',  # Changed from 'Lax' to 'None' for cross-origin
        SESSION_COOKIE_SECURE=False,      # Set to True in production
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_NAME='sessionId',  # Custom cookie name
        SESSION_COOKIE_DOMAIN=None,       # Allow cross-domain cookies
        DEBUG=True
    )

    app.config['DEBUG'] = True
    app.logger.setLevel(logging.DEBUG)
    
    # Configure the SECRET_KEY for signing and securing cookies
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    
    # Initialize session handling (using Flask-Session)
    Session(app)

    # Enable CORS
    frontend_url = os.environ.get('FRONTEND_URL' )
    
    CORS(app, supports_credentials=True, resources={r"/*": {"origins": frontend_url}})
    '''
    CORS(app, 
         resources={
             r"/*": {
                 "origins": ["http://127.0.0.1:3000"],
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                 "allow_headers": ["Content-Type", "Authorization"],
                 "expose_headers": ["Set-Cookie", "Content-Range", "X-Content-Range"],
                 "supports_credentials": True
             }
         },
         supports_credentials=True)
    '''
    # Add response headers for every response
    @app.after_request
    def after_request(response):
        origin = "http://127.0.0.1:3000"
        response.headers.add('Access-Control-Allow-Origin', origin)
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Expose-Headers', 'Set-Cookie')
        return response
    # Initialize the database and migration tool
    from .models import db
    db.init_app(app)
    migrate.init_app(app, db)

    # Register blueprints
    from app.auth import auth_bp
    from app.admin import admin_bp
     
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(admin_bp, url_prefix='/admin')
    

    return app
