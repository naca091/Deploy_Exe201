import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Nếu userId đến từ URL

const Profile = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  const [user, setUser] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userId) {
      setMessage('User ID is missing');
      return;
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data.data);
      } catch (error) {
        setMessage('Failed to fetch user data');
        console.error(error);
      }
    };

    fetchUser();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!userId) {
      setMessage('User ID is missing');
      return;
    }

    try {
      const response = await axios.put(`/api/users/${userId}`, user);
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!userId) {
      setMessage('User ID is missing');
      return;
    }

    try {
      const response = await axios.put(`/api/users/${userId}/password`, {
        currentPassword,
        newPassword,
      });
      setMessage(response.data.message);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      {message && <p>{message}</p>}

      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={user.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>

      <form onSubmit={handleChangePassword} style={{ marginTop: '20px' }}>
        <h3>Change Password</h3>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default Profile;
