import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import "./Cart.css";
import CartCoupon from "./CartCoupon";
import CartTable from "./CartTable";
import CartTotals from "./CartTotals";

const Cart = () => {
  const { cartItems } = useContext(CartContext);
  return (
    <section className="cart-page">
      <div className="container">
        {cartItems.length > 0 ? (
          <div className="cart-page-wrapper">
            <form className="cart-form">
              <div className="shop-table-wrapper">
                <CartTable />
                <CartCoupon />
              </div>
            </form>
            <div className="cart-collaterals">
              <CartTotals />
            </div>
          </div>
        ) : (
          <div className="empty-cart-message">
            <h2>Sepette hiç ürün yok!</h2>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
