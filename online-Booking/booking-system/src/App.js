import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import BookingForm from "./components/BookingForm";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import BookingStatus from "./components/BookingStatus";
import AdminLogin from "./components/AdminLogin";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route with Header and Home */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />

          {/* Routes for user functionalities */}
          <Route
            path="/register"
            element={
              <>
                <Header />
                <Register />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Header />
                <Login />
              </>
            }
          />
          <Route path="/booking-form" element={<BookingForm />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/booking-status" element={<BookingStatus />} />

          {/* Routes for admin functionalities under /admin */}
          <Route path="/admin" element={
            <>
            <Header />
            < AdminLogin/>
             </>
             } 
             />
          <Route path="/dashboard" element={
            <>
            <Header />
            <AdminDashboard/> 
            </>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
