import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { message, Button, Select, Spin } from "antd";

import AddressModal from "../Modals/AddressModal";

const CartTotals = () => {
  const [cargoChecked, setCargoChecked] = useState(false);
  const [cargoCompanies, setCargoCompanies] = useState([]);
  const [selectedCargo, setSelectedCargo] = useState(null);
  const [loadingCargo, setLoadingCargo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCargoCompanies = async () => {
        setLoadingCargo(true);
        try {
            const response = await fetch(`${apiUrl}/CargoCompany`, {
                credentials: "include"
            });
            if (response.ok) {
                const data = await response.json();
                setCargoCompanies(data);
                // if(data.length > 0) {
                //    setSelectedCargo(data[0]);
                // }
            }
        } catch (error) {
            console.log("Kargo veri hatası:", error);
        } finally {
            setLoadingCargo(false);
        }
    }
    fetchCargoCompanies();
  }, [apiUrl]);
  
  const navigate = useNavigate();

  const { cartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const cartItemTotals = cartItems.map((item) => {
    return item.price * item.quantity;
  });

  const subTotals = cartItemTotals.reduce((previousValue, currentValue) => {
    return previousValue + currentValue;
  }, 0);

  const cartTotals = selectedCargo
    ? (subTotals + selectedCargo.price).toFixed(2)
    : subTotals.toFixed(2);

  const handleCheckout = () => {
    if (!user) {
      message.info("Ödeme yapabilmek için giriş yapmanız gerekmektedir.");
      return;
    }
    if (!address) {
        message.warning("Lütfen bir teslimat adresi seçin.");
        return;
    }
    if (!selectedCargo) {
        message.warning("Lütfen bir kargo firması seçin.");
        return;
    }
    navigate("/payment");
  };

  const handleAddressClick = () => {
      if (!user) {
          message.info("Adres seçmek için giriş yapmalısınız.");
          return;
      }
      setIsModalOpen(true);
  }

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
            <th>Kargo</th>
            <td>
               {loadingCargo ? <Spin size="small" /> : (
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Select
                        style={{ width: 200 }}
                        placeholder="Kargo Seçiniz"
                        value={selectedCargo ? selectedCargo.id : undefined}
                        onChange={(value) => {
                            const cargo = cargoCompanies.find(c => c.id === value);
                            setSelectedCargo(cargo);
                        }}
                        options={cargoCompanies.map(c => ({ 
                            value: c.id, 
                            label: (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {c.logoUrl && (
                                        <img 
                                            src={c.logoUrl} 
                                            alt={c.companyName} 
                                            style={{ width: '30px', height: '20px', objectFit: 'contain' }} 
                                        />
                                    )}
                                    <span>{c.companyName} - {c.price} TL</span>
                                </div>
                            )
                        }))}
                    />
                 </div>
               )}
            </td>
          </tr>
          <tr>
            <th>Teslimat Adresi</th>
            <td>
                {address ? (
                    <div style={{ textAlign: 'right', fontSize: '13px' }}>
                        <strong>{address.title}</strong>
                        <br/>
                        <Button type="link" size="small" onClick={handleAddressClick} style={{ color: 'darkred' }}>Değiştir</Button>
                    </div>
                ) : (
                    <Button type="link" onClick={handleAddressClick} style={{ color: 'darkred' }}>Adres Seç</Button>
                )}
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

      <AddressModal 
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setAddress={setAddress}
      />
    </div>
  );
};

export default CartTotals;
