import re
from flask import Blueprint, request, jsonify, session, current_app, redirect, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from app.models import User
from datetime import timedelta
from sqlalchemy.exc import IntegrityError
from .models import db
from app.utils import validate_email
from functools import wraps
import traceback
 

auth_bp = Blueprint('auth', __name__)
 

# Password validation function
def validate_password(password):
    if len(password) < 6:
        return False
    if not re.search(r'\d', password):  # Check for numbers
        return False
    if not re.search(r'[A-Za-z]', password):  # Check for letters
        return False
    if not re.search(r'[@$!%*?&]', password):  # Check for special characters
        return False
    return True

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        user_data = request.get_json()

        # Validate required fields
        required_fields = ['id_number', 'full_name', 'email', 'parish', 'password']
        missing_fields = [field for field in required_fields if not user_data.get(field)]
        if missing_fields:
            return jsonify({"error": "Missing required fields", "missing": missing_fields}), 400

        # Validate password and email
        if not validate_email(user_data['email']):
            return jsonify({"error": "Invalid email format"}), 400
        if not validate_password(user_data['password']):
            return jsonify({"error": "Password must be at least 6 characters long and contain letters, numbers, and special characters"}), 400

        # Create new user
        hashed_password = generate_password_hash(user_data['password'])
        new_user = User(
            id_number=user_data['id_number'],
            full_name=user_data['full_name'],
            email=user_data['email'],
            parish=user_data['parish'],
            user_password=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201

    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": f"Integrity error: {str(e)}"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500

 
# Updated login endpoint
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        credentials = request.get_json()
        if not credentials or 'id_number' not in credentials or 'password' not in credentials:
            return jsonify({"message": "Missing credentials"}), 400

        user = User.query.filter_by(id_number=credentials['id_number']).first()
        if not user or not check_password_hash(user.user_password, credentials['password']):
            return jsonify({"message": "Invalid credentials"}), 401

        # Set session data
        session['id_number'] = user.id_number
        session['full_name'] = user.full_name
        session['role'] = user.role.value  # Assuming role is an Enum or some attribute

        # Set the session as permanent (lasts as long as PERMANENT_SESSION_LIFETIME)
        session.permanent = True

        # Create response with user dashboard data
        user_dashboard = {
            "id_number": user.id_number,
            "name": user.full_name,
            "email": user.email,
            "parish": user.parish,
            "registration_date": user.registration_date.strftime("%Y-%m-%d") if user.registration_date else None,
            "role": user.role.value
        }

        # Ensure session cookie is set properly
        response = make_response(jsonify({
            "message": "Login successful",
            "user_dashboard": user_dashboard
        }))
        
        response.set_cookie(
            'session',
            session.sid,
            max_age=current_app.permanent_session_lifetime.total_seconds(),
            expires=session.permanent,
            httponly=True,
            samesite='None',
            secure=False  # Ensure 'secure=True' is only used in production with HTTPS
        )
        
        return response, 200

    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({"message": "Login failed due to an error"}), 500

# Simplified dashboard route without authentication check
@auth_bp.route('/dashboard', methods=['GET'])
def dashboard():
    try:
        # Retrieve id_number from session
        id_number = session.get('id_number')
        
        if not id_number:
            # If no session, return a default or initial dashboard state
            return jsonify({
                "message": "No active session",
                "status": "unauthenticated"
            }), 200

        # Query user by id_number
        user = User.query.filter_by(id_number=id_number).first()
        
        if not user:
            return jsonify({
                "message": "User not found",
                "status": "unauthenticated"
            }), 200

        # Construct the dashboard response
        user_dashboard = {
            "id_number": user.id_number,
            "name": user.full_name,
            "email": user.email,
            "parish": user.parish,
            "registration_date": user.registration_date.strftime("%Y-%m-%d") if user.registration_date else None,
            "role": user.role.value
        }

        current_app.logger.info(f"Dashboard data retrieved for user {id_number}.")
        return jsonify(user_dashboard), 200

    except Exception as e:
        current_app.logger.error(f"Unexpected error in dashboard: {str(e)}")
        return jsonify({"message": "An unexpected error occurred"}), 500
# Logout route to clear the session
@auth_bp.route('/logout', methods=['POST'])
def logout():
    try:
        session.clear()  # Clear all session data
        current_app.logger.info("User logged out successfully")
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error during logout: {str(e)}")
        return jsonify({"message": "Error during logout", "details": str(e)}), 500
