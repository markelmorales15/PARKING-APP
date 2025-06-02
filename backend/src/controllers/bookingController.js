import Booking from '../models/booking.js';
import Garage from '../models/garage.js';
import Credit from '../models/credit.js';
import pool from '../config/db.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { garageId, startDate, endDate, useCredits = false } = req.body;
    const userId = req.user.id;
    
    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start and end dates are required' 
      });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (start < now) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start date cannot be in the past' 
      });
    }
    
    if (end <= start) {
      return res.status(400).json({ 
        success: false, 
        message: 'End date must be after start date' 
      });
    }
    
    // Get garage details
    const garage = await Garage.getById(garageId);
    
    if (!garage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Garage not found' 
      });
    }
    
    // Check if garage belongs to the user
    if (garage.owner_id === userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'You cannot book your own garage' 
      });
    }
    
    // Check availability
    const bookings = await Booking.getByGarageId(garageId);
    
    const conflictingBookings = bookings.filter(booking => {
      if (booking.status !== 'confirmed') return false;
      
      const bookingStart = new Date(booking.start_date);
      const bookingEnd = new Date(booking.end_date);
      
      return (
        (start >= bookingStart && start < bookingEnd) ||
        (end > bookingStart && end <= bookingEnd) ||
        (start <= bookingStart && end >= bookingEnd)
      );
    });
    
    if (conflictingBookings.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Garage is not available for the selected dates' 
      });
    }
    
    // Calculate total price
    const daysCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = daysCount * garage.price_per_day;
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create booking
      const bookingQuery = `
        INSERT INTO bookings (user_id, garage_id, start_date, end_date, total_price, status)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      
      const bookingValues = [userId, garageId, start, end, totalPrice, 'pending'];
      const bookingResult = await client.query(bookingQuery, bookingValues);
      const booking = bookingResult.rows[0];
      
      // Handle credits if needed
      if (useCredits) {
        try {
          const creditsNeeded = Math.min(totalPrice, 100); // Example: maximum 100 credits can be used per booking
          await Credit.useCredits(userId, creditsNeeded, booking.id);
          
          // Update booking to reflect credit usage
          await client.query(
            'UPDATE bookings SET credits_used = $1 WHERE id = $2',
            [creditsNeeded, booking.id]
          );
          
          booking.credits_used = creditsNeeded;
        } catch (err) {
          console.log('Credit usage failed:', err.message);
          // Continue with the booking even if credit usage fails
        }
      }
      
      await client.query('COMMIT');
      
      res.status(201).json({
        success: true,
        booking
      });
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get all user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const bookings = await Booking.getByUserId(userId);
    
    res.status(200).json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const booking = await Booking.getById(id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }
    
    // Check if booking belongs to the user or the garage owner
    if (booking.user_id !== userId) {
      // Get the garage to check if the user is the owner
      const garage = await Garage.getById(booking.garage_id);
      
      if (garage.owner_id !== userId) {
        return res.status(403).json({ 
          success: false, 
          message: 'Not authorized to access this booking' 
        });
      }
    }
    
    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get bookings for a garage (owner only)
export const getGarageBookings = async (req, res) => {
  try {
    const { garageId } = req.params;
    const userId = req.user.id;
    
    // Check if user is the garage owner
    const garage = await Garage.getById(garageId);
    
    if (!garage) {
      return res.status(404).json({ 
        success: false, 
        message: 'Garage not found' 
      });
    }
    
    if (garage.owner_id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to access this garage\'s bookings' 
      });
    }
    
    // Get all bookings for the garage with user details
    const query = `
      SELECT b.*, 
             u.first_name, 
             u.last_name, 
             u.email, 
             u.phone
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.garage_id = $1
      ORDER BY b.start_date DESC
    `;
    
    const result = await pool.query(query, [garageId]);
    
    res.status(200).json({
      success: true,
      bookings: result.rows
    });
  } catch (error) {
    console.error('Get garage bookings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Update booking status (owner only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    if (!['confirmed', 'rejected', 'cancelled_by_owner'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }
    
    // Get booking details
    const booking = await Booking.getById(id);
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }
    
    // Check if user is the garage owner
    const garage = await Garage.getById(booking.garage_id);
    
    if (garage.owner_id !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this booking' 
      });
    }
    
    // Update booking status
    const updatedBooking = await Booking.updateStatus(id, status);
    
    res.status(200).json({
      success: true,
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Cancel booking (user only)
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Cancel the booking
    try {
      const cancelledBooking = await Booking.cancel(id, userId);
      
      res.status(200).json({
        success: true,
        booking: cancelledBooking
      });
    } catch (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
