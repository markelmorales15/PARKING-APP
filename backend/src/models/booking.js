import pool from '../config/db.js';

class Booking {
  // Create a new booking
  static async create(userId, garageId, startDate, endDate, totalPrice, status = 'pending') {
    const query = `
      INSERT INTO bookings (user_id, garage_id, start_date, end_date, total_price, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [userId, garageId, startDate, endDate, totalPrice, status];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get user's bookings
  static async getByUserId(userId) {
    const query = `
      SELECT b.*, 
             g.title as garage_title, 
             g.address as garage_address,
             g.city as garage_city,
             g.state as garage_state,
             json_agg(DISTINCT gi.image_url) FILTER (WHERE gi.image_url IS NOT NULL) as garage_images
      FROM bookings b
      JOIN garages g ON b.garage_id = g.id
      LEFT JOIN garage_images gi ON g.id = gi.garage_id
      WHERE b.user_id = $1
      GROUP BY b.id, g.title, g.address, g.city, g.state
      ORDER BY b.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get booking by ID
  static async getById(id) {
    const query = `
      SELECT b.*, 
             g.title as garage_title, 
             g.address as garage_address,
             g.city as garage_city,
             g.state as garage_state,
             json_agg(DISTINCT gi.image_url) FILTER (WHERE gi.image_url IS NOT NULL) as garage_images
      FROM bookings b
      JOIN garages g ON b.garage_id = g.id
      LEFT JOIN garage_images gi ON g.id = gi.garage_id
      WHERE b.id = $1
      GROUP BY b.id, g.title, g.address, g.city, g.state
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get garage's bookings
  static async getByGarageId(garageId) {
    const query = `
      SELECT b.id, b.start_date, b.end_date, b.status, b.created_at
      FROM bookings b
      WHERE b.garage_id = $1
      ORDER BY b.start_date ASC
    `;
    
    try {
      const result = await pool.query(query, [garageId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update booking status
  static async updateStatus(id, status) {
    const query = `
      UPDATE bookings
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id, status]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Cancel booking
  static async cancel(id, userId) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Verify the booking belongs to the user
      const bookingQuery = 'SELECT * FROM bookings WHERE id = $1 AND user_id = $2';
      const bookingResult = await client.query(bookingQuery, [id, userId]);
      
      if (bookingResult.rows.length === 0) {
        throw new Error('Booking not found or not authorized');
      }
      
      const booking = bookingResult.rows[0];
      
      // Check if the booking can be cancelled (not in the past)
      const now = new Date();
      const startDate = new Date(booking.start_date);
      
      if (startDate < now) {
        throw new Error('Cannot cancel a booking that has already started');
      }
      
      // Update the booking status to cancelled
      const updateQuery = `
        UPDATE bookings
        SET status = 'cancelled', updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const updateResult = await client.query(updateQuery, [id]);
      
      await client.query('COMMIT');
      return updateResult.rows[0];
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default Booking;
