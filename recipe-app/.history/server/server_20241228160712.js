const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: 'ENV_FILENAME' });

// Load env vars - thêm path để chắc chắn tìm đúng file .env
dotenv.config({ path: path.join(__dirname, '.env') });

// Debug để kiểm tra
console.log('Current directory:', __dirname);
console.log('MongoDB URI:', process.env.MONGO_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});