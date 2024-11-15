// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserDashboard from './UserDashboard';

// A mock authentication function to check if the user is logged in
// Replace this with actual authentication logic or API calls
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

function Home() {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  // Function to navigate to login or register pages
  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="home-container">
      {/* Header component */}
     

      <div className="flex justify-center items-center h-screen bg-gray-100">
        {loggedIn ? (
          // Show User Dashboard if the user is logged in
          <UserDashboard />
        ) : (
          // Show Login and Register options if the user is not logged in
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h1 className="text-2xl font-bold mb-4 text-center">Welcome to the Booking System</h1>
            <p className="text-center mb-6">Please log in or register to access your dashboard.</p>
            <div className="flex justify-around">
              <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
