import pool from '../config/db.js';

class Credit {
  // Get user's credit balance
  static async getBalance(userId) {
    const query = `
      SELECT credits
      FROM user_credits
      WHERE user_id = $1
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      
      if (result.rows.length === 0) {
        // Create a new credit record if it doesn't exist
        const insertQuery = `
          INSERT INTO user_credits (user_id, credits)
          VALUES ($1, 0)
          RETURNING credits
        `;
        
        const insertResult = await pool.query(insertQuery, [userId]);
        return { credits: insertResult.rows[0].credits };
      }
      
      return { credits: result.rows[0].credits };
    } catch (error) {
      throw error;
    }
  }

  // Add credits to user's account
  static async addCredits(userId, amount) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if user has a credit record
      const checkQuery = 'SELECT id FROM user_credits WHERE user_id = $1';
      const checkResult = await client.query(checkQuery, [userId]);
      
      let creditId;
      
      if (checkResult.rows.length === 0) {
        // Create a new credit record
        const insertQuery = `
          INSERT INTO user_credits (user_id, credits)
          VALUES ($1, $2)
          RETURNING id
        `;
        
        const insertResult = await client.query(insertQuery, [userId, amount]);
        creditId = insertResult.rows[0].id;
      } else {
        // Update existing record
        const updateQuery = `
          UPDATE user_credits
          SET credits = credits + $2
          WHERE user_id = $1
          RETURNING id
        `;
        
        const updateResult = await client.query(updateQuery, [userId, amount]);
        creditId = updateResult.rows[0].id;
      }
      
      // Create a transaction record
      const transactionQuery = `
        INSERT INTO credit_transactions (user_id, amount, transaction_type, description)
        VALUES ($1, $2, 'add', 'Credit added')
        RETURNING id
      `;
      
      await client.query(transactionQuery, [userId, amount]);
      
      // Get the updated balance
      const balanceQuery = 'SELECT credits FROM user_credits WHERE id = $1';
      const balanceResult = await client.query(balanceQuery, [creditId]);
      
      await client.query('COMMIT');
      return { credits: balanceResult.rows[0].credits };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Use credits for a booking
  static async useCredits(userId, amount, bookingId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Check if user has enough credits
      const checkQuery = 'SELECT credits FROM user_credits WHERE user_id = $1';
      const checkResult = await client.query(checkQuery, [userId]);
      
      if (checkResult.rows.length === 0 || checkResult.rows[0].credits < amount) {
        throw new Error('Insufficient credits');
      }
      
      // Update user's credit balance
      const updateQuery = `
        UPDATE user_credits
        SET credits = credits - $2
        WHERE user_id = $1
        RETURNING credits
      `;
      
      const updateResult = await client.query(updateQuery, [userId, amount]);
      
      // Create a transaction record
      const transactionQuery = `
        INSERT INTO credit_transactions (user_id, amount, transaction_type, description, booking_id)
        VALUES ($1, $2, 'use', 'Credits used for booking', $3)
        RETURNING id
      `;
      
      await client.query(transactionQuery, [userId, amount, bookingId]);
      
      await client.query('COMMIT');
      return { credits: updateResult.rows[0].credits };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get user's transaction history
  static async getTransactionHistory(userId) {
    const query = `
      SELECT t.*, b.id as booking_id, b.start_date, b.end_date
      FROM credit_transactions t
      LEFT JOIN bookings b ON t.booking_id = b.id
      WHERE t.user_id = $1
      ORDER BY t.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
}

export default Credit;
