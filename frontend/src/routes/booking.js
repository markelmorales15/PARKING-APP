// src/routes/booking.js
import express from 'express';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool();

// Book a garage
router.post('/book', async (req, res) => {
  const { userId, garageId, date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO bookings (user_id, garage_id, date) VALUES ($1, $2, $3) RETURNING *',
      [userId, garageId, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Cancel a booking
router.delete('/cancel/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM bookings WHERE id = $1', [id]);
    res.status(200).json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;