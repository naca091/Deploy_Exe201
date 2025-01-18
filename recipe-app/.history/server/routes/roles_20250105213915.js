const express = require('express');
const { Role } = require("../models/models");
const router = express.Router();

// Get all roles
router.get('/api/roles', async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching roles', error: error.message });
    }
});

// Add a new role
router.post('/api/roles', async (req, res) => {
    const { roleId, roleName } = req.body;

    try {
        const roleExists = await Role.findOne({ roleId });
        if (roleExists) {
            return res.status(400).json({ success: false, message: 'Role ID already exists' });
        }

        const newRole = new Role({ roleId, roleName });
        await newRole.save();
        res.status(201).json({ success: true, data: newRole });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating role', error: error.message });
    }
});

// Update a role
router.put('/api/roles/:id', async (req, res) => {
    const { id } = req.params;
    const { roleId, roleName } = req.body;

    try {
        const updatedRole = await Role.findByIdAndUpdate(
            id,
            { roleId, roleName },
            { new: true, runValidators: true }
        );

        if (!updatedRole) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        res.status(200).json({ success: true, data: updatedRole });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating role', error: error.message });
    }
});

// Delete a role
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRole = await Role.findByIdAndDelete(id);

        if (!deletedRole) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        res.status(200).json({ success: true, message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting role', error: error.message });
    }
});

module.exports = router;
