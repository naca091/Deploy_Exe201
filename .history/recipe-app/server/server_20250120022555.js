const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

// Load environment variables
dotenv.config();

// Import routes
const ingredientRoutes = require("./routes/ingredients");
const categoryRoutes = require("./routes/categories");
const menuRouter = require("./routes/menus");
const roleRouter = require("./routes/roles");
const userRouter = require("./routes/users");
const authRoutes = require("./routes/auth");
const resetPasswordRoutes = require("./routes/resetPassword");
const videoRoutes = require("./routes/videoRoutes");
const statsRouter = require("./routes/stats");
const attendanceRouter = require("./routes/attendance");

const app = express();

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://tien:Dtmghsk29903@cluster0.4owga.mongodb.net/recipe_db';

// Enable logging
app.use(morgan('dev'));

// Basic Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS Configuration
const allowedOrigins = [
  'https://countlory.onrender.com',
  'https://demcalo.onrender.com',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // CORS preflight cache time in seconds
}));

// Request Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  console.log('Request Headers:', req.headers);
  next();
});

// Static Files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use("/api/ingredients", ingredientRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menus", menuRouter);
app.use("/api/roles", roleRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRoutes);
app.use("/api/auth", resetPasswordRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/stats", statsRouter);
app.use("/api/attendance", attendanceRouter);

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log("📦 MongoDB Connected Successfully");
  console.log(`MongoDB URI: ${MONGO_URI}`);
})
.catch((err) => {
  console.error("❌ MongoDB Connection Error:", err);
  process.exit(1);
});

// Production static files
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// 404 Handler - Must be after all other routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});
// Thêm vào server.js sau khi kết nối MongoDB
mongoose.connection.on('connected', async () => {
  try {
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log('Available collections:', collections.map(c => c.name));
      
      const ingredientCount = await Ingredient.countDocuments();
      console.log('Number of ingredients in DB:', ingredientCount);
  } catch (err) {
      console.error('Error checking collections:', err);
  }
});
// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});
console.log('Mounted routes:', app._router.stack.filter(r => r.route).map(r => r.route.path));


// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
