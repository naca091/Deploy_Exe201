// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');
const { User, Role } = require('../models/models');

// Thêm JWT_SECRET trực tiếp
const JWT_SECRET = "71917999b687ce0c5cc3fb267d1f3c99c29497ad1d63bc8ae4d50a245c19ef15";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'dinhquoctien1980@gmail.com', // Replace with your email
      pass: 'your-app-password' // Replace with your app password
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Email or password is incorrect',
      });
    }
    
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      userEmail: user.email,
      userxu: user.xu
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login'
    });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'purchasedMenus.menuId',
        select: 'name description unlockPrice defaultStatus'
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        xu: user.xu,
        purchasedMenus: user.purchasedMenus.map(pm => ({
          menuId: pm.menuId._id,
          name: pm.menuId.name,
          description: pm.menuId.description,
          unlockPrice: pm.menuId.unlockPrice,
          defaultStatus: pm.menuId.defaultStatus
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user information',
      error: error.message
    });
  }
});

//logout
router.post('/logout', (req, res) => {
  // Ghi nhật ký hoặc xử lý đăng xuất nếu cần
  res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
  });
});

//register 
router.post('/register', async (req, res) => {
  const { username, password, email, fullName, phone, address, xu =0 } = req.body;

  try {
      if (!username || !password || !email || !fullName) {
          return res.status(400).json({
              success: false,
              message: 'All required fields must be provided',
          });
      }

      // Kiểm tra người dùng tồn tại
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
          return res.status(400).json({
              success: false,
              message: 'Username or email already exists',
          });
      }

      // Tìm role với id = 1
      const memberRole = await Role.findOne({ id: 1 });
      if (!memberRole) {
          console.error('Role with id: 1 not found');
          return res.status(500).json({
              success: false,
              message: 'System initialization in progress. Please try again later.',
          });
      }

      // Tạo người dùng mới
      const newUser = new User({
          username,
          password, // Không mã hóa mật khẩu
          email,
          fullName,
          phone: phone || '',
          address: address || '',
          xu, // Giá trị mặc định cho xu
          role: memberRole._id, // Gắn role từ roleId
      });

      await newUser.save();

      res.status(201).json({
          success: true,
          message: 'Registration successful! Please login to continue.',
      });
  } catch (error) {
      console.error('Registration error:', error);

      res.status(500).json({
          success: false,
          message: error.message || 'Registration failed. Please try again later.',
      });
  }
});

// Store verification codes temporarily (in production, use Redis or similar)
const verificationCodes = new Map();

// Generate random 6-digit code
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request password reset
router.post('/reset-password-request', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Generate verification code
        const verificationCode = generateVerificationCode();
        
        // Store code with timestamp (expires in 10 minutes)
        verificationCodes.set(email, {
            code: verificationCode,
            timestamp: Date.now(),
            attempts: 0
        });

        // Send email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset Verification Code',
            text: `Your verification code is: ${verificationCode}\nThis code will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Verification code sent successfully'
        });

    } catch (error) {
        console.error('Reset password request error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process reset password request'
        });
    }
});

// Verify code and reset password
router.post('/verify-reset-code', async (req, res) => {
    try {
        const { email, verificationCode, newPassword } = req.body;

        // Get stored verification data
        const storedData = verificationCodes.get(email);
        
        if (!storedData) {
            return res.status(400).json({
                success: false,
                message: 'No verification code found or code expired'
            });
        }

        // Check if code is expired (10 minutes)
        if (Date.now() - storedData.timestamp > 600000) {
            verificationCodes.delete(email);
            return res.status(400).json({
                success: false,
                message: 'Verification code expired'
            });
        }

        // Verify code
        if (storedData.code !== verificationCode) {
            storedData.attempts += 1;
            
            // Max 3 attempts
            if (storedData.attempts >= 3) {
                verificationCodes.delete(email);
                return res.status(400).json({
                    success: false,
                    message: 'Too many failed attempts. Please request a new code.'
                });
            }

            return res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
        }

        // Update password
        const user = await User.findOne({ email });
        user.password = newPassword;
        await user.save();

        // Clear verification code
        verificationCodes.delete(email);

        res.json({
            success: true,
            message: 'Password reset successfully'
        });

    } catch (error) {
        console.error('Verify reset code error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password'
        });
    }
});

module.exports = router;
