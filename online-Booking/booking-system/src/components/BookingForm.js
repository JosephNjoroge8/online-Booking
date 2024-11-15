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
      {/* Add input fields for each form item */}
      <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Submit</button>
    </form>
  );
}

export default BookingForm;
