// src/pages/BookingPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const BookingPage = () => {
  const { garageId } = useParams();
  const navigate = useNavigate();
  const [garage, setGarage] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate number of days between start and end dates
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  // Calculate total price based on garage price and number of days
  const calculateTotalPrice = () => {
    if (!garage) return 0;
    return (garage.price * calculateDays()).toFixed(2);
  };

  useEffect(() => {
    const fetchGarage = async () => {
      try {
        setIsLoading(true);
        // This would be an actual API call in a production environment
        // For now, we'll use a mock response
        // const response = await fetch(`/api/garages/${garageId}`);
        // const data = await response.json();

        // Mock data for development purposes
        setTimeout(() => {
          const mockGarage = {
            id: garageId,
            name: `Garage #${garageId}`,
            dimensions: '10x20 ft',
            accessType: 'Remote',
            covered: true,
            description: 'Secure private garage with remote entry system',
            price: 25.00,
            location: '123 Main Street, Anytown, USA',
            photos: ['garage-image-1.jpg']
          };

          setGarage(mockGarage);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to fetch garage details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchGarage();
  }, [garageId]);

  const handleConfirmBooking = async () => {
    try {
      // In a real implementation, this would make an API call to create a booking
      // const response = await fetch('/api/bookings', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     garageId,
      //     startDate,
      //     endDate,
      //   }),
      // });
      // const data = await response.json();

      // For now, we'll just show a success message and redirect
      alert('Booking confirmed successfully!');
      navigate('/garages');
    } catch (err) {
      setError('Failed to confirm booking. Please try again later.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-xl">Loading garage details...</div>
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">Book a Garage</h1>
        {garage && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">{garage.name}</h2>
              <p className="text-gray-700 mb-2">{garage.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600"><span className="font-medium">Location:</span> {garage.location}</p>
                  <p className="text-gray-600"><span className="font-medium">Dimensions:</span> {garage.dimensions}</p>
                </div>
                <div>
                  <p className="text-gray-600"><span className="font-medium">Access Type:</span> {garage.accessType}</p>
                  <p className="text-gray-600"><span className="font-medium">Covered:</span> {garage.covered ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <p className="text-gray-800 mt-2 font-medium">Price: ${garage.price}/day</p>
            </div>

            <div className="border-t border-b py-6 my-4">
              <h3 className="text-xl font-semibold mb-4">Select Booking Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2">Start Date</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">End Date</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Booking Summary</h3>
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex justify-between mb-2">
                  <span>Duration:</span>
                  <span>{calculateDays()} day(s)</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Price per day:</span>
                  <span>${garage.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row justify-between">
                <button
                  onClick={() => navigate('/garages')}
                  className="px-4 py-2 mb-4 md:mb-0 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Back to Listings
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;