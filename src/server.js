const express = require('express');
const db = require('./db');

const app = express();
app.use(express.json()); // REQUIRED for POST body

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get users
app.get('/users', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM users');
  res.json(rows);
});

// 🔹 ADD USER (THIS IS NEW)
app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'name and email required' });
  }

  await db.query(
    'INSERT INTO users (name, email) VALUES (?, ?)',
    [name, email]
  );

  res.status(201).json({ message: 'User created' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

