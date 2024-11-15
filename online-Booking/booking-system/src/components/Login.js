import React, { useState } from 'react';
import { loginUser } from '../api';

function Login() {
  const [credentials, setCredentials] = useState({
    id_number: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(credentials);
      localStorage.setItem('token', response.data.token);
      alert("Logged in successfully!");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <><form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md">
      <input
        type="text"
        name="id_number"
        onChange={handleChange}
        placeholder="ID Number"
        className="p-2 border rounded w-full mb-3" />
 
      <input
        type="password"
        name="password"
        onChange={handleChange}
        placeholder="Password"
        className="p-2 border rounded w-full mb-3" />
    </form>
    <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded align-bottom">Login</button></>
  );
}

export default Login;
