const express = require("express");  
const router = express.Router();  
const { User, Menu, UserMenu } = require("../models/models");  

// Mua menu và ghi nhận vào userMenu  
router.post("/api/usermenus", async (req, res) => {  
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
      const usermenus = new UserMenu({ userId, menuId });  
      await usermenus.save();  

      return res.status(200).json({ message: "Menu unlocked successfully!" });  
  } catch (error) {  
      console.error("Error during menu purchase:", error);  
      return res.status(500).json({ message: "Internal server error", error });  
  }  
});  
module.exports = router;