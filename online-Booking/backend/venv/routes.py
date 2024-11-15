from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from app import app, db
from models import User

# Route to register a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.form.to_dict()  # Get the non-file data
    file = request.files.get('image_url')  # Handle the uploaded file
    
    # Save the file if it exists
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join('uploads', filename))  # Save the file to your desired location
        data['image_url'] = filename  # Store the filename or URL of the saved file
    
    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(
        full_name=data['full_name'],
        id_number=data['id_number'],
        dob=data['dob'],
        phone_number=data['phone_number'],
        image_url=data.get('image_url', ''),  # Optional field
        community=data['community'],
        talent_group=data['talent_group'],
        education_level=data['education_level'],
        course=data['course'],
        employment_status=data['employment_status'],
        email=data['email'],
        password=hashed_password
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"message": "Error registering user", "error": str(e)}), 500

# Route to log in a user
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()

    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"message": "Invalid credentials"}), 401

    return jsonify({"message": "Logged in successfully"}), 200
