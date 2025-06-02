// src/pages/BookingPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const BookingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [booking, setBooking] = useState(null);
  const [garage, setGarage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateDays = () => {
    if (!booking?.start_date || !booking?.end_date) return 0;
    const startDate = new Date(booking.start_date);
    const endDate = new Date(booking.end_date);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const calculateTotalPrice = () => {
    if (!garage) return 0;
    return (garage.price * calculateDays()).toFixed(2);
  };

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await fetch(`/api/bookings/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) throw new Error('Error fetching booking');
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBooking();
  }, [bookingId]);

  useEffect(() => {
    const fetchGarage = async () => {
      if (!booking?.garage_id) return;
      try {
        const response = await fetch(`/api/garages/${booking.garage_id}`);
        if (!response.ok) throw new Error('Error fetching garage');
        const data = await response.json();
        setGarage(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (booking) fetchGarage();
  }, [booking]);

  const handleUpdateBookingStatus = async (status) => {
    try {
      if (status === 'confirmed') {
        if (!user || !user.id) throw new Error('User not authenticated.');
        const balanceRes = await fetch(`/api/wallet/${user.id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        const balanceData = await balanceRes.json();
        if (balanceData.success && balanceData.balance < booking.total_price) {
          alert('Insufficient balance.');
          return;
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
        throw new Error(errorData.message || `Error updating status`);
      }

      const updated = await response.json();
      setBooking(updated.booking);
      alert(`Booking status updated to ${status}!`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancelBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Error canceling booking');
      alert('Booking canceled');
      navigate('/garages');
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading || !booking) {
    return <div className="p-6 text-center text-lg">Loading booking...</div>;
  }

  if (error || !garage) {
    return <div className="p-6 text-center text-red-500">{error || 'Garage not found'}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
        <p><strong>ID:</strong> {booking.id}</p>
        <p><strong>Status:</strong> {booking.status}</p>

        <h2 className="text-xl font-semibold mt-6 mb-2">Garage Info</h2>
        <p><strong>Name:</strong> {garage.name}</p>
        <p><strong>Description:</strong> {garage.description}</p>
        <p><strong>Location:</strong> {garage.location}</p>
        <p><strong>Price per day:</strong> ${garage.price}</p>

        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold">Booking Dates</h3>
          <p><strong>Start:</strong> {new Date(booking.start_date).toLocaleDateString()}</p>
          <p><strong>End:</strong> {new Date(booking.end_date).toLocaleDateString()}</p>
        </div>

        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold">Total Price</h3>
          <p>{calculateDays()} days × ${garage.price} = <strong>${calculateTotalPrice()}</strong></p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => navigate('/garages')} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Back</button>

          {user && booking && garage && (
            <>
              {user.id === garage.owner_id && booking.status === 'pending' && (
                <>
                  <button onClick={() => handleUpdateBookingStatus('confirmed')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Confirm</button>
                  <button onClick={() => handleUpdateBookingStatus('rejected')} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                </>
              )}
              {user.id === booking.user_id && booking.status === 'pending' && (
                <button onClick={handleCancelBooking} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Cancel</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
