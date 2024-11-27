from datetime import datetime
from enum import Enum
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize SQLAlchemy instance
db = SQLAlchemy()

class Role(Enum):
    USER = 'User'
    ADMIN = 'Admin'

class User(db.Model):
    __tablename__ = 'users'
    
    id_number = db.Column(db.String(50), primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    parish = db.Column(db.String(100), nullable=True)
    user_password = db.Column('password', db.String(255), nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    role = db.Column(db.Enum(Role), nullable=False, default=Role.USER)
    
    def to_dict(self):
        """
        Converts the User object into a dictionary for API responses.
        """
        return {
            'id_number': self.id_number,
            'full_name': self.full_name,
            'email': self.email,
            'parish': self.parish if self.parish else "N/A",  # Handle nullable fields
            'registration_date': self.registration_date.strftime("%Y-%m-%d %H:%M:%S"),
            'role': self.role.value
        }

    @classmethod
    def create_user(cls, id_number, full_name, email, password, parish=None):
        """
        Helper method to create a new user with hashed password.
        """
        hashed_password = generate_password_hash(password)
        new_user = cls(
            id_number=id_number,
            full_name=full_name,
            email=email,
            user_password=hashed_password,
            parish=parish
        )
        db.session.add(new_user)
        db.session.commit()
        return new_user

    def check_password(self, password):
        """
        Verifies if the provided password matches the stored hash.
        """
        return check_password_hash(self.user_password, password)
    
class Admin(db.Model):
    __tablename__ = 'admin'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    id_number = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_main_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class QuoRegister(db.Model):
    __tablename__ = 'quo_register'
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)
    # Add more fields as needed for your specific registration requirements

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'phone_number': self.phone_number,
            'registration_date': self.registration_date.isoformat()
        }
