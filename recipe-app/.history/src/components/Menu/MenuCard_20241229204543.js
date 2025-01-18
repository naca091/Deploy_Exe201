import React from 'react';
import { Card, Button } from 'antd';

const { Meta } = Card;

const MenuCard = ({ menu, onUnlock }) => {
    return (
        <Card
            hoverable
            cover={<img alt={menu.name} src={menu.image} />}
            className="menu-card"
        >
            <Meta
                title={menu.name}
                description={`Calories: ${menu.calories}`}
            />
            {menu.status === 'lock' && (
                <Button 
                    type="primary" 
                    onClick={() => onUnlock(menu._id)}
                    className="unlock-button"
                >
                    Unlock Recipe
                </Button>
            )}
        </Card>
    );
};

export default MenuCard;