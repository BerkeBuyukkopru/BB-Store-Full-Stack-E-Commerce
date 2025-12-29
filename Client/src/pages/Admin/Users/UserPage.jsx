import { Button, Popconfirm, Table, message } from "antd"; // Popconfirm ve Button eklendi
import { useCallback, useEffect, useState } from "react";

const AdminUserPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Kullanıcı listesini Backend'den çeken fonksiyon
  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        const updatedData = data.map((item) => ({
          ...item,
          key: item.id,
        }));

        setDataSource(updatedData);
      } else if (response.status === 401 || response.status === 403) {
        message.error("Kullanıcı listesini görüntüleme yetkiniz yok.");
      } else {
        message.error("Kullanıcılar getirilirken beklenmeyen bir hata oluştu.");
      }
    } catch (error) {
      console.error("Kullanıcı listesi çekilirken ağ hatası:", error);
      message.error(
        "Sunucuya bağlanılamadı. Lütfen API'nin çalıştığından emin olun."
      );
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${apiUrl}/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        message.success("Kullanıcı başarıyla silindi.");
        fetchUsers();
      } else if (response.status === 400 || response.status === 404) {
        // ✨ KRİTİK: 400 (BadRequest) veya 404 hatalarından JSON mesajını oku
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
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (id) => id.substring(0, 8) + "...",
    },
    {
      title: "Ad",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Soyad",
      dataIndex: "surname",
      key: "surname",
    },
    {
      title: "E-posta",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role) => (role === 1 ? "Admin" : "Kullanıcı"), // 0/1 dönüşümünü User'a çevirdik
    },
    {
      title: "Kayıt Tarihi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("tr-TR"),
    },

    {
      title: "İşlemler",
      dataIndex: "actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Kullanıcıyı Sil"
          description={`'${record.name} ${record.surname}' kullanıcısını silmek istediğinizden emin misiniz?`}
          okText="Evet"
          cancelText="Hayır"
          onConfirm={() => deleteUser(record.id)}
        >
          <Button className="admin-delete-btn">
            Sil
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey={(record) => record.id}
      loading={loading}
      scroll={{ x: 1000 }}
    />
  );
};

export default AdminUserPage;
