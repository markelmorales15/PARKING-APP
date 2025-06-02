// src/pages/GarageListing.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GarageListing = () => {
  const [garages, setGarages] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch garage listings from backend API
    const fetchGarages = async () => {
      try {
        setError(null); // Clear previous errors
        setIsLoading(true);

        const response = await fetch('/api/garages');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setGarages(data);
      } catch (error) {
        console.error('Error fetching garages:', error);
        setError('Failed to load garages. Please try again later.'); // Set user-friendly error message
      } finally {
          setIsLoading(false);
      }
    };

    fetchGarages();
  }, []);

  const handleBooking = (garageId) => {
    // Navigate to the booking page with the selected garage ID
    navigate(`/booking/${garageId}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-xl">Loading garages...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Welcome to Private Garage Rental</h1>
          <p className="text-xl text-gray-600">Find secure private garages near you. Rent by the hour, day, or month.</p>
        </div>
        
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Available Garages</h2>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {garages.map((garage) => (
            <div key={garage.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 overflow-hidden">
                <img 
                  src={garage.photos[0]} 
                  alt={garage.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{garage.name}</h3>
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-gray-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 text-sm">{garage.location}</span>
                </div>
                <div className="flex items-center mb-4">
                  <svg className="w-5 h-5 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-600 font-medium">${garage.price.toFixed(2)}/day</span>
                </div>
                <p className="text-gray-700 mb-4">{garage.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">{garage.accessType} Access</span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">{garage.dimensions}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">{garage.covered ? 'Covered' : 'Uncovered'}</span>
                </div>
                <button
                  onClick={() => handleBooking(garage.id)}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GarageListing;