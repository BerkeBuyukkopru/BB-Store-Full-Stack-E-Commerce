import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { Button, Result } from "antd";

const PaymentSuccessPage = () => {
    const { setCartItems, setAppliedCoupon } = useContext(CartContext);

    useEffect(() => {
        setCartItems([]);
        setAppliedCoupon(null);
        localStorage.removeItem("cartItems");
        localStorage.removeItem("appliedCoupon");
    }, [setCartItems, setAppliedCoupon]);

    return (
        <div className="container mx-auto py-20">
            <Result
                status="success"
                title="Ödeme Başarılı!"
                subTitle="Siparişiniz başarıyla alındı. Teşekkür ederiz."
                extra={[
                    <Link to="/shop" key="shop">
                        <Button type="primary" size="large">
                            Alışverişe Devam Et
                        </Button>
                    </Link>,
                    <Link to="/" key="home">
                        <Button size="large">
                            Ana Sayfaya Dön
                        </Button>
                    </Link>
                ]}
            />
        </div>
    );
};

export default PaymentSuccessPage;
