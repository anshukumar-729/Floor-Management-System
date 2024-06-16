// src/components/SyncOfflineData.jsx

import React, { useState } from 'react';
import axios from 'axios';

const SyncOfflineData = () => {
  const [layout, setLayout] = useState('');

  const handleSync = async () => {
    try {
      await axios.post('http://localhost:8000/api/sync-floor-plan-versions/', { layout });
      alert('Data synchronized successfully!');
    } catch (error) {
      console.error('Error synchronizing data:', error);
      alert('Failed to sync data. Please try again later.');
      window.location.href = '/login';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Sync Offline Data</h1>
      <form className="space-y-4" onSubmit={handleSync}>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md"
          rows={6}
          value={layout}
          onChange={e => setLayout(e.target.value)}
          placeholder="Enter floor plan layout here..."
          required
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-300"
        >
          Sync Data
        </button>
      </form>
    </div>
  );
};

export default SyncOfflineData;
