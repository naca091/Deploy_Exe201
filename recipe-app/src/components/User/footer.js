import React from "react";
import logo from "./images/logo.jpg";
import "./fontend/footer.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="widget-row">
          <div className="logofooter">
            <img src={logo} alt="Logo" className="logoft-image" />
            <h1>Recipe App</h1>
          </div>
          <div className="footer-top-subbox">
            <div className="footer-top-subs">
              <h2 className="footer-top-subs-title">Đăng ký nhận tin</h2>
              <p className="footer-top-subs-text">
                Nhận thông tin mới nhất từ chúng tôi
              </p>
            </div>
            <form className="form-ground">
              <input
                type="email"
                className="form-ground-input"
                placeholder="Nhập email của bạn"
              />
              <button className="form-ground-btn">
                <span>ĐĂNG KÝ</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="widget-area">
        <div className="widget-row">
          <div className="widget-row-col-1">
            <h3 className="widget-title">Về chúng tôi</h3>
            <div className="widget-row-col-content">
              <p>CountCalo là ........</p>
            </div>
            <div className="widget-social">
              <div className="widget-social-item">
                <a href="#">
                  <i className="fab fa-facebook-f"></i>
                </a>
              </div>
              <div className="widget-social-item">
                <a href="">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
              <div className="widget-social-item">
                <a href="">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
              <div className="widget-social-item">
                <a href="">
                  <i className="fab fa-whatsapp"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="widget-row-col">
            <h3 className="widget-title">Liên kết</h3>
            <ul className="widget-contact">
              <li className="widget-contact-item">
                <a href="">
                  <i className="fa-solid fa-circle-arrow-right"></i>
                  <span>Về chúng tôi</span>
                </a>
              </li>
              <li className="widget-contact-item">
                <a href="">
                  <i className="fa-solid fa-circle-arrow-right"></i>
                  <span>Thực đơn</span>
                </a>
              </li>
              <li className="widget-contact-item">
                <a href="">
                  <i className="fa-solid fa-circle-arrow-right"></i>
                  <span>Điều khoản</span>
                </a>
              </li>
              <li className="widget-contact-item">
                <a href="">
                  <i className="fa-solid fa-circle-arrow-right"></i>
                  <span>Liên hệ</span>
                </a>
              </li>
              <li className="widget-contact-item">
                <a href="">
                  <i className="fa-solid fa-circle-arrow-right"></i>
                  <span>Tin tức</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="widget-row-col">
            <h3 className="widget-title">Thực đơn</h3>
            <ul className="widget-contact">
              <li className="widget-contact-item">
                <a href="">
                  <i className="fa-solid fa-circle-arrow-right"></i>
                  <span>Điểm tâm</span>
                </a>
              </li>
              <li className="widget-contact-item">
                <a href="">
                  <i className="fa-solid fa-circle-arrow-right"></i>
                  <span>Món chay</span>
                </a>
              </li>
              <li className="widget-contact-item">
                <a href="">
                  <i className="fa-solid fa-circle-arrow-right"></i>
                  <span>Món mặn</span>
                </a>
              </li>
              <li className="widget-contact-item">
                <a href="">
                  <i className="fa-solid fa-circle-arrow-right"></i>
                  <span>Nước uống</span>
                </a>
              </li>
              <li className="widget-contact-item">
                <a href="">
                  <i className="fa-solid fa-circle-arrow-right"></i>
                  <span>Tráng miệng</span>
                </a>
              </li>
            </ul>
          </div>
          <div className="widget-row-col-1">
            <h3 className="widget-title">Liên hệ</h3>
            <div className="contact">
              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fa-solid fa-city"></i>
                </div>
                <div className="contact-content">
                  <span>
                    20/9 Trần Văn Ơn, Nguyễn Văn Cừ, Thành Phố Quy Nhơn
                  </span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fa-solid fa-phone"></i>
                </div>
                <div className="contact-content contact-item-phone">
                  <span>0332766193</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <i className="fa-regular fa-envelope"></i>
                </div>
                <div className="contact-content conatct-item-email">
                  <span>tungccvv111@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
