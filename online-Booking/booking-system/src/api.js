import axios from 'axios';

// Define the base URL of your Flask API
const API_URL = 'http://127.0.0.1:5000'; // Ensure there are no spaces or typos here

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    // Create a new FormData object
    const formData = new FormData();

    // Loop through the userData and append each field to the FormData object
    for (const key in userData) {
      if (userData[key]) {
        formData.append(key, userData[key]);
      }
    }

    // Send the formData as a POST request with 'Content-Type': 'multipart/form-data'
    const response = await axios.post(`${API_URL}/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Required for file upload
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Other API functions remain the same...


// Function to log in a user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

// Function to get all bookings (for admin use)
export const getBookings = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

// Add more API functions as needed
