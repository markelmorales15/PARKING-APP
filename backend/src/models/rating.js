import pool from '../config/db.js';

class Rating {
  // Create a new rating
  static async create(userId, garageId, rating, comment = null) {
    const query = `
      INSERT INTO ratings (user_id, garage_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [userId, garageId, rating, comment];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get ratings by garage ID
  static async getByGarageId(garageId) {
    const query = `
      SELECT r.*, 
             u.first_name, 
             u.last_name, 
             u.profile_picture
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.garage_id = $1
      ORDER BY r.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [garageId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get ratings by user ID
  static async getByUserId(userId) {
    const query = `
      SELECT r.*, 
             g.title as garage_title,
             g.address as garage_address,
             g.city as garage_city,
             g.state as garage_state
      FROM ratings r
      JOIN garages g ON r.garage_id = g.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `;
    
    try {
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Update a rating
  static async update(id, userId, rating, comment) {
    const query = `
      UPDATE ratings
      SET rating = $3, comment = $4, updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    const values = [id, userId, rating, comment];
    
    try {
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        throw new Error('Rating not found or not authorized to update');
      }
      
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete a rating
  static async delete(id, userId) {
    const query = `
      DELETE FROM ratings
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;
    
    try {
      const result = await pool.query(query, [id, userId]);
      
      if (result.rows.length === 0) {
        throw new Error('Rating not found or not authorized to delete');
      }
      
      return { deleted: true, id };
    } catch (error) {
      throw error;
    }
  }
}

export default Rating;
