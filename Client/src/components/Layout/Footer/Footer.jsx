import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="widgets-row">
        <div className="container">
          <div className="footer-widgets">
            <div className="footer-logo">
              <Link to={"/"} className="logo">
                <img src="/logo.png" alt="Logo" />
              </Link>
            </div>
            <div className="widget-nav-menu">
              <h4>Kurumsal</h4>
              <ul>
                <li>
                  <a href="#">Hakkımızda</a>
                </li>
                <li>
                  <a href="#">M.S.S</a>
                </li>
              </ul>
            </div>
            <div className="widget-nav-menu">
              <h4>Mağaza</h4>
              <ul>
                <li>
                  <Link to={"/"}>Anasafya</Link>
                </li>
                <li>
                  <Link to={"/shop"}>Ürünler</Link>
                </li>
                <li>
                  <Link to={"/blog"}>Blog</Link>
                </li>
              </ul>
            </div>
            <div className="widget-nav-menu">
              <h4>Destek</h4>
              <ul>
                <li>
                  <Link to={"/auth"}>Giriş Yap/Kayıt Ol</Link>
                </li>
                <li>
                  <Link to={"/contact"}>İletişim</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <div className="copyright-row">
        <div className="container">
          <div className="footer-copyright-row">
            <div className="site-copyright">
              <p>Copyright 2025 © B&B Store. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
