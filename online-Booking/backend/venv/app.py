from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
import jwt
import os
import re
from datetime import datetime, timedelta
 



app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
 
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
    role = db.Column(db.String(20), nullable=False, default='User')  # Default to 'User'

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
    
@app.route('/login', methods=['POST'])
def login():
    try:
        credentials = request.get_json()

        if not credentials or 'id_number' not in credentials or 'password' not in credentials:
            return jsonify({"message": "Invalid credentials"}), 400

        user = User.query.filter_by(id_number=credentials['id_number']).first()

        if not user or not check_password_hash(user.user_password, credentials['password']):
            return jsonify({"message": "Invalid credentials"}), 401

        # Generate token with role
        token = jwt.encode({
            'id_number': user.id_number,
            'role': user.role,  # Include role in the token
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')

        return jsonify({
            "message": "Login successful",
            "token": token,
            "role": user.role,  # Include role in the response
            "user": {
                'id_number': user.id_number,
                'full_name': user.full_name,
                'email': user.email
            }
        }), 200

    except Exception as e:
        return jsonify({"message": f"Login failed: {str(e)}"}), 500

@app.route('/api/user/profile', methods=['GET'])
def get_user_profile():
    try:
        # Retrieve the token from the Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Authorization header is missing or invalid"}), 401

        token = auth_header.split(" ")[1]
        try:
            # Decode the token
            decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            id_number = decoded_token['id_number']
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401

        # Fetch the user from the database
        user = User.query.filter_by(id_number=id_number).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Return the user data
        return jsonify({
            "id_number": user.id_number,
            "full_name": user.full_name,
            "email": user.email,
            "parish": user.parish,
            "registration_date": user.registration_date.strftime("%Y-%m-%d")
        }), 200

    except Exception as e:
        print(f"Error details: {str(e)}")  # Log the error for debugging
        return jsonify({"message": "Failed to retrieve user profile", "details": str(e)}), 500  
      
def verify_admin_token():
    try:
        # Extract the token from the request headers
        token = request.headers.get('Authorization')
        if not token:
            return None, {"message": "Token is missing"}

        # Remove "Bearer " from the token if it's present
        token = token.replace('Bearer ', '')

        # Verify the token using the same SECRET_KEY used during token generation
        decoded_token = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])

        # Return the user ID (id_number) from the decoded token
        return decoded_token['id_number'], None  # No error response

    except jwt.ExpiredSignatureError:
        return None, {"message": "Token has expired"}
    except jwt.InvalidTokenError:
        return None, {"message": "Invalid token"}
    except Exception as e:
        return None, {"message": f"Unexpected error: {str(e)}"}

# Route to check admin authentication
 
# Assuming User model is imported from your models

@app.route('/api/admin/check-auth', methods=['GET'])
def check_admin_auth():
    try:
        # Extract user ID and error response from token verification
        user_id, error_response = verify_admin_token()

        # Handle token verification error
        if error_response:
            print(f"Token verification failed: {error_response}")
            return jsonify(error_response), 401  # Unauthorized

        # Query the database for the user with the corresponding id_number
        user = User.query.filter_by(id_number=user_id).first()

        # Handle case where user is not found
        if not user:
            print(f"User not found: ID {user_id}")
            return jsonify({"message": "User not found"}), 404  # Not Found

        # Handle based on role and redirect accordingly
        if user.role == 'Admin':
            # Admin user, return admin dashboard data
            return jsonify({
                "redirect": "/admindashboard",
                "name": user.full_name,
                "email": user.email
            }), 200  # OK
        elif user.role == 'User':
            # Regular user, return user dashboard data
            return jsonify({
                "redirect": "/userdashboard",
                "name": user.full_name,
                "email": user.email
            }), 200  # OK
        else:
            return jsonify({"message": "Invalid role"}), 403  # Forbidden

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({
            "message": "An error occurred while processing the request.",
            "error": str(e)
        }), 500  # Internal Server Error



@app.route('/api/admin/tables', methods=['GET'])
def get_tables():
    try:
        # Mock list of tables - adjust according to your actual database
        tables = [
            {"name": "users", "fields": 5},
            {"name": "transactions", "fields": 7},
            {"name": "orders", "fields": 6}
        ]
        response = jsonify(tables)
        response.headers['Content-Type'] = 'application/json'
        return response, 200
    except Exception as e:
        app.logger.error(f"Error fetching tables: {str(e)}")
        return jsonify({"message": "Error fetching tables", "details": str(e)}), 500

# Route to fetch data from a specific table for the admin dashboard
@app.route('/api/admin/tables/<string:table_name>', methods=['GET'])
def get_table_data(table_name):
    admin_id, error_response = verify_admin_token()
    if error_response:
        return error_response

    try:
        # Check if the requested table exists in your database
        if table_name == "users":
            data = [user.to_dict() for user in User.query.all()]
        elif table_name == "transactions":
            # Add logic to fetch transaction data (if you have a Transaction model)
            data = [{"id": 1, "amount": 100, "status": "completed"}]  # Placeholder for actual transaction data
        elif table_name == "orders":
            # Add logic to fetch order data (if you have an Order model)
            data = [{"order_id": 123, "item": "product", "quantity": 2}]  # Placeholder for actual order data
        else:
            return jsonify({"message": "Table not found"}), 404
        
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"message": "Error fetching table data", "details": str(e)}), 500


# Route to fetch database tables (for illustration, returning a mock list
 

# Route to update a specific record
@app.route('/api/admin/tables/<string:table_name>/<int:record_id>', methods=['PUT'])
def update_record(table_name, record_id):
    try:
        if table_name != "users":
            return jsonify({"message": "Table not supported for updates"}), 400

        data = request.get_json()
        record = User.query.get(record_id)
        if not record:
            return jsonify({"message": "Record not found"}), 404

        # Update fields dynamically from the request data
        for key, value in data.items():
            if hasattr(record, key):
                setattr(record, key, value)

        db.session.commit()
        return jsonify({"message": "Record updated successfully"}), 200
    except SQLAlchemyError as e: # type: ignore
        db.session.rollback()
        return jsonify({"message": "Error updating record", "details": str(e)}), 500

# Route to delete a specific record
@app.route('/api/admin/tables/<string:table_name>/<int:record_id>', methods=['DELETE'])
def delete_record(table_name, record_id):
    try:
        if table_name != "users":
            return jsonify({"message": "Table not supported for deletion"}), 400

        record = User.query.get(record_id)
        if not record:
            return jsonify({"message": "Record not found"}), 404

        db.session.delete(record)
        db.session.commit()
        return jsonify({"message": "Record deleted successfully"}), 200
    except SQLAlchemyError as e: # type: ignore
        db.session.rollback()
        return jsonify({"message": "Error deleting record", "details": str(e)}), 500
    

# Ensure database tables are created
@app.route('/api/admin/update-role', methods=['PUT'])
def update_role():
    try:
        data = request.get_json()
        if not data or 'id_number' not in data or 'role' not in data:
            return jsonify({"message": "Invalid data"}), 400

        user = User.query.filter_by(id_number=data['id_number']).first()
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Update the user's role
        user.role = data['role']
        db.session.commit()

        return jsonify({"message": "Role updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update role", "details": str(e)}), 500

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')