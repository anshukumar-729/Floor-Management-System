import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { checkAdmin } from '.././utils';

const BookingRequests = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [allocatedRoom, setAllocatedRoom] = useState('');
  const [meetingRooms, setMeetingRooms] = useState([]);

  useEffect(() => {
    if(!localStorage.getItem('accessToken') || !checkAdmin(localStorage.getItem('accessToken'))){
        window.location.href = '/login'; 
    }

    fetchBookingRequests();
    fetchMeetingRooms();
    

  }, []);
  
  const fetchBookingRequests = async () => {
    try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://127.0.0.1:8000/api/booking-requests/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setBookingRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch booking requests:', error);
      window.location.href = '/login';
    }
  };

  const fetchMeetingRooms = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://127.0.0.1:8000/api/meeting-rooms/',{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const availableRooms = response.data.filter(room => room.available);
      setMeetingRooms(availableRooms);
    } catch (error) {
      console.error('Failed to fetch meeting rooms:', error);
      window.location.href = '/login';
    }
  };

  const handleAllocateRoom = async () => {
    const token = localStorage.getItem('accessToken');
    if (selectedRequest && allocatedRoom) {
      try {
        // First, update the room to mark it as unavailable and update other fields
        const selectedRoom = meetingRooms.find(room => room.name === allocatedRoom);
        if (selectedRoom) {
          await axios.patch(`http://127.0.0.1:8000/api/meeting-rooms/${selectedRoom.name}/`, {
            available: false,
            number_of_people: selectedRequest.number_of_people,
            booked_by: selectedRequest.requested_by,
            in_time: selectedRequest.in_time,
            out_time: selectedRequest.out_time
          },{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }

        // Then, update the booking request
        await axios.patch(`http://127.0.0.1:8000/api/booking-requests/${selectedRequest.id}/`, {
          processed: true,
          booked_room: allocatedRoom
        },{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        fetchBookingRequests();
        fetchMeetingRooms();
        setSelectedRequest(null);
        setAllocatedRoom('');
      } catch (error) {
        console.error('Failed to allocate room:', error);
        window.location.href = '/login';
      }
    }
  };

  const handleAllocateAllRooms = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post('http://127.0.0.1:8000/api/allocate-all-rooms/',{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchBookingRequests();
      fetchMeetingRooms();
    } catch (error) {
      console.error('Failed to allocate all rooms:', error);
    }
  };

  // Filter allocated and non-allocated requests
  const allocatedRequests = bookingRequests.filter(request => !!request.booked_room);
  const nonAllocatedRequests = bookingRequests.filter(request => !request.booked_room);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Booking Requests</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2">
          <h3 className="text-lg font-semibold mb-4">Non-Allocated Requests</h3>
          <ul className="border border-gray-200 p-4 rounded-lg">
            {nonAllocatedRequests.map(request => (
              <li
                key={request.id}
                className={`flex justify-between items-center mb-4 p-2 border-b border-gray-300 ${selectedRequest && selectedRequest.id === request.id ? 'bg-green-100' : ''}`}
              >
                <div>
                  <h3 className="text-lg font-semibold">{request.booked_room || "No Room Allocated"}</h3>
                  <p>Requested By: {request.requested_by}</p>
                  <p>Number of People: {request.number_of_people}</p>
                  <p>Start Time: {new Date(request.in_time).toLocaleString()}</p>
                  <p>End Time: {new Date(request.out_time).toLocaleString()}</p>
                </div>
                {!request.processed && (
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    Allocate Room
                  </button>
                )}
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold mb-4 mt-8">Allocated Requests</h3>
          <ul className="border border-gray-200 p-4 rounded-lg">
            {allocatedRequests.map(request => (
              <li
                key={request.id}
                className={`flex justify-between items-center mb-4 p-2 border-b border-gray-300 ${selectedRequest && selectedRequest.id === request.id ? 'bg-green-100' : ''}`}
              >
                <div>
                  <h3 className="text-lg font-semibold">{request.booked_room}</h3>
                  <p>Requested By: {request.requested_by}</p>
                  <p>Number of People: {request.number_of_people}</p>
                  <p>Start Time: {new Date(request.in_time).toLocaleString()}</p>
                  <p>End Time: {new Date(request.out_time).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {selectedRequest && (
          <div className="col-span-1 border border-gray-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Allocate Room</h3>
            <label htmlFor="allocatedRoom" className="block text-sm font-medium text-gray-700 mb-2">Select Room:</label>
            <select
              id="allocatedRoom"
              name="allocatedRoom"
              value={allocatedRoom}
              onChange={(e) => setAllocatedRoom(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
              required
            >
              <option value="">Select Room</option>
              {meetingRooms.map(room => (
                <option key={room.id} value={room.name}>
                  {room.name} (Capacity: {room.capacity})
                </option>
              ))}
            </select>
            <div className="flex justify-end">
              <button onClick={handleAllocateRoom} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
                Allocate
              </button>
              <button onClick={() => setSelectedRequest(null)} className="ml-4 text-gray-600 hover:text-gray-800">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Button to allocate all rooms */}
      <div className="mt-8 text-center">
        <button onClick={handleAllocateAllRooms} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300">
          Allocate All Rooms
        </button>
      </div>
    </div>
  );
};

export default BookingRequests;
