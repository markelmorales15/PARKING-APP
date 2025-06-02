import express from 'express';
import {
  getBalance,
  addCredits,
  getTransactionHistory
} from '../controllers/creditController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Get user's credit balance (protected)
router.get('/', verifyToken, getBalance);

// Add credits to user's account (protected)
router.post('/add', verifyToken, addCredits);

// Get transaction history (protected)
router.get('/transactions', verifyToken, getTransactionHistory);

export default router;
