const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const { Menu, Category, Ingredient, User } = require("../models/models");
const auth = require('../middleware/auth');
const debug = require('debug')('app:menus');

// Middleware for request logging
router.use((req, res, next) => {
    debug(`${req.method} ${req.originalUrl}`);
    debug('Headers:', req.headers);
    debug('Body:', req.body);
    next();
});

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Upload file route
router.post("/upload", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        res.json({
            success: true,
            message: "File uploaded successfully",
            filePath: `/uploads/${req.file.filename}`,
        });
    } catch (error) {
        debug("Error uploading file:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error });
    }
});

// Create menu route
router.post("/", async (req, res) => {
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

        if (!name || !ingredients || !description || !category || !image) {
            return res.status(400).json({ success: false, message: "Required fields are missing" });
        }

        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(400).json({ success: false, message: "Category not found" });
        }

        const ingredientIds = ingredients.map((ing) => ing.ingredient);
        const existingIngredients = await Ingredient.find({ _id: { $in: ingredientIds } });
        if (existingIngredients.length !== ingredientIds.length) {
            return res.status(400).json({ success: false, message: "Some ingredients not found" });
        }

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
        res.status(201).json({ success: true, message: "Menu created successfully", data: menu });
    } catch (error) {
        debug("Error creating menu:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
});

// Get menus with user-specific access
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const menus = await Menu.find().populate("category").populate("ingredients.ingredient").lean();

        const accessibleMenus = menus.map(menu => {
            const isUnlocked = menu.defaultStatus === 'unlock' || user.purchasedMenus.some(p => p.menuId.equals(menu._id));
            return isUnlocked || menu.defaultStatus !== 'lock'
                ? { ...menu, isLocked: false }
                : {
                    _id: menu._id,
                    name: menu.name,
                    image: menu.image,
                    description: menu.description,
                    category: menu.category,
                    unlockPrice: menu.unlockPrice,
                    defaultStatus: menu.defaultStatus,
                    averageRating: menu.averageRating,
                    isLocked: true,
                };
        });

        res.json(accessibleMenus);
    } catch (error) {
        debug("Error fetching menus:", error);
        res.status(500).json({ success: false, message: "Error fetching menus", error: error.message });
    }
});
// Update menu by ID
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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



// Route mua menu  
router.post("/:menuId/purchase", auth, async (req, res) => {
  try {
    const { menuId } = req.params;
    console.log('Purchase attempt for menuId:', menuId);
    console.log('User ID from auth:', req.user._id);

    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      throw new Error('Invalid menu ID format');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error('User not found');
    }

    const menu = await Menu.findById(menuId);
    if (!menu) {
      throw new Error('Menu not found');
    }

    if (menu.defaultStatus === 'unlock') {
      throw new Error('This menu is already unlocked');
    }

    const alreadyPurchased = user.purchasedMenus.some(p => 
      p.menuId && p.menuId.toString() === menuId
    );
    if (alreadyPurchased) {
      throw new Error('Menu already purchased');
    }

    if (user.xu < menu.unlockPrice) {
      throw new Error(`Insufficient xu balance. Required: ${menu.unlockPrice}, Current: ${user.xu}`);
    }

    // Cập nhật user
    user.xu -= menu.unlockPrice;
    user.purchasedMenus.push({ menuId });
    await user.save();
    
    res.json({ 
      success: true,
      message: 'Menu purchased successfully',
      remainingXu: user.xu,
      menuId: menuId
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(400).json({ 
      success: false,
      message: error.message
    });
  }
});

module.exports = router;