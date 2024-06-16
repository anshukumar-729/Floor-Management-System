import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { checkAdmin } from '.././utils';
const MeetingRoomList = () => {
  const [admin, setAdmin] = useState(checkAdmin(localStorage.getItem('accessToken')));
  const [meetingRooms, setMeetingRooms] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    floor: '',
    number_of_people: 0,
    booked_by: '',
    in_time: '',
    out_time: ''
  });
  const [numberOfPeople, setNumberOfPeople] = useState(0);
  const [bookingRoomId, setBookingRoomId] = useState(null);
  const [error, setError] = useState('');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    fetchMeetingRooms();
  }, []);

  const fetchMeetingRooms = async () => {

    try {
      const response = await axios.get('http://127.0.0.1:8000/api/meeting-rooms/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMeetingRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch meeting rooms:', error);
      window.location.href = '/login';
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/meeting-rooms/', {
        "name":formData.name,
        "capacity": formData.capacity,
        "floor":formData.floor,
        "available":true,
        "number_of_people":0,
        "booked_by":"",
        "in_time":null,
        "out_time":null,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({
        name: '',
        capacity: '',
        floor: '',
        number_of_people: 0,
        booked_by: '',
        in_time: '',
        out_time: ''
      });
      fetchMeetingRooms();
    } catch (error) {
      console.error('Failed to add meeting room:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/meeting-rooms/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchMeetingRooms();
    } catch (error) {
      console.error('Failed to delete meeting room:', error);
    }
  };

  const toggleAvailability = async (id, available) => {
    try {
      const updateData = {
        available: available,
        in_time: available ? null : new Date(),  // Set in_time to null if available, or current timestamp if unavailable
        out_time: available ? null : new Date()  // Set out_time to null if available, or current timestamp if unavailable
      };
  
      await axios.patch(`http://127.0.0.1:8000/api/meeting-rooms/${id}/`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchMeetingRooms();  // Refresh meeting rooms list after update
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  };

  const openBookingModal = (id) => {
    setBookingRoomId(id);
    setNumberOfPeople(0);
    setError('');
  };

  const closeBookingModal = () => {
    setBookingRoomId(null);
    setNumberOfPeople(0);
    setError('');
  };

  const handleBookRoom = async () => {
    if (numberOfPeople > 0) {
      const room = meetingRooms.find(room => room.name === bookingRoomId); // Assuming name is used for bookingRoomId
      if (room && numberOfPeople <= room.capacity) {
        try {
          await axios.patch(`http://127.0.0.1:8000/api/meeting-rooms/${bookingRoomId}/`, {
            available: false,
            number_of_people: numberOfPeople,
            booked_by: formData.booked_by,
            in_time: formData.in_time,
            out_time: formData.out_time
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          fetchMeetingRooms();
          closeBookingModal();
        } catch (error) {
          console.error('Failed to book room:', error);
        }
      } else {
        setError(`Number of people exceeds room capacity (${room.capacity})`);
      }
    } else {
      setError('Please enter a valid number of people.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
    {admin && <>
        <h2 className="text-2xl font-bold mb-4">Meeting Rooms</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            required
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="number"
            name="floor"
            placeholder="Floor"
            value={formData.floor}
            onChange={handleInputChange}
            required
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Add Meeting Room
        </button>
      </form>
    </>}
      

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meetingRooms.map(room => (
          <li key={room.name} className="border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">{room.name}</h3>
            <p>Capacity: {room.capacity}</p>
            <p>Floor: {room.floor}</p>
            <p>In Time: {room.in_time ? new Date(room.in_time).toLocaleString() : 'Not set'}</p>
            <p>Out Time: {room.out_time ? new Date(room.out_time).toLocaleString() : 'Not set'}</p>
            {room.available ? (
              <div className="flex items-center mt-2">
                <span className="text-green-500 mr-2">Empty</span>
                {admin && <button onClick={() => openBookingModal(room.name)} className="text-blue-500 hover:underline focus:outline-none">Book</button>}
              </div>
            ) : (
              <div className="flex items-center mt-2">
                <span className="text-red-500 mr-2">Booked ({room.number_of_people} people) by {room.booked_by}</span>
                
                  {admin && <button onClick={() => toggleAvailability(room.name, true)} className="ml-4 text-blue-500 hover:underline focus:outline-none">Mark as Empty</button>}
                
              </div>
            )}
            {admin && <button onClick={() => handleDelete(room.name)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
              Delete
            </button>}
          </li>
        ))}
      </ul>

      {/* Booking Modal */}
      {bookingRoomId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Book Meeting Room</h3>
            <label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700 mb-2">Number of People:</label>
            <input
              type="number"
              id="numberOfPeople"
              name="numberOfPeople"
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
              min="0"
              required
            />
            <label htmlFor="bookedBy" className="block text-sm font-medium text-gray-700 mb-2">Booked By:</label>
            <input
              type="text"
              id="bookedBy"
              name="booked_by"
              value={formData.booked_by}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
              required
            />
            <label htmlFor="inTime" className="block text-sm font-medium text-gray-700 mb-2">In Time:</label>
            <input
              type="datetime-local"
              id="inTime"
              name="in_time"
              value={formData.in_time}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
              required
            />
            <label htmlFor="outTime" className="block text-sm font-medium text-gray-700 mb-2">Out Time:</label>
<input
           type="datetime-local"
           id="outTime"
           name="out_time"
           value={formData.out_time}
           onChange={handleInputChange}
           className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
           required
         />
{error && <p className="text-red-500 text-sm mb-4">{error}</p>}
<div className="flex justify-end">
<button onClick={handleBookRoom} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
Book
</button>
<button onClick={closeBookingModal} className="ml-4 text-gray-600 hover:text-gray-800">
Cancel
</button>
</div>
</div>
</div>
)}
</div>
);
};

export default MeetingRoomList;
