const express = require('express');
const router = express.Router();
const { Category } = require('../models/models');
const debug = require('debug')('app:categories');

// Logging middleware for all category routes
router.use((req, res, next) => {
    debug(`${req.method} ${req.originalUrl}`);
    debug('Request body:', req.body);
    next();
});

// Get all categories
router.get('/api/categories', async (req, res) => {
    try {
        debug('Fetching all categories');
        const categories = await Category.find().sort({ name: 1 });
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

// Get single category
router.get('/api/categories/:id', async (req, res) => {
    try {
        debug('Fetching category with id:', req.params.id);
        const category = await Category.findById(req.params.id);
        
        if (!category) {
            debug('Category not found');
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }
        
        debug('Found Category:', category);
        res.json({
            success: true,
            data: category
        });
    } catch (error) {
        debug('Error fetching category:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message
        });
    }
});

// Create category
router.post('/api/categories', async (req, res) => {
    try {
        debug('Creating new category with data:', req.body);
        const { name } = req.body;  // Chỉ lấy name từ request

        // Validation
        if (!name) {
            debug('Missing required fields');
            return res.status(400).json({
                success: false,
                message: 'Name is required'
            });
        }

        // Check for existing category
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            debug('Category already exists:', name);
            return res.status(400).json({
                success: false,
                message: 'Category already exists'
            });
        }

        // Chỉ tạo với field name
        const category = new Category({ name });

        await category.save();
        debug('Category created successfully:', category);
        
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category
        });
    } catch (error) {
        debug('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
});

// Update Category
router.put('/api/categories/:id', async (req, res) => {
    try {
        debug('Updating category with id:', req.params.id);
        debug('Update data:', req.body);
        
        const { name} = req.body;

        if (name) {
            const existingCategory = await Category.findOne({
                name,
                _id: { $ne: req.params.id }
            });

            if (existingCategory) {
                debug('Category name already exists:', name);
                return res.status(400).json({
                    success: false,
                    message: 'Category name already exists'
                });
            }
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            { name},
            { new: true, runValidators: true }
        );

        if (!category) {
            debug('Category not found for update');
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        debug('Category updated successfully:', category);
        res.json({
            success: true,
            message: 'Category updated successfully',
            data: category
        });
    } catch (error) {
        debug('Error updating category:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating category',
            error: error.message
        });
    }
});

// Delete category
router.delete('/api/categories/:id', async (req, res) => {
    try {
        debug('Deleting category with id:', req.params.id);
        
        const category = await Category.findByIdAndDelete(req.params.id);
        
        if (!category) {
            debug('Category not found for deletion');
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        debug('Category deleted successfully');
        res.json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        debug('Error deleting category:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting category',
            error: error.message
        });
    }
});

module.exports = router;