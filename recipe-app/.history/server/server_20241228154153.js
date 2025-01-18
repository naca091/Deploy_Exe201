const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db');

dotenv.config(); // Tải biến môi trường từ file .env

const app = express();

// Kết nối MongoDB
connectDB();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
