import Credit from '../models/credit.js';

// Get user's credit balance
export const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const result = await Credit.getBalance(userId);
    
    res.status(200).json({
      success: true,
      credits: result.credits
    });
  } catch (error) {
    console.error('Get credit balance error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Add credits to user's account (admin or payment verification would be needed)
export const addCredits = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid amount is required' 
      });
    }
    
    // In a real application, this would verify payment before adding credits
    const result = await Credit.addCredits(userId, amount);
    
    res.status(200).json({
      success: true,
      credits: result.credits
    });
  } catch (error) {
    console.error('Add credits error:', error);
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
    
    const transactions = await Credit.getTransactionHistory(userId);
    
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
