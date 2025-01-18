import React from 'react';  
import { Modal, Button, message } from 'antd';  
import { UnlockOutlined } from '@ant-design/icons';  

const MenuDetailModal = ({ menu, visible, onClose, userXu, onPurchaseMenu }) => {
  const [loading, setLoading] = useState(false);
  const [menuStatus, setMenuStatus] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
      const checkMenuStatus = async () => {
          if (!menu || !user) return;

          try {
              const response = await axios.get(
                  `https://demcalo.onrender.com/api/usermenus/check-status/${menu._id}`,
                  { params: { userId: user.userId } }
              );
              setMenuStatus(response.data);
          } catch (error) {
              console.error('Error checking menu status:', error);
          }
      };

      if (visible && menu) {
          checkMenuStatus();
      }
  }, [menu, visible, user]);

  const handleUnlock = async () => {
      if (!menu || !user) return;

      if (userXu < menu.unlockPrice) {
          message.error(`Insufficient xu. Required: ${menu.unlockPrice}, Available: ${userXu}`);
          return;
      }

      Modal.confirm({
          title: 'Unlock Menu',
          content: `Are you sure to unlock "${menu.name}" for ${menu.unlockPrice} xu?`,
          onOk: async () => {
              setLoading(true);
              try {
                  const result = await onPurchaseMenu(menu._id);
                  if (result.success) {
                      setMenuStatus({ isUnlocked: true });
                      message.success(`Menu unlocked! Remaining xu: ${result.Xu}`);
                  }
              } catch (error) {
                  message.error('Failed to unlock menu');
              } finally {
                  setLoading(false);
              }
          }
      });
  };

  // Render menu content based on unlock status
  const renderMenuContent = () => {
      if (!menuStatus) return <Skeleton active />;

      return menuStatus.isUnlocked || menu.defaultStatus === 'unlock' ? (
          // Full menu content
          <div>
              <img src={menu.imageUrl} alt={menu.name} style={{ width: '100%' }} />
              <div className="mt-4">
                  <h3>Description</h3>
                  <p>{menu.description}</p>
                  {/* Add other menu details here */}
              </div>
          </div>
      ) : (
          // Preview content for locked menu
          <div>
              <img 
                  src={menu.imageUrl} 
                  alt={menu.name} 
                  style={{ width: '100%', filter: 'blur(5px)' }} 
              />
              <div className="text-center mt-4">
                  <LockOutlined style={{ fontSize: 24 }} />
                  <p>Unlock this menu to view full details</p>
              </div>
          </div>
      );
  };

  return (
      <Modal
          title={menu?.name}
          visible={visible}
          onCancel={onClose}
          footer={[
              <Button key="close" onClick={onClose}>
                  Close
              </Button>,
              (!menuStatus?.isUnlocked && menu?.defaultStatus !== 'unlock') && (
                  <Button
                      key="unlock"
                      type="primary"
                      icon={<UnlockOutlined />}
                      onClick={handleUnlock}
                      loading={loading}
                      disabled={userXu < (menu?.unlockPrice || 0)}
                  >
                      Unlock ({menu?.unlockPrice} xu)
                  </Button>
              )
          ]}
          width={800}
      >
          {renderMenuContent()}
      </Modal>
  );
};

export default MenuDetailModal;