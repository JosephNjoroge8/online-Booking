import re
from flask import current_app, request, session, jsonify

def validate_email(email):
    """
    Validate the email address format using a regex.
    """
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(pattern, email) is not None

def verify_session():
    """
    Verifies if the user is authenticated via session.
    """
    try:
        # Check if user data exists in the session
        if 'user_id' not in session:
            return None, {"message": "User is not logged in or session has expired"}

        # Retrieve user data from the session
        id_number = session.get('id_number')
        full_name = session.get('full_name')
        role = session.get('role')

        # Return user details
        return {
            "id_number": id_number,
            "full_name": full_name,
            "role": role
        }, None

    except Exception as e:
        current_app.logger.error(f"Unexpected session error: {str(e)}")  # Log unexpected errors
        return None, {"message": f"Unexpected error during session verification: {str(e)}"}

def verify_admin_session():
    """
    Verifies if the user has admin privileges via session.
    """
    user_data, error = verify_session()
    if error:
        return None, error

    # Check if the user role is admin
    if user_data.get('role') != 'admin':
        return None, {"message": "Admin privileges are required"}

    return user_data, None
