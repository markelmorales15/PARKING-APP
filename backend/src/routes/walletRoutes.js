import express from 'express';
import {
  getWalletBalance,
  transferCredits
} from '../controllers/walletController.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

// Get wallet balance for a user (protected)
router.get('/:userId', verifyToken, getWalletBalance);

// Transfer credits (protected - likely called internally or by admin)
router.post('/transfer', verifyToken, transferCredits);

export default router;
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