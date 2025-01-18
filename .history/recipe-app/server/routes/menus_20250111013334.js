const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Menu, Category, Ingredient } = require("../models/models");

// Cấu hình multer để lưu file vào thư mục "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); // Đường dẫn tuyệt đối đến thư mục uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
  },
});



const upload = multer({ storage });

// Endpoint để upload file
router.post("/upload", upload.single("image"), (req, res) => {
  try {
    console.log("Request file:", req.file); // Log file được gửi lên
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    res.json({
      success: true,
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`,
    });
  } catch (error) {
    console.error("Error uploading file:", error); // Log lỗi chi tiết
    res.status(500).json({ success: false, message: "Something broke!" });
  }
});


// Create menu
router.post("/api/menus", async (req, res) => {
  try {
    const {
      name,
      ingredients,
      description,
      cookingTime,
      difficulty,
      servingSize,
      defaultStatus,
      category,
      tags,
      image,
      calories,
      nutritionalInfo,
      unlockPrice,
      averageRating,
      isActive,
    } = req.body;

    // Validation
    if (
      !name ||
      !ingredients ||
      !description ||
      !cookingTime ||
      !difficulty ||
      !servingSize ||
      !defaultStatus ||
      !category ||
      !tags ||
      !image ||
      !calories ||
      !nutritionalInfo ||
      !unlockPrice ||
      !averageRating ||
      isActive === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if all ingredients exist
    const ingredientIds = ingredients.map((ing) => ing.ingredient);
    const existingIngredients = await Ingredient.find({
      _id: { $in: ingredientIds },
    });
    if (existingIngredients.length !== ingredientIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some ingredients not found",
      });
    }

    // Create menu
    const menu = new Menu({
      name,
      ingredients: ingredients.map((ing) => ({
        ingredient: ing.ingredient,
        weight: ing.weight,
        unit: ing.unit,
      })),
      description,
      cookingTime,
      difficulty,
      servingSize,
      defaultStatus,
      category,
      tags,
      image,
      calories,
      nutritionalInfo,
      unlockPrice,
      averageRating,
      isActive,
    });

    await menu.save();
    res.status(201).json({
      success: true,
      message: "Menu created successfully",
      data: menu,
    });
  } catch (error) {
    console.error("Error creating menu:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Get all menus
router.get("/api/menus", async (req, res) => {
  try {
    const menus = await Menu.find().sort({ name: 1 });
    res.json({
      success: true,
      count: menus.length,
      data: menus,
    });
  } catch (error) {
    console.error("Error fetching menus:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching menus",
      error: error.message,
    });
  }
});

// Get single menu by ID
router.get("/api/menus/:id", async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }
    res.json({
      success: true,
      data: menu,
    });
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching menu",
      error: error.message,
    });
  }
});

// Update menu by ID
router.put("/api/menus/:id", async (req, res) => {
  try {
    const {
      name,
      ingredients,
      description,
      cookingTime,
      difficulty,
      servingSize,
      defaultStatus,
      category,
      tags,
      image,
      calories,
      nutritionalInfo,
      unlockPrice,
      averageRating,
      isActive,
    } = req.body;

    // Check if menu exists
    const existingMenu = await Menu.findById(req.params.id);
    if (!existingMenu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }

    // Check if category exists
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if all ingredients exist
    const ingredientIds = ingredients.map((ing) => ing.ingredient);
    const existingIngredients = await Ingredient.find({
      _id: { $in: ingredientIds },
    });
    if (existingIngredients.length !== ingredientIds.length) {
      return res.status(400).json({
        success: false,
        message: "Some ingredients not found",
      });
    }

    // Update menu
    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        name,
        ingredients: ingredients.map((ing) => ({
          ingredient: ing.ingredient,
          weight: ing.weight,
          unit: ing.unit,
        })),
        description,
        cookingTime,
        difficulty,
        servingSize,
        defaultStatus,
        category,
        tags,
        image,
        calories,
        nutritionalInfo,
        unlockPrice,
        averageRating,
        isActive,
      },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: "Menu updated successfully",
      data: updatedMenu,
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({
      success: false,
      message: "Error updating menu",
      error: error.message,
    });
  }
});

// Delete menu by ID
router.delete("/api/menus/:id", async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({
        success: false,
        message: "Menu not found",
      });
    }
    res.json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting menu",
      error: error.message,
    });
  }
});

// Endpoint để tạo menu
router.post("/", async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json({ success: true, data: menu });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Endpoint để lấy danh sách menu
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find().populate("category").populate("ingredients.ingredient");
    res.json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route mua menu  
router.post('/purchase', async (req, res) => {
  try {
    const { menuName } = req.body;
    const userEmail = req.user.email; // Lấy email từ middleware auth

    // Tìm menu bằng tên
    const menu = await Menu.findOne({ name: menuName });
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Kiểm tra nếu user đã mua menu
    if (menu.purchasedBy.includes(userEmail)) {
      return res.status(400).json({ message: 'You have already purchased this menu.' });
    }

    // Thêm email của user vào danh sách purchasedBy
    menu.purchasedBy.push(userEmail);
    await menu.save();

    res.status(200).json({ message: 'Menu purchased successfully.', menu });
  } catch (error) {
    console.error('Error purchasing menu:', error);
    res.status(500).json({ message: 'An error occurred while purchasing the menu.' });
  }
});
module.exports = router;