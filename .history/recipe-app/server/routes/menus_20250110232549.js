const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/upload", upload.single("image"), menuController.uploadImage);
router.post("/api/menus", menuController.createMenu);
router.get("/api/menus", menuController.getAllMenus);
router.get("/api/menus/:id", menuController.getMenuById);
router.put("/api/menus/:id", menuController.updateMenu);
router.delete("/api/menus/:id", menuController.deleteMenu);
router.post('/api/menus/purchase', authMiddleware, menuController.purchaseMenu);

module.exports = router;