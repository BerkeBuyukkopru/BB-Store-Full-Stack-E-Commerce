import { useEffect, useState } from "react";
import { Table, Spin, message, Badge, Button, Collapse, theme } from "antd";
import { Link } from "react-router-dom";

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/orders/my-orders`, {
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                message.error("Siparişler getirilemedi.");
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Helper to format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('tr-TR', options);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'orange';
            case 'Approved': return 'blue';
            case 'Shipped': return 'purple';
            case 'Delivered': return 'green';
            case 'Cancelled': return 'red';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
          case 'Pending': return 'Sipariş Alındı';
          case 'Approved': return 'Onaylandı';
          case 'Shipped': return 'Kargoya Verildi';
          case 'Delivered': return 'Teslim Edildi';
          case 'Cancelled': return 'İptal Edildi';
          default: return status;
        }
    };

    if (loading) return <Spin size="large" />;

    return (
        <div>
            <h2 style={{ marginBottom: 20 }}>Siparişlerim</h2>
            {orders.length === 0 ? (
                <p>Henüz bir siparişiniz bulunmamaktadır.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {orders.map(order => (
                        <div key={order.id} style={{ border: '1px solid #f0f0f0', borderRadius: '8px', padding: '20px', background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>Sipariş No: <span style={{ fontWeight: 'normal' }}>{order.orderNumber}</span></h4>
                                    <div style={{ color: '#888', fontSize: '12px' }}>{formatDate(order.createdAt)}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Badge status={getStatusColor(order.status) === 'green' ? 'success' : getStatusColor(order.status) === 'red' ? 'error' : 'processing'} text={getStatusText(order.status)} />
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{order.totalPrice.toFixed(2)} TL</div>
                                    <div style={{ fontSize: '12px', color: '#888' }}>Kredi Kartı</div>
                                </div>
                            </div>

                            <Collapse ghost
                                items={[{
                                    key: '1',
                                    label: 'Sipariş Detayı',
                                    children: (
                                        <div>
                                            <div style={{ marginBottom: 10, fontWeight: 500 }}>Teslimat Adresi: <span style={{ fontWeight: 400 }}>{order.address?.addressDetail}, {order.address?.district}/{order.address?.city}</span></div>
                                            <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '10px 0' }} />
                                            {order.basketItems?.map((item, index) => (
                                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <img 
                                                            src={item.img?.[0] || "/default-product.png"} 
                                                            alt={item.name} 
                                                            style={{ width: '50px', height: '50px', objectFit: 'contain' }} 
                                                        />
                                                        <div>
                                                            <div style={{ fontWeight: 500 }}>{item.name}</div>
                                                            <div style={{ fontSize: '12px', color: '#888' }}>Adet: {item.quantity}</div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {(item.price * item.quantity).toFixed(2)} TL
                                                    </div>
                                                </div>
                                            ))}
                                            <div style={{ marginTop: 10, borderTop: '1px solid #f0f0f0', paddingTop: '10px' }}>
                                                {order.cargoFee > 0 && (
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                                        <div style={{ fontWeight: 500 }}>Kargo Ücreti</div>
                                                        <div>{order.cargoFee.toFixed(2)} TL</div>
                                                    </div>
                                                )}
                                                {order.cargoCompanyName && (
                                                    <div style={{ fontSize: '12px', color: '#888', textAlign: 'right' }}>Kargo Firması: {order.cargoCompanyName}</div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }]}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserOrders;
