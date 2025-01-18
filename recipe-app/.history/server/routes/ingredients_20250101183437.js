const express = require('express');
const router = express.Router();
const { User, Role, Menu, UserMenu, Category, Ingredient } = require('../models/models');

// Get all ingredients
router.get('/ingredients', async (req, res) => {
    try {
        const ingredients = await Ingredient.find().sort({ name: 1 });
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ingredients', error: error.message });
    }
});

// Get single ingredient
router.get('/ingredients/:id', async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id);
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }
        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ingredient', error: error.message });
    }
});

// Create ingredient
router.post('/ingredients', async (req, res) => {
    try {
        const { name } = req.body;
        
        // Check for existing ingredient
        const existingIngredient = await Ingredient.findOne({ name: name });
        if (existingIngredient) {
            return res.status(400).json({ message: 'Ingredient already exists' });
        }

        const ingredient = new Ingredient({ name });
        await ingredient.save();
        
        res.status(201).json(ingredient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ingredient', error: error.message });
    }
});

// Update ingredient
router.put('/api/ingredients/:id', async (req, res) => {
    try {
        const { name } = req.body;
        
        // Check for existing ingredient with same name but different ID
        const existingIngredient = await Ingredient.findOne({ 
            name: name, 
            _id: { $ne: req.params.id } 
        });
        
        if (existingIngredient) {
            return res.status(400).json({ message: 'Ingredient name already exists' });
        }

        const ingredient = await Ingredient.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );

        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ingredient', error: error.message });
    }
});

// Delete ingredient
router.delete('/api/ingredients/:id', async (req, res) => {
    try {
        const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
        
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        res.json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ingredient', error: error.message });
    }
});

module.exports = router;