const express = require('express');
const router = express.Router();
const { Ingredient } = require('../models/models');
const debug = require('debug')('app:categories');

// Logging middleware for all ingredient routes
router.use((req, res, next) => {
    debug(`${req.method} ${req.originalUrl}`);
    debug('Request body:', req.body);
    next();
});

// Get all categories
router.get('/api/categories', async (req, res) => {
    try {
        debug('Fetching all categories');
        const categories = await Ingredient.find().sort({ name: 1 });
        debug(`Found ${categories.length} categories`);
        
        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        debug('Error fetching categories:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching categories',
            error: error.message 
        });
    }
});

// Get single ingredient
router.get('/api/categories/:id', async (req, res) => {
    try {
        debug('Fetching category with id:', req.params.id);
        const category = await Category.findById(req.params.id);
        
        if (!ingredient) {
            debug('Ingredient not found');
            return res.status(404).json({
                success: false,
                message: 'Ingredient not found'
            });
        }
        
        debug('Found ingredient:', ingredient);
        res.json({
            success: true,
            data: ingredient
        });
    } catch (error) {
        debug('Error fetching ingredient:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching ingredient',
            error: error.message
        });
    }
});

// Create ingredient
router.post('/api/ingredients', async (req, res) => {
    try {
        debug('Creating new ingredient with data:', req.body);
        const { name } = req.body;  // Chỉ lấy name từ request

        // Validation
        if (!name) {
            debug('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        // Check for existing ingredient
        const existingIngredient = await Ingredient.findOne({ name });
        if (existingIngredient) {
            debug('Ingredient already exists:', name);
            return res.status(400).json({
                success: false,
                message: 'Ingredient already exists'
            });
        }

        // Chỉ tạo với field name
        const ingredient = new Ingredient({ name });

        await ingredient.save();
        debug('Ingredient created successfully:', ingredient);
        
        res.status(201).json({
            success: true,
            message: 'Ingredient created successfully',
            data: ingredient
        });
    } catch (error) {
        debug('Error creating ingredient:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating ingredient',
            error: error.message
        });
    }
});

// Update ingredient
router.put('/api/ingredients/:id', async (req, res) => {
    try {
        debug('Updating ingredient with id:', req.params.id);
        debug('Update data:', req.body);
        
        const { name} = req.body;

        if (name) {
            const existingIngredient = await Ingredient.findOne({
                name,
                _id: { $ne: req.params.id }
            });

            if (existingIngredient) {
                debug('Ingredient name already exists:', name);
                return res.status(400).json({
                    success: false,
                    message: 'Ingredient name already exists'
                });
            }
        }

        const ingredient = await Ingredient.findByIdAndUpdate(
            req.params.id,
            { name},
            { new: true, runValidators: true }
        );

        if (!ingredient) {
            debug('Ingredient not found for update');
            return res.status(404).json({
                success: false,
                message: 'Ingredient not found'
            });
        }

        debug('Ingredient updated successfully:', ingredient);
        res.json({
            success: true,
            message: 'Ingredient updated successfully',
            data: ingredient
        });
    } catch (error) {
        debug('Error updating ingredient:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating ingredient',
            error: error.message
        });
    }
});

// Delete ingredient
router.delete('/api/ingredients/:id', async (req, res) => {
    try {
        debug('Deleting ingredient with id:', req.params.id);
        
        const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
        
        if (!ingredient) {
            debug('Ingredient not found for deletion');
            return res.status(404).json({
                success: false,
                message: 'Ingredient not found'
            });
        }

        debug('Ingredient deleted successfully');
        res.json({
            success: true,
            message: 'Ingredient deleted successfully'
        });
    } catch (error) {
        debug('Error deleting ingredient:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting ingredient',
            error: error.message
        });
    }
});

module.exports = router;