import { Table, Button, Space, Popconfirm, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BlogListPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/blogs`);
      if (response.ok) {
        const data = await response.json();
        setDataSource(data);
      } else {
        message.error("Bloglar getirilirken hata oluştu.");
      }
    } catch (error) {
      console.log("Veri hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/blogs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        message.success("Blog başarıyla silindi.");
        fetchBlogs();
      } else {
        message.error("Silme işlemi başarısız.");
      }
    } catch (error) {
      console.log("Silme hatası:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [apiUrl]);

  const columns = [
    {
      title: "Görsel",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imgSrc) => (
        <img src={imgSrc} alt="Blog" style={{ width: "100px", borderRadius: "5px" }} />
      ),
    },
    {
      title: "Başlık",
      dataIndex: "title",
      key: "title",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Oluşturulma Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("tr-TR"),
    },
    {
      title: "Güncellenme Tarihi",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) => new Date(date).toLocaleDateString("tr-TR"),
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => (
        <Space>
        <Space>
          <Button className="admin-edit-btn" onClick={() => navigate(`/admin/blogs/update/${record.id}`)}>
            Düzenle
          </Button>
          <Popconfirm
            title="Blog Sil"
            description="Bu blog yazısını silmek istediğinize emin misiniz?"
            onConfirm={() => deleteBlog(record.id)}
            okText="Evet"
            cancelText="Hayır"
          >
            <Button className="admin-delete-btn">
              Sil
            </Button>
          </Popconfirm>
        </Space>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
            <h2>Blog Listesi</h2>
            <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => navigate("/admin/blogs/create")}
            >
                Yeni Blog Ekle
            </Button>
        </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default BlogListPage;
