import React, { useState } from 'react';

function BookingForm() {
  const [formData, setFormData] = useState({
    full_name: '',
    id_number: '',
    dob: '',
    phone_number: '',
    image_url: '',
    community: '',
    talent_group: '',
    education_level: '',
    course: '',
    employment_status: ''
  });

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded shadow-md">
      <label>
        Full Name:
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </label>
      
      <label>
        ID Number:
        <input
          type="text"
          name="id_number"
          value={formData.id_number}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </label>
      
      <label>
        Date of Birth:
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </label>

      {/* Add similar inputs for the other formData fields */}

      <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
        Submit
      </button>
    </form>
  );
}

export default BookingForm;
