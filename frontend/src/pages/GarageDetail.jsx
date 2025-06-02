import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const GarageDetail = ({ garage, onClose }) => {
  if (!garage) return null;

  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!garage || !garage.id) return;
      try {
        setIsLoadingBookings(true);
        const response = await fetch(`/api/bookings/garage/${garage.id}`);
        if (!response.ok) throw new Error('Failed to fetch booking data');
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setBookingError(err.message);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    const fetchReviews = async () => {
      if (!garage || !garage.id) return;
      try {
        setIsLoadingReviews(true);
        const response = await fetch(`/api/reviews/garage/${garage.id}`);
        if (!response.ok) throw new Error('Failed to fetch review data');
        const data = await response.json();
        const reviewsWithUsers = await Promise.all(
          data.reviews.map(async (review) => {
            try {
              const userResponse = await fetch(`/api/users/${review.user_id}`);
              const userData = await userResponse.json();
              return {
                ...review,
                reviewer_name: `${userData.user.first_name} ${userData.user.last_name}`,
              };
            } catch (userError) {
              console.error('Failed to fetch user for review:', userError);
              return { ...review, reviewer_name: 'Anonymous' };
            }
          })
        );
        setReviews(reviewsWithUsers);
      } catch (err) {
        setReviewError(err.message);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchBookings();
    fetchReviews();
  }, [garage]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 'N/A';
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const renderStars = (count) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative overflow-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl font-bold"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-6">{garage.name}</h2>

        {garage.photo && (
          <img
            src={garage.photo}
            alt={garage.name}
            className="w-full max-h-64 object-cover rounded mb-6"
          />
        )}

        <div className="space-y-4 text-gray-700">
          <p><strong>Description:</strong> {garage.description}</p>
          <p><strong>Location:</strong> {garage.location}</p>
          <p><strong>Price per day:</strong> ${garage.price.toFixed(2)}</p>
          <p><strong>Dimensions:</strong> {garage.dimensions}</p>
          <p><strong>Access Type:</strong> {garage.accessType}</p>
          <p><strong>Covered:</strong> {garage.covered ? 'Yes' : 'No'}</p>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4 border-b border-gray-300 pb-2">Reviews and Ratings</h3>
          {isLoadingReviews && <div>Loading reviews...</div>}
          {reviewError && <div className="text-red-600">{reviewError}</div>}
          {!isLoadingReviews && !reviewError && (
            <>
              <p className="mb-4"><strong>Average Rating:</strong> {calculateAverageRating()}</p>
              <ul className="space-y-4">
                {reviews.map(review => (
                  <li key={review.id} className="p-4 bg-gray-50 rounded-md shadow">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{review.reviewer_name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className="text-yellow-400 font-semibold text-lg">{renderStars(review.rating)}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">Availability Calendar</h3>
          {isLoadingBookings && <div>Loading availability...</div>}
          {bookingError && <div className="text-red-600">{bookingError}</div>}
          {!isLoadingBookings && !bookingError && (
            <Calendar
              tileDisabled={({ date, view }) => {
                if (view === 'month') {
                  return bookings.some(booking => {
                    const startDate = new Date(booking.startDate);
                    const endDate = new Date(booking.endDate);
                    startDate.setHours(0, 0, 0, 0);
                    endDate.setHours(23, 59, 59, 999);
                    return date >= startDate && date <= endDate;
                  });
                }
                return false;
              }}
              value={null}
              selectRange={false}
              className="react-calendar mx-auto"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GarageDetail;
