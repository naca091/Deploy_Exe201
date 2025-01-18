const express = require('express');
const router = express.Router();
const { Menu, Category, Ingredient } = require('../models/models');
const debug = require('debug')('app:menus');

// Logging middleware for all menu routes
router.use((req, res, next) => {
    debug(`${req.method} ${req.originalUrl}`);
    debug('Request body:', req.body);
    next();
});

// Get all menus
router.get('/api/menus', async (req, res) => {
    try {
        debug('Fetching all menus');
        const menus = await Menu.find().sort({ name: 1 });
        debug(`Found ${menus.length} menus`);
        
        res.json({
            success: true,
            count: menus.length,
            data: menus
        });
    } catch (error) {
        debug('Error fetching menus:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching menus',
            error: error.message 
        });
    }
});

// Get single menu
router.get('/api/menus/:id', async (req, res) => {
    try {
        debug('Fetching menu with id:', req.params.id);
        const menu = await Menu.findById(req.params.id);
        
        if (!menu) {
            debug('Menu not found');
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }
        
        debug('Found Menu:', menu);
        res.json({
            success: true,
            data: menu
        });
    } catch (error) {
        debug('Error fetching menu:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching menu',
            error: error.message
        });
    }
});

// Create menu
router.post('/api/menus', async (req, res) => {
    try {
        debug('Creating new menu with data:', req.body);
        const { name, ingredients, description, cookingTime, difficulty, servingSize, defaultStatus, category, tags, image, calories, nutritionalInfo, unlockPrice, averageRating, isActive } = req.body;

        // Validation
        if (!name || !ingredients || !description || !cookingTime || !difficulty || !servingSize || !defaultStatus || !category || !tags || !image || !calories || !nutritionalInfo || !unlockPrice || !averageRating || isActive === undefined) {
            debug('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if category exists
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            debug('Category not found');
            return res.status(400).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if all ingredients exist
        const ingredientIds = ingredients.map(ing => ing.ingredient);
        const existingIngredients = await Ingredient.find({ _id: { $in: ingredientIds } });
        if (existingIngredients.length !== ingredientIds.length) {
            debug('Some ingredients not found');
            return res.status(400).json({
                success: false,
                message: 'Some ingredients not found'
            });
        }

        // Create menu object
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
            defaultStatus,
            category,
            tags,
            image,
            calories,
            nutritionalInfo,
            unlockPrice,
            averageRating,
            isActive
        });

        await menu.save();
        debug('Menu created successfully:', menu);
        
        res.status(201).json({
            success: true,
            message: 'Menu created successfully',
            data: menu
        });
    } catch (error) {
        debug('Error creating menu:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating menu',
            error: error.message
        });
    }
});

// Update Menu
router.put('/api/menus/:id', async (req, res) => {
    try {
        debug('Updating menu with id:', req.params.id);
        debug('Update data:', req.body);
        
        const { name, ingredients, description, cookingTime, difficulty, servingSize, defaultStatus, category, tags, image, calories, nutritionalInfo, unlockPrice, averageRating, isActive } = req.body;

        // Validation
        if (!name || !ingredients || !description || !cookingTime || !difficulty || !servingSize || !defaultStatus || !category || !tags || !image || !calories || !nutritionalInfo || !unlockPrice || !averageRating || isActive === undefined) {
            debug('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if category exists
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            debug('Category not found');
            return res.status(400).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check if all ingredients exist
        const ingredientIds = ingredients.map(ing => ing.ingredient);
        const existingIngredients = await Ingredient.find({ _id: { $in: ingredientIds } });
        if (existingIngredients.length !== ingredientIds.length) {
            debug('Some ingredients not found');
            return res.status(400).json({
                success: false,
                message: 'Some ingredients not found'
            });
        }

        // Update menu
        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            {
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
                defaultStatus,
                category,
                tags,
                image,
                calories,
                nutritionalInfo,
                unlockPrice,
                averageRating,
                isActive
            },
            { new: true, runValidators: true }
        );

        if (!menu) {
            debug('Menu not found for update');
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }

        debug('Menu updated successfully:', menu);
        res.json({
            success: true,
            message: 'Menu updated successfully',
            data: menu
        });
    } catch (error) {
        debug('Error updating menu:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating menu',
            error: error.message
        });
    }
});

// Delete menu
router.delete('/api/menus/:id', async (req, res) => {
    try {
        debug('Deleting menu with id:', req.params.id);
        
        const menu = await Menu.findByIdAndDelete(req.params.id);
        
        if (!menu) {
            debug('Menu not found for deletion');
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }

        debug('Menu deleted successfully');
        res.json({
            success: true,
            message: 'Menu deleted successfully'
        });
    } catch (error) {
        debug('Error deleting menu:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting menu',
            error: error.message
        });
    }
});

module.exports = router;