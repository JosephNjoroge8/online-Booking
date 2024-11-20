import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function Register() {
  const navigate = useNavigate(); // Initialize navigate function
  
  // State for form data
  const [userData, setUserData] = useState({
    id_number: '',
    full_name: '',
    email: '',
    parish: '',
    password: '',
  });

  // Handle form field changes
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    // Log the user data to verify it's being populated correctly
    console.log('User Data before submission:', userData);
   
    // Check if all required fields are filled
    if (!userData.full_name || !userData.id_number || !userData.email || !userData.parish || !userData.password) {
      alert('Please fill all required fields.');
      return;
    }
   
    // Create FormData object for sending multipart/form-data
    const formData = new FormData();
    for (const key in userData) {
      if (userData[key]) {
        formData.append(key, userData[key]);
      } else {
        console.error(`Missing field: ${key}`);
      }
    }
   
    // Log the FormData to ensure it is correctly formatted
    for (let pair of formData.entries()) {
      console.log(pair[0]+ ', ' + pair[1]);
    }
   
    try {
      // Call the register API to register the user
      const response = await axios.post('http://127.0.0.1:5000/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Ensure the correct header for FormData
        },
      });
      alert(response.data.message); // Show success message
      
      // After successful registration, navigate to login page
      navigate('/login'); // Assuming '/login' is your login route
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Registration failed. Please try again.');
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