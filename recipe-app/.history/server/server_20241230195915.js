const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env if available
dotenv.config({ path: path.join(__dirname, '.env') });

// Fallback to default values if environment variables are not provided
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recipe_db';
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



// Route đăng ký người dùng
app.post('/api/users/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !password || !email) {
      return res.status(400).json({ success: false, message: 'All fields are required!' });
    }

    // Lấy model User từ file schema/models
    const { User } = require('./models'); // Thay đổi đường dẫn nếu cần

    // Kiểm tra xem email hoặc username đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email or username already exists!' });
    }

    // Tạo người dùng mới
    const newUser = new User({ username, password, email });
    await newUser.save();

    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    console.error(`Error during user registration: ${error.message}`, error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
