const express = require('express');
require('./config/env');

const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/users', usersRouter);

module.exports = app;

