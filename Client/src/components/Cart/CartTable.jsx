import { useContext } from "react";
import CartItem from "./CartItem";
import { CartContext } from "../../context/CartContext";

const CartTable = () => {
  const { cartItems, removeFromCart, updateItemQuantity } = useContext(CartContext);

  return (
    <>
        <div className="desktop-cart-table">
            <table className="shop-table">
              <thead>
                <tr>
                  <th className="product-thumbnail">&nbsp;</th>
                  <th className="product-name">Ürün</th>
                  <th className="product-color">Renk</th>

                  <th className="product-size">Beden</th>
                  <th className="product-price">Fiyat</th>
                  <th className="product-quantity">Adet</th>
                  <th className="product-subtotal">Fiyat</th>
                </tr>
              </thead>
              <tbody className="cart-wrapper">
                {cartItems.map((item) => (
                  <CartItem cartItem={item} key={`${item.id}-${item.size}-${item.color}`} />
                ))}
              </tbody>
            </table>
        </div>

        <div className="mobile-cart-grid">
            {cartItems.map((item) => (
                <div className="mobile-cart-item" key={`${item.id}-${item.size}-${item.color}`}>
                    <div className="mobile-cart-image">
                        <img src={item.img[0]} alt={item.name} />
                    </div>
                    <div className="mobile-cart-info">
                        <h3>{item.name}</h3>
                        <div className="cart-item-meta">
                            <span>Renk: {item.color || "-"}</span>
                            <span>Beden: {item.size ? item.size.toUpperCase() : "-"}</span>
                        </div>
                        <div className="cart-item-price">
                             Fiyat: {item.price.toFixed(2)} TL
                        </div>
                        <div className="cart-item-total">
                             Toplam: {(item.price * item.quantity).toFixed(2)} TL
                        </div>
                        
                        <div className="cart-item-actions">
                             <div className="qty-control">
                                 <button type="button" onClick={() => updateItemQuantity(item.id, item.size, item.color, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                 <span>{item.quantity}</span>
                                 <button type="button" onClick={() => updateItemQuantity(item.id, item.size, item.color, item.quantity + 1)}>+</button>
                             </div>
                             <button type="button" className="delete-btn" onClick={() => removeFromCart(item.id, item.size, item.color)}>Sil</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </>
  );
};

export default CartTable;
