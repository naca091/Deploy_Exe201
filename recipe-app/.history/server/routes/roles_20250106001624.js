const express = require('express');
const router = express.Router();
const { Role } = require('../models/models');

// Logging middleware for all category routes
router.use((req, res, next) => {
    debug(`${req.method} ${req.originalUrl}`);
    debug('Request body:', req.body);
    next();
});

// Get all categories
router.get('/api/roles', async (req, res) => {
    try {
        debug('Fetching all roles');
        const categories = await Category.find().sort({ name: 1 });
        debug(`Found ${categories.length} roles`);
        
        res.json({
            success: true,
            count: roles.length,
            data: roles
        });
    } catch (error) {
        debug('Error fetching roles:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching roles',
            error: error.message 
        });
    }
});

// Get single roles
router.get('/api/roles/:id', async (req, res) => {
    try {
        debug('Fetching roles with id:', req.params.id);
        const role = await Role.findById(req.params.id);
        
        if (!role) {
            debug('Role not found');
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }
        
        debug('Found Role:', role);
        res.json({
            success: true,
            data: role
        });
    } catch (error) {
        debug('Error fetching role:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching role',
            error: error.message
        });
    }
});

// Create role
router.post('/api/roles', async (req, res) => {
    try {
        debug('Creating new role with data:', req.body);
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
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            debug('Role already exists:', name);
            return res.status(400).json({
                success: false,
                message: 'Role already exists'
            });
        }

        // Chỉ tạo với field name
        const role = new Role({ name });

        await role.save();
        debug('Role created successfully:', role);
        
        res.status(201).json({
            success: true,
            message: 'Role created successfully',
            data: role
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