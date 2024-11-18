import axios from 'axios';

// Base URL for the API
const API_URL = 'http://127.0.0.1:5000';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    Accept: 'application/json',
  },
});

// Error handling function
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with a status outside the 2xx range
    const errorMessage = error.response.data.error || 'An error occurred';
    throw new Error(errorMessage);
  } else if (error.request) {
    // No response received from the server
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Request setup triggered an error
    throw new Error('Error setting up request. Please try again.');
  }
};

// Function to register a new user (No image handling)
export const registerUser = async (userData) => {
  try {
    const formData = new FormData();
    
    // Append data to FormData object
    formData.append('full_name', userData.full_name);
    formData.append('id_number', userData.id_number);
    formData.append('email', userData.email);
    formData.append('parish', userData.parish);
    formData.append('password', userData.password);

    // Directly use axios to post the formData
    const response = await axios.post('http://127.0.0.1:5000/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure correct content type for FormData
      },
    });

    return response.data;  // Return response data
  } catch (error) {
    console.error('Error occurred during registration:', error);
    handleApiError(error);  // Call the error handler
    throw error; // Re-throw the error for further handling
  }
};

// Function to log in a user
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to get user profile
export const getUserProfile = async (userId, token) => {
  try {
    const response = await apiClient.get(`/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to update user profile
export const updateUserProfile = async (userId, userData, token) => {
  try {
    let data;
    let headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

    // If updating with a file, use FormData
    if (userData.image_url) {
      data = new FormData();
      Object.keys(userData).forEach((key) => {
        if (userData[key] !== null && userData[key] !== undefined) {
          data.append(key, userData[key]);
        }
      });
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      // Use JSON for text data
      data = userData;
    }

    // Send PUT request to update the user profile
    const response = await apiClient.put(`/users/${userId}`, data, { headers });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Export all functions as part of the api object
const api = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
};

export default api;
