import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ id_number: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.id_number.trim() || !credentials.password.trim()) {
      setErrorMessage('Please fill in both ID number and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/login', credentials, {
        withCredentials: true,
      });

      console.log('Login response:', response.data); // Debug log

      // Redirect to the user dashboard if login is successful
      navigate('/userdashboard');
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        const errorMsg = error.response.data.message;
        setErrorMessage(errorMsg || 'Login failed. Please check your credentials.');
      } else if (error.request) {
        setErrorMessage('No response from server. Please check your internet connection.');
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl mb-6 text-center">Login</h2>

        {errorMessage && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p className="block sm:inline">{errorMessage}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            ID Number
            <input
              type="text"
              name="id_number"
              onChange={handleChange}
              value={credentials.id_number}
              placeholder="Enter your ID number"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-1"
              required
              disabled={isLoading}
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
              value={credentials.password}
              placeholder="Enter your password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline mt-1"
              required
              disabled={isLoading}
            />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;