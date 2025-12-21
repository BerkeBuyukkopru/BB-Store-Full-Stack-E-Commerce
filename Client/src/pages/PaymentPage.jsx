import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";

const PaymentPage = () => {
  const { cartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const initializePayment = async () => {
      if (cartItems.length === 0) return;

      try {
        const total = cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        const payload = {
            User: {
                Id: user._id || user.id,
                Name: user.name || user.username || "Guest Name",
                Surname: user.surname || "Guest Surname",
                Email: user.email,
            },
            BasketItems: cartItems.map(item => ({
                Id: item._id || item.id,
                Name: item.name,
                Category: "General",
                Price: item.price,
                Quantity: item.quantity
            })),
            TotalPrice: total
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
  }, [cartItems, user, apiUrl]);

  return (
    <div className="container mx-auto py-20">
      {loading && <div className="text-center">Ödeme Formu Yükleniyor...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      
      <div id="payment-container" className="flex justify-center">
        {/* Iyzico formu buraya yüklenecek */}
      </div>
    </div>
  );
};

export default PaymentPage;
