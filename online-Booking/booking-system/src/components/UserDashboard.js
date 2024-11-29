import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboard, isAuthenticated } from '../api'; // Import from updated api.js

function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check authentication first
        const authStatus = await isAuthenticated();
        if (!authStatus) {
          navigate('/login');
          return;
        }

        // Fetch dashboard data
        const dashboardData = await getDashboard();
        
        // Update state with fetched data
        setUserData({
          id_number: dashboardData.id_number,
          name: dashboardData.name, // Changed from full_name
          email: dashboardData.email,
          parish: dashboardData.parish,
          registration_date: dashboardData.registration_date,
          role: dashboardData.role
        });
        setLoading(false);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError(err.message || 'Failed to load user data');
        setLoading(false);

        // Handle specific authentication errors
        if (err.message.includes('Unauthorized')) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  // Loading State
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

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No User Data State
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>No user data available</p>
        </div>
      </div>
    );
  }

  // Render Dashboard (rest of the component remains the same as in the original file)
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-200  shadow-sm">
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

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {/* User Profile Section */}
            <div className="w-1/4 bg-white shadow-lg rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="h-24 w-24 rounded-full bg-gray-300 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl text-gray-600">
                    {user.name ? user.name.charAt(0) : '?'}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{user.name || 'N/A'}</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">ID Number:</span>
                  <span>{user.id_number || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">Email:</span>
                  <span>{user.email || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium mr-2">Parish:</span>
                  <span>{user.parish || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Welcome Message and Services */}
            <div className="w-3/4 bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome {user.full_name} to Quovadis Youth Hub Challenge Week 2024
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-4 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About Quovadis Youth Hub</h3>
              <p className="text-gray-300 text-sm">
                Empowering youth through innovative programs and opportunities for growth and development.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><Link to="/services" className="hover:text-white">Our Services</Link></li>
                <li><Link to="/events" className="hover:text-white">Upcoming Events</Link></li>
                <li><Link to="/resources" className="hover:text-white">Resources</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com/quovadisyouthhub" className="hover:text-blue-400">
                  Facebook
                </a>
                <a href="https://twitter.com/quovadisyouth" className="hover:text-blue-400">
                  Twitter
                </a>
                <a href="https://instagram.com/quovadisyouthhub" className="hover:text-blue-400">
                  Instagram
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>📞 +254 700 000 000</p>
                <p>✉️ info@quovadisyouthhub.com</p>
                <p>📍 Nairobi, Kenya</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300 text-sm">
            <p>&copy; {new Date().getFullYear()} Quovadis Youth Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default UserDashboard;