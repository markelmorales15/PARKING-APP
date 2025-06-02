import express from 'express';
import { register, login, googleAuth, getCurrentUser } from '../controllers/authController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Register with email/password
router.post('/register', register);

// Login with email/password
router.post('/login', login);

// Google authentication
router.post('/google', googleAuth);

// Get current user (protected)
router.get('/user', verifyToken, getCurrentUser);

export default router;
