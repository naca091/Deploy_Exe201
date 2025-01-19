const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const debug = require("debug")("app:server");

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
dotenv.config();

const app = express();

// Constants
const PORT = 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://tien:Dtmghsk29903@cluster0.4owga.mongodb.net/recipe_db';

// CORS configuration - Updated to include your render.com domain
app.use(
  cors({
    origin: 'https://countlory.onrender.com',
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
 );

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("📦 MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// API Routes
app.use("/api", ingredientRoutes);
app.use("/api", categoryRoutes);
app.use("/api", menuRouter);
app.use("/api", roleRouter);
app.use("/api", userRouter);
app.use("/api/auth", authRoutes);
app.use("/api/auth", resetPasswordRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api", statsRouter);
app.use("/api", attendanceRouter);

// Serve static files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  debug("Error occurred:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
});

// 404 handler
app.use((req, res) => {
  debug("Route not found:", req.originalUrl);
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`MongoDB URI: ${MONGO_URI}`);
});