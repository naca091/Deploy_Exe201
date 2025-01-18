const purchaseMenu = async (menuId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://demcalo.onrender.com/api/purchase-menu',
        { menuId },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };