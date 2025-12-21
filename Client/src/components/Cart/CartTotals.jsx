import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { message } from "antd";

const CartTotals = () => {
  const [cargoChecked, setCargoChecked] = useState(false);
  const navigate = useNavigate();

  const { cartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const cartItemTotals = cartItems.map((item) => {
    return item.price * item.quantity;
  });

  const subTotals = cartItemTotals.reduce((previousValue, currentValue) => {
    return previousValue + currentValue;
  }, 0);

  const cargoPrice = 90;

  const cartTotals = cargoChecked
    ? (subTotals + cargoPrice).toFixed(2)
    : subTotals.toFixed(2);

  const handleCheckout = () => {
    if (!user) {
      message.info("Ödeme yapabilmek için giriş yapmanız gerekmektedir.");
      return;
    }
    navigate("/payment");
  };

  return (
    <div className="cart-totals">
      <h2>Sepet</h2>
      <table>
        <tbody>
          <tr className="cart-subtotal">
            <th>Toplam Fiyat</th>
            <td>
              <span id="subtotal">{subTotals.toFixed(2)} TL</span>
            </td>
          </tr>
          <tr>
            <th>Adres ve Kargo</th>
            <td>
              <ul>
                <li>
                  <label>
                    Kargo: 90 TL
                    <input
                      type="checkbox"
                      id="cargo"
                      checked={cargoChecked}
                      onChange={() => setCargoChecked(!cargoChecked)}
                    />
                  </label>
                </li>
                <li>
                  <a href="#">Adresi Değiştir</a>
                </li>
              </ul>
            </td>
          </tr>
          <tr>
            <th>Sepet Tutarı</th>
            <td>
              <strong id="cart-total">{cartTotals} TL</strong>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="checkout">
        <button 
          className="btn btn-lg" 
          onClick={handleCheckout}
        >
          Sepeti Onayla
        </button>
      </div>
    </div>
  );
};

export default CartTotals;
