import Wallet from '../models/wallet.js';
import pool from '../config/db.js'; // Assuming you have a db connection pool

// Get wallet balance
export const getWalletBalance = async (req, res) => {
 try {
 const userId = req.user.id;
    const balance = await Wallet.getBalance(userId);

    res.status(200).json({
 success: true,
 balance
 });
 } catch (error) {
 console.error('Get wallet balance error:', error);
    res.status(500).json({
 success: false,
 message: 'Server error'
 });
 }
};

// Function to handle credit transfers (called from other controllers)
export const transferCredits = async (fromUserId, toUserId, amount, bookingId) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Deduct from sender's balance
    const deductResult = await client.query(
      'UPDATE wallets SET balance = balance - $1 WHERE user_id = $2 RETURNING balance',
      [amount, fromUserId]
    );

    if (deductResult.rows.length === 0 || deductResult.rows[0].balance < 0) {
      // Rollback if sender not found or insufficient balance
      await client.query('ROLLBACK');
      throw new Error('Insufficient balance');
    }

    // Calculate commission (10%) and amount for receiver
    const commissionRate = 0.10;
    const commissionAmount = amount * commissionRate;
    const amountForReceiver = amount - commissionAmount;

    // Add to receiver's balance
    await client.query(
      'UPDATE wallets SET balance = balance + $1 WHERE user_id = $2',
      [amountForReceiver, toUserId]
    );

    // Log transactions (optional but good practice)
    // Assuming a transactions table with columns: user_id, amount, type (debit/credit), reference_id (bookingId)
    await client.query(
      'INSERT INTO transactions (user_id, amount, type, reference_id) VALUES ($1, $2, $3, $4)',
      [fromUserId, -amount, 'debit', bookingId] // Debit is negative amount
    );
    await client.query(
      'INSERT INTO transactions (user_id, amount, type, reference_id) VALUES ($1, $2, $3, $4)',
      [toUserId, amountForReceiver, 'credit', bookingId] // Credit is positive amount
    );
    // Optionally log commission transaction

    await client.query('COMMIT');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Credit transfer error:', error);
    throw error; // Rethrow to be caught by the caller
  } finally {
    client.release();
  }
};

// Note: addFunds and getTransactionHistory are commented out for now based on instructions.
/*
export const addFunds = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const balance = await Wallet.addFunds(userId, amount);

    res.status(200).json({
      success: true,
      balance
    });
  } catch (error) {
    console.error('Add funds error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Wallet.getTransactionHistory(userId);

    res.status(200).json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
*/
import Wallet from '../models/wallet.js';

// Get wallet balance
export const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    const balance = await Wallet.getBalance(userId);
    
    res.status(200).json({
      success: true,
      balance
    });
  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Add funds to wallet
export const addFunds = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }
    
    const balance = await Wallet.addFunds(userId, amount);
    
    res.status(200).json({
      success: true,
      balance
    });
  } catch (error) {
    console.error('Add funds error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get transaction history
export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Wallet.getTransactionHistory(userId);
    
    res.status(200).json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error('Get transaction history error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};