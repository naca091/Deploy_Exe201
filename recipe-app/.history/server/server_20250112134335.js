const express = require('express');  
const mongoose = require('mongoose');  
const dotenv = require('dotenv');  
const cors = require('cors');  
const path = require('path');  
const debug = require('debug')('app:server');  

// Import routes  
const ingredientRoutes = require('./routes/ingredients');  
const categoryRoutes = require('./routes/categories');  
const menuRouter = require('./routes/menus');  
const roleRouter = require('./routes/roles');  
const userRouter = require('./routes/users');  
const { router: authRoutes } = require('./routes/auth');  // Import router từ auth.js
// Load environment variables  
dotenv.config();  

const app = express();  

// Constants  
const PORT = process.env.PORT || 5000;  
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/recipe_db';  

// Middleware  
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  

// MongoDB Connection  
mongoose.connect(MONGO_URI)  
    .then(() => console.log('📦 MongoDB Connected Successfully'))  
    .catch(err => {  
        console.error('❌ MongoDB Connection Error:', err);  
        process.exit(1);  
    });  

// Use routes  
app.use(ingredientRoutes);  
app.use(categoryRoutes);  
app.use('/api/menus', menuRouter);  
app.use(roleRouter);  
app.use(userRouter);  
//app.use('/api/users', userRouter);  
app.use(authRoutes);

// Error handling middleware  
app.use((err, req, res, next) => {
    debug('Error occurred:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message,
      stack: err.stack // Optionally include the error stack for debugging
    });
  });
  

// 404 handler  
app.use((req, res) => {  
    debug('Route not found:', req.originalUrl);  
    res.status(404).json({  
        success: false,  
        message: "Route not found"  
    });  
});  

// Start server  
app.listen(PORT, () => {  
    console.log(`Server is running on port ${PORT}`);  
    console.log(`MongoDB URI: ${MONGO_URI}`);  
});