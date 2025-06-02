import express from 'express';
import { updateProfile, changePassword, getUserProfile } from '../controllers/userController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Update user profile (protected)
router.put('/', verifyToken, updateProfile);

// Change password (protected)
router.put('/password', verifyToken, changePassword);

// Get user profile by ID (public profile)
router.get('/:id', getUserProfile);

export default router;
