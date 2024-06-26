// src/Nav.js

import React, { useState } from 'react';
import { checkAdmin } from './utils';

const Nav = () => {
  const [admin, setAdmin] = useState(checkAdmin(localStorage.getItem('accessToken')));

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    // Redirect to login page after logout
    
    window.location.href = '/login';  // Redirects to the login page
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          
          <div className="flex space-x-4">
            {admin &&
                   <a href="/booking-requests/" className="text-white hover:text-gray-300">Booking Requests</a>
               }
            {!admin && <a href="/requests/" className="text-white hover:text-gray-300">My Requests</a>}
            {/* <a href="/floor-plan/" className="text-white hover:text-gray-300">Floor Planning</a> */}
            <a href="/room-list/" className="text-white hover:text-gray-300">Room List</a>
            
          </div>
        </div>
        <div className="flex items-center">
          {/* Conditional rendering based on authentication state */}
          {localStorage.getItem('accessToken') ? (
            <>
              <button onClick={handleLogout} className="text-white mr-4 hover:text-gray-300">Logout</button>
            </>
          ) : (
            <>
              <a href="/login/" className="text-white mr-4 hover:text-gray-300">Login</a>
              <a href="/register/" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300">Sign Up</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
