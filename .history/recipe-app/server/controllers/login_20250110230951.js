const { User } = require('../models/models');  
const CustomError = require('../utils/customError');  

const loginController = {  
  login: async (req, res) => {  
    const { email, password } = req.body;  

    try {  
      // Tìm user và so sánh password  
      const user = await User.findOne({ email });  
      if (!user || !(await user.comparePassword(password))) {  
        throw new CustomError(401, 'Email hoặc mật khẩu không đúng');  
      }  

      // Tạo token và trả về  
      const token = await user.generateToken();  
      res.json({ user, token });  
    } catch (error) {  
      console.error('Login Error:', error);  
      res.status(error.code || 500).json({  
        success: false,  
        message: error.message  
      });  
    }  
  }  
};  

module.exports = loginController;