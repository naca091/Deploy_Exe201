const express = require("express");  
const router = express.Router();  
const { User, Menu, UserMenu } = require("../models/models");  

// Lấy danh sách menus đã mua của người dùng theo userId  
router.get("/:userId", async (req, res) => {  
  try {  
    // Tìm danh sách menus đã mua của người dùng  
    const usermenus = await UserMenu.find({ userId: req.params.userId }).populate("menuId");  

    if (!usermenus.length) {  
      return res.status(404).json({ message: "No purchased menus found for this user." });  
    }  

    // Trả về danh sách menus đã mua  
    res.status(200).json(userMenus);  
  } catch (error) {  
    console.error("Error fetching user menus:", error);  
    res.status(500).json({ message: "An error occurred while fetching user menus.", error });  
  }  
});  

// Mua menu và ghi nhận vào userMenu  
router.post("/purchase", async (req, res) => {  
  const { userId, menuId } = req.body;  

  try {  
      // Tìm người dùng và menu từ cơ sở dữ liệu  
      const user = await User.findById(userId);  
      const menu = await Menu.findById(menuId);  

      if (!user || !menu) {  
          return res.status(404).json({ message: "User or menu not found." });  
      }  

      // Kiểm tra xem người dùng có đủ xu không  
      if (user.xu < menu.unlockPrice) {  
          return res.status(400).json({ message: "Not enough xu." });  
      }  

      // Trừ xu  
      user.xu -= menu.unlockPrice;  
      await user.save();  

      // Lưu menu đã mở khóa vào UserMenu  
      const userMenu = new UserMenu({ userId, menuId });  
      await userMenu.save();  

      return res.status(200).json({ message: "Menu unlocked successfully!" });  
  } catch (error) {  
      console.error("Error during menu purchase:", error);  
      return res.status(500).json({ message: "Internal server error", error });  
  }  
});  
module.exports = router;