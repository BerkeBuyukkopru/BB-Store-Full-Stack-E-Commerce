import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const PaymentPage = () => {
  const { cartItems, appliedCoupon } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const location = useLocation();
    const { selectedCargo, address: selectedAddress } = location.state || {};

  useEffect(() => {
    const initializePayment = async () => {
      if (cartItems.length === 0) return;

      try {
        const cartTotal = cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        
        const discountAmount = appliedCoupon 
            ? (cartTotal * (appliedCoupon.discountPercent / 100)) 
            : 0;

        const cargoPrice = selectedCargo ? parseFloat(selectedCargo.price) : 0;
        const total = cartTotal - discountAmount + cargoPrice;

        let chosenAddress = selectedAddress || null;
        if (!chosenAddress) {
             try {
                const addressResponse = await fetch(`${apiUrl}/address`, { credentials: "include" });
                if (addressResponse.ok) {
                    const addresses = await addressResponse.json();
                    if (addresses.length > 0) {
                        chosenAddress = addresses[0]; 
                    }
                }
            } catch (addrErr) {

            }
        }

        const basketItems = cartItems.map(item => {
            const itemOriginalPrice = item.price;
            let itemDiscountedPrice = appliedCoupon 
                ? itemOriginalPrice * (1 - appliedCoupon.discountPercent / 100) 
                : itemOriginalPrice;
            
            itemDiscountedPrice = Math.round(itemDiscountedPrice * 100) / 100;

            return {
                Id: item._id || item.id,
                Name: item.name,
                Category: "General",
                Price: itemDiscountedPrice, 
                Quantity: item.quantity,
                Size: item.size || "",
                Color: item.color || "",
                Img: item.img || []
            };
        });

        const derivedTotal = basketItems.reduce((acc, item) => acc + (item.Price * item.Quantity), 0) + cargoPrice;

        const payload = {
            User: {
                Id: user._id || user.id,
                Name: user.name || user.username || "Guest Name",
                Surname: user.surname || "Guest Surname",
                Email: user.email,
            },
            Address: chosenAddress,
            BasketItems: basketItems,
            CargoFee: cargoPrice,
            CargoCompanyName: selectedCargo ? selectedCargo.companyName : "",
            TotalPrice: derivedTotal
        };

        const response = await fetch(`${apiUrl}/payment/checkout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage = errorData.errorMessage || errorData.title || "Ödeme formu yüklenemedi.";
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.content, "text/html");
        
        const formDiv = doc.getElementById("iyzipay-checkout-form");
        if(formDiv) {
            document.getElementById("payment-container").appendChild(formDiv);
        }

        const scriptContent = doc.querySelector("script")?.textContent;
        if (scriptContent) {
           const scriptElement = document.createElement("script");
           scriptElement.innerHTML = scriptContent;
           document.body.appendChild(scriptElement);
        }

      } catch (err) {
        console.error(err);
        setError("Ödeme sistemi yüklenirken bir sorun oluştu.");
      } finally {
        setLoading(false);
      }
    };

    if(user && cartItems.length > 0) {
        initializePayment();
    }
  }, [cartItems, user, apiUrl, appliedCoupon]);



  return (
    <div className="container mx-auto py-20">
      {loading && <div className="text-center">Ödeme Formu Yükleniyor...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      
      <div id="payment-container" className="flex justify-center">
      </div>
    </div>
  );
};

export default PaymentPage;
