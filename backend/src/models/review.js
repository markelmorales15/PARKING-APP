import pool from '../config/db.js';
import User from './user.js'; // Assuming a User model exists to join for renter info

class Review {
  static async create(bookingId, userId, garageId, rating, comment) {
    const query = `
      INSERT INTO reviews (booking_id, user_id, garage_id, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [bookingId, userId, garageId, rating, comment];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getByGarageId(garageId) {
    const query = `
      SELECT r.*, u.first_name, u.last_name, u.profile_picture_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.garage_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [garageId]);
    // Attach user details to reviews if needed, or handle in controller/frontend
    return result.rows;
  }

  static async getAverageRatingByGarageId(garageId) {
    const query = `
      SELECT AVG(rating)::numeric(10, 2) AS average_rating
      FROM reviews
      WHERE garage_id = $1
    `;
    const result = await pool.query(query, [garageId]);
    // Return the average rating as a number, or 0 if no reviews exist
    return result.rows[0]?.average_rating || 0;
  }

  static async hasUserReviewedBooking(userId, bookingId) {
    const query = `
      SELECT COUNT(*) FROM reviews
      WHERE user_id = $1 AND booking_id = $2
    `;
    const result = await pool.query(query, [userId, bookingId]);
    return parseInt(result.rows[0].count, 10) > 0;
  }
}
export default Review;
import pool from '../config/db.js';
import User from './user.js'; // Assuming a User model exists to join for renter info

class Review {
  static async create(bookingId, userId, garageId, rating, comment) {
    const query = `
      INSERT INTO reviews (booking_id, user_id, garage_id, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [bookingId, userId, garageId, rating, comment];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async getByGarageId(garageId) {
    const query = `
      SELECT r.*, u.first_name, u.last_name, u.profile_picture_url
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.garage_id = $1
      ORDER BY r.created_at DESC
    `;
    const result = await pool.query(query, [garageId]);
    // Attach user details to reviews if needed, or handle in controller/frontend
    return result.rows;
  }

  static async hasUserReviewedBooking(userId, bookingId) {
    const query = `
      SELECT COUNT(*) FROM reviews
      FROM reviews
      WHERE user_id = $1 AND booking_id = $2
    `;
    const result = await pool.query(query, [garageId]);
    // Return the average rating as a number, or 0 if no reviews exist
    return result.rows[0]?.average_rating || 0;
  }

}
export default Review;
// backend/src/models/review.js