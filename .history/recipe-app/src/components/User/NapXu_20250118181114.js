// export default NapXu;
import React, { useState, useEffect } from "react";
import { Card, message, Row, Col, Spin, Button, Typography } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import logobank from "./images/tpbank.jpg";
import bankqr from "./images/bankqr.jpg";

const { Title, Paragraph } = Typography;

const NapXu = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [transferCode, setTransferCode] = useState("");
  const [bankDetails] = useState({
    account: "0332766193",
    bank: "Ngân Hàng Tiên Phong Bank (TPBank)",
    recipient: "Nguyễn Thanh Tùng",
  });

  const generateShortCode = (email) => {
    const hash = email
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return `NX ${hash % 1000000}`;
  };

  useEffect(() => {
    const validateUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Please login first");
        navigate("/user/login");
        return;
      }
      try {
        const response = await axios.get("https://demcalo.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setTransferCode(generateShortCode(response.data.user.email));
        setLoading(false);
      } catch (error) {
        message.error("Failed to fetch user data.");
        localStorage.clear("token");
        navigate("/user/login");
      }
    };
    validateUser();
  }, [navigate]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Header
        userEmail={user.email}
        userXu={user.xu}
        navigateToProfile={() => navigate("/user/profile")}
        handleLogout={() => {
          navigate("/login");
        }}
      />
      <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={12}>
              <img
                src={logobank}
                alt="TPBank Logo"
                style={{ maxWidth: "150px", marginBottom: "16px" }}
              />
              <Title level={4}>{bankDetails.bank}</Title>
              <Paragraph>
                <strong>STK: {bankDetails.account}</strong>
              </Paragraph>
              <Paragraph>
                <strong>Người nhận: {bankDetails.recipient}</strong>
              </Paragraph>
              <Paragraph>
                <strong>Nội dung chuyển khoản:</strong>
                <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                  {" "}
                  {transferCode}{" "}
                </span>
                <Button
                  type="dashed"
                  onClick={() => navigator.clipboard.writeText(transferCode)}
                >
                  Copy
                </Button>
              </Paragraph>
              <Paragraph>
                <strong>1.000 VND = 100 Xu</strong>
              </Paragraph>
            </Col>
            <Col xs={24} md={12} style={{ textAlign: "center" }}>
              <div style={{ marginBottom: "15px", color: "red" }}>
                <strong>Quét mã QR để nội dung chuyển khoản chính xác</strong>
              </div>
              <img src={bankqr} alt="TP QR" style={{ maxWidth: "200px" }} />
            </Col>
          </Row>
          <div style={{ marginTop: "16px" }}>
            <Title level={5} style={{ color: "red" }}>
              Lưu ý:
            </Title>
            <ul>
              <li style={{ color: "red" }}>
                Vui lòng điền chính xác nội dung chuyển khoản để thực hiện nạp
                tiền tự động.
              </li>
              <li style={{ color: "red" }}>
                Không chấp nhận giao dịch nạp tiền từ tài khoản công ty. Chỉ các
                giao dịch được thực hiện từ tài khoản cá nhân, đúng với thông
                tin đã đăng ký với ngân hàng, mới được xử lý.
              </li>
              <li>
                Tiền sẽ vào tài khoản trong vòng 1-10 phút kể từ khi giao dịch
                thành công.
              </li>
              <li>
                <strong style={{ color: "red" }}>
                  TPBank trong khoảng 23-3h không thể kiểm tra lịch sử giao
                  dịch.
                </strong>
                <p style={{ color: "black" }}>
                  các giao dịch trong khung giờ này có thể mất từ 15 phút đến 2
                  giờ tiền mới vào tài khoản. Bạn có thể tránh nạp tiền trong
                  khung giờ này để đỡ mất thời gian chờ đợi nhé.
                </p>
              </li>
            </ul>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default NapXu;
