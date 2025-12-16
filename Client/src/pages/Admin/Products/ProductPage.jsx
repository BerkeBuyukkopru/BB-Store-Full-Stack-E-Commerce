import { Button, Popconfirm, Space, Table, message } from "antd";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";

const ProductPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [categoriesResponse, productsResponse] = await Promise.all([
        fetch(`${apiUrl}/category`, { credentials: "include" }),
        fetch(`${apiUrl}/product`, { credentials: "include" }),
      ]);

      if (!categoriesResponse.ok || !productsResponse.ok) {
        if (
          categoriesResponse.status === 401 ||
          categoriesResponse.status === 403 ||
          productsResponse.status === 401 ||
          productsResponse.status === 403
        ) {
          message.error("Ürün listesini görüntüleme yetkiniz yok.");
        } else {
          message.error("Veriler getirilirken beklenmeyen bir hata oluştu.");
        }
        return;
      }

      const [categoriesData, productsData] = await Promise.all([
        categoriesResponse.json(),
        productsResponse.json(),
      ]);

      if (!Array.isArray(productsData)) {
        message.error("Sunucudan gelen ürün verisi geçersiz.");
        setDataSource([]);
        return;
      }

      const productsWithCategories = productsData.map((product) => {
        const categoryId = product.category?._id || product.category;

        const category = categoriesData.find(
          (item) => item._id === categoryId || item.id === categoryId
        );

        return {
          ...product,
          key: product._id || product.id,
          categoryName: category ? category.name : "Tanımsız",
        };
      });

      setDataSource(productsWithCategories);
    } catch (error) {
      console.error("Veri hatası:", error);
      message.error(
        "Sunucuya bağlanılamadı. Lütfen API'nin çalıştığından emin olun."
      );
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${apiUrl}/product/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        message.success("Ürün başarıyla silindi.");
        fetchData();
      } else if (response.status === 400 || response.status === 404) {
        const errorData = await response.json();
        message.error(
          errorData.message || "Silme işlemi sırasında bir hata oluştu."
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
    fetchData();
  }, [fetchData]);

  const columns = [
    {
      title: "Ürün Görseli",
      dataIndex: "img",
      key: "img",
      render: (imgSrc) => (
        <img
          src={imgSrc && imgSrc.length > 0 ? imgSrc[0] : ""}
          alt="Ürün Görseli"
          width={100}
        />
      ),
    },
    {
      title: "Ürün Adı",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Kategori",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Fiyat",
      dataIndex: "productPrice",
      key: "current",
      render: (text) => (
        <span>{text?.current ? text.current.toFixed(2) + " TL" : "-"}</span>
      ),
    },
    {
      title: "İndirim Oranı",
      dataIndex: "productPrice",
      key: "discount",
      render: (text) => <span>%{text?.discount || 0}</span>,
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            style={{ width: 80 }}
            onClick={() =>
              navigate(`/admin/products/update/${record._id || record.id}`)
            }
          >
            Düzenle
          </Button>
          <Popconfirm
            title="Ürünü Sil"
            description={`${record.name} adlı ürünü silmek istediğinizden emin misiniz?`}
            okText="Evet"
            cancelText="Hayır"
            onConfirm={() => deleteProduct(record._id || record.id)}
          >
            <Button type="primary" danger style={{ width: 80 }}>
              Sil
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
          onClick={() => navigate("/admin/products/create")}
        >
          Yeni Ürün Ekle
        </Button>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(record) => record._id || record.id}
        loading={loading}
        scroll={{ x: 1000 }}
      />
    </>
  );
};

export default ProductPage;
