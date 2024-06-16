// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Home from './Home';
import Nav from './Nav';
import Login from './Login';
import Register from './Register';
import FloorPlanList from './components/FloorPlanList';
import MeetingRoomList from './components/MeetingRoomList';
import SyncOfflineData from './components/SyncOfflineData';
import BookingRequests from './components/BookingRequests';
import Requests from './components/Requests';
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Nav/>
        </header>
        <main>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/floor-plan" element={<FloorPlanList />} />
            <Route path="/room-list" element={<MeetingRoomList />} />
            <Route path="/booking-requests" element={<BookingRequests />} />
            <Route path='/requests' element={<Requests/>}/>
          </Routes> 
        </main>
      </div>
    </Router>
  );
}

export default App;
