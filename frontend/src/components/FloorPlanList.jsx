// src/components/FloorPlanList.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FloorPlanList = () => {
  const [floorPlans, setFloorPlans] = useState([]);

  useEffect(() => {
    const fetchFloorPlans = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/floor-plans/');
        setFloorPlans(response.data);
      } catch (error) {
        console.error('Error fetching floor plans:', error);
      }
    };

    fetchFloorPlans();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Floor Plans</h1>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {floorPlans.map(floorPlan => (
          <div key={floorPlan.id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold">{floorPlan.name}</h2>
            <p className="text-gray-600">{floorPlan.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FloorPlanList;
