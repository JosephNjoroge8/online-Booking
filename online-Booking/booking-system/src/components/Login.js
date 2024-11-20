import React, { useState } from 'react';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    id_number: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMessage(''); // Clear any previous error messages
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await loginUser(credentials);

      // Extract role from response
      const { token, role } = response.data;

      // Store token and role in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user_id', credentials.id_number);

      // Redirect based on role
      if (role === 'Admin') {
        navigate('/admindashboard');
      } else if (role === 'User') {
        navigate('/userdashboard');
      } else {
        navigate('/home'); // Fallback redirect
      }
    } catch (error) {
      console.error("Error logging in:", error);

      // Set error message based on the type of error
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Login failed. Please check your credentials.');
      } else if (error.request) {
        setErrorMessage('No response from server. Please check your internet connection.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-6 text-center">Login</h2>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            {errorMessage}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            ID Number
            <input
              type="text"
              name="id_number"
              onChange={handleChange}
              placeholder="ID Number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </label>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </label>
        </div>
        
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
