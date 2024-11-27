import os
from datetime import timedelta

class Config:
    # Database configuration
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:fkl%402030@localhost/quo_register'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = True

    # Flask-Session configuration for File-based session storage
    
    SESSION_FILE_THRESHOLD = 100  # Max number of session files before cleanup
    SESSION_PERMANENT = True  # Make sessions permanent (they last until the expiration time)
    SESSION_USE_SIGNER = True  # Sign the session cookie to prevent tampering
     
    # Optional session lifetime configuration
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)  # Set session lifetime (in hours)
     
    