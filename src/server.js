const express = require('express');
const cors = require('cors');
const db = require('./db/db');

const app = express();

/**
 * ------------------------
 * CORS CONFIGURATION
 * ------------------------
 * Allow:
 *  - Local frontend (vite)
 *  - Cloud Run frontend service
 */
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://hello-frontend-247494040824.us-central1.run.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  })
);

app.use(express.json()); // REQUIRED for POST body

/**
 * ------------------------
 * ROUTES
 * ------------------------
 */

// Health check (used by Cloud Run)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get users
app.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Add user
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'name and email required' });
    }

    await db.query(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * ------------------------
 * SERVER START
 * ------------------------
 */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

