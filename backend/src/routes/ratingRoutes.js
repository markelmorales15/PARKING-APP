import express from 'express';
import {
  createRating,
  getGarageRatings,
  getUserRatings,
  updateRating,
  deleteRating
} from '../controllers/ratingController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Create a new rating (protected)
router.post('/', verifyToken, createRating);

// Get ratings by garage ID (public)
router.get('/garage/:garageId', getGarageRatings);

// Get user's ratings (protected)
router.get('/user', verifyToken, getUserRatings);

// Update a rating (protected)
router.put('/:id', verifyToken, updateRating);

// Delete a rating (protected)
router.delete('/:id', verifyToken, deleteRating);

export default router;
