import "./Header.css";
import Proptypes from "prop-types";
import { CartContext } from "../../../context/CartContext";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { SiteContext } from "../../../context/SiteContext";
import { FavoritesContext } from "../../../context/FavoritesContext";
import { message, Popconfirm } from "antd";

const Header = ({ setIsSearchShow }) => {
  const { cartItems } = useContext(CartContext);
  const { favorites } = useContext(FavoritesContext); // FavoritesContext

  const { pathname } = useLocation();

  const { user, logout } = useContext(AuthContext);
  const { siteSettings } = useContext(SiteContext);

  return (
    <header>
      <div className="global-notification">
        <div className="container">
          <p>
            {siteSettings?.globalNotification || "THEME FAQ'S"}
          </p>
        </div>
      </div>

      <div className="header-row">
        <div className="container">
          <div className="header-wrapper">
            <div className="header-mobile">
              <i className="bi bi-list" id="btn-menu"></i>
            </div>

            <div className="header-left">
              <Link to={"/"} className="logo">
                <img src={siteSettings?.logoUrl || "/logo.png"} alt="Logo" />
              </Link>
            </div>

            <div className="header-center" id="sidebar">
              <nav className="navigation">
                <ul className="menu-list">
                  <li className="menu-list-item">
                    <Link
                      to={"/"}
                      className={`menu-link ${pathname === "/" && "active"}`}
                    >
                      Ana Sayfa
                    </Link>
                  </li>

                  <li className="menu-list-item">
                    <Link
                      to={"/shop"}
                      className={`menu-link ${
                        pathname === "/shop" && "active"
                      }`}
                    >
                      Ürünler
                      <i className="bi bi-chevron-down"></i>
                    </Link>

                    <div className="menu-dropdown-wrapper">
                      <ul className="menu-dropdown-content">
                        <li>
                          <a href="#">Erkek</a>
                        </li>
                        <li>
                          <a href="#">Kadın</a>
                        </li>
                      </ul>
                    </div>
                  </li>

                  <li className="menu-list-item">
                    <Link
                      to={"/blog"}
                      className={`menu-link ${
                        pathname === "/blog" && "active"
                      }`}
                    >
                      Blog
                    </Link>
                  </li>

                  <li className="menu-list-item">
                    <Link
                      to={"/contact"}
                      className={`menu-link ${
                        pathname === "/contact" && "active"
                      }`}
                    >
                      iletişim
                    </Link>
                  </li>
                </ul>
              </nav>

              <i className="bi-x-circle" id="close-sidebar"></i>
            </div>

            <div className="header-right">
              <div className="header-right-links">
                <button
                  className="search-button"
                  onClick={() => setIsSearchShow(true)}
                >
                  <i className="bi bi-search"></i>
                </button>

                <div>
                  <Link to={"/auth"} className="header-account">
                    <i className="bi bi-person"></i>
                  </Link>
                </div>

                <Link to={"/favorites"} className="header-cart-link">
                  <i className="bi bi-heart"></i>
                </Link>

                <div className="header-cart">
                  <Link to={"/cart"} className="header-cart-link">
                    <i className="bi bi-bag"></i>
                    <span className="header-cart-count">
                      {cartItems.length}
                    </span>
                  </Link>
                </div>

                {user && (
                  <Popconfirm
                    title="Çıkış Yap"
                    description="Çıkış yapmak istediğinize emin misiniz?"
                    onConfirm={() => {
                        logout();
                        message.success("Başarıyla çıkış yapıldı."); // Optional: Add feedback
                    }}
                    okText="Evet"
                    cancelText="Hayır"
                    placement="bottomRight"
                  >
                     <button className="search-button">
                        <i className="bi bi-box-arrow-right"></i>
                    </button>
                  </Popconfirm>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
Header.propTypes = {
  setIsSearchShow: Proptypes.func,
};
