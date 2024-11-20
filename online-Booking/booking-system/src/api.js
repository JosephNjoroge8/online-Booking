import axios from 'axios';

// Base URL for the API
const API_URL = 'http://127.0.0.1:5000';

// Create an axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    Accept: 'application/json',
  },
});

// Error handling function with better logging for debugging
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with a status outside the 2xx range
    console.error('API Response Error:', error.response);
    const errorMessage = error.response.data.error || 'An error occurred';
    throw new Error(errorMessage);
  } else if (error.request) {
    // No response received from the server
    console.error('API Request Error:', error.request);
    throw new Error('No response from server. Please check your connection.');
  } else {
    // Request setup triggered an error
    console.error('API Setup Error:', error.message);
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
    const response = await axios.post(`${API_URL}/register`, formData, {
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

// Login function with token storage
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Save the token if login is successful
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);  // Store token in localStorage
    }

    return response;
  } catch (error) {
    console.error('Login error:', error.response?.data);
    throw error;
  }
};

// Function to get user profile with token authorization
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

// Function to update user profile with token authorization
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

// Function to check admin authentication status
export const checkAdminAuth = async (token) => {
  try {
    const response = await apiClient.get('/api/admin/check-auth', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Admin Authentication error:', error);
    handleApiError(error);  // Handle error
    throw error;  // Rethrow the error for further handling
  }
};

// Export all functions as part of the api object
const api = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  checkAdminAuth,  // Add the checkAdminAuth function
};

export default api;
