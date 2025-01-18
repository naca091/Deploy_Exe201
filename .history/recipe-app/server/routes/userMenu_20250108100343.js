const express = require("express");
const router = express.Router();
const UserMenu = require("../models/UserMenu");
const User = require("../models/User"); // User schema with coins field
const Menu = require("../models/Menu");

// Purchase menu
router.post("/purchase", async (req, res) => {
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

    // Deduct coins and save
    user.coins -= menu.unlockPrice;
    await user.save();

    // Add to userMenu
    const userMenu = new UserMenu({ userId, menuId });
    await userMenu.save();

    res.status(200).json({ message: "Menu unlocked successfully!" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred.", error });
  }
});

// Get purchased menus for a user
router.get("/:userId", async (req, res) => {
  try {
    const userMenus = await UserMenu.find({ userId: req.params.userId }).populate("menuId");
    res.status(200).json(userMenus);
  } catch (error) {
    res.status(500).json({ message: "An error occurred.", error });
  }
});

module.exports = router;
