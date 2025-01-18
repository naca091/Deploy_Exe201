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


router.post("/purchase", async (req, res) => {  
  console.log("Purchase route hit!");
  console.log("Request body:", req.body);

  const { userId, menuId } = req.body;

  try {  
    // Kiểm tra dữ liệu
    if (!userId || !menuId) {
      console.log("Missing userId or menuId");
      return res.status(400).json({ message: "UserId and MenuId are required." });
    }

    // Truy vấn User và Menu
    const user = await User.findById(userId);
    console.log("User found:", user);

    const menu = await Menu.findById(menuId);
    console.log("Menu found:", menu);

    if (!user) {  
      return res.status(404).json({ message: "User not found." });  
    }  

    if (!menu) {  
      return res.status(404).json({ message: "Menu not found." });  
    }  

    // Kiểm tra số coins
    console.log(`User coins: ${user.coins}, Menu price: ${menu.unlockPrice}`);
    if (user.coins < menu.unlockPrice) {  
      return res.status(400).json({ message: "Not enough coins." });  
    }  

    // Kiểm tra xem menu đã được mua chưa
    const existingPurchase = await UserMenu.findOne({ userId, menuId });
    console.log("Existing purchase:", existingPurchase);

    if (existingPurchase) {
      return res.status(400).json({ message: "Menu has already been purchased." });
    }

    // Thêm menu vào danh sách đã mua
    const newUserMenu = new UserMenu({ userId, menuId });  
    await newUserMenu.save();

    console.log("New purchase saved:", newUserMenu);

    // Cập nhật số coins của người dùng
    user.coins -= menu.unlockPrice;  
    await user.save();  

    console.log("User coins updated:", user.coins);

    res.status(200).json({ 
      message: "Menu purchased successfully!", 
      userCoins: user.coins 
    });  
  } catch (error) {  
    console.error("Error purchasing menu:", error.message, error.stack);  
    res.status(500).json({ 
      message: "An error occurred while purchasing the menu.", 
      error: error.message 
    });  
  }  
});


module.exports = router;