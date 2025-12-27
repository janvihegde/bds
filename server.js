require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

// 1. Connect Database
connectDB();

// 2. Init Middleware
app.use(express.json());
app.use(cors());

// 3. Define Routes
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/products', require('./routes/products')); // Commented out until we create it

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));