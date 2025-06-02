import express from 'express';
import {
  getBalance,
  addFunds,
  getTransactionHistory
} from '../controllers/walletController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Get wallet balance (protected)
router.get('/balance', verifyToken, getBalance);

// Add funds to wallet (protected)
router.post('/add-funds', verifyToken, addFunds);

// Get transaction history (protected)
router.get('/transactions', verifyToken, getTransactionHistory);

export default router;