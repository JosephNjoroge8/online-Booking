import React, { useState } from 'react';
import { registerUser } from '../api'; // Ensure this API call is correctly set up to send a POST request to your Flask backend

function Register() {
  const [formData, setFormData] = useState({
    full_name: '',
    id_number: '',
    dob: '',
    phone_number: '',
    image_url: null, // Start with null for file upload
    community: '',
    talent_group: '',
    education_level: '',
    course: '',
    employment_status: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, image_url: e.target.files[0] }); // Set the file object
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle the data (including the file)
    const data = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    }

    try {
      const response = await registerUser(data); // Pass FormData to the API
      alert(response.data.message); // Success message from the backend
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-blue-50 rounded shadow-emerald-100">
      <input
        type="text"
        name="full_name"
        value={formData.full_name}
        onChange={handleChange}
        placeholder="Full Name"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="number"
        name="id_number"
        value={formData.id_number}
        onChange={handleChange}
        placeholder="ID Number"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="date"
        name="dob"
        value={formData.dob}
        onChange={handleChange}
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="number"
        name="phone_number"
        value={formData.phone_number}
        onChange={handleChange}
        placeholder="Phone Number"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="file"
        name="image_url"
        onChange={handleChange}
        className="p-2 border rounded mb-2 w-full"
      />
      <input
        type="text"
        name="talent_group"
        value={formData.talent_group}
        onChange={handleChange}
        placeholder="Talent Group"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="text"
        name="education_level"
        value={formData.education_level}
        onChange={handleChange}
        placeholder="Education Level"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="text"
        name="course"
        value={formData.course}
        onChange={handleChange}
        placeholder="Course"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="text"
        name="employment_status"
        value={formData.employment_status}
        onChange={handleChange}
        placeholder="Employment Status"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="text"
        name="community"
        value={formData.community}
        onChange={handleChange}
        placeholder="Community"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="p-2 border rounded mb-2 w-full"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
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
