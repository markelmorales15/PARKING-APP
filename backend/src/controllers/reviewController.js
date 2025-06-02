// backend/src/controllers/reviewController.js
import Review from '../models/review.js';
import Booking from '../models/booking.js'; // Import Booking model to check booking status

export const createReview = async (req, res) => {
  try {
    const { booking_id, rating, comment } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!booking_id ||
      rating === undefined ||
      comment === undefined ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    // Fetch booking details
    const booking = await Booking.getById(booking_id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if the user is the renter for this booking
    if (booking.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this booking' });
    }

    // Check if the booking status is 'confirmed'
    if (booking.status !== 'confirmed') {
 return res.status(400).json({ success: false, message: 'Only confirmed bookings can be reviewed' });
    }

    // Check if the booking is completed (end date is in the past)
    const endDate = new Date(booking.end_date);
    const now = new Date();
    if (endDate > now) {
      return res.status(400).json({ success: false, message: 'Booking must be completed to leave a review' });
    }

    // Create the review
    const newReview = await Review.create(booking_id, userId, booking.garage_id, rating, comment);

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all reviews and average rating for a garage
export const getGarageReviews = async (req, res) => {
  try {
    const { garageId } = req.params;

    // Fetch all reviews for the given garage ID
    const reviews = await Review.getByGarageId(garageId); // Assuming you'll add a getByGarageId method to Review model

    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / reviews.length;
    }

    res.status(200).json({
      success: true,
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1)) // Return average rounded to 1 decimal place
    });

  } catch (error) {
    console.error('Error fetching garage reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews'
    });
  }
};
      rating === undefined ||
      comment === undefined ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({ success: false, message: 'Invalid input data' });
    }

    // Fetch booking details
    const booking = await Booking.getById(booking_id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if the user is the renter for this booking
    if (booking.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this booking' });
    }

    // Check if a review already exists for this booking
    const existingReview = await Review.findByBookingId(booking_id); // Assuming you'll add this method to Review model
    if (existingReview) {
 return res.status(400).json({ success: false, message: 'Review already exists for this booking' });
    }

    // Check if the booking is completed (end date is in the past)
    const endDate = new Date(booking.end_date);
    const now = new Date();
    if (endDate > now) {
      return res.status(400).json({ success: false, message: 'Booking must be completed to leave a review' });
    }

    // Create the review
    const newReview = await Review.create(booking_id, userId, booking.garage_id, rating, comment);

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all reviews and average rating for a garage
export const getGarageReviews = async (req, res) => {
  try {
    const { garageId } = req.params;

    // Fetch all reviews for the given garage ID
    const reviews = await Review.getByGarageId(garageId); // Assuming you'll add a getByGarageId method to Review model

    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      averageRating = totalRating / reviews.length;
    }

    res.status(200).json({
      success: true,
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1)) // Return average rounded to 1 decimal place
    });

  } catch (error) {
    console.error('Error fetching garage reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews'
    });
  }
};
// backend/src/controllers/reviewController.js
import Review from '../models/review.js';
import Booking from '../models/booking.js'; // Import Booking model to check booking status

export const createReview = async (req, res) => {
  try {
    const { booking_id, rating, comment } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!booking_id ||