import { Button, message, Popconfirm, Spin, Card, Row, Col } from "antd";
import { useEffect, useState } from "react";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddressForm from "../../components/Modals/AddressForm";

const UserAddressManager = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/address`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const deleteAddress = async (id) => {
      try {
          const response = await fetch(`${apiUrl}/address/${id}`, {
              method: "DELETE",
              credentials: "include"
          });
          if (response.ok) {
              message.success("Adres silindi.");
              fetchAddresses();
          } else {
              message.error("Silinemedi.");
          }
      } catch (error) {

      }
  }

  const handleEditAddress = (addr) => {
    setEditingAddress(addr);
    setIsAddingNew(true);
  };

  const handleAddressFormSuccess = () => {
    setIsAddingNew(false);
    setEditingAddress(null);
    fetchAddresses();
  };

  const handleAddressFormCancel = () => {
    setIsAddingNew(false);
    setEditingAddress(null);
  };

  if (isAddingNew || editingAddress) {
      return (
          <div style={{ maxWidth: 700 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2>{editingAddress ? "Adresi Düzenle" : "Yeni Adres Ekle"}</h2>
                  <Button onClick={handleAddressFormCancel} style={{ color: 'black', borderColor: '#d9d9d9' }} onMouseEnter={(e) => { e.target.style.color = "black"; e.target.style.borderColor = "black"; }} onMouseLeave={(e) => { e.target.style.color = "black"; e.target.style.borderColor = "#d9d9d9"; }}>Listeye Dön</Button>
              </div>
              <AddressForm
                  onSuccess={handleAddressFormSuccess}
                  onCancel={handleAddressFormCancel}
                  editingAddress={editingAddress}
              />
          </div>
      )
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2>Adreslerim</h2>
          <Button 
            type="primary" 
            style={{ backgroundColor: 'black', borderColor: 'black' }}
            icon={<PlusOutlined />}
            onClick={() => {
                setIsAddingNew(true);
                setEditingAddress(null);
            }}
          >
            Yeni Adres Ekle
          </Button>
      </div>

      {loading ? (
         <Spin size="large" />
      ) : addresses.length === 0 ? (
         <p>Kayıtlı adresiniz yok.</p>
      ) : (
         <Row gutter={[16, 16]}>
             {addresses.map((addr) => (
                 <Col xs={24} md={12} key={addr.id}>
                     <Card 
                        title={addr.title} 
                        bordered={true}
                        actions={[
                            <EditOutlined key="edit" onClick={() => handleEditAddress(addr)} />,
                            <Popconfirm title="Silmek istediğine emin misin?" onConfirm={() => deleteAddress(addr.id)} okText="Evet" cancelText="Hayır">
                                <DeleteOutlined key="delete" style={{ color: "darkred" }} />
                            </Popconfirm>
                        ]}
                     >
                         <p><strong>{addr.name} {addr.surname}</strong></p>
                         <p>{addr.addressDetail}</p>
                         <p>{addr.neighborhood}, {addr.district}/{addr.city}</p>
                         <p>{addr.phone}</p>
                     </Card>
                 </Col>
             ))}
         </Row>
      )}
    </div>
  );
};

export default UserAddressManager;
