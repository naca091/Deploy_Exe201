const express = require("express");  
const router = express.Router();  
const { Menu, User, UserMenu } = require("../models/models");  

// Purchase menu  
router.post("/api/userMenu/purchase", async (req, res) => {  
  const { userId, menuId } = req.body;  

  try {  
    // Tìm user và menu  
    const user = await User.findById(userId);  
    const menu = await Menu.findById(menuId);  

    // Kiểm tra sự tồn tại của user  
    if (!user) {  
      return res.status(404).json({ message: "User not found." });  
    }  

    // Kiểm tra sự tồn tại của menu  
    if (!menu) {  
      return res.status(404).json({ message: "Menu not found." });  
    }  

    console.log("User Coins:", user.coins); // Debug thông tin coins của user  
    console.log("Menu Unlock Price:", menu.unlockPrice); // Debug thông tin unlock price  

    // Kiểm tra số coins của user  
    if (user.coins < menu.unlockPrice) {  
      return res.status(400).json({ message: "Not enough coins." });  
    }  

    // Kiểm tra xem menu đã được mua chưa  
    const existingUserMenu = await UserMenu.findOne({ userId, menuId });  
    if (existingUserMenu) {  
      return res.status(400).json({ message: "Menu already unlocked." });  
    }  

    // Trừ số xu và lưu lại  
    user.coins -= menu.unlockPrice;  
    await user.save();  

    // Thêm menu vào UserMenu  
    const userMenu = new UserMenu({ userId, menuId });  
    await userMenu.save();  

    res.status(200).json({ message: "Menu unlocked successfully!", userCoins: user.coins });  
  } catch (error) {  
    console.error("Error purchasing menu:", error);  
    res.status(500).json({ message: "An error occurred.", error });  
  }  
});  

// Get purchased menus for a user  
router.get("/api/userMenu/:userId", async (req, res) => {  
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