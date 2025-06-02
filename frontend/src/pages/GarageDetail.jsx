import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import calendar styles

const GarageDetail = ({ garage, onClose }) => {
  if (!garage) return null;
  const [bookings, setBookings] = useState([]); // State to hold bookings
  const [isLoadingBookings, setIsLoadingBookings] = useState(true); // Loading state for bookings
  const [bookingError, setBookingError] = useState(null); // Error state for bookings

  const [reviews, setReviews] = useState([]); // State to hold reviews
  const [isLoadingReviews, setIsLoadingReviews] = useState(true); // Loading state for reviews
  const [reviewError, setReviewError] = useState(null); // Error state for reviews

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

        {/* Garage Photo */}
        {garage.photo && (
          <img
            src={garage.photo}
            alt={garage.name}
            className="w-full max-h-64 object-cover rounded mb-6"
          />
        )}

        {/* Garage Details */}
        <div className="space-y-4 text-gray-700">
          <p><strong>Description:</strong> {garage.description}</p>
          <p><strong>Location:</strong> {garage.location}</p>
          <p><strong>Price per day:</strong> ${garage.price.toFixed(2)}</p>
          <p><strong>Dimensions:</strong> {garage.dimensions}</p>
          <p><strong>Access Type:</strong> {garage.accessType}</p>
          <p><strong>Covered:</strong> {garage.covered ? 'Yes' : 'No'}</p>
        </div>

        {/* Reviews Section */}
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

        {/* Availability Calendar */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Availability Calendar</h3>
 {isLoadingBookings && <div>Loading availability...</div>}
 {bookingError && <div className="text-red-600">{bookingError}</div>}
        {!isLoadingBookings && !bookingError && (
 <Calendar
 tileDisabled={({ date, view }) => {
 if (view === 'month') {
              // Check if the date falls within any of the booked ranges
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
 value={null} // We don't need to select a date initially
 selectRange={false} // Prevent range selection for now
 className="react-calendar mx-auto"
 />
 )}
      </div>

        </div>
      </div>

      useEffect(() => {
 const fetchBookings = async () => {
 if (!garage || !garage.id) return;
 try {
 setIsLoadingBookings(true);
 const response = await fetch(`/api/bookings/garage/${garage.id}`);
 if (!response.ok) {
 throw new Error('Failed to fetch booking data');
 }
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
        // Fetch reviews for the garage
 const response = await fetch(`/api/reviews/garage/${garage.id}`);
 if (!response.ok) {
 throw new Error('Failed to fetch review data');
 }
 const data = await response.json();
        // Fetch user details for each review (assuming the review data only has user_id)
 const reviewsWithUsers = await Promise.all(data.reviews.map(async review => {
 try {
 const userResponse = await fetch(`/api/users/${review.user_id}`); // Assuming a user endpoint exists
 const userData = await userResponse.json();
 return { ...review, reviewer_name: `${userData.user.first_name} ${userData.user.last_name}` };
 } catch (userError) {
 console.error('Failed to fetch user for review:', userError);
 return { ...review, reviewer_name: 'Anonymous' }; // Handle cases where user data can't be fetched
 }
 }));
 setReviews(reviewsWithUsers);
 } catch (err) {
 setReviewError(err.message);
 } finally {
 setIsLoadingReviews(false);
 }

 };
 fetchBookings();
      }, [garage]); // Refetch bookings if the garage prop changes
    </div>
  );
};

// Helper function to calculate average rating
const calculateAverageRating = () => {
 if (reviews.length === 0) return 'N/A';
 const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
 return (totalRating / reviews.length).toFixed(1);
};

// Helper function to render stars
const renderStars = (count) => {
 return '★'.repeat(count) + '☆'.repeat(5 - count);
};

export default GarageDetail;