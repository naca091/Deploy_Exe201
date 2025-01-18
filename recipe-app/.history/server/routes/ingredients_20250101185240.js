const express = require('express');
const router = express.Router();
const { Ingredient } = require('../models');
const debug = require('debug')('app:ingredients');

// Logging middleware for all ingredient routes
router.use((req, res, next) => {
    debug(`${req.method} ${req.originalUrl}`);
    debug('Request body:', req.body);
    next();
});

// Get all ingredients
router.get('/api/ingredients', async (req, res) => {
    try {
        debug('Fetching all ingredients');
        const ingredients = await Ingredient.find().sort({ name: 1 });
        debug(`Found ${ingredients.length} ingredients`);
        
        res.json({
            success: true,
            count: ingredients.length,
            data: ingredients
        });
    } catch (error) {
        debug('Error fetching ingredients:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching ingredients',
            error: error.message 
        });
    }
});

// Get single ingredient
router.get('/api/ingredients/:id', async (req, res) => {
    try {
        debug('Fetching ingredient with id:', req.params.id);
        const ingredient = await Ingredient.findById(req.params.id);
        
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
        const { name, category, nutritionalInfo, unit } = req.body;

        // Validation
        if (!name || !category || !unit) {
            debug('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
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

        const ingredient = new Ingredient({
            name,
            category,
            nutritionalInfo,
            unit
        });

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
        
        const { name, category, nutritionalInfo, unit } = req.body;

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
            { name, category, nutritionalInfo, unit },
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