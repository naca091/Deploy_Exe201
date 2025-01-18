const mongoose = require('mongoose');
const validator = require('validator');
const dotenv = require("dotenv");
require('dotenv').config({ path: 'ENV_FILENAME' });

dotenv.config();
// Role Schema
const roleSchema = new mongoose.Schema({
  roleId: { 
    type: Number, 
    required: true, 
    unique: true,
    enum: [1, 2, 3] // 1: admin, 2: member, 3: vipmember
  },
  roleName: { 
    type: String, 
    required: true,
    enum: ['admin', 'member', 'vipmember']
  }
}, { timestamps: true });

// User Schema 
const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true
  },
  address: { 
    type: String,
    trim: true
  },
  phone: { 
    type: String,
    validate: {
      validator: function(v) {
        return /\d{10,11}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  coins: { 
    type: Number, 
    default: 0,
    min: [0, 'Coins cannot be negative']
  },
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role', 
    required: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: [4, 'Username must be at least 4 characters long']
  },
  password: { 
    type: String, 
    required: true,
    minlength: [6, 'Password must be at least 6 characters long']
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ingredient Schema
const ingredientSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    unique: true
  }
}, { timestamps: true });

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    unique: true
  }
}, { timestamps: true });

// Menu Schema
const menuSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  ingredients: [{
    ingredient: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Ingredient',
      required: true
    },
    weight: { 
      type: Number, 
      required: true,
      min: [0, 'Weight cannot be negative']
    }
  }],
  description: { 
    type: String,
    trim: true
  },
  servingSize: { 
    type: Number, 
    required: true,
    min: [1, 'Serving size must be at least 1']
  },
  defaultStatus: { 
    type: String, 
    enum: ['lock', 'unlock'], 
    default: 'lock'
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true
  },
  image: { 
    type: String,
    required: [true, 'Menu image is required']
  },
  calories: { 
    type: Number,
    required: true,
    min: [0, 'Calories cannot be negative']
  },
  unlockPrice: {
    type: Number,
    required: true,
    min: [0, 'Unlock price cannot be negative'],
    default: 100 // Giá mặc định để mở khóa menu
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Thêm virtual field để tính số người đã mở khóa menu
menuSchema.virtual('unlockCount', {
  ref: 'UserMenu',
  localField: '_id',
  foreignField: 'menuId',
  count: true 
});

// UserMenu Schema
const userMenuSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  menuId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Menu', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['lock', 'unlock'], 
    required: true 
  },
  unlockedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Create indexes
userMenuSchema.index({ userId: 1, menuId: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
menuSchema.index({ name: 1 });
menuSchema.index({ category: 1 });

// Export models
module.exports = {
  Role: mongoose.model('Role', roleSchema),
  User: mongoose.model('User', userSchema),
  Ingredient: mongoose.model('Ingredient', ingredientSchema),
  Category: mongoose.model('Category', categorySchema),
  Menu: mongoose.model('Menu', menuSchema),
  UserMenu: mongoose.model('UserMenu', userMenuSchema)
};