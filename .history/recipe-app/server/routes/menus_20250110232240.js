const express = require("express");  
const router = express.Router();  
const multer = require("multer");  
const path = require("path");  
const menuController = require("../controllers/menuController");  
const authMiddleware = require("./authMiddleware");  

// Configure multer for file uploads  
const storage = multer.diskStorage({  
  destination: (req, file, cb) => {  
    cb(null, path.join(__dirname, "../uploads"));  
  },  
  filename: (req, file, cb) => {  
    cb(null, Date.now() + path.extname(file.originalname));  
  },  
});  
const upload = multer({ storage });  

// File upload endpoint  
router.post("/upload", upload.single("image"), menuController.uploadImage);  

// Menu CRUD endpoints  
router.post("/api/menus", menuController.createMenu);  
router.get("/api/menus", menuController.getAllMenus);  
router.get("/api/menus/:id", menuController.getMenuById);  
router.put("/api/menus/:id", menuController.updateMenu);  
router.delete("/api/menus/:id", menuController.deleteMenu);  
router.post('/api/menus/purchase', authMiddleware, menuController.purchaseMenu);
module.exports = router;