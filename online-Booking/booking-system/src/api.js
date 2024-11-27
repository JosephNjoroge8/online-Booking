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

// Generic error handling function
const handleApiError = (error) => {
  if (error.response) {
    const message = error.response.data.error || 'An error occurred';
    throw new Error(message);
  }
  if (error.request) {
    throw new Error('No response from server. Check your connection.');
  }
  throw new Error('Request setup error. Please try again.');
};

// API Services
export const api = {
  get: async (url, params = {}) => {
    try {
      const response = await apiClient.get(url, { params });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  post: async (url, data = {}) => {
    try {
      const response = await apiClient.post(url, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  put: async (url, data = {}) => {
    try {
      const response = await apiClient.put(url, data);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
  delete: async (url) => {
    try {
      const response = await apiClient.delete(url);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

// Specific API Endpoints
export const getDashboard = () => api.get('/auth/dashboard');
export const updateUserProfile = (userId, userData) => api.put(`/auth/dashboard/${userId}`, userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
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
