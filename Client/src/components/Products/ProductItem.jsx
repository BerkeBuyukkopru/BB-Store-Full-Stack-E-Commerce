import PropTypes from "prop-types";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./ProductItem.css";
import { Link } from "react-router-dom";

const ProductItem = ({ productItem }) => {
  const { cartItems, addToCart } = useContext(CartContext);

  const productId = productItem._id || productItem.id;
  const filteredCart = cartItems.find((cartItem) => cartItem.id === productId);

  // ✨ Backend DTO Uyumu: productPrice içinden verileri alıyoruz
  const originalPrice = productItem.productPrice?.current || 0;
  const discountPercentage = productItem.productPrice?.discount || 0;

  // İndirimli fiyatı hesaplama
  const discountedPrice = originalPrice - (originalPrice * discountPercentage) / 100;

  return (
    <div className="product-item glide__slide glide__slide--active">
      <div className="product-image">
        <Link to={`product/${productId}`}>
          {/* ✨ Backend'den gelen dizi formatındaki görseller */}
          <img src={productItem.img[0]} alt="" className="img1" />
          <img src={productItem.img[1] || productItem.img[0]} alt="" className="img2" />
        </Link>
      </div>
      <div className="product-info">
        <Link to={`product/${productId}`} className="product-title">
          {productItem.name}
        </Link>
        <ul className="product-star">
          {[...Array(5)].map((_, i) => (
            <li key={i}><i className="bi bi-star-fill"></i></li>
          ))}
        </ul>
        <div className="product-prices">
          <strong className="new-price">{discountedPrice.toFixed(2)} TL</strong>
          <span className="old-price">{originalPrice.toFixed(2)} TL</span>
        </div>
        {discountPercentage > 0 && (
          <span className="product-discount">-{discountPercentage}%</span>
        )}
        <div className="product-links">
          <button
            className="add-to-cart"
            onClick={() => addToCart({
              ...productItem,
              id: productId, // Context'te standart ID kullanmak için
              price: discountedPrice, // Sepete indirimli fiyatı gönderiyoruz
            })}
            disabled={filteredCart}
          >
            <i className="bi bi-basket-fill"></i>
          </button>
          <button><i className="bi bi-heart-fill"></i></button>
          <Link to={`product/${productId}`} className="product-link">
            <i className="bi bi-eye-fill"></i>
          </Link>
          <a href="#"><i className="bi bi-share-fill"></i></a>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;

ProductItem.propTypes = { productItem: PropTypes.object };