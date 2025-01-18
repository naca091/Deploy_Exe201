const express = require("express");  
const router = express.Router();  
const { User, Menu, UserMenu } = require("../models/models");  

// Lấy danh sách menus đã mua của người dùng theo userId  
router.get("/:userId", async (req, res) => {  
  try {  
    const userMenus = await UserMenu.find({ userId: req.params.userId }).populate("menuId");  

    if (!userMenus.length) {  
      return res.status(404).json({ message: "No purchased menus found for this user." });  
    }  

    res.status(200).json(userMenus);  
  } catch (error) {  
    console.error("Error fetching user menus:", error);  
    res.status(500).json({ message: "An error occurred while fetching user menus.", error });  
  }  
});  

// Mua menu  
router.post("/purchase", async (req, res) => {  
  const { userId, menuId } = req.body;  

  try {  
    const user = await User.findById(userId);  
    const menu = await Menu.findById(menuId);  

    if (!user || !menu) {  
      return res.status(404).json({ message: "User or Menu not found." });  
    }  

    // Kiểm tra số coins  
    if (user.coins < menu.unlockPrice) {  
      return res.status(400).json({ message: "Not enough coins." });  
    }  

    // Thêm menu vào danh sách menu đã mua  
    const newUserMenu = new UserMenu({ userId, menuId });  
    await newUserMenu.save();  

    // Cập nhật số coins của người dùng  
    user.coins -= menu.unlockPrice;  
    await user.save();  

    res.status(200).json({ message: "Menu purchased successfully!", userCoins: user.coins });  
  } catch (error) {  
    console.error("Error purchasing menu:", error);  
    res.status(500).json({ message: "An error occurred while purchasing the menu.", error });  
  }  
});  

module.exports = router;