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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Welcome to Your App</h1>
        
        {data ? (
          <div className="bg-gray-100 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Hello, {data.username}!</h2>
            <p className="text-lg text-gray-700 mb-2">Welcome back! {localStorage.getItem('user')}</p>
            
          </div>
        ) : (
          <p className="text-xl text-gray-700 mt-6">Loading...</p>
        )}

        
      </div>
    </div>
  );
};

export default Home;
