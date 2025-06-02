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