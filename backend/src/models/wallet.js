import pool from '../config/db.js';

class Wallet {
  // Get wallet balance
  static async getBalance(userId) {
    const query = 'SELECT balance FROM wallets WHERE user_id = $1';
    
    try {
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        // Create wallet if it doesn't exist
        const createQuery = `
          INSERT INTO wallets (user_id, balance)
          VALUES ($1, 0)
          RETURNING balance
        `;
        const createResult = await pool.query(createQuery, [userId]);
        return createResult.rows[0].balance;
      }
      
      return result.rows[0].balance;
    } catch (error) {
      throw error;
    }
  }

  // Add funds to wallet
  static async addFunds(userId, amount) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update wallet balance
      const updateQuery = `
        UPDATE wallets 
        SET balance = balance + $2,
            updated_at = NOW()
        WHERE user_id = $1
        RETURNING balance
      `;
      
      const result = await client.query(updateQuery, [userId, amount]);
      
      // Record transaction
      const transactionQuery = `
        INSERT INTO wallet_transactions (
          user_id,
          type,
          amount,
          description
        ) VALUES ($1, 'deposit', $2, 'Funds added to wallet')
      `;
      
      await client.query(transactionQuery, [userId, amount]);
      
      await client.query('COMMIT');
      return result.rows[0].balance;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Deduct funds from wallet
  static async deductFunds(userId, amount, description) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check current balance
      const balanceQuery = 'SELECT balance FROM wallets WHERE user_id = $1';
      const balanceResult = await client.query(balanceQuery, [userId]);
      
      if (balanceResult.rows[0].balance < amount) {
        throw new Error('Insufficient funds');
      }
      
      // Update wallet balance
      const updateQuery = `
        UPDATE wallets 
        SET balance = balance - $2,
            updated_at = NOW()
        WHERE user_id = $1
        RETURNING balance
      `;
      
      const result = await client.query(updateQuery, [userId, amount]);
      
      // Record transaction
      const transactionQuery = `
        INSERT INTO wallet_transactions (
          user_id,
          type,
          amount,
          description
        ) VALUES ($1, 'withdrawal', $2, $3)
      `;
      
      await client.query(transactionQuery, [userId, amount, description]);
      
      await client.query('COMMIT');
      return result.rows[0].balance;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get transaction history
  static async getTransactionHistory(userId) {
    const query = `
      SELECT * FROM wallet_transactions
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

export default Wallet;