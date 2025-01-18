const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const menuController = require("../controllers/menuController");
const authMiddleware = require("../routes/authMiddleware");

// Cấu hình multer cho upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post("/upload", upload.single("image"), menuController.uploadImage);
router.post("/api/menus", menuController.createMenu);
router.get("/api/menus", menuController.getAllMenus);
router.get("/api/menus/:id", menuController.getMenuById);
router.put("/api/menus/:id", menuController.updateMenu);
router.delete("/api/menus/:id", menuController.deleteMenu);
router.post('/api/menus/purchase', authMiddleware, menuController.purchaseMenu);
router.post('/api/menus/purchase', function(req, res){
  authMiddleware, menuController.purchaseMenu
});
module.exports = router;