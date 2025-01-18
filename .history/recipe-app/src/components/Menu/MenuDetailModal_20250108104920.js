import React, { useState } from "react";
import { Modal, Button, Typography, message } from "antd";
import { UnlockOutlined, ClockCircleOutlined, FireOutlined, TeamOutlined } from "@ant-design/icons";

const { Text } = Typography;

const MenuDetailModal = ({ menu, userCoins, onPurchase }) => {
  const [visible, setVisible] = useState(false);

  if (!menu) return null;

  const isUnlocked = menu.defaultStatus === "unlock";

  const handleOpen = () => {
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleUnlock = () => {
    if (userCoins >= menu.unlockPrice) {
      Modal.confirm({
        title: "Are you sure you want to unlock this menu?",
        content: `This will cost you ${menu.unlockPrice} coins.`,
        okText: "Unlock",
        cancelText: "Cancel",
        onOk: () => {
          onPurchase(menu.id);
          message.success("Menu unlocked successfully!");
          setVisible(false);
        },
      });
    } else {
      message.error("You do not have enough coins to unlock this menu.");
    }
  };

  return (
    <div>
      {/* Trigger Button to Open Modal */}
      <Button type="primary" onClick={handleOpen}>
        View Menu Details
      </Button>

      {/* Modal */}
      <Modal
        title={menu.name}
        open={visible}
        onCancel={handleClose}
        footer={[
          !isUnlocked && (
            <Button key="unlock" type="primary" icon={<UnlockOutlined />} onClick={handleUnlock}>
              Unlock - {menu.unlockPrice} coins
            </Button>
          ),
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
        ]}
        width={800}
      >
        <div className="space-y-6">
          {/* Image Section */}
          <div className="w-full h-[400px] overflow-hidden rounded-lg">
            <img
              src={`https://demcalo.onrender.com${menu.image}`}
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
    </div>
  );
};

export default MenuDetailModal;
