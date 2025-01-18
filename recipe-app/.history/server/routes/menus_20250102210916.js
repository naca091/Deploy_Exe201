const express = require('express');
const router = express.Router();

const debug = require('debug')('app:menus');

// Logging middleware
router.use((req, res, next) => {
    debug(`${req.method} ${req.originalUrl}`);
    debug('Request body:', req.body);
    next();
});

// Get all menus
router.get('/api/menus', async (req, res) => {
    try {
        const filters = { isActive: true };
        if (req.query.category) filters.category = req.query.category;
        if (req.query.difficulty) filters.difficulty = req.query.difficulty;
        if (req.query.tags) filters.tags = { $in: req.query.tags.split(',') };
        
        const sortOptions = req.query.sort ? 
            { [req.query.sort.split(':')[0]]: req.query.sort.split(':')[1] === 'desc' ? -1 : 1 } : 
            { createdAt: -1 };

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const menus = await Menu.find(filters)
            .populate('category', 'name')
            .populate('ingredients.ingredient', 'name')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const total = await Menu.countDocuments(filters);

        res.json({
            success: true,
            data: menus,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching menus',
            error: error.message 
        });
    }
});

// Get menu by ID
router.get('/api/menus/:id', async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id)
            .populate('category', 'name')
            .populate('ingredients.ingredient', 'name');
            
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }

        res.json({
            success: true,
            data: menu
        });
    } catch (error) {
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
        const menuData = {
            ...req.body,
            image: req.file.path,
            ingredients: JSON.parse(req.body.ingredients),
            nutritionalInfo: JSON.parse(req.body.nutritionalInfo),
            cookingTime: JSON.parse(req.body.cookingTime),
            tags: req.body.tags.split(',').map(tag => tag.trim())
        };

        const menu = new Menu(menuData);
        await menu.save();
        
        res.status(201).json({
            success: true,
            message: 'Menu created successfully',
            data: menu
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating menu',
            error: error.message
        });
    }
});

// Update menu
router.put('/api/menus/:id', async (req, res) => {
    try {
        const updateData = { ...req.body };
        
        if (req.file) updateData.image = req.file.path;
        if (req.body.ingredients) updateData.ingredients = JSON.parse(req.body.ingredients);
        if (req.body.nutritionalInfo) updateData.nutritionalInfo = JSON.parse(req.body.nutritionalInfo);
        if (req.body.cookingTime) updateData.cookingTime = JSON.parse(req.body.cookingTime);
        if (req.body.tags) updateData.tags = req.body.tags.split(',').map(tag => tag.trim());

        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Menu updated successfully',
            data: menu
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating menu',
            error: error.message
        });
    }
});

// Delete menu (soft delete)
router.delete('/api/menus/:id', async (req, res) => {
    try {
        const menu = await Menu.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        
        if (!menu) {
            return res.status(404).json({
                success: false,
                message: 'Menu not found'
            });
        }
        
        res.json({
            success: true,
            message: 'Menu deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting menu',
            error: error.message
        });
    }
});

// Search menus
router.get('/api/menus/search', async (req, res) => {
    try {
        const searchQuery = req.query.q;
        const menus = await Menu.find({
            $and: [
                { isActive: true },
                {
                    $or: [
                        { name: { $regex: searchQuery, $options: 'i' } },
                        { description: { $regex: searchQuery, $options: 'i' } },
                        { tags: { $in: [new RegExp(searchQuery, 'i')] } }
                    ]
                }
            ]
        })
        .populate('category', 'name')
        .limit(10);
        
        res.json({
            success: true,
            data: menus
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error searching menus',
            error: error.message
        });
    }
});

module.exports = router;