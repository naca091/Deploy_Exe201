// routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { User, Role, LoginStat } = require("../models/models");

// Thêm JWT_SECRET trực tiếp
const JWT_SECRET =
  "b1c85f1955577a9721f8c389162b691bebf9a1729a6606c7d75d18623d7988fc";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate("role");
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect",
      });
    }

    // Thêm ghi nhận đăng nhập
    const loginStat = new LoginStat({
      userId: user._id,
    });
    await loginStat.save();

    const token = jwt.sign(
      { userId: user._id, roleId: user.role.id },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      userEmail: user.email,
      userxu: user.xu,
      roleId: user.role.id,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login",
    });
  }
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "purchasedMenus.menuId",
      select: "name description unlockPrice defaultStatus",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,

        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
        address: user.address,
        xu: user.xu,
        purchasedMenus: user.purchasedMenus.map((pm) => ({
          menuId: pm.menuId._id,
          name: pm.menuId.name,
          description: pm.menuId.description,
          unlockPrice: pm.menuId.unlockPrice,
          defaultStatus: pm.menuId.defaultStatus,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user information",
      error: error.message,
    });
  }
});

//logout
router.post("/logout", (req, res) => {
  // Ghi nhật ký hoặc xử lý đăng xuất nếu cần
  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
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
