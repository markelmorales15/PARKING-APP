// src/routes/garage.js
import express from 'express';
import multer from 'multer';
import { Pool } from 'pg';

const router = express.Router();
const pool = new Pool();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// Add a new garage listing
router.post('/add', upload.array('photos', 5), async (req, res) => {
  const { dimensions, accessType, covered, description, price, location } = req.body;
  const photos = req.files.map(file => file.path);
  try {
    const result = await pool.query(
      'INSERT INTO garages (dimensions, access_type, covered, description, price, location, photos) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [dimensions, accessType, covered, description, price, location, photos]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;