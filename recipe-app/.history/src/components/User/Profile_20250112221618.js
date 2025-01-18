import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Profile = () => {
    const { state } = useLocation();
    const { user } = state || {};
    const [formData, setFormData] = useState(user || {});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleUpdate = async (field) => {
        if (!formData[field]) {
            message.warning('Please provide a valid value.');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:5000/api/users/${user._id}`,
                { [field]: formData[field] },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            message.success(`${field} updated successfully!`);
        } catch (error) {
            message.error('Failed to update.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>User Profile</h1>
            <Form layout="vertical">
                {Object.keys(formData).map((key) => (
                    <Form.Item key={key} label={key}>
                        <Input
                            name={key}
                            value={formData[key]}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                        <Button
                            type="primary"
                            onClick={() => handleUpdate(key)}
                            loading={loading}
                            style={{ marginTop: '10px' }}
                        >
                            Update {key}
                        </Button>
                    </Form.Item>
                ))}
            </Form>
        </div>
    );
};

export default Profile;
