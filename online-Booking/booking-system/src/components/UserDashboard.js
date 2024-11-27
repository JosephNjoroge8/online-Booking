import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: { Accept: 'application/json' },
  withCredentials: true, // Ensures cookies and session data are included
});

// Function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    console.error('API Response Error:', error.response);
    const errorMessage = error.response.data.message || 'An error occurred';
    throw new Error(errorMessage);
  } else if (error.request) {
    console.error('API Request Error:', error.request);
    throw new Error('No response from server. Please check your connection.');
  } else {
    console.error('API Setup Error:', error.message);
    throw new Error('Error setting up request. Please try again.');
  }
};

// Function to get user dashboard data
const fetchDashboardData = async () => {
  try {
    const response = await apiClient.get('/auth/dashboard'); // Updated endpoint
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const data = await fetchDashboardData(); // Fetches user-specific dashboard data
        setDashboardData(data); // Set the data for rendering
      } catch (err) {
        console.error('Error loading dashboard data:', err.message || err);
        setError(err.message || 'Failed to load dashboard data');
        navigate('/login'); // Redirect to login page if session validation fails
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>No dashboard data available</p>
          <Link
            to="/login"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">User Dashboard</h1>
            </div>
            <nav className="flex space-x-8">
              <Link to="/booking-form" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Booking Form
              </Link>
              <Link to="/services" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Services
              </Link>
              <Link to="/booking-status" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Booking Status
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {/* User Profile Section */}
            <div className="w-full sm:w-1/4 bg-white shadow-lg rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="h-24 w-24 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-gray-600">
                    {dashboardData.full_name
                      ? dashboardData.full_name.split(' ').map(word => word.charAt(0)).join('')
                      : '?'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{dashboardData.full_name || 'N/A'}</h2>
                <p className="text-sm text-gray-500 mt-1">Registered: {dashboardData.registration_date || 'N/A'}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">ID Number:</span>
                  <span>{dashboardData.id_number || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">Email:</span>
                  <span>{dashboardData.email || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">Parish:</span>
                  <span>{dashboardData.parish || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Welcome Message and Services */}
            <div className="w-full sm:w-3/4 bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome {dashboardData.full_name} to Quovadis Youth Hub Challenge Week 2024
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're excited to have you join us for this transformative experience. 
                Click here to view more of our services or book a session with us.
              </p>
              <Link
                to="/services"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
              >
                View Our Services
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-12">
        {/* Footer content here */}
      </footer>
    </div>
  );
}

export default UserDashboard;
