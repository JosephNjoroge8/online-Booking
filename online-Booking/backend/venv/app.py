from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash
import os
import re
from datetime import datetime

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Database Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:fkl%402030@localhost/quo_register'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.urandom(24)

db = SQLAlchemy(app)

class User(db.Model):
    __tablename__ = 'users'
    
    id_number = db.Column(db.String(50), primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    parish = db.Column(db.String(100), nullable=True)
    user_password = db.Column('password', db.String(255), nullable=False)  # Changed column name
    registration_date = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id_number': self.id_number,
            'full_name': self.full_name,
            'email': self.email,
            'parish': self.parish,
            'registration_date': str(self.registration_date)
        }

def validate_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(pattern, email) is not None

@app.route('/register', methods=['POST'])
def register():
    try:
        # Flexible data parsing
        if request.content_type.startswith('multipart/form-data'):
            user_data = request.form.to_dict()
        elif request.content_type.startswith('application/json'):
            user_data = request.json
        else:
            try:
                user_data = request.get_json(force=True)
            except:
                return jsonify({
                    "error": "Invalid request format", 
                    "details": "Could not parse request data"
                }), 400

        # Validate required fields
        required_fields = ['id_number', 'full_name', 'email', 'parish', 'password']
        missing_fields = [field for field in required_fields if not user_data.get(field)]
        
        if missing_fields:
            return jsonify({
                "error": "Missing required fields", 
                "missing": missing_fields
            }), 400

        # Trim and validate fields
        for field in required_fields:
            user_data[field] = str(user_data[field]).strip()

        # Email validation
        if not validate_email(user_data['email']):
            return jsonify({"error": "Invalid email format"}), 400

        # Check if user already exists
        existing_user = User.query.filter(
            (User.email == user_data['email']) | 
            (User.id_number == user_data['id_number'])
        ).first()
        
        if existing_user:
            return jsonify({
                "error": "User already exists", 
                "details": "Email or ID number is already registered"
            }), 400

        # Hash the password
        hashed_password = generate_password_hash(user_data['password'])

        # Create new user
        new_user = User(
            id_number=user_data['id_number'],
            full_name=user_data['full_name'],
            email=user_data['email'],
            parish=user_data['parish'],
            user_password=hashed_password  # Use the column name defined in the model
        )

        # Add and commit the new user
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "User registered successfully", 
            "user": {
                'id_number': new_user.id_number,
                'full_name': new_user.full_name,
                'email': new_user.email,
                'parish': new_user.parish
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error details: {str(e)}")  # Log the full error for debugging
        return jsonify({
            "error": "Registration failed",
            "details": str(e)
        }), 400

# Ensure database tables are created
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')