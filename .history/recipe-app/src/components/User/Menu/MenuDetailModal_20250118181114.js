// MenuDetailModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, message, Skeleton } from "antd";
import { UnlockOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";

const MenuDetailModal = ({
  menu,
  visible,
  onClose,
  userXu,
  purchasedMenus,
  onPurchaseSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (menu) {
      setIsUnlocked(
        menu.defaultStatus === "unlock" || purchasedMenus.includes(menu._id)
      );
    }
  }, [menu, purchasedMenus]);

  const purchaseMenu = async () => {
    if (!menu?._id) {
      message.error("Invalid menu");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Make sure token exists
      if (!token) {
        message.error("Please login first");
        return;
      }

      const response = await axios.post(
        `https://demcalo.onrender.com/api/menus/${menu._id}/purchase`,
        {}, // empty body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        // Check for success flag
        message.success("Menu unlocked successfully!");
        setIsUnlocked(true);
        onPurchaseSuccess(response.data.remainingXu, menu._id);
      }
    } catch (error) {
      console.error("Error purchasing menu:", error);
      // More detailed error handling
      if (error.response) {
        // Server responded with error
        message.error(error.response.data.message || "Failed to unlock menu");
      } else if (error.request) {
        // Request made but no response
        message.error("No response from server. Please try again.");
      } else {
        // Request setup error
        message.error("Error making request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  const renderMenuContent = () => {
    if (!menu) return <Skeleton active />;

    return isUnlocked ? (
      <div>
        <img
          //   src={menu.imageUrl}
          src={`https://demcalo.onrender.com${menu.image}`}
          alt={menu.name}
          style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
        />
        <div className="mt-4">
          <h3>Description</h3>
          <p>{menu.description}</p>
        </div>
        <div className="mt-4">
          <h3>Cooking Time</h3>
          <p>Preparation: {menu.cookingTime.prep} minutes</p>
          <p>Cooking: {menu.cookingTime.cook} minutes</p>
        </div>
        <div className="mt-4">
          <h3>Difficulty</h3>
          <p>
            {menu.difficulty.charAt(0).toUpperCase() + menu.difficulty.slice(1)}
          </p>
        </div>
        <div className="mt-4">
          <h3>Serving Size</h3>
          <p>{menu.servingSize} people</p>
        </div>
        <div className="mt-4">
          <h3>Calories</h3>
          <p>{menu.calories} kcal</p>
        </div>
        <div className="mt-4">
          <h3>Nutritional Information</h3>
          <p>Protein: {menu.nutritionalInfo?.protein || "N/A"} g</p>
          <p>Carbs: {menu.nutritionalInfo?.carbs || "N/A"} g</p>
          <p>Fat: {menu.nutritionalInfo?.fat || "N/A"} g</p>
          <p>Fiber: {menu.nutritionalInfo?.fiber || "N/A"} g</p>
        </div>
        <div className="mt-4">
          <h3>Tags</h3>
          <p>{menu.tags.join(", ")}</p>
        </div>
        <div className="mt-4">
          <h3>Category</h3>
          <p>{menu.category.name}</p> {/* Assuming category has a name field */}
        </div>
        <div className="mt-4">
          <h3>Unlock Price</h3>
          <p>{menu.unlockPrice} xu</p>
        </div>
        <div className="mt-4">
          <h3>Average Rating</h3>
          <p>
            {menu.averageRating} / 5 ({menu.ratingCount} ratings)
          </p>
        </div>
        <div className="mt-4">
          <h3>Ingredients</h3>
          <ul>
            {menu.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.ingredient.name}: {ingredient.weight}{" "}
                {ingredient.unit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    ) : (
      <div>
        <img
          src={`https://demcalo.onrender.com${menu.image}`}
          alt={menu.name}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            filter: "blur(5px)",
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/placeholder.jpg";
          }}
        />

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <LockOutlined style={{ fontSize: 24 }} />
          <p>Unlock this menu to view full details</p>
          <p>Price: {menu.unlockPrice} xu</p>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={menu?.name}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        !isUnlocked && (
          <Button
            key="unlock"
            type="primary"
            icon={<UnlockOutlined />}
            onClick={purchaseMenu}
            loading={loading}
            disabled={userXu < (menu?.unlockPrice || 0)}
          >
            Unlock ({menu?.unlockPrice} xu)
          </Button>
        ),
      ]}
      width={800}
    >
      {renderMenuContent()}
    </Modal>
  );
};

export default MenuDetailModal;
