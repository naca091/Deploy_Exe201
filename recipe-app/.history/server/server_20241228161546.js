const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env if available
dotenv.config({ path: path.join(__dirname, '.env') });

// Fallback to default values if environment variables are not provided
const MONGO_URI = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/recipe_db';
const PORT = process.env.PORT || 5000;

// Debugging logs
console.log('Current directory:', __dirname);
console.log('MongoDB URI:', MONGO_URI);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDBWithFallback();

// Function to connect to the database
async function connectDBWithFallback() {
  try {
    const mongoose = require('mongoose');
    await mongoose.connect(MONGO_URI); // Không cần các tùy chọn cũ nữa
    console.log(`MongoDB Connected: ${MONGO_URI}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
}


// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
