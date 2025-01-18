// Profile.jsx
import React, { useEffect, useState } from 'react';
import { Card, Button, Avatar, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            message.error('You need to log in first.');
            navigate('/login');
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    const handleEditProfile = () => {
        navigate('/profile/edit');
    };

    return (
        user && (
            <div className="min-h-screen flex justify-center items-center bg-gray-100">
                <Card className="w-1/2">
                    <div className="text-center mb-6">
                        <Avatar size={100} src={`/uploads/${user.avatar}`} />
                        <h2 className="text-2xl font-bold mt-2">{user.fullName}</h2>
                        <p className="text-gray-500">{user.email}</p>
                    </div>
                    <div className="space-y-4">
                        <p><strong>Address:</strong> {user.address || 'N/A'}</p>
                        <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                        <p><strong>Coins:</strong> {user.coins}</p>
                        <p><strong>Last Login:</strong> {new Date(user.lastLogin).toLocaleString()}</p>
                    </div>
                    <div className="mt-6 text-center">
                        <Button type="primary" onClick={handleEditProfile}>
                            Edit Profile
                        </Button>
                    </div>
                </Card>
            </div>
        )
    );
};

export default Profile;
