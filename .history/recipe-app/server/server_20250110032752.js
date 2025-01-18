const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const debug = require('debug')('app:server');

// Import routes
const userRoutes = require('./routes/users');
const ingredientRoutes = require('./routes/ingredients');
const categoryRoutes = require('./routes/categories');
const menusRouter = require("./routes/menus");
const roleRouter = require('./routes/roles');
const userRouter = require('./routes/users');
const authRoutes = require('./routes/authRoutes');
// Load environment variables
dotenv.config();
// Định nghĩa routes  

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
app.use('/api/users', userRoutes);
app.use(ingredientRoutes);
app.use(categoryRoutes);
app.use("/api/menus", menusRouter);
app.use(roleRouter);
app.use(userRouter);
app.use(authRoutes);
app.use('/api/usermenus', require('./routes/userMenuRoutes'));

app.post('/api/menus/purchase/:id', (req, res) => {  
    const menuId = req.params.id;  

    // Logic để kiểm tra xem menu có tồn tại và thực hiện mua  
    // Ví dụ giả định:  
    if (menuId === '67802d695acd40767f5f8dd7') {  
        res.json({ success: true, message: 'Purchase successful!' });  
    } else {  
        res.json({ success: false, message: 'Menu not found.' });  
    }  
});  
// Error handling middleware
app.use((err, req, res, next) => {
    debug('Error occurred:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
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
