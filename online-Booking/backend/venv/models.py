# models.py
from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    id_number = db.Column(db.String(20), unique=True, nullable=False)
    dob = db.Column(db.Date, nullable=False)  # Date of Birth as a Date type
    phone_number = db.Column(db.String(20), nullable=False)
    image_url = db.Column(db.String(255))  # URL to the passport size image, not required
    community = db.Column(db.String(100))  # Small Christian Community, optional
    talent_group = db.Column(db.String(100))  # Talent group (e.g., Music, Drama), optional
    education_level = db.Column(db.String(100))  # Education Level, optional
    course = db.Column(db.String(100))  # Course done (if out of school), optional
    employment_status = db.Column(db.String(50))  # Employment status, optional
    email = db.Column(db.String(120), unique=True, nullable=False)  # Email for authentication
    password = db.Column(db.String(200), nullable=False)  # Hashed password

    def __repr__(self):
        return f"<User {self.full_name}>"


# You can add more models here for other resources like booking, etc.
