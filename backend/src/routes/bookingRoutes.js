import express from 'express';
import {
  createBooking,
  getUserBookings,
  getBookingById,
  getGarageBookings,
  updateBookingStatus,
  cancelBooking,
  generateInvoice
} from '../controllers/bookingController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Create a new booking (protected)
router.post('/', verifyToken, createBooking);

// Get all user's bookings (protected)
router.get('/', verifyToken, getUserBookings);

// Get booking by ID (protected)
router.get('/:id', verifyToken, getBookingById);

// Get bookings for a garage (owner only)
router.get('/garage/:garageId', verifyToken, getGarageBookings);

// Update booking status (owner only)
router.put('/:id/status', verifyToken, updateBookingStatus); // Ensure this line is present and correct

// Cancel booking (user only)
router.delete('/:id', verifyToken, cancelBooking);

// Generate booking invoice (protected)
router.get('/:id/invoice', verifyToken, generateInvoice);

export default router;
