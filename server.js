const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = require('./config/db');
const seedAdmin = require('./config/seedAdmin');

connectDB().then(() => {
  seedAdmin();
});

// Routes
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/daily-service', require('./routes/dailyServiceRoutes'));

app.get('/', (req, res) => {
  res.send('Backend API is running...');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
