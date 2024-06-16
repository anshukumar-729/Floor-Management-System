// src/Home.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/home/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        window.location.href = '/login';
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your App</h1>
        
        {data ? (
          <div className="bg-gray-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Data from API:</h2>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          </div>
        ) : (
          <p className="text-lg text-gray-600 mt-4">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Home;
