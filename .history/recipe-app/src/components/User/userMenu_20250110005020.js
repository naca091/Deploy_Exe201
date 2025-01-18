// /src/api/userMenus.js  

import axios from 'axios';  

export const fetchUserMenus = async (userId) => {  
    return await axios.get(`http://localhost:5000/api/usermenus/users/${userId}`);  
};