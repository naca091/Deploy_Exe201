const express = require("express");  
const router = express.Router();  
const { User, Menu, UserMenu } = require("../models/models");  

router.post('/', async (req, res) => {  
    const { userId, menuId } = req.body;  

    try {  
        // Tìm user và menu trong cơ sở dữ liệu  
        const user = await User.findById(userId);  
        const menu = await Menu.findById(menuId);  

        // Kiểm tra xem user và menu có tồn tại không  
        if (!user || !menu) {  
            return res.status(404).json({ message: "User or menu not found." });  
        }  

        // Thêm menuId vào danh sách menus của user  
        user.menus.push(menuId);  
        await user.save(); // Lưu cập nhật cho người dùng  

        return res.status(200).json({ message: 'Purchase successful', user });  
    } catch (error) {  
        console.error('Error processing purchase:', error);  
        return res.status(500).json({ message: 'Internal server error' });  
    }  
});  

module.exports = router;  