import React from 'react';

function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <div className="logo text-2xl font-bold">BookingSystem</div>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="/courses" className="hover:underline">Courses</a></li>
          <li><a href="/booking" className="hover:underline">Booking</a></li>
          <li><a href="/services" className="hover:underline">Services</a></li>
          <li><input type="text" placeholder="Search" className="p-1 rounded"/></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
