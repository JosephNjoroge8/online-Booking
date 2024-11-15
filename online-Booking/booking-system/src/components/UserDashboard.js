// src/components/UserDashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const navigate = useNavigate();

  // Mock user data (replace with data fetched from your backend)
  const userData = {
    fullName: "John Doe",
    idNumber: "12345678",
    phoneNumber: "+254700000000",
    email: "johndoe@example.com",
    registeredGroups: ["Music", "Drama"],
    bookingCount: 3,
  };

  // Navigation handlers
  const handleViewBookingStatus = () => {
    navigate('/booking-status');
  };

  const handleManageBookings = () => {
    navigate('/booking');
  };

  return (
    <div className="user-dashboard bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {userData.fullName}!</h2>
      
      <div className="mb-4">
        <p><strong>ID Number:</strong> {userData.idNumber}</p>
        <p><strong>Phone Number:</strong> {userData.phoneNumber}</p>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Registered Groups:</strong> {userData.registeredGroups.join(", ")}</p>
        <p><strong>Total Bookings:</strong> {userData.bookingCount}</p>
      </div>
      
      <div className="flex space-x-4">
        <button
          onClick={handleViewBookingStatus}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          View Booking Status
        </button>
        <button
          onClick={handleManageBookings}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Manage Bookings
        </button>
      </div>
    </div>
  );
}

export default UserDashboard;
