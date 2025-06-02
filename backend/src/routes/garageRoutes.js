import express from 'express';
import {
  createGarage,
  getAllGarages,
  getGarageById,
  getUserGarages,
  updateGarage,
  deleteGarage,
  checkAvailability
} from '../controllers/garageController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Create a new garage (protected)
router.post('/', verifyToken, createGarage);

// Get all garages (public)
router.get('/', getAllGarages);

// Get garage by ID (public)
router.get('/:id', getGarageById);

// Get user's garages (protected)
router.get('/user/me', verifyToken, getUserGarages);

// Update garage (protected)
router.put('/:id', verifyToken, updateGarage);

// Delete garage (protected)
router.delete('/:id', verifyToken, deleteGarage);

// Check availability (public)
router.post('/:id/availability', checkAvailability);

export default router;
