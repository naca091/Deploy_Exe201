import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const MenuForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    ingredients: [{ ingredient: '', weight: '', unit: '' }],
    description: '',
    cookingTime: { prep: '', cook: '' },
    difficulty: '',
    servingSize: '',
    defaultStatus: '',
    category: '',
    tags: '',
    image: null,
    calories: '',
    nutritionalInfo: {
      protein: '',
      carbs: '',
      fat: '',
      fiber: ''
    },
    unlockPrice: '',
    averageRating: '',
    isActive: true
  });

  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch ingredients and categories on component mount
  useEffect(() => {
    // Replace with actual API calls
    const fetchData = async () => {
      // Mock data - replace with API calls
      setIngredients([
        { id: 1, name: 'Ingredient 1' },
        { id: 2, name: 'Ingredient 2' },
      ]);
      setCategories([
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ]);
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNutritionalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      nutritionalInfo: {
        ...prev.nutritionalInfo,
        [name]: value
      }
    }));
  };

  const handleCookingTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      cookingTime: {
        ...prev.cookingTime,
        [name]: value
      }
    }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData(prev => ({
      ...prev,
      ingredients: newIngredients
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { ingredient: '', weight: '', unit: '' }]
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block mb-1">Ingredients</label>
          {formData.ingredients.map((ing, index) => (
            <div key={index} className="flex gap-4 mb-2">
              <select
                value={ing.ingredient}
                onChange={(e) => handleIngredientChange(index, 'ingredient', e.target.value)}
                className="w-1/3 p-2 border rounded"
                required
              >
                <option value="">Select Ingredient</option>
                {ingredients.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={ing.weight}
                onChange={(e) => handleIngredientChange(index, 'weight', e.target.value)}
                placeholder="Weight"
                className="w-1/4 p-2 border rounded"
                required
              />
              <input
                type="text"
                value={ing.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                placeholder="Unit"
                className="w-1/4 p-2 border rounded"
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add Ingredient
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        {/* Cooking Time */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block mb-1">Prep Time (minutes)</label>
            <input
              type="number"
              name="prep"
              value={formData.cookingTime.prep}
              onChange={handleCookingTimeChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block mb-1">Cook Time (minutes)</label>
            <input
              type="number"
              name="cook"
              value={formData.cookingTime.cook}
              onChange={handleCookingTimeChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block mb-1">Difficulty</label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Serving Size */}
        <div>
          <label className="block mb-1">Serving Size</label>
          <input
            type="number"
            name="servingSize"
            value={formData.servingSize}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Default Status */}
        <div>
          <label className="block mb-1">Default Status</label>
          <select
            name="defaultStatus"
            value={formData.defaultStatus}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Status</option>
            <option value="lock">Lock</option>
            <option value="unlock">Unlock</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block mb-1">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded"
            required
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-2 h-32 object-cover rounded" />
          )}
        </div>

        {/* Calories */}
        <div>
          <label className="block mb-1">Calories</label>
          <input
            type="number"
            name="calories"
            value={formData.calories}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Nutritional Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Protein (g)</label>
            <input
              type="number"
              name="protein"
              value={formData.nutritionalInfo.protein}
              onChange={handleNutritionalInfoChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Carbs (g)</label>
            <input
              type="number"
              name="carbs"
              value={formData.nutritionalInfo.carbs}
              onChange={handleNutritionalInfoChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Fat (g)</label>
            <input
              type="number"
              name="fat"
              value={formData.nutritionalInfo.fat}
              onChange={handleNutritionalInfoChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Fiber (g)</label>
            <input
              type="number"
              name="fiber"
              value={formData.nutritionalInfo.fiber}
              onChange={handleNutritionalInfoChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Unlock Price */}
        <div>
          <label className="block mb-1">Unlock Price</label>
          <input
            type="number"
            name="unlockPrice"
            value={formData.unlockPrice}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Average Rating */}
        <div>
          <label className="block mb-1">Average Rating</label>
          <input
            type="number"
            name="averageRating"
            value={formData.averageRating}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        {/* Is Active */}
        <div>
          <label className="block mb-1">Status</label>
          <select
            name="isActive"
            value={formData.isActive}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Save Menu
      </button>
    </form>
  );
};

export default MenuForm;