// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { User, Role, LoginStat } = require("../models/models");

const JWT_SECRET = "9678d44b902720c8b90db26395bfc1d35a76fb79d962fd0ea807fd5c2f1bbf3a";

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await User.findOne({ email }).populate("role");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Validate password
        if (user.password !== password) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Record login
        await new LoginStat({ userId: user._id }).save();

        // Generate token
        const token = jwt.sign(
            { 
                userId: user._id,
                roleId: user.role.id 
            },
            JWT_SECRET,
            { expiresIn: "50h" }
        );

        // Send response
        res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    email: user.email,
                    xu: user.xu,
                    roleId: user.role.id
                }
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during login"
        });
    }
});

// Get user profile
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate("role")
            .populate({
                path: "purchasedMenus.menuId",
                select: "name description unlockPrice defaultStatus"
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    phone: user.phone,
                    address: user.address,
                    xu: user.xu,
                    purchasedMenus: user.purchasedMenus.map(pm => ({
                        menuId: pm.menuId?._id,
                        name: pm.menuId?.name,
                        description: pm.menuId?.description,
                        unlockPrice: pm.menuId?.unlockPrice,
                        defaultStatus: pm.menuId?.defaultStatus
                    }))
                }
            }
        });

    } catch (error) {
        console.error("Profile Error:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user profile"
        });
    }
});
//register
router.post("/register", async (req, res) => {
  const {
    username,
    password,
    email,
    fullName,
    phone,
    address,
    xu = 0,
  } = req.body;

  try {
    if (!username || !password || !email || !fullName) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Kiểm tra người dùng tồn tại
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // Tìm role với id = 1
    const memberRole = await Role.findOne({ id: 1 });
    if (!memberRole) {
      console.error("Role with id: 1 not found");
      return res.status(500).json({
        success: false,
        message: "System initialization in progress. Please try again later.",
      });
    }

    // Tạo người dùng mới
    const newUser = new User({
      username,
      password, // Không mã hóa mật khẩu
      email,
      fullName,
      phone: phone || "",
      address: address || "",
      xu, // Giá trị mặc định cho xu
      role: memberRole._id, // Gắn role từ roleId
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Registration successful! Please login to continue.",
    });
  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Registration failed. Please try again later.",
    });
  }
});

module.exports = router;
