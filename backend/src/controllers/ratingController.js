import Rating from '../models/rating.js';
import Booking from '../models/booking.js';
import pool from '../config/db.js';

// Create a new rating
export const createRating = async (req, res) => {
  try {
    const { garageId, rating, comment } = req.body;
    const userId = req.user.id;
    
    if (!garageId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid garage ID and rating (1-5) are required' 
      });
    }
    
    // Check if user has booked this garage before (optional)
    const checkBookingQuery = `
      SELECT id FROM bookings 
      WHERE user_id = $1 AND garage_id = $2 AND status = 'confirmed'
      LIMIT 1
    `;
    
    const bookingResult = await pool.query(checkBookingQuery, [userId, garageId]);
    
    if (bookingResult.rows.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'You can only rate garages you have booked' 
      });
    }
    
    // Check if user has already rated this garage
    const checkRatingQuery = 'SELECT id FROM ratings WHERE user_id = $1 AND garage_id = $2';
    const ratingResult = await pool.query(checkRatingQuery, [userId, garageId]);
    
    if (ratingResult.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already rated this garage' 
      });
    }
    
    // Create the rating
    const newRating = await Rating.create(userId, garageId, rating, comment);
    
    res.status(201).json({
      success: true,
      rating: newRating
    });
  } catch (error) {
    console.error('Create rating error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get ratings by garage ID
export const getGarageRatings = async (req, res) => {
  try {
    const { garageId } = req.params;
    
    const ratings = await Rating.getByGarageId(garageId);
    
    res.status(200).json({
      success: true,
      ratings
    });
  } catch (error) {
    console.error('Get garage ratings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get user's ratings
export const getUserRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const ratings = await Rating.getByUserId(userId);
    
    res.status(200).json({
      success: true,
      ratings
    });
  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Update a rating
export const updateRating = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid rating (1-5) is required' 
      });
    }
    
    try {
      const updatedRating = await Rating.update(id, userId, rating, comment);
      
      res.status(200).json({
        success: true,
        rating: updatedRating
      });
    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  } catch (error) {
    console.error('Update rating error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Delete a rating
export const deleteRating = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    try {
      const result = await Rating.delete(id, userId);
      
      res.status(200).json({
        success: true,
        message: 'Rating deleted successfully'
      });
    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  } catch (error) {
    console.error('Delete rating error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
