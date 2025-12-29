import { Button, Popconfirm, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SliderPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchSliders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/sliders`);
      if (response.ok) {
        const data = await response.json();
        setDataSource(data);
      } else {
        message.error("Slider listesi getirilemedi.");
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const deleteSlider = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/sliders/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Slider silindi.");
        fetchSliders();
      } else {
        message.error("Silme başarısız.");
      }
    } catch (error) {
      console.error("Silme hatası:", error);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  const columns = [
    {
      title: "Görsel",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (img) => <img src={img} alt="Slider" style={{ width: 100 }} />,
    },
    {
      title: "Sıra",
      dataIndex: "order",
      key: "order",
      sorter: (a, b) => a.order - b.order,
    },
    {
      title: "İşlemler",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px" }}>
             <Button
                className="admin-edit-btn"
                onClick={() => navigate(`/admin/sliders/update/${record.id}`)}
            >
                Düzenle
            </Button>
            <Popconfirm 
                title="Silmek istiyor musunuz?" 
                onConfirm={() => deleteSlider(record.id)}
                okText="Evet"
                cancelText="Hayır"
            >
                <Button className="admin-delete-btn">Sil</Button>
            </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <h2>Slider Yönetimi</h2>
            <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate("/admin/sliders/create")}
            >
                Yeni Slider Ekle
            </Button>
        </div>
      <Table dataSource={dataSource} columns={columns} rowKey="id" loading={loading} />
    </div>
  );
};

export default SliderPage;
