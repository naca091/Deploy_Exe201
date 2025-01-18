import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import "./fontend/login.css";
const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(
        "https://demcalo.onrender.com/api/auth/register",
        values
      );

      if (response.data.success) {
        message.success(response.data.message);
        navigate("/login");
      } else {
        message.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during registration";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="container">
        <div className="form-container">
          <h1>
            Create Your Account
            <span aria-label="sparkles" role="img">
              ✨
            </span>
          </h1>
          <p>
            Join us today! Fill out the form below to get started on your
            journey.
          </p>
          <Form name="register" layout="vertical" onFinish={handleRegister}>
            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input placeholder="Enter your username" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                { required: true, message: "Please input your full name!" },
              ]}
            >
              <Input placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item label="Phone" name="phone">
              <Input placeholder="Enter your phone number" />
            </Form.Item>

            <Form.Item label="Address" name="address">
              <Input placeholder="Enter your address" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Register
              </Button>
            </Form.Item>
            <div className="footerlogin">
              <div className="text-center">
                <Button type="link" onClick={() => navigate("/login")}>
                  Already have an account? Login
                </Button>
              </div>
              <p>© 2024 ALL RIGHTS RESERVED</p>
            </div>
          </Form>
        </div>
        <div className="image-container">
          <img
            alt="A beautiful image to inspire registration."
            height="600"
            src="https://storage.googleapis.com/a1aa/image/PljjEMSYjA7RDZGiXbl2V8co53pwHfSTOfEztlF93eq6t4EoA.jpg"
            width="450"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
