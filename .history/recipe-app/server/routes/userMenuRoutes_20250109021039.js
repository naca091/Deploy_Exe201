const express = require("express");  
const router = express.Router();  
const { User, Menu, UserMenu } = require("../models/models");  

// Create new user menu purchase
router.post('/', async (req, res) => {
    const { userId, menuId } = req.body;
    
    try {
      // Find user by userId (not _id)
      const user = await User.findOne({ userId: userId });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      const menu = await Menu.findById(menuId);
      if (!menu) {
        return res.status(404).json({
          success: false,
          message: 'Menu not found'
        });
      }
  
      // Check if already purchased
      const existingPurchase = await UserMenu.findOne({
        userId: user._id,
        menuId: menu._id
      });
  
      if (existingPurchase) {
        return res.status(400).json({
          success: false,
          message: 'Menu already purchased'
        });
      }
  
      // Check xu balance
      if (user.xu < menu.unlockPrice) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient xu balance'
        });
      }
  
      // Create purchase record
      const userMenu = new UserMenu({
        userId: user._id,
        menuId: menu._id
      });
      await userMenu.save();
  
      // Update user's xu
      user.xu -= menu.unlockPrice;
      await user.save();
  
      return res.json({
        success: true,
        message: 'Menu purchased successfully',
        unlockPrice: menu.unlockPrice,
        Xu: user.xu
      });
  
    } catch (error) {
      console.error('Purchase menu error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  });
  
  // Check if menu is unlocked for user
  router.get('/check-status/:menuId', async (req, res) => {
    const { userId } = req.query;
    const { menuId } = req.params;
  
    try {
      const user = await User.findOne({ userId: userId });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      const userMenu = await UserMenu.findOne({
        userId: user._id,
        menuId: menuId
      });
  
      return res.json({
        isUnlocked: !!userMenu
      });
    } catch (error) {
      console.error('Check status error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  });
  
  // Get all unlocked menus for user
  router.get('/api/usermenus/users/:userId', async (req, res) => {  
    const { userId } = req.params;  

    try {  
        // Check and find user by _id  
        const userMenus = await UserMenu.find({ userId: userId }); // Assuming userId is in the `UserMenu` schema  
        
        //  OR if userId should reference the user's _id, you might need to do this  
        // const userMenus = await UserMenu.find({ userId: userId }); // Adjust based on your schema  
        // OR  
        // const userMenus = await UserMenu.find({ userId: mongoose.Types.ObjectId(userId) });  

        if (!userMenus || userMenus.length === 0) {  
            return res.status(404).json({  
                success: false,  
                message: 'No menus found for this user.',  
            });  
        }  

        res.json({  
            success: true,  
            menus: userMenus,  
        });  
    } catch (error) {  
        console.error('Error fetching user menus:', error);  
        res.status(500).json({  
            success: false,  
            message: 'Internal server error',  
        });  
    }  
});
  
  module.exports = router;