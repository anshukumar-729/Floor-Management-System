import React, { useState } from 'react';
import axios from 'axios';

const RoomRequestForm = ({ fetchBookingRequests, loggedInUser }) => {
    const token = localStorage.getItem('accessToken');
  const [formData, setFormData] = useState({
    requested_by: loggedInUser.username, // Assuming username is used
    number_of_people: 0,
    in_time: '',
    out_time: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/booking-requests/', formData,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
      });
      setFormData({
        requested_by: loggedInUser.username,
        number_of_people: 0,
        in_time: '',
        out_time: ''
      });
      fetchBookingRequests(); // Refresh booking requests after submission
    } catch (error) {
      console.error('Failed to add room request:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Submit Room Request</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="requested_by" className="block text-sm font-medium text-gray-700">Requested By:</label>
          <input
            type="text"
            id="requested_by"
            name="requested_by"
            value={formData.requested_by}
            readOnly
            className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="number_of_people" className="block text-sm font-medium text-gray-700">Number of People:</label>
          <input
            type="number"
            id="number_of_people"
            name="number_of_people"
            value={formData.number_of_people}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="in_time" className="block text-sm font-medium text-gray-700">Start Time:</label>
          <input
            type="datetime-local"
            id="in_time"
            name="in_time"
            value={formData.in_time}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="out_time" className="block text-sm font-medium text-gray-700">End Time:</label>
          <input
            type="datetime-local"
            id="out_time"
            name="out_time"
            value={formData.out_time}
            onChange={handleInputChange}
            className="p-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">Submit Request</button>
      </form>
    </div>
  );
};

export default RoomRequestForm;
