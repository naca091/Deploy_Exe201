const { Menu, Category, Ingredient, User } = require("../models/models");  
const CustomError = require("../utils/customError.js");  

exports.uploadImage = async (req, res) => {  
  try {  
    if (!req.file) {  
      throw new CustomError(400, "No file uploaded");  
    }  
    res.json({  
      success: true,  
      message: "File uploaded successfully",  
      filePath: `/uploads/${req.file.filename}`,  
    });  
  } catch (error) {  
    console.error("Error uploading file:", error);  
    res.status(error.code || 500).json({  
      success: false,  
      message: error.message,  
    });  
  }  
};  

exports.createMenu = async (req, res) => {  
  try {  
    const menu = await this.createMenuWithValidation(req.body);  
    res.status(201).json({  
      success: true,  
      message: "Menu created successfully",  
      data: menu,  
    });  
  } catch (error) {  
    console.error("Error creating menu:", error);  
    res.status(error.code || 500).json({  
      success: false,  
      message: error.message,  
    });  
  }  
};  

exports.createMenuWithValidation = async (menuData) => {  
  const {  
    name,  
    ingredients,  
    description,  
    cookingTime,  
    difficulty,  
    servingSize,  
    defaultStatus,  
    category,  
    tags,  
    image,  
    calories,  
    nutritionalInfo,  
    unlockPrice,  
    averageRating,  
    isActive,  
  } = menuData;  

  // Validate input  
  if (  
    !name ||  
    !ingredients ||  
    !description ||  
    !cookingTime ||  
    !difficulty ||  
    !servingSize ||  
    !defaultStatus ||  
    !category ||  
    !tags ||  
    !image ||  
    !calories ||  
    !nutritionalInfo ||  
    !unlockPrice ||  
    !averageRating ||  
    isActive === undefined  
  ) {  
    throw new CustomError(400, "All fields are required");  
  }  

  // Check if category exists  
  const existingCategory = await Category.findById(category);  
  if (!existingCategory) {  
    throw new CustomError(400, "Category not found");  
  }  

  // Check if all ingredients exist  
  const ingredientIds = ingredients.map((ing) => ing.ingredient);  
  const existingIngredients = await Ingredient.find({  
    _id: { $in: ingredientIds },  
  });  
  if (existingIngredients.length !== ingredientIds.length) {  
    throw new CustomError(400, "Some ingredients not found");  
  }  

  // Create menu  
  const menu = new Menu({  
    name,  
    ingredients: ingredients.map((ing) => ({  
      ingredient: ing.ingredient,  
      weight: ing.weight,  
      unit: ing.unit,  
    })),  
    description,  
    cookingTime,  
    difficulty,  
    servingSize,  
    defaultStatus,  
    category,  
    tags,  
    image,  
    calories,  
    nutritionalInfo,  
    unlockPrice,  
    averageRating,  
    isActive,  
  });  

  await menu.save();  
  return menu;  
};  

exports.getAllMenus = async (req, res) => {  
  try {  
    const { page = 1, limit = 10, sortField = "name", sortOrder = "asc" } = req.query;  
    const menus = await Menu.find()  
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })  
      .skip((page - 1) * limit)  
      .limit(limit);  
    const count = await Menu.countDocuments();  
    res.json({  
      success: true,  
      count,  
      page,  
      limit,  
      data: menus,  
    });  
  } catch (error) {  
    console.error("Error fetching menus:", error);  
    res.status(500).json({  
      success: false,  
      message: "Error fetching menus",  
      error: error.message,  
    });  
  }  
};  

exports.getMenuById = async (req, res) => {  
  try {  
    const menu = await Menu.findById(req.params.id);  
    if (!menu) {  
      throw new CustomError(404, "Menu not found");  
    }  
    res.json({  
      success: true,  
      data: menu,  
    });  
  } catch (error) {  
    console.error("Error fetching menu:", error);  
    res.status(error.code || 500).json({  
      success: false,  
      message: error.message,  
    });  
  }  
};  

exports.updateMenu = async (req, res) => {  
  try {  
    const {  
      name,  
      ingredients,  
      description,  
      cookingTime,  
      difficulty,  
      servingSize,  
      defaultStatus,  
      category,  
      tags,  
      image,  
      calories,  
      nutritionalInfo,  
      unlockPrice,  
      averageRating,  
      isActive,  
    } = req.body;  

    // Check if menu exists  
    const existingMenu = await Menu.findById(req.params.id);  
    if (!existingMenu) {  
      throw new CustomError(404, "Menu not found");  
    }  

    // Check if category exists  
    const existingCategory = await Category.findById(category);  
    if (!existingCategory) {  
      throw new CustomError(400, "Category not found");  
    }  

    // Check if all ingredients exist  
    const ingredientIds = ingredients.map((ing) => ing.ingredient);  
    const existingIngredients = await Ingredient.find({  
      _id: { $in: ingredientIds },  
    });  
    if (existingIngredients.length !== ingredientIds.length) {  
      throw new CustomError(400, "Some ingredients not found");  
    }  

    // Update menu  
    const updatedMenu = await Menu.findByIdAndUpdate(  
      req.params.id,  
      {  
        name,  
        ingredients: ingredients.map((ing) => ({  
          ingredient: ing.ingredient,  
          weight: ing.weight,  
          unit: ing.unit,  
        })),  
        description,  
        cookingTime,  
        difficulty,  
        servingSize,  
        defaultStatus,  
        category,  
        tags,  
        image,  
        calories,  
        nutritionalInfo,  
        unlockPrice,  
        averageRating,  
        isActive,  
      },  
      { new: true, runValidators: true }  
    );  

    res.json({  
      success: true,  
      message: "Menu updated successfully",  
      data: updatedMenu,  
    });  
  } catch (error) {  
    console.error("Error updating menu:", error);  
    res.status(error.code || 500).json({  
      success: false,  
      message: error.message,  
    });  
  }  
};  

exports.deleteMenu = async (req, res) => {  
  try {  
    const menu = await Menu.findByIdAndDelete(req.params.id);  
    if (!menu) {  
      throw new CustomError(404, "Menu not found");  
    }  
    res.json({  
      success: true,  
      message: "Menu deleted successfully",  
    });  
  } catch (error) {  
    console.error("Error deleting menu:", error);  
    res.status(error.code || 500).json({  
      success: false,  
      message: error.message,  
    });  
  }  
};

exports.purchaseMenu = async (req, res) => {  
  const { menuId } = req.body;  
  const userId = req.user._id;  

  try {  
    // Tìm menu và user  
    const [menu, user] = await Promise.all([  
      Menu.findById(menuId),  
      User.findById(userId)  
    ]);  

    // Kiểm tra menu tồn tại  
    if (!menu) {  
      throw new CustomError(404, 'Menu không tồn tại');  
    }  

    // Kiểm tra đã mua chưa  
    if (menu.purchasedBy.includes(userId)) {  
      throw new CustomError(400, 'Bạn đã mua menu này rồi');  
    }  

    // Kiểm tra đủ xu không  
    if (user.xu < menu.unlockPrice) {  
      throw new CustomError(400, 'Không đủ xu để mua menu');  
    }  

    // Thực hiện giao dịch  
    user.xu -= menu.unlockPrice;  
    menu.purchasedBy.push(userId);  

    // Lưu thay đổi  
    await Promise.all([  
      user.save(),  
      menu.save()  
    ]);  

    res.json({  
      success: true,  
      message: 'Mua menu thành công',  
      data: {  
        remainingXu: user.xu,  
        menuStatus: {  
          isUnlocked: true  
        }  
      }  
    });  
  } catch (error) {  
    console.error('Purchase Menu Error:', error);  
    res.status(error.code || 500).json({  
      success: false,  
      message: error.message  
    });  
  }  
};