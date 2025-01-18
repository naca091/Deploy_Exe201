// MongoDB Schema
const mongoose = require('mongoose');

// Role Schema
const roleSchema = new mongoose.Schema({
  roleId: { type: Number, required: true, unique: true },
  roleName: { type: String, required: true }
});

// User Schema 
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Ingredient Schema
const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }
});

// Menu Schema
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{
    ingredient: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
    weight: { type: Number, required: true }
  }],
  description: { type: String },
  servingSize: { type: Number, required: true },
  defaultStatus: { type: String, enum: ['lock', 'unlock'], default: 'lock' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  image: { type: String },
  calories: { type: Number }
});

// UserMenu (Intermediate table for user-specific menu status)
const userMenuSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  menuId: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true },
  status: { type: String, enum: ['lock', 'unlock'], required: true }
});

// Create indexes for better query performance
userMenuSchema.index({ userId: 1, menuId: 1 }, { unique: true });

// Export models
module.exports = {
  Role: mongoose.model('Role', roleSchema),
  User: mongoose.model('User', userSchema),
  Ingredient: mongoose.model('Ingredient', ingredientSchema),
  Category: mongoose.model('Category', categorySchema),
  Menu: mongoose.model('Menu', menuSchema),
  UserMenu: mongoose.model('UserMenu', userMenuSchema)
};