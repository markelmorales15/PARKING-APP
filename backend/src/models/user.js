import pool from '../config/db.js';

class User {
  // Create a new user
  static async create(email, hashedPassword, firstName, lastName, phone = null) {
    const query = `
      INSERT INTO users (email, password, first_name, last_name, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, first_name, last_name, phone, created_at
    `;
    const values = [email, hashedPassword, firstName, lastName, phone];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE id = $1';
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update user information
  static async update(id, firstName, lastName, phone) {
    const query = `
      UPDATE users
      SET first_name = $2, last_name = $3, phone = $4, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, first_name, last_name, phone, created_at, updated_at
    `;
    const values = [id, firstName, lastName, phone];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create Google OAuth user or return existing
  static async findOrCreateGoogleUser(googleId, email, firstName, lastName, profilePicture = null) {
    try {
      // Check if user exists
      let user = await this.findByEmail(email);
      
      if (!user) {
        // If user doesn't exist, create a new one
        const query = `
          INSERT INTO users (google_id, email, first_name, last_name, profile_picture)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING id, email, first_name, last_name, profile_picture, created_at
        `;
        const values = [googleId, email, firstName, lastName, profilePicture];
        
        const result = await pool.query(query, values);
        user = result.rows[0];
      } else if (!user.google_id) {
        // If user exists but doesn't have google_id (email/pwd user), link accounts
        const query = `
          UPDATE users
          SET google_id = $2, updated_at = NOW()
          WHERE id = $1
          RETURNING id, email, first_name, last_name, profile_picture, created_at, updated_at
        `;
        const values = [user.id, googleId];
        
        const result = await pool.query(query, values);
        user = result.rows[0];
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }
}

export default User;
