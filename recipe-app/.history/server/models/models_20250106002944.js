const mongoose = require('mongoose');
const validator = require('validator');
const AutoIncrement = require('mongoose-sequence')(mongoose);
const bcrypt = require('bcrypt'); // thay vì 'bcryptjs'
const dotenv = require("dotenv");
require('dotenv').config({ path: 'ENV_FILENAME' });

dotenv.config();

// Role Schema - Thêm description và permissions
const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  id: {
    type: Number,
    unique: true  // Đảm bảo id là duy nhất
  }
}, { timestamps: true });
ingredientSchema.plugin(AutoIncrement, { inc_field: 'id' });

// User Schema - Thêm methods và validations
const userSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  address: { 
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  phone: { 
    type: String,
    validate: {
      validator: function(v) {
        return /^(\+84|84|0)?[1-9]\d{8,9}$/.test(v); // Validate Vietnam phone numbers
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
    min: [0, 'Coins cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Coins must be an integer'
    }
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
    minlength: [4, 'Username must be at least 4 characters long'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: 'Username can only contain letters, numbers and underscores'
    }
  },
  password: { 
    type: String, 
    required: true,
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Không trả về password trong queries
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user is VIP
userSchema.methods.isVIP = function() {
  return this.role.roleId === 3;
};

//ingredients schema
const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  id: {
    type: Number,
    unique: true  // Đảm bảo id là duy nhất
  }
}, { timestamps: true });
ingredientSchema.plugin(AutoIncrement, { inc_field: 'id' });


// Category Schema - Thêm description và icon
const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Menu Schema - Thêm cooking time và difficulty
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
    },
    unit: {
      type: String,
      required: true
    }
  }],
  description: { 
    type: String,
    trim: true
  },
  cookingTime: {
    prep: { type: Number, required: true }, // minutes
    cook: { type: Number, required: true }  // minutes
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
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
  tags: [{
    type: String,
    trim: true
  }],
  image: { 
    type: String,
    required: [true, 'Menu image is required']
  },
  calories: { 
    type: Number,
    required: true,
    min: [0, 'Calories cannot be negative']
  },
  nutritionalInfo: {
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  unlockPrice: {
    type: Number,
    required: true,
    min: [0, 'Unlock price cannot be negative'],
    default: 100
  },
  averageRating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// UserMenu Schema - Thêm rating và bookmark
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
  },
  isBookmarked: {
    type: Boolean,
    default: false
  },
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    ratedAt: Date
  }
}, { timestamps: true });

// Middleware để cập nhật rating trung bình của menu
userMenuSchema.post('save', async function(doc) {
  if (doc.rating && doc.rating.score) {
    const Menu = mongoose.model('Menu');
    const menu = await Menu.findById(doc.menuId);
    
    const newAvgRating = (menu.averageRating * menu.ratingCount + doc.rating.score) / (menu.ratingCount + 1);
    
    await Menu.findByIdAndUpdate(doc.menuId, {
      $set: { averageRating: newAvgRating },
      $inc: { ratingCount: 1 }
    });
  }
});

// Indexes
userMenuSchema.index({ userId: 1, menuId: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
menuSchema.index({ name: 1 });
menuSchema.index({ category: 1 });
menuSchema.index({ tags: 1 });
menuSchema.index({ averageRating: -1 });

// Virtual fields cho Menu
menuSchema.virtual('totalCookingTime').get(function() {
  return this.cookingTime.prep + this.cookingTime.cook;
});

// Export models
module.exports = {
  Role: mongoose.model('Role', roleSchema),
  User: mongoose.model('User', userSchema),
  Ingredient: mongoose.model('Ingredient', ingredientSchema),
  Category: mongoose.model('Category', categorySchema),
  Menu: mongoose.model('Menu', menuSchema),
  UserMenu: mongoose.model('UserMenu', userMenuSchema)
};