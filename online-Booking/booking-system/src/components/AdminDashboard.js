import React, { useEffect, useState } from 'react';
import { getBookings } from '../api';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings(token);
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id} className="p-2 border-b">
            User ID: {booking.user_id} | Session: {booking.session_details} | Status: {booking.status}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;
