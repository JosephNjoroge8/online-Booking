import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id_number: '',
    full_name: '',
    email: '',
    parish: '',
    password: '',
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field validation
    if (!userData.full_name || !userData.id_number || !userData.email || !userData.parish || !userData.password) {
      alert('Please fill all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (userData.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    try {
      // Send data to backend to register the user
      const response = await axios.post('http://127.0.0.1:5000/auth/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Send cookies along with the request
      });

      alert(response.data.message); // Show success message

      // Now, login the user after successful registration
      const loginResponse = await axios.post('http://127.0.0.1:5000/auth/login', {
        id_number: userData.id_number,
        password: userData.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true, // Ensure the session cookie is sent with the request
      });

      alert(loginResponse.data.message); // Success message after login
      navigate('/userdashboard'); // Redirect to user dashboard after login
    } catch (error) {
      console.error('Error registering or logging in user:', error);
      alert(
        error.response?.data?.message || 'Registration or login failed. Please try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-blue-50 rounded shadow-emerald-100">
      <input
        type="text"
        name="id_number"
        value={userData.id_number}
        onChange={handleChange}
        placeholder="ID Number"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="text"
        name="full_name"
        value={userData.full_name}
        onChange={handleChange}
        placeholder="Full Name"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="email"
        name="email"
        value={userData.email}
        onChange={handleChange}
        placeholder="Email"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="text"
        name="parish"
        value={userData.parish}
        onChange={handleChange}
        placeholder="Parish"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="password"
        name="password"
        value={userData.password}
        onChange={handleChange}
        placeholder="Password"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Register
      </button>
    </form>
  );
}

export default Register;
