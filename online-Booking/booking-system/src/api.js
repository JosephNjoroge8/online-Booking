import axios from 'axios';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  withCredentials: true,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Add interceptors for debugging (can be disabled for production)
apiClient.interceptors.request.use(
  (config) => {
    console.log('🔍 Request:', config);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response);
    return response;
  },
  (error) => Promise.reject(error)
);

// Comprehensive error handling function
const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    const status = error.response.status;
    const message = error.response.data.message || error.response.data.error || 'An unexpected error occurred';
    
    switch (status) {
      case 400:
        throw new Error(`Bad Request: ${message}`);
      case 401:
        throw new Error('Unauthorized: Please log in again');
      case 403:
        throw new Error('Forbidden: You do not have permission');
      case 404:
        throw new Error('Not Found: The requested resource does not exist');
      case 500:
        throw new Error('Server Error: Please try again later');
      default:
        throw new Error(message);
    }
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response from server. Check your network connection.');
  } else {
    // Something happened in setting up the request
    throw new Error('Error setting up the request. Please try again.');
  }
};

// Enhanced API Services with more detailed error handling
export const api = {
  get: async (url, params = {}, config = {}) => {
    try {
      const response = await apiClient.get(url, { 
        ...config, 
        params 
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  delete: async (url, config = {}) => {
    try {
      const response = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Specific API Endpoints with Enhanced Error Handling
export const getDashboard = async () => {
  try {
    const response = await api.get('/auth/dashboard');
    
    // Validate response structure
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid dashboard data received');
    }

    return {
      user: response, // Assuming the response contains user dashboard data
      message: 'Dashboard data retrieved successfully'
    };
  } catch (error) {
    console.error('Dashboard Fetch Error:', error);
    throw error;
  }
};

// Other endpoints remain mostly the same, with added error logging
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    
    // Validate login response
    if (!response.user_dashboard) {
      throw new Error('Login failed: No user data received');
    }

    return {
      user: response.user_dashboard,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('Login Error:', error);
    throw error;
  }
};

// Additional utility functions
export const isAuthenticated = async () => {
  try {
    await getDashboard();
    return true;
  } catch (error) {
    return false;
  }
};

export const safelyFetchData = async (fetchFunction) => {
  try {
    return await fetchFunction();
  } catch (error) {
    console.error('Data Fetch Error:', error);
    return null;
  }
};

// Existing endpoints remain the same
export const updateUserProfile = (userId, user) => api.put(`/auth/dashboard/${userId}`, user);
export const logoutUser = () => api.post('/auth/logout');
export const getTableData = (tableName) => api.get(`/admin/tables/${tableName}`);
export const updateRecord = (tableName, recordId, data) => api.put(`/admin/tables/${tableName}/${recordId}`, data);
export const deleteRecord = (tableName, recordId) => api.delete(`/admin/tables/${tableName}/${recordId}`);
export const createNewAdmin = (adminData) => api.post('/admin/create-admin', adminData);
export const getRegisteredUsers = () => api.get('/admin/users');
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);
export const sortUsers = (sortBy = 'full_name') => api.get('/admin/users/sort', { sort_by: sortBy });
export const getDashboardStats = () => api.get('/admin/dashboard-stats');

export default api;