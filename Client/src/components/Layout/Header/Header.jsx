import "./Header.css";
import Proptypes from "prop-types";
import { CartContext } from "../../../context/CartContext";
import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = ({ setIsSearchShow }) => {
  const { cartItems } = useContext(CartContext);

  const { pathname } = useLocation();

  return (
    <header>
      <div className="global-notification">
        <p>B&B Store’a Hoş Geldiniz...</p>
      </div>

      <div className="header-row">
        <div className="container">
          <div className="header-wrapper">
            <div className="header-mobile">
              <i className="bi bi-list" id="btn-menu"></i>
            </div>

            <div className="header-left">
              <Link to={"/"} className="logo">
                <img src="/logo.png" alt="Logo" />
              </Link>
            </div>

            <div className="header-center" id="sidebar">
              <nav className="navigation">
                <ul className="menu-list">
                  <li className="menu-list-item">
                    <Link
                      to={"/"}
                      href="#"
                      className={`menu-link ${pathname === "/" && "active"}`}
                    >
                      Anasayfa
                    </Link>
                  </li>

                  <li className="menu-list-item">
                    <Link to={"/shop"} className={`menu-link ${pathname === "/shop" && "active"}`}>
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
                    <Link to={"/blog"} className={`menu-link ${pathname === "/blog" && "active"}`}>
                      Blog
                    </Link>
                  </li>

                  <li className="menu-list-item">
                    <Link to={"/contact"} className={`menu-link ${pathname === "/contact" && "active"}`}>
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

                <a href="#">
                  <i className="bi bi-heart"></i>
                </a>

                <div className="header-cart">
                  <Link to={"/cart"} className="header-cart-link">
                    <i className="bi bi-bag"></i>
                    <span className="header-cart-count">
                      {cartItems.length}
                    </span>
                  </Link>
                </div>
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
