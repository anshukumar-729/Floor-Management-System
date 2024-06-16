import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoomRequestForm from './RoomRequestForm';
import PreviousRequests from './PreviousRequests';

const Requests = () => {
  const [bookingRequests, setBookingRequests] = useState([]);
  const loggedInUser = {
    "username": localStorage.getItem('user')
  }
  useEffect(() => {
    fetchBookingRequests();
  }, []);

  const fetchBookingRequests = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/booking-requests/', {
        params: {
          requested_by: loggedInUser.username // Adjust according to your backend API
        }
      });
      setBookingRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch booking requests:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <RoomRequestForm fetchBookingRequests={fetchBookingRequests} loggedInUser={loggedInUser} />
      <PreviousRequests previousRequests={bookingRequests} />
    </div>
  );
};

export default Requests;
