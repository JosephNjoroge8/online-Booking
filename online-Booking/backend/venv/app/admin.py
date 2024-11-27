from flask import Blueprint, request, jsonify, session
from .models import db, Admin, QuoRegister
from sqlalchemy.exc import IntegrityError
from functools import wraps

# Admin blueprint
admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

# Admin login route
@admin_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    admin = Admin.query.filter_by(email=email).first()
    if admin and admin.check_password(password):
        session['admin_id'] = admin.id
        return jsonify({"message": "Login successful", "admin_id": admin.id})
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# Admin logout route
@admin_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('admin_id', None)
    return jsonify({"message": "Logout successful"})

# Create a new admin (Only Main Admin)
@admin_bp.route('/create-admin', methods=['POST'])
def create_admin():
    if 'admin_id' not in session:
        return jsonify({"message": "Unauthorized"}), 401

    current_admin = Admin.query.get(session['admin_id'])
    if not current_admin or not current_admin.is_main_admin:
        return jsonify({"message": "Only main admins can create new admins"}), 403

    data = request.json
    new_admin = Admin(
        username=data['username'],
        id_number=data['id_number'],
        email=data['email'],
        phone_number=data['phone_number'],
        is_main_admin=data.get('is_main_admin', False)
    )
    new_admin.set_password(data['password'])

    db.session.add(new_admin)
    db.session.commit()
    return jsonify({"message": "Admin created successfully"})

# View all registered users
@admin_bp.route('/users', methods=['GET'])
def get_users():
    if 'admin_id' not in session:
        return jsonify({"message": "Unauthorized"}), 401

    users = QuoRegister.query.all()
    users_list = [user.to_dict() for user in users]

    return jsonify(users_list)

# Delete a user
@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    if 'admin_id' not in session:
        return jsonify({"message": "Unauthorized"}), 401

    user = QuoRegister.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"})

# Sort users (by name or registration date)
@admin_bp.route('/users/sort', methods=['GET'])
def sort_users():
    if 'admin_id' not in session:
        return jsonify({"message": "Unauthorized"}), 401

    sort_by = request.args.get('sort_by', 'full_name')  # Default sorting by full_name
    if sort_by == 'full_name':
        users = QuoRegister.query.order_by(QuoRegister.full_name).all()
    elif sort_by == 'registration_date':
        users = QuoRegister.query.order_by(QuoRegister.registration_date).all()
    else:
        return jsonify({"message": "Invalid sort option"}), 400

    users_list = [user.to_dict() for user in users]
    return jsonify(users_list)