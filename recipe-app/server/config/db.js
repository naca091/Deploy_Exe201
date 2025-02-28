const mongoose = require('mongoose');
const validator = require('validator');const AutoIncrement = require('mongoose-sequence')(mongoose);
const jwt = require('jsonwebtoken');  
const JWT_SECRET = "1f5171c9fc9d21958f87da31626db489da6e621c2444d0bbfcc24c293b6f9b71";

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  id: {
    type: Number,
    required: true,  // Add this to make id required
    unique: true
  }
}, { timestamps: true });
// User Schema
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
        return /^(\+84|84|0)?[1-9]\d{8,9}$/.test(v);
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
  xu: { 
    type: Number, 
    required: true,
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
    type: String, // Lưu trực tiếp mật khẩu mà không băm
    required: true
  },
  lastLogin: {
    type: Date
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },

  purchasedMenus: [{
    menuId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu'
    }
  }],
  rewardedVideos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Video'
}],
}); ({ 
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
  },
  id: {
    type: Number,
    unique: true  // Đảm bảo id là duy nhất
  }
}, { timestamps: true });
ingredientSchema.plugin(AutoIncrement, { inc_field: 'id' });


// Category Schema
const categorySchema = new mongoose.Schema({
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
  timestamps: true,  
  toJSON: { virtuals: true },  
  toObject: { virtuals: true }  
});

// video Schema
const videoSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true,
      trim: true
  },
  videoPath: {
      type: String,
      required: true
  },
  uploadDate: {
      type: Date,
      default: Date.now
  },
  timestamps: true,  
  toJSON: { virtuals: true },  
  toObject: { virtuals: true }  
});
const loginStatSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

//attdence for user
const attendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  }
}, { timestamps: true });

// Composite index to ensure one attendance per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

// Tự động xóa records cũ hơn 30 ngày
loginStatSchema.index({ date: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });




// Menu Virtuals
menuSchema.virtual('totalCookingTime').get(function() {
  return this.cookingTime.prep + this.cookingTime.cook;
});

// UserMenu Middleware
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

// Create and export models
const Role = mongoose.model('Role', roleSchema);
const User = mongoose.model('User', userSchema);
const Ingredient = mongoose.model('Ingredient', ingredientSchema);
const Category = mongoose.model('Category', categorySchema);
const Menu = mongoose.model('Menu', menuSchema);
const Video = mongoose.model('Video', videoSchema);
const LoginStat = mongoose.model('LoginStat', loginStatSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = {
  Role,
  User,
  Ingredient,
  Category,
  Menu,
  Video,
  LoginStat,
  Attendance
};