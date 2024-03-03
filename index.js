const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors'); // Import cors module

const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Use cors middleware before defining routes
app.use(bodyParser.json());

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ZitharaDB',
  password: 'root',
  port: 5432,
});

// Route to fetch customers data
app.get('/api/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log('Server is running on port ${port}');
});