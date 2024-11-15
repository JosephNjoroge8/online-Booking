// src/components/BookingStatus.js
import React from 'react';

function BookingStatus() {
  // Mock booking data (replace with data fetched from your backend)
  const bookings = [
    {
      id: 1,
      session: "Music Practice",
      date: "2024-11-15",
      status: "Confirmed",
      expiry: "2024-11-20",
    },
    {
      id: 2,
      session: "Drama Rehearsal",
      date: "2024-11-17",
      status: "Pending",
      expiry: "2024-11-22",
    },
    {
      id: 3,
      session: "Dance Class",
      date: "2024-11-18",
      status: "Expired",
      expiry: "2024-11-23",
    },
  ];

  return (
    <div className="booking-status bg-white shadow-md rounded p-6">
      <h2 className="text-2xl font-bold mb-4">Booking Status</h2>
      
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border">Session</th>
            <th className="py-2 px-4 border">Date</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Expiry</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="py-2 px-4 border">{booking.session}</td>
              <td className="py-2 px-4 border">{booking.date}</td>
              <td className="py-2 px-4 border">{booking.status}</td>
              <td className="py-2 px-4 border">{booking.expiry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingStatus;
