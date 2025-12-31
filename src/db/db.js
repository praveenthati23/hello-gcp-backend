// src/db.js
const mysql = require('mysql2/promise');

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
    });
    console.log('MySQL pool created');
  }
  return pool;
}

module.exports = {
  query: async (...args) => {
    const pool = getPool();
    return pool.query(...args);
  }
};

