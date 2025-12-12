import PropTypes from "prop-types";
import "./ProductItem.css";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";

const ProductItem = ({ productItem }) => {
  const { cartItems, addToCart } = useContext(CartContext);

  const filteredCart = cartItems.find(
    (cartItem) => cartItem.id === productItem.id
  );

  return (
    <div className="product-item glide__slide glide__slide--active">
      <div className="product-image">
        <Link to={`product/${productItem.id}`}>
          <img src={productItem.img.singleImage} alt="" className="img1" />
          <img src={productItem.img.thumbs[1]} alt="" className="img2" />
        </Link>
      </div>
      <div className="product-info">
        <Link to={`product/${productItem.id}`} className="product-title">
          {productItem.name}
        </Link>
        <ul className="product-star">
          <li>
            <i className="bi bi-star-fill"></i>
          </li>
          <li>
            <i className="bi bi-star-fill"></i>
          </li>
          <li>
            <i className="bi bi-star-fill"></i>
          </li>
          <li>
            <i className="bi bi-star-fill"></i>
          </li>
          <li>
            <i className="bi bi-star-half"></i>
          </li>
        </ul>
        <div className="product-prices">
          <strong className="new-price">
            {productItem.price.newPrice.toFixed(2)} TL
          </strong>
          <span className="old-price">
            {productItem.price.oldPrice.toFixed(2)} TL
          </span>
        </div>
        <span className="product-discount">-{productItem.discount}%</span>
        <div className="product-links">
          <button
            className="add-to-cart"
            onClick={() => addToCart(productItem)}
            disabled={filteredCart}
          >
            <i className="bi bi-basket-fill"></i>
          </button>
          <button>
            <i className="bi bi-heart-fill"></i>
          </button>
          <Link
            to={`product/${productItem.id}`}
            className="product-link"
          >
            <i className="bi bi-eye-fill"></i>
          </Link>
          <a href="#">
            <i className="bi bi-share-fill"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;

ProductItem.propTypes = {
  productItem: PropTypes.object,
  setCartItems: PropTypes.func,
};
