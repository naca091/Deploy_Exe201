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
router.post("/purchase", (req, res, next) => {
  console.log("Purchase route hit!");
  next(); // Chuyển request đến middleware tiếp theo
});

// Mua menu  
router.post("/purchase", async (req, res) => {  
  const { userId, menuId } = req.body;  

  try {  
    // Kiểm tra dữ liệu userId và menuId
    if (!userId || !menuId) {
      return res.status(400).json({ message: "UserId and MenuId are required." });
    }

    // Tìm kiếm User và Menu
    const user = await User.findById(userId);
    const menu = await Menu.findById(menuId);

    // Nếu không tìm thấy User hoặc Menu
    if (!user) {  
      return res.status(404).json({ message: "User not found." });  
    }  

    if (!menu) {  
      return res.status(404).json({ message: "Menu not found." });  
    }  

    // Kiểm tra số coins của user
    if (user.coins < menu.unlockPrice) {  
      return res.status(400).json({ message: "Not enough coins." });  
    }  

    // Kiểm tra xem menu đã được mua chưa
    const existingPurchase = await UserMenu.findOne({ userId, menuId });
    if (existingPurchase) {
      return res.status(400).json({ message: "Menu has already been purchased." });
    }

    // Thêm menu vào danh sách đã mua
    const newUserMenu = new UserMenu({ userId, menuId });  
    await newUserMenu.save();  

    // Cập nhật số coins của người dùng
    user.coins -= menu.unlockPrice;  
    await user.save();  

    // Trả về phản hồi thành công
    res.status(200).json({ 
      message: "Menu purchased successfully!", 
      userCoins: user.coins 
    });  
  } catch (error) {  
    console.error("Error purchasing menu:", error);  
    res.status(500).json({ 
      message: "An error occurred while purchasing the menu.", 
      error: error.message 
    });  
  }  
});

module.exports = router;