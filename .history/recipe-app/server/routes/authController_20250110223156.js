// authController.js  
const authService = require('./authService');  

exports.login = async (req, res) => {  
  try {  
    const { email, password } = req.body;  
    const user = await authService.login(email, password);  
    res.json({ success: true, user });  
  } catch (error) {  
    res.status(401).json({ success: false, message: error.message });  
  }  
};  

exports.register = async (req, res) => {  
  try {  
    const { name, email, password } = req.body;  
    const user = await authService.register(name, email, password);  
    res.status(201).json({ success: true, user });  
  } catch (error) {  
    res.status(400).json({ success: false, message: error.message });  
  }  
};