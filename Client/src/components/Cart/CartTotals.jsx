import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { useState } from "react";

const CartTotals = () => {
  const [cargoChecked, setCargoChecked] = useState(false);

  const { cartItems } = useContext(CartContext);

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
        <button className="btn btn-lg">Sepeti Onayla</button>
      </div>
    </div>
  );
};

export default CartTotals;
