import { Table, message } from "antd";
import { useCallback, useEffect, useState } from "react";

const OrderPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;


  // Kategori listesini Backend'den çeken fonksiyon
  const fetchOrders = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        const updatedData = data.map((item) => ({
          ...item,
          key: item.id || item._id,
        }));

        setDataSource(updatedData);
      } else if (response.status === 401 || response.status === 403) {
        message.error("Sipariş listesini görüntüleme yetkiniz yok.");
      } else {
        message.error("Siparişler getirilirken beklenmeyen bir hata oluştu.");
      }
    } catch (error) {
      console.error("Sipariş listesi çekilirken ağ hatası:", error);
      message.error(
        "Sunucuya bağlanılamadı. Lütfen API'nin çalıştığından emin olun."
      );
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);


  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns = [
    {
      title: "Sipariş No",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Müşteri Email",
      dataIndex: ["user", "email"],
      key: "userEmail",
    },
    {
      title: "Tutar",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (price) => `${price.toFixed(2)}₺`,
    },
    {
      title: "Durum",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = status === "PaymentSuccess" ? "green" : status === "Pending" ? "orange" : "red";
        
        let text = status;
        if (status === "PaymentSuccess") text = "Ödendi";
        else if (status === "Pending") text = "Ödeme Bekleniyor";
        else if (status === "PaymentFailed") text = "Ödeme Başarısız";

        return <span style={{ color: color, fontWeight: 'bold' }}>{text}</span>;
      }
    },
    {
      title: "Tarih",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("tr-TR") + " " + new Date(date).toLocaleTimeString("tr-TR"),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={(record) => record.id || record._id}
      loading={loading}
      scroll={{ x: 700 }}
    />
  );
};

export default OrderPage;
