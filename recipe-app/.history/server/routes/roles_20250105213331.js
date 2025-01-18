const express = require('express');
const { Role } = require('../models/models');
const router = express.Router();

// Get all roles
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find().sort({ roleId: 1 });
        res.json({
            success: true,
            data: roles
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch roles'
        });
    }
});

// Get role by ID
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }
        res.json({
            success: true,
            data: role
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch role'
        });
    }
});

// Create new role
router.post('/', async (req, res) => {
    try {
        const { roleId, roleName } = req.body;

        // Check if role already exists
        const existingRole = await Role.findOne({ 
            $or: [{ roleId }, { roleName }] 
        });
        
        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: 'Role ID or name already exists'
            });
        }

        const role = new Role({ roleId, roleName });
        await role.save();

        res.status(201).json({
            success: true,
            data: role,
            message: 'Role created successfully'
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to create role'
        });
    }
});

// Update role
router.put('/:id', async (req, res) => {
    try {
        const { roleId, roleName } = req.body;

        // Check if role exists with same ID or name but different document ID
        const existingRole = await Role.findOne({
            _id: { $ne: req.params.id },
            $or: [{ roleId }, { roleName }]
        });

        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: 'Role ID or name already exists'
            });
        }

        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { roleId, roleName },
            { new: true, runValidators: true }
        );

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        res.json({
            success: true,
            data: role,
            message: 'Role updated successfully'
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: Object.values(error.errors).map(err => err.message).join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Failed to update role'
        });
    }
});

// Delete role
router.delete('/:id', async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        res.json({
            success: true,
            message: 'Role deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete role'
        });
    }
});

module.exports = router;