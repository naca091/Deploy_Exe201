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


router.post("/api/userMenu/purchase", async (req, res) => {
  const { userId, menuId } = req.body;

  try {
    const user = await User.findById(userId);
    const menu = await Menu.findById(menuId);

    if (!user || !menu) {
      return res.status(404).json({ message: "User or menu not found." });
    }

    if (user.coins < menu.unlockPrice) {
      return res.status(400).json({ message: "Not enough coins." });
    }

    // Deduct xu
    user.xu -= menu.unlockPrice;
    await user.save();

    // Save unlocked menu to userMenu
    const userMenu = new UserMenu({ userId, menuId });
    await userMenu.save();

    return res.status(200).json({ message: "Menu unlocked successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
});

module.exports = router;