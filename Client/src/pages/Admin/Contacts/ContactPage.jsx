import { Table, message, Button } from "antd";
import { useEffect, useState } from "react";

const ContactPage = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/contacts`, {
          credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setDataSource(data);
      } else {
        message.error("Mesajlar getirilirken hata oluştu.");
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [apiUrl]);

  const handleStatusChange = async (id, checked) => {
    try {
      const response = await fetch(`${apiUrl}/contacts/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isRead: checked })
      });
      if (response.ok) {
        message.success("Mesaj durumu güncellendi.");
        setDataSource(prev => prev.map(item => item.id === id ? { ...item, isRead: checked } : item));
      } else {
        message.error("Güncelleme başarısız.");
      }
    } catch (error) {

    }
  };

  const columns = [
    {
      title: "Okundu",
      dataIndex: "isRead",
      key: "isRead",
      render: (text, record) => (
          <input 
            type="checkbox" 
            checked={record.isRead} 
            onChange={(e) => handleStatusChange(record.id, e.target.checked)}
            style={{ transform: "scale(1.5)", cursor: "pointer" }}
          />
      )
    },
    {
      title: "Ad Soyad",
      key: "fullName",
      render: (record) => (
          <span style={{ fontWeight: record.isRead ? "normal" : "bold" }}>
             {record.name} {record.surname}
          </span>
      )
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Mesaj",
      dataIndex: "message",
      key: "message",
      width: "40%",
    },
    {
        title: "Tarih",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date) => new Date(date).toLocaleString("tr-TR"),
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
             <h2>Gelen Mesajlar</h2>
             <Button type="primary" onClick={fetchContacts} loading={loading}>Yenile</Button>
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

export default ContactPage;
