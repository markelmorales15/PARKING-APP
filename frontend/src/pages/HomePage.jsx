// src/pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const HomePage = () => {
  const [garages, setGarages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch mock garage listings
    const fetchGarages = async () => {
      try {
        setIsLoading(true);
        // Simulating API call with setTimeout
        setTimeout(() => {
          const mockGarages = [
            {
              id: '1',
              name: 'Downtown Secure Garage',
              description: 'Well-maintained garage in the heart of downtown. 24/7 security cameras and remote access provided. Perfect for daily commuters.',
              price: 25.00,
              dimensions: '10x20 ft',
              accessType: 'Remote',
              covered: true,
              location: '123 Main St, Downtown',
              photos: ['https://images.unsplash.com/photo-1486006920555-c77dcf18193c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80']
            },
            {
              id: '2',
              name: 'Suburban Parking Space',
              description: 'Clean and spacious garage in a quiet neighborhood. Ideal for medium-sized vehicles with additional storage space available.',
              price: 20.00,
              dimensions: '12x22 ft',
              accessType: 'Keypad',
              covered: true,
              location: '456 Oak Ave, Suburbia',
              photos: ['https://images.unsplash.com/photo-1558349699-f6dd3c78be7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80']
            },
            {
              id: '3',
              name: 'Riverside Carport',
              description: 'Covered carport with security cameras. Great for short-term parking or weekend use. Easy access to major highways.',
              price: 15.00,
              dimensions: '10x18 ft',
              accessType: 'Manual',
              covered: false,
              location: '789 River Rd, Riverside',
              photos: ['https://images.unsplash.com/photo-1565361641430-1f15c3467d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80']
            },
            {
              id: '4',
              name: 'Luxury Condo Garage',
              description: 'Premium underground parking in luxury condominium. Climate controlled with 24/7 concierge. Suitable for luxury vehicles.',
              price: 35.00,
              dimensions: '12x24 ft',
              accessType: 'Key Fob',
              covered: true,
              location: '1010 Parkway Blvd, Eastside',
              photos: ['https://images.unsplash.com/photo-1470224114660-3f6686c562eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80']
            }
          ];
          setGarages(mockGarages);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching garages:', error);
        setIsLoading(false);
      }
    };

    fetchGarages();
  }, []);

  const handleBooking = (garageId) => {
    // Navigate to the booking page with the selected garage ID
    navigate(`/booking/${garageId}`);
  };

  const handleViewAllGarages = () => {
    // Navigate to the garages listing page
    navigate('/garages');
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-xl">Loading garages...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Banner */}
        <div className="mb-10 bg-gradient-to-r from-blue-700 to-blue-900 p-10 rounded-lg shadow-md text-white">
          <h1 className="text-4xl font-bold mb-4">Find secure private garages near you.</h1>
          <p className="text-xl">Rent by the hour, day, or month.</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button 
              onClick={handleViewAllGarages}
              className="px-6 py-3 bg-white text-blue-900 rounded-lg hover:bg-gray-100 transition-colors duration-300 font-medium"
            >
              View All Garages
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
              List Your Garage
            </button>
            <Link to="/dashboard" className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium">
              My Dashboard
            </Link>
          </div>
        </div>

        {/* Featured Garages Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Featured Garages</h2>
            <button 
              onClick={handleViewAllGarages}
              className="text-blue-700 hover:text-blue-900 font-medium flex items-center"
            >
              View All
              <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Garage Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  <p className="text-gray-700 mb-4 line-clamp-2">{garage.description}</p>
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

        {/* How It Works Section */}
        <div className="bg-white p-8 rounded-lg shadow-md mt-10">
          <h2 className="text-2xl font-semibold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Find a Garage</h3>
              <p className="text-gray-600">Search for available garages in your area using our easy-to-use search tool.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 8a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Book & Pay</h3>
              <p className="text-gray-600">Reserve your parking spot online with our secure payment system.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm11 14V6H4v10h12z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Park & Go</h3>
              <p className="text-gray-600">Access your garage using the provided details and enjoy your hassle-free parking.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;