import { Button, Popconfirm, Table, message, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CouponPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchCoupons = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/coupon`, {
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
        message.error("Kupon listesini görüntüleme yetkiniz yok.");
      } else {
        message.error("Kuponlar getirilirken beklenmeyen bir hata oluştu.");
      }
    } catch (error) {
      console.error("Kupon listesi çekilirken ağ hatası:", error);
      message.error(
        "Sunucuya bağlanılamadı. Lütfen API'nin çalıştığından emin olun."
      );
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const deleteCoupon = async (couponId) => {
    try {
      const response = await fetch(`${apiUrl}/coupon/${couponId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        message.success("Kupon başarıyla silindi.");
        fetchCoupons();
      } else if (response.status === 400 || response.status === 404) {
        const errorData = await response.json();
        message.error(
          errorData.message ||
            "Silme işlemi sırasında bir kısıtlama hatası oluştu."
        );
      } else {
        message.error(
          "Silme işlemi başarısız. Yetkiniz yok veya sunucu hatası."
        );
      }
    } catch (error) {
      console.error("Silme hatası:", error);
      message.error("Silme işlemi sırasında ağ hatası oluştu.");
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const columns = [
    {
      title: "Kupon Kodu",
      dataIndex: "code",
      key: "code",
      render: (code) => <b>{code}</b>,
    },
    {
      title: "İndirim Oranı",
      dataIndex: "discountPercent",
      key: "discountPercent",
      render: (code) => <span>%{code}</span>,
    },
    {
      title: "Oluşturulma Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("tr-TR") : "-",
    },
    {
      title: "Güncellenme Tarihi",
      dataIndex: "updatedAt",
      key: "updatedAtt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("tr-TR") : "-",
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space>
        <Space>
          <Button
            className="admin-edit-btn"
            onClick={() =>
              navigate(`/admin/coupons/update/${record.id || record._id}`)
            }
          >
            Düzenle
          </Button>

          <Popconfirm
            title="Kuponu Sil"
            description={`${record.name} kuponunu silmek istediğinizden emin misiniz?`}
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => deleteCoupon(record.id || record._id)}
          >
            <Button className="admin-delete-btn">
              Kaldır
            </Button>
          </Popconfirm>
        </Space>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, textAlign: "right" }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/admin/coupons/create")}
        >
          Yeni Kupon Ekle
        </Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(record) => record.id || record._id}
        loading={loading}
        scroll={{ x: 700 }}
      />
    </>
  );
};

export default CouponPage;
