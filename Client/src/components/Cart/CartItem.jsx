import PropTypes from "prop-types";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Button } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const CartItem = ({ cartItem }) => {
  const { removeFromCart, updateItemQuantity } = useContext(CartContext);
  return (
    <tr className="cart-item">
      <td></td>
      <td className="cart-image">
        <img src={cartItem.img[0]} alt="" />
        <i className="bi bi-x delete-cart" onClick={() => removeFromCart(cartItem.id)}></i>
      </td>
      <td>{cartItem.name}</td>
      <td>{cartItem.price.toFixed(2)} TL</td>
      <td className="product-quantity">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            type="primary"
            shape="circle"
            size="small"
            icon={<MinusOutlined />}
            htmlType="button" // CRITICAL: Propagates to native button type="button" to prevent form submit
            onClick={() => updateItemQuantity(cartItem.id, cartItem.quantity - 1)}
            disabled={cartItem.quantity <= 1}
            style={{ backgroundColor: 'black', borderColor: 'black' }}
          />
          <span style={{ fontSize: '16px', fontWeight: 'bold', minWidth: '20px', textAlign: 'center'  }}>
            {cartItem.quantity}
          </span>
          <Button
            type="primary"
            shape="circle"
            size="small"
            icon={<PlusOutlined />}
            htmlType="button" // CRITICAL: Propagates to native button type="button" to prevent form submit
            onClick={() => updateItemQuantity(cartItem.id, cartItem.quantity + 1)}
            style={{ backgroundColor: 'black', borderColor: 'black' }}
          />
        </div>
      </td>
      <td className="product-subtotal">{(cartItem.price * cartItem.quantity).toFixed(2)} TL</td>
    </tr>
  );
};

export default CartItem;

CartItem.propTypes = {
  cartItem: PropTypes.object,
};
