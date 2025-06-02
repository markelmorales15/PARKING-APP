// src/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import { getAuth } from 'firebase-admin/auth';

const router = express.Router();

// User registration
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await getAuth().createUser({ email, password });
    res.status(201).json({ message: 'User registered successfully', userId: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getAuth().getUserByEmail(email);
    const token = jwt.sign({ uid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

export default router;