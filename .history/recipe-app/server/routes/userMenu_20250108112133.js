const express = require("express");  
const router = express.Router();  
const { Menu, User, UserMenu } = require("../models/models");  

router.post("/purchase", async (req, res) => {  
  const { userId, menuId } = req.body;  

  try {  
    const user = await User.findById(userId);  
    const menu = await Menu.findById(menuId);  

    if (!user || !menu) {  
      return res.status(404).json({ message: "User or Menu not found." });  
    }  

    console.log("User Coins:", user.coins);  
    console.log("Menu Unlock Price:", menu.unlockPrice);  

    // Kiểm tra số coins  
    if (user.coins < menu.unlockPrice) {  
      return res.status(400).json({ message: "Not enough coins." });  
    }  

    const existingUserMenu = await UserMenu.findOne({ userId, menuId });  
    if (existingUserMenu) {  
      return res.status(400).json({ message: "Menu already unlocked." });  
    }  

    // Trừ coins và lưu  
    user.coins -= menu.unlockPrice;  
    await user.save();  

    // Lưu menu vào UserMenu  
    const userMenu = new UserMenu({ userId, menuId });  
    await userMenu.save();  

    res.status(200).json({ message: "Menu unlocked successfully!", userCoins: user.coins });  
  } catch (error) {  
    console.error("Error purchasing menu:", error);  
    res.status(500).json({ message: "An error occurred.", error });  
  }  
});  

// Lấy danh sách menu đã mua  
router.get("/:userId", async (req, res) => {  
  try {  
    const userMenus = await UserMenu.find({ userId: req.params.userId }).populate("menuId");  

    if (!userMenus.length) {  
      return res.status(404).json({ message: "No purchased menus found for this user." });  
    }  

    res.status(200).json(userMenus);  
  } catch (error) {  
    console.error("Error fetching user menus:", error);  
    res.status(500).json({ message: "An error occurred.", error });  
  }  
});  

module.exports = router;  