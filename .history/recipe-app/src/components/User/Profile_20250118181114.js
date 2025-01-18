import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import "./fontend/login.css";
import { ProfileOutlined } from "@ant-design/icons";

const Profile = () => {
  const { state } = useLocation();
  const [user, setUser] = useState(state?.user || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state?.user) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            "https://demcalo.onrender.com/api/auth/me",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data.user);
        } catch (error) {
          message.error("Failed to fetch user data.");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleUpdate = async (field) => {
    if (!user[field]) {
      message.warning("Please provide a valid value.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://demcalo.onrender.com/api/users/${user._id}`,
        { [field]: user[field] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(`${field} updated successfully!`);
    } catch (error) {
      message.error("Failed to update.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header
        userEmail={user.email}
        userXu={user.xu}
        navigateToProfile={() => {}}
        handleLogout={() => {}}
      />
      <div className="profile">
        <div className="container">
          <div className="form-container">
            <div>
              <h1>
                <ProfileOutlined /> User Profile
              </h1>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <Form layout="vertical">
                  {Object.keys(user).map((key) => (
                    <Form.Item key={key} label={key}>
                      <Input
                        name={key}
                        value={user[key]}
                        onChange={handleInputChange}
                      />
                      <Button
                        type="default"
                        onClick={() => handleUpdate(key)}
                        style={{ marginTop: "10px" }}
                      >
                        Update {key}
                      </Button>
                    </Form.Item>
                  ))}
                </Form>
              )}
            </div>
          </div>
          <div className="image-container">
            <img
              alt="A beautiful still life painting of a bouquet of flowers in a vase."
              height="600"
              src="https://storage.googleapis.com/a1aa/image/PljjEMSYjA7RDZGiXbl2V8co53pwHfSTOfEztlF93eq6t4EoA.jpg"
              width="450"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
