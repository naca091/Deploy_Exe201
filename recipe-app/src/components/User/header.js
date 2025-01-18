import React, { useState } from "react";
import { Input, Button } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  BookOutlined,
  CalculatorOutlined,
  PlusCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "./images/logo.jpg";
import "./fontend/header.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import AttendanceCalendar from "./AttendanceCalendar";

const Header = ({
  userEmail,
  userXu,
  navigateToProfile,
  handleLogout,
  // navigateToSeeVideo,
  setUserXu,
  onSearch,
}) => {
  const navigate = useNavigate();
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const handleSearch = (value) => {
    console.log("Search value:", value);
    if (onSearch) {
      onSearch(value);
    }
  };
  return (
    <div>
      {/* Main Navbar */}
      <div className="navbar">
        <div className="logo" onClick={() => navigate("/user/homepage")}>
          <img src={logo} alt="Logo" className="logo-image" />
          <h1>Recipe App</h1>
        </div>
        <div className="search-bar">
          <Input.Search
            placeholder="Search menu by name"
            onSearch={handleSearch}
            enterButton
          />
        </div>
        {userEmail ? (
          <>
            <strong>
              <i className="fa-solid fa-user-tie"></i> User: {userEmail}
            </strong>
            <strong>
              Balance: {userXu} xu <i className="fa-solid fa-coins"></i>
            </strong>
            <Button
              onClick={() => setIsCalendarVisible(true)}
              className="bg-blue-500 text-white"
            >
              Calendar
            </Button>
            <AttendanceCalendar
              visible={isCalendarVisible}
              onClose={() => setIsCalendarVisible(false)}
              onAttendanceSuccess={(newBalance) => setUserXu(newBalance)}
            />
            <Button type="dashed" onClick={navigateToProfile}>
              <i className="fa-solid fa-id-card"></i>
              Go to Profile
            </Button>
            <Button type="dashed" danger onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              Logout
            </Button>
          </>
        ) : (
          <div className="auth-buttons">
            <Button type="primary" onClick={() => navigate("/login")}>
              <i className="fa-solid fa-right-to-bracket"></i>
              Login
            </Button>
            <Button type="default" onClick={() => navigate("/register")}>
              <i className="fa-solid fa-registered"></i>
              Register
            </Button>
          </div>
        )}
      </div>

      {/* Secondary Navbar */}
      <div className="navbar secondary-navbar">
        <div className="nav-links">
          <Button
            type="link"
            icon={<HomeOutlined />}
            onClick={() => navigate("/user/homepage")}
          >
            Home
          </Button>
          <Button
            type="link"
            icon={<AppstoreOutlined />}
            onClick={() => navigate("/user/homepage")}
          >
            Products
          </Button>
          <Button type="link" icon={<BookOutlined />}>
            Recipes
          </Button>
          <Button type="link" icon={<CalculatorOutlined />}>
            Calories Tools
          </Button>
          <Button
            type="link"
            icon={<PlusCircleOutlined />}
            onClick={() => navigate("/user/nap-xu")}
          >
            Add Coins
          </Button>
          <Button
            type="link"
            icon={<PlayCircleOutlined />}
            onClick={() => navigate("/user/see-video")}
          >
            Watch Ads
          </Button>
        </div>
      </div>
      <div className="banner-line"></div>
    </div>
  );
};

export default Header;
