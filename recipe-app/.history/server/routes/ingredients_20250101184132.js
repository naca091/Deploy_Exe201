const express = require('express');
const router = express.Router();
const { Ingredient } = require('../models/models'); // Chỉnh sửa import để lấy từ models.js

// Get all ingredients
router.get('/api/ingredients', async (req, res) => {
    try {
        const ingredients = await Ingredient.find().sort({ name: 1 });
        res.json({
            success: true,
            data: ingredients
        });
    } catch (error) {
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
        const ingredient = await Ingredient.findById(req.params.id);
        if (!ingredient) {
            return res.status(404).json({
                success: false,
                message: 'Ingredient not found'
            });
        }
        res.json({
            success: true,
            data: ingredient
        });
    } catch (error) {
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
        const { name, category, nutritionalInfo, unit } = req.body;

        // Check for existing ingredient
        const existingIngredient = await Ingredient.findOne({ name });
        if (existingIngredient) {
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
        
        res.status(201).json({
            success: true,
            message: 'Ingredient created successfully',
            data: ingredient
        });
    } catch (error) {
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
        const { name, category, nutritionalInfo, unit } = req.body;

        // Check for existing ingredient with same name but different ID
        if (name) {
            const existingIngredient = await Ingredient.findOne({
                name,
                _id: { $ne: req.params.id }
            });

            if (existingIngredient) {
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
            return res.status(404).json({
                success: false,
                message: 'Ingredient not found'
            });
        }

        res.json({
            success: true,
            message: 'Ingredient updated successfully',
            data: ingredient
        });
    } catch (error) {
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
        const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
        
        if (!ingredient) {
            return res.status(404).json({
                success: false,
                message: 'Ingredient not found'
            });
        }

        res.json({
            success: true,
            message: 'Ingredient deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting ingredient',
            error: error.message
        });
    }
});

module.exports = router;