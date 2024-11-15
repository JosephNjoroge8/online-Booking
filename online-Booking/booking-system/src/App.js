// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import BookingForm from './components/BookingForm';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import BookingStatus from './components/BookingStatus';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Header component with logo and navigation links */}
        <Header />
        
        <div className="container mx-auto p-4">
          {/* Routes for navigating between different pages */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/booking-form" element={<BookingForm />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/booking-status" element={<BookingStatus />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
