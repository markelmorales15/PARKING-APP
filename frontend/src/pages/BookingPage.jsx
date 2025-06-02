// src/pages/BookingPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from '../context/AuthContext';

const BookingPage = () => {
  const { bookingId } = useParams(); // Assuming the route is now /booking/:bookingId
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Get the current user from context

  const [booking, setBooking] = useState(null);
  const [garage, setGarage] = useState(null); // Still need garage details for display

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

  // Fetch booking details when the component mounts or bookingId changes
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch the specific booking using the bookingId
        const response = await fetch(`/api/bookings/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
          }
        });

        if (!response.ok) {
          throw new Error(`Error fetching booking details: ${response.statusText}`);
        }

        const bookingData = await response.json();
      } catch (err) {
        setError('Failed to fetch garage details. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchGarage();
  }, [bookingId, user?.id]); // Refetch if bookingId or user changes

  // Fetch garage details once booking is loaded
  useEffect(() => {
    if (booking && booking.garage_id) {
      const fetchGarageDetails = async () => {
        try {
          const response = await fetch(`/api/garages/${booking.garage_id}`);
          if (!response.ok) {
            throw new Error(`Error fetching garage details: ${response.statusText}`);
          }
          const garageData = await response.json();
          setGarage(garageData);
          setIsLoading(false); // Set loading false after fetching both
        } catch (err) {
          setError('Failed to fetch garage details. Please try again later.');
          setIsLoading(false);
        }
      };
      fetchGarageDetails();
    } else if (!booking && !isLoading) {
       // If booking is null and not loading, it means booking wasn't found
       setIsLoading(false);
    }
  }, [booking, isLoading]);

  const handleUpdateBookingStatus = async (status) => {
    try {
 if (status === 'confirmed') {
 // Fetch the logged-in user's wallet balance
 if (!user || !user.id) {
 throw new Error('User not authenticated.');
      }

 const balanceResponse = await fetch(`/api/wallet/${user.id}`, {
 headers: {
 'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      });
 const balanceData = await balanceResponse.json();

 if (balanceData.success && balanceData.balance < booking.total_price) {
 alert('Insufficient balance.');
 return; // Prevent status update if balance is insufficient
      }
    }
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error updating booking status: ${response.statusText}`);
      }

      const updatedBooking = await response.json();
      setBooking(updatedBooking.booking); // Update the booking state with the new status
      alert(`Booking status updated to ${status}!`);
    } catch (err) {
      setError(`Failed to update booking status: ${err.message}`);
    }
  };

  const handleCancelBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error cancelling booking: ${response.statusText}`);
      }

      // For now, we'll just show a success message and redirect
      alert('Booking confirmed successfully!');
      navigate('/garages');
    } catch (err) {
      setError('Failed to confirm booking. Please try again later.');
    }
  };

  if (isLoading || !booking) { // Show loading while fetching booking or if booking is null
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-xl">Loading garage details...</div>
      </div>
    );
  }

  if (error || !garage) { // Show error if fetching failed or garage details are missing
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
        {/* Display booking details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
           <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
           <p className="text-gray-700 mb-2"><span className="font-medium">Booking ID:</span> {booking.id}</p>
           <p className="text-gray-700 mb-2"><span className="font-medium">Status:</span> {booking.status}</p>
           {/* Display garage details related to the booking */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Garage: {garage.name}</h2>
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

             {/* Display selected booking dates */}
             <div className="border-t border-b py-6 my-4">
               <h3 className="text-xl font-semibold mb-4">Booked Dates</h3>
               <p className="text-gray-700 mb-2"><span className="font-medium">Start Date:</span> {new Date(booking.start_date).toLocaleDateString()}</p>
               <p className="text-gray-700"><span className="font-medium">End Date:</span> {new Date(booking.end_date).toLocaleDateString()}</p>
             </div>

             {/* Display booking price */}
             <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Price</h3>
              <div className="bg-gray-50 p-4 rounded">
                <div className="flex justify-between mb-2">
                  <span>Duration:</span>
                  <span>{calculateDays()} day(s)</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Price per Day:</span>
                  <span>${garage.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
              </div>

              {/* Action buttons based on user role and booking status */}
              <div className="mt-6 flex flex-col md:flex-row justify-between">
                <button
                  onClick={() => navigate('/garages')}
                  className="px-4 py-2 mb-4 md:mb-0 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Back to Bookings
                </button>

                {/* Render buttons based on status and ownership */}
                {user && booking && garage && (
                  <>
                     {/* Garage Owner Actions */}
                    {user.id === garage.owner_id && booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateBookingStatus('confirmed')}
                          className="ml-0 md:ml-4 px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                          Confirm Booking
                        </button>
                        <button
                          onClick={() => handleUpdateBookingStatus('rejected')}
                          className="ml-0 md:ml-4 px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                        >
                          Reject Booking
                        </button>
                      </>
                    )}

                    {/* Renter Action */}
                    {user.id === booking.user_id && booking.status === 'pending' && (
                       <button
                         onClick={handleCancelBooking}
                         className="ml-0 md:ml-4 px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                       >
                         Cancel Booking
                       </button>
                     )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;