import { Button, Popconfirm, Table, message, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CategoryPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Kategori listesini Backend'den çeken fonksiyon
  const fetchCategories = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/category`, {
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
        message.error("Kategori listesini görüntüleme yetkiniz yok.");
      } else {
        message.error("Kategoriler getirilirken beklenmeyen bir hata oluştu.");
      }
    } catch (error) {
      console.error("Kategori listesi çekilirken ağ hatası:", error);
      message.error(
        "Sunucuya bağlanılamadı. Lütfen API'nin çalıştığından emin olun."
      );
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`${apiUrl}/category/${categoryId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        message.success("Kategori başarıyla silindi.");
        fetchCategories();
      } else if (response.status === 400 || response.status === 404) {
        const errorText = await response.text();
        try {
            const errorData = JSON.parse(errorText);
            message.error(
                errorData.error || 
                errorData.message || 
                "Silme işlemi sırasında bir kısıtlama hatası oluştu."
            );
        } catch (e) {
            // Eğer JSON değilse direkt metni göster
            message.error(errorText || "Silme işlemi yapılamadı.");
        }
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
    fetchCategories();
  }, [fetchCategories]);

  const columns = [
    {
      title: "Kategori Görseli",
      dataIndex: "img",
      key: "img",
      render: (imgSrc) => <img src={imgSrc} alt="Görsel" width={100} />,
    },
    {
      title: "Kategori Adı",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Cinsiyet",
      dataIndex: "gender",
      key: "gender",
      render: (text) => <span>{text === "Man" ? "Erkek" : text === "Woman" ? "Kadın" : "Unisex"}</span>,
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
          <Button className="admin-edit-btn" onClick={()=> navigate(`/admin/categories/update/${record.id || record._id}`)}>
            Düzenle
          </Button>

          <Popconfirm
            title="Kategoriyi Sil"
            description={`${record.name} kategorisini silmek istediğinizden emin misiniz?`}
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => deleteCategory(record.id || record._id)}
          >
            <Button className="admin-delete-btn">
              Kaldır
            </Button>
          </Popconfirm>
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
          onClick={() => navigate("/admin/categories/create")}
        >
          Yeni Kategori Ekle
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

export default CategoryPage;
