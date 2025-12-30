import PropTypes from "prop-types";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { FavoritesContext } from "../../context/FavoritesContext";
import "./ProductItem.css";
import { Link, useNavigate } from "react-router-dom";
import RatingBadge from "../Reviews/RatingBadge";

const ProductItem = ({ productItem }) => {
  const navigate = useNavigate();
  const { cartItems, addToCart } = useContext(CartContext);
  const { favorites, addToFavorites, removeFromFavorites } = useContext(FavoritesContext); // FavoritesContext entegrasyonu

  const productId = productItem._id || productItem.id;
  
  // Favori kontrolü
  const isFavorite = favorites.some((fav) => (fav._id || fav.id) === productId);

  // ✨ Backend DTO Uyumu: productPrice içinden verileri alıyoruz
  const originalPrice = productItem.productPrice?.current || 0;
  const discountPercentage = productItem.productPrice?.discount || 0;

  // İndirimli fiyatı hesaplama
  const discountedPrice = originalPrice - (originalPrice * discountPercentage) / 100;

  const handleFavoriteClick = () => {
      if (isFavorite) {
          removeFromFavorites(productId);
      } else {
          addToFavorites({
              ...productItem,
              id: productId,
              price: discountedPrice
          });
      }
  };

  return (
    <div
      className="product-item"
      onClick={() => navigate(`/product/${productId}`)}
    >
      <div className="product-image">
        <img src={productItem.img[0]} alt="" className="img1" />
        <img src={productItem.img[1]} alt="" className="img2" />
      </div>
      <div className="product-info">
        <a href="/" className="product-title">
          {productItem.name}
        </a>
        <div className="product-prices">
          <RatingBadge rating={productItem.rating || 0} reviewCount={productItem.reviewCount || 0} showCount={false} />
          <strong className="new-price">
            {productItem.productPrice.discount > 0
              ? productItem.productPrice.discount.toFixed(2)
              : productItem.productPrice.current.toFixed(2)}
            {" TL"}
          </strong>
          {productItem.productPrice.discount > 0 && (
            <span className="old-price">
              {productItem.productPrice.current.toFixed(2)} TL
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductItem;

ProductItem.propTypes = { productItem: PropTypes.object };