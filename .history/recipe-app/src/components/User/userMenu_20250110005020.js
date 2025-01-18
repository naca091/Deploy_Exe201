// /src/api/userMenus.js  

import axios from 'axios';  

export const fetchUserMenus = async (userId) => {  
    return await axios.get(`https://demcalo.onrender.com/api/usermenus/users/${userId}`);  
};