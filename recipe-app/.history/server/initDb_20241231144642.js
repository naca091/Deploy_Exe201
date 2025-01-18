const mongoose = require('mongoose');
const { Role } = require('./models');

const initializeRoles = async () => {
  try {
    // Kiểm tra xem đã có roles chưa
    const existingRoles = await Role.find();
    if (existingRoles.length === 0) {
      // Nếu chưa có, tạo mới roles
      await Role.create([
        {
          roleId: 1,
          roleName: 'member',
          description: 'Regular member',
          permissions: ['view_menu']
        },
        {
          roleId: 2,
          roleName: 'admin',
          description: 'Administrator',
          permissions: ['create_menu', 'edit_menu', 'delete_menu', 'manage_users', 'view_analytics']
        },
        {
          roleId: 3,
          roleName: 'vipmember',
          description: 'VIP Member',
          permissions: ['view_menu']
        }
      ]);
      console.log('✅ Roles initialized successfully');
    } else {
      console.log('ℹ️ Roles already exist, skipping initialization');
    }
  } catch (error) {
    console.error('❌ Error initializing roles:', error);
  }
};