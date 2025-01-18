// routes/users.js
const express = require('express');
const bcrypt = require('bcrypt');
const { User, Role } = require('../models/models');
const router = express.Router();
//admin create user 
router.post('/api/users', async (req, res) => {
    const { username, password, email, fullName, role, phone, address, xu, isActive,  } = req.body;

    try {
        // Kiểm tra username hoặc email đã tồn tại
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists',
            });
        }

        // Tạo người dùng mới (không hash password)
        const newUser = new User({
            username,
            password, // Lưu mật khẩu trực tiếp
            email,
            fullName,
            role,
            phone,
            address,
            xu,
            isActive,
        });

        // Lưu người dùng vào cơ sở dữ liệu
        await newUser.save();

        res.status(201).json({
            success: true,
            data: newUser,
        });
    } catch (error) {
        console.error('Error creating user:', error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
//crud user
// Get all users with pagination and search
router.get('/api/users', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const sortField = req.query.sortField || 'createdAt';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

        const query = {
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        };

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .populate('role')
            .sort({ [sortField]: sortOrder })
            .skip((page - 1) * limit)
            .limit(limit)
            .select('-password');

        res.json({
            success: true,
            data: users,
            pagination: {
                total,
                page,
                lastPage: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

// API để lấy thông tin người dùng  
router.get('/api/users/:userId', async (req, res) => {  
    try {  
        const user = await User.findById(req.params.userId) // Sử dụng params.userId để lấy ID  
            .populate('role') // Kết hợp thông tin role  
            .select('-password'); // Loại bỏ mật khẩu khỏi phản hồi  

        if (!user) {  
            return res.status(404).json({  
                success: false,  
                message: 'User not found'  
            });  
        }  

        // Tạo đối tượng phản hồi với thông tin cần thiết  
        const userResponse = {  
            _id: user._id,  
            fullName: user.fullName,  
            username: user.username,  
            email: user.email,  
            xu: user.xu, // Thêm số xu vào phản hồi  
            role: user.role,  
            lastLogin: user.lastLogin,  
            avatar: user.avatar  
        };  

        res.json({  
            success: true,  
            data: userResponse // Trả về dữ liệu người dùng  
        });  
    } catch (error) {  
        console.error('Error fetching user:', error);  
        res.status(500).json({  
            success: false,  
            message: 'Failed to fetch user'  
        });  
    }  
});  

// Update user
router.put('/api/users/:userId', async (req, res) => {
    try {
        const { email, ...updateData } = req.body;
        
        // Check if email is being changed
        if (email) {
            const existingUser = await User.findOne({
                _id: { $ne: req.params.userId },
                email: email
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        // Update user
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { 
                ...updateData,
                ...(email && { email })
            },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user,
            message: 'User updated successfully'
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: errors.join(', ')
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update user'
        });
    }
});

// Password update route without hashing
router.put('/api/users/:userId/password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Find user with password
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if current password matches
        if (currentPassword !== user.password) {
            return res.status(400).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update with plain password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update password'
        });
    }
});
// Delete user
router.delete('/api/users/:userId', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete user'
        });
    }
});

// User Registration Route
router.post('/register', async (req, res) => {
    const { username, password, email, fullName, phone, address } = req.body;

    try {
        // Validate input
        if (!username || !password || !email || !fullName) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided',
            });
        }

        // Check for existing user
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username or email already exists',
            });
        }

        // Find member role with retry mechanism
        let memberRole;
        for (let i = 0; i < 3; i++) { // Try up to 3 times
            memberRole = await Role.findOne({ roleId: 1 });
            if (memberRole) break;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
        }

        if (!memberRole) {
            return res.status(500).json({
                success: false,
                message: 'System initialization in progress. Please try again later.',
            });
        }

        // Create new user (no hashing of password)
        const newUser = new User({
            username,
            password, // Lưu mật khẩu trực tiếp
            email,
            fullName,
            phone: phone || '',
            address: address || '',
            role: memberRole._id,
            xu, // Default value for xu
            avatar: '', // Default avatar value
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please login to continue.',
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: errors.join(', '),
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again later.',
        });
    }
});

/*
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Tìm user dựa trên email
      const user = await User.findOne({ email });
  
      // Kiểm tra nếu user tồn tại và mật khẩu đúng
      if (!user || user.password !== password) {
        return res.status(401).json({
          success: false,
          message: 'Email or password is incorrect',
        });
      }
  
      // Trả về thông tin email
      res.json({
        success: true,
        message: 'Login successful',
        userEmail: user.email,
        userxu: user.xu, // Giả sử bạn có cột 'coins' trong schema User
      });
    } catch (error) {
        console.error('Error in login:', error);  
        return res.status(500).json({  
            success: false,  
            message: 'An error occurred while logging in.',  
            error: error.message,  
        });  
    }
  });*/
module.exports = router;