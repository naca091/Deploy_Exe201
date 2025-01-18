import React from "react";
import { Modal, Button, Typography, message } from "antd";
import { ClockCircleOutlined, FireOutlined, TeamOutlined, UnlockOutlined } from "@ant-design/icons";

const { Text } = Typography;

const MenuDetailModal = ({ menu, user, visible, onClose, userCoins, onPurchaseMenu,handleUnlockMenu }) => {

  if (!menu) return null;

  const isUnlocked = menu.defaultStatus === "unlock";

  const handleUnlockMenu = async () => {
    console.log('Unlock Menu Button Clicked');
    console.log('User Coins:', user.coins);
    console.log('Menu Unlock Price:', menu.unlockPrice);
  
    if (user.coins < menu.unlockPrice) {
      alert('Not enough coins!');
      return;
    }
  
    const confirmed = window.confirm('Are you sure to buy this menu?');
    console.log('User Confirmation:', confirmed);
  
    if (!confirmed) return;
  
    try {
      const response = await fetch('/api/userMenu/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, menuId: menu.id }),
      });
  
      const result = await response.json();
      console.log('Server Response:', result);
  
      if (response.ok) {
        alert('Menu unlocked successfully!');
        // Cập nhật giao diện nếu cần
      } else {
        alert(result.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error occurred while unlocking menu:', error);
    }
  };
  

  return (
    <Modal
      title={menu.name}
      open={visible}
      onCancel={onClose}
      footer={[
        !isUnlocked && (
          <Button
            key="unlock"
            type="primary"
            icon={<UnlockOutlined />}
            onClick={handleUnlock}
          >
            Unlock - {menu.unlockPrice} coins
          </Button>
        ),
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
      width={800}
    >
      <div className="space-y-6">
        <div className="w-full h-[400px] overflow-hidden rounded-lg">
          <img
            src={`http://localhost:5000${menu.image}`}
            alt={menu.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/path/to/default/image.jpg"; // Fallback image
            }}
          />
        </div>

        {isUnlocked ? (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <ClockCircleOutlined className="text-xl text-blue-500" />
                <div className="mt-2">
                  <Text strong>Cooking Time</Text>
                  <div>Prep: {menu.cookingTime?.prep} mins</div>
                  <div>Cook: {menu.cookingTime?.cook} mins</div>
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <FireOutlined className="text-xl text-red-500" />
                <div className="mt-2">
                  <Text strong>Calories</Text>
                  <div>{menu.calories} kcal</div>
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <TeamOutlined className="text-xl text-green-500" />
                <div className="mt-2">
                  <Text strong>Serving Size</Text>
                  <div>{menu.servingSize} persons</div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Text strong>Description</Text>
              <p>{menu.description}</p>
            </div>
            <div className="mt-4">
              <Text strong>Ingredients</Text>
              <ul>
                {menu.ingredients.map((item, index) => (
                  <li key={index}>
                    {item.weight} {item.unit} of {item.ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500">
            <Text strong>This menu is locked. Unlock it to see the details.</Text>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default MenuDetailModal;
