import React from 'react';

const PreviousRequests = ({ previousRequests }) => {
  // Filter requests that have allocated rooms
  const allocatedRequests = previousRequests.filter(request => !!request.booked_room);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Previous Requests</h2>
      
      {/* Allocated Requests */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Non-Allocated Requests</h3>
        <ul className="border border-gray-200 p-4 rounded-lg">
          {previousRequests.map(request => (
            !request.booked_room && (
              <li key={request.id} className="flex justify-between items-center mb-4 p-2 border-b border-gray-300">
                <div>
                  <h3 className="text-lg font-semibold">No Room Allocated</h3>
                  <p>Requested By: {request.requested_by}</p>
                  <p>Number of People: {request.number_of_people}</p>
                  <p>Start Time: {new Date(request.in_time).toLocaleString()}</p>
                  <p>End Time: {new Date(request.out_time).toLocaleString()}</p>
                </div>
              </li>
            )
          ))}
        </ul>
      </div>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Allocated Requests</h3>
        <ul className="border border-gray-200 p-4 rounded-lg">
          {allocatedRequests.map(request => (
            <li key={request.id} className="flex justify-between items-center mb-4 p-2 border-b border-gray-300">
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

      {/* Non-Allocated Requests */}
      
    </div>
  );
};

export default PreviousRequests;
