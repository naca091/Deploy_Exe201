const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Menu, Category, Ingredient, User } = require("../models/models");
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    // Ensure upload directory exists
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
  }
});

const upload = multer({ storage });

// File upload endpoint
router.post("/upload", auth, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No file uploaded" 
      });
    }
    res.json({
      success: true,
      message: "File uploaded successfully",
      filePath: `/uploads/${req.file.filename}`
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ 
      success: false, 
      message: "File upload failed" 
    });
  }
});

// Get all menus
router.get('/', auth, asyncHandler(async (req, res) => {
  // Validate auth token and user
  if (!req.user?._id) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(401).json({
      success: false, 
      message: "User not found"
    });
  }

  const menus = await Menu.find({})
    .populate('category')
    .populate('ingredients.ingredient')
    .lean();

  const accessibleMenus = menus.map(menu => {
    // Check if menu is unlocked or purchased
    const isUnlocked = menu.defaultStatus === 'unlock' || 
      user.purchasedMenus?.some(p => p.menuId?.toString() === menu._id.toString());

    if (!isUnlocked && menu.defaultStatus === 'lock') {
      // Return limited data for locked menus
      return {
        _id: menu._id,
        name: menu.name,
        image: menu.image,
        description: menu.description,
        category: menu.category,
        unlockPrice: menu.unlockPrice,
        defaultStatus: menu.defaultStatus,
        averageRating: menu.averageRating,
        ratingCount: menu.ratingCount,
        isLocked: true
      };
    }

    // Return full data for unlocked menus
    return {
      ...menu,
      isLocked: false
    };
  });

  res.json({
    success: true,
    data: accessibleMenus
  });
}));

// Get single menu
router.get("/:id", auth, asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid menu ID"
    });
  }

  const menu = await Menu.findById(req.params.id)
    .populate('category')
    .populate('ingredients.ingredient');

  if (!menu) {
    return res.status(404).json({
      success: false,
      message: "Menu not found"
    });
  }

  res.json({
    success: true,
    data: menu
  });
}));

// Create menu
router.post("/", auth, asyncHandler(async (req, res) => {
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
    isActive
  } = req.body;

  // Basic validation
  if (!name || !ingredients || !description || !category) {
    return res.status(400).json({
      success: false,
      message: "Required fields missing"
    });
  }

  // Validate category
  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    return res.status(400).json({
      success: false,
      message: "Category not found"
    });
  }

  // Validate ingredients
  const ingredientIds = ingredients.map(ing => ing.ingredient);
  const existingIngredients = await Ingredient.find({
    _id: { $in: ingredientIds }
  });

  if (existingIngredients.length !== ingredientIds.length) {
    return res.status(400).json({
      success: false,
      message: "Some ingredients not found"
    });
  }

  const menu = new Menu({
    name,
    ingredients: ingredients.map(ing => ({
      ingredient: ing.ingredient,
      weight: ing.weight,
      unit: ing.unit
    })),
    description,
    cookingTime,
    difficulty,
    servingSize,
    defaultStatus: defaultStatus || 'lock',
    category,
    tags: tags || [],
    image,
    calories,
    nutritionalInfo,
    unlockPrice: unlockPrice || 0,
    averageRating: averageRating || 0,
    isActive: isActive ?? true
  });

  await menu.save();

  res.status(201).json({
    success: true,
    message: "Menu created successfully",
    data: menu
  });
}));

// Purchase menu
router.post("/:menuId/purchase", auth, asyncHandler(async (req, res) => {
  const { menuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(menuId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid menu ID"
    });
  }

  const [user, menu] = await Promise.all([
    User.findById(req.user._id),
    Menu.findById(menuId)
  ]);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  if (!menu) {
    return res.status(404).json({
      success: false,
      message: "Menu not found"
    });
  }

  if (menu.defaultStatus === 'unlock') {
    return res.status(400).json({
      success: false,
      message: "Menu is already unlocked"
    });
  }

  const alreadyPurchased = user.purchasedMenus?.some(p => 
    p.menuId?.toString() === menuId
  );

  if (alreadyPurchased) {
    return res.status(400).json({
      success: false,
      message: "Menu already purchased"
    });
  }

  if (user.xu < menu.unlockPrice) {
    return res.status(400).json({
      success: false,
      message: `Insufficient xu balance. Required: ${menu.unlockPrice}, Current: ${user.xu}`
    });
  }

  user.xu -= menu.unlockPrice;
  user.purchasedMenus.push({ menuId });
  await user.save();

  res.json({
    success: true,
    message: "Menu purchased successfully",
    remainingXu: user.xu,
    menuId: menuId
  });
}));

module.exports = router;