const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { Menu, Category, Ingredient, User } = require("../models/models");
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const debug = require('debug')('app:menus');

// Apply auth middleware to all routes
router.use(auth);

router.use((req, res, next) => {
  debug(`${req.method} ${req.originalUrl}`);
  debug('Request body:', req.body);
  debug('User:', req.user); // Add user debugging
  next();
});

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads")); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Error handler middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// File upload endpoint
router.post("/upload", upload.single("image"), asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  
  res.json({
    success: true,
    message: "File uploaded successfully",
    filePath: `/uploads/${req.file.filename}`,
  });
}));

// Get all menus with authentication
router.get('/', asyncHandler(async (req, res) => {
  // Ensure user exists in request
  if (!req.user?._id) {
    return res.status(401).json({ 
      success: false, 
      message: "Authentication required" 
    });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ 
      success: false, 
      message: "User not found" 
    });
  }

  const menus = await Menu.find()
    .populate('category')
    .populate('ingredients.ingredient')
    .lean();

  const accessibleMenus = menus.map(menu => {
    const isUnlocked = menu.defaultStatus === 'unlock' || 
      user.purchasedMenus.some(p => p.menuId?.equals(menu._id));

    if (!isUnlocked && menu.defaultStatus === 'lock') {
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
router.get("/:id", asyncHandler(async (req, res) => {
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
router.post("/", asyncHandler(async (req, res) => {
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
  if (!name || !ingredients || !description || !category) {
    return res.status(400).json({
      success: false,
      message: "Required fields are missing"
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
}));

// Purchase menu
router.post("/:menuId/purchase", asyncHandler(async (req, res) => {
  const { menuId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(menuId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid menu ID format'
    });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const menu = await Menu.findById(menuId);
  if (!menu) {
    return res.status(404).json({
      success: false,
      message: 'Menu not found'
    });
  }

  if (menu.defaultStatus === 'unlock') {
    return res.status(400).json({
      success: false,
      message: 'This menu is already unlocked'
    });
  }

  const alreadyPurchased = user.purchasedMenus.some(p => 
    p.menuId?.toString() === menuId
  );
  
  if (alreadyPurchased) {
    return res.status(400).json({
      success: false,
      message: 'Menu already purchased'
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
    message: 'Menu purchased successfully',
    remainingXu: user.xu,
    menuId: menuId
  });
}));

module.exports = router;