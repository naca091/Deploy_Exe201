const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const debug = require('debug')('app:server');
const authMiddleware = require('./routes/authMiddleware');
// Import routes
const userRoutes = require('./routes/users');
const ingredientRoutes = require('./routes/ingredients');
const categoryRoutes = require('./routes/categories');
const menusRouter = require("./routes/menus");
const roleRouter = require('./routes/roles');
const userRouter = require('./routes/users');
const authRoutes = require('./routes/authRoutes');
const authservices = require('./routes/authService');
const authController = require('./routes/rac/authController');
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

app.use('/api/users');
app.use(ingredientRoutes);
app.use(categoryRoutes);
app.use("/api/menus", menusRouter);
app.use(roleRouter);
app.use(userRouter);
app.use(authRoutes);
app.use('/api/usermenus', require('./routes/userMenuRoutes'));
app.use('/api/auth', authRoutes);


app.post('/api/menus/purchase', authMiddleware, async (req, res) => {  
    const { menuId } = req.body; // Lấy menuId thay vì name
    const userId = req.user.userId; // Lấy từ decoded token
  
    if (!userId || !menuId) {  
        return res.status(400).json({ 
            success: false, 
            message: 'User ID hoặc menu ID bị thiếu.' 
        });  
    }  
  
    try {  
        // Tìm menu bằng ID
        const menu = await Menu.findById(menuId);
        // Tìm user hiện tại
        const currentUser = await User.findById(userId);
  
        if (!menu) {  
            return res.status(404).json({ 
                success: false, 
                message: 'Menu không tồn tại.' 
            });  
        }  
  
        // Kiểm tra số xu
        if (currentUser.xu < menu.unlockPrice) {  
            return res.status(400).json({ 
                success: false, 
                message: 'Không đủ xu để mua menu.' 
            });  
        }  
  
        // Kiểm tra đã mua chưa
        if (!menu.purchasedBy.includes(userId)) {  
            // Trừ xu và thêm vào purchasedBy
            currentUser.xu -= menu.unlockPrice;  
            menu.purchasedBy.push(userId);  
  
            await currentUser.save();  
            await menu.save();  
  
            return res.json({ 
                success: true, 
                message: 'Mua menu thành công!',
                remainingXu: currentUser.xu 
            });  
        } else {  
            return res.status(400).json({ 
                success: false, 
                message: 'Bạn đã mua menu này rồi.' 
            });  
        }  
    } catch (error) {  
        console.error('Error purchasing menu:', error);  
        return res.status(500).json({ 
            success: false, 
            message: 'Lỗi khi mua menu.' 
        });  
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
