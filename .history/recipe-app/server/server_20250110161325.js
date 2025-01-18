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

app.post('/api/menus/purchase', authMiddleware, async (req, res) => {  
    const { name } = req.body; // Lấy tên menu từ body request  
    const userId = req.user._id; // Lấy userId từ thông tin người dùng đã xác thực  
  
    // Kiểm tra xem userId và name có tồn tại không  
    if (!userId || !name) {  
        return res.status(400).json({ success: false, message: 'User ID hoặc menu name bị thiếu.' });  
    }  
  
    try {  
        // Tìm menu trong database bằng tên  
        const menu = await Menu.findOne({ name: name });  
  
        // Kiểm tra xem menu có tồn tại không  
        if (!menu) {  
            return res.status(404).json({ success: false, message: 'Menu not found.' });  
        }  
  
        // Kiểm tra số xu của người dùng  
        if (req.user.xu < menu.unlockPrice) {  
            return res.status(400).json({ success: false, message: 'Không đủ xu để mua menu.' });  
        }  
  
        // Kiểm tra xem người dùng đã mua menu này chưa  
        if (!menu.purchasedBy.includes(userId)) {  
            // Trừ xu và thêm userId vào purchasedBy  
            req.user.xu -= menu.unlockPrice;  
            menu.purchasedBy.push(userId);  
  
            // Lưu thay đổi vào cơ sở dữ liệu  
            await req.user.save();  
            await menu.save();  
  
            return res.json({ success: true, message: 'Mua menu thành công!' });  
        } else {  
            return res.status(400).json({ success: false, message: 'Bạn đã mua menu này rồi.' });  
        }  
    } catch (error) {  
        console.error('Error purchasing menu:', error);  
        return res.status(500).json({ success: false, message: 'Error purchasing menu.', error });  
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
