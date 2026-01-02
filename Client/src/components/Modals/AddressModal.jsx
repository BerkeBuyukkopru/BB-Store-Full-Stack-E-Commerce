import { Modal, Button, Radio, message, Space, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";

const AddressModal = ({ isModalOpen, setIsModalOpen, setAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
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
    if (isModalOpen) {
      fetchAddresses();
      setIsAddingNew(false);
      setEditingAddress(null); 
    }
  }, [isModalOpen]);

  const handleOk = () => {
    if (!selectedAddressId) {
        message.warning("Lütfen bir adres seçin.");
        return;
    }
    const selected = addresses.find(a => a.id === selectedAddressId);
    setAddress(selected);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsAddingNew(false);
    setEditingAddress(null); 
  };

  const deleteAddress = async (id) => {
      try {
          const response = await fetch(`${apiUrl}/address/${id}`, {
              method: "DELETE",
              credentials: "include"
          });
          if (response.ok) {
              message.success("Adres silindi.");
              fetchAddresses();
              if (selectedAddressId === id) setSelectedAddressId(null);
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

  return (
    <Modal
      title={editingAddress ? "Adresi Düzenle" : (isAddingNew ? "Yeni Adres Ekle" : "Adres Seçin")}
      open={isModalOpen}
      onCancel={handleCancel}
      footer={
        (isAddingNew || editingAddress) ? null : [
          <Button key="cancel" onClick={handleCancel}>
            İptal
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk} style={{ backgroundColor: 'black', borderColor: 'black', color: 'white' }}>
            Bu Adresi Seç
          </Button>,
        ]
      }
    >
      {(isAddingNew || editingAddress) ? (
        <AddressForm
            onSuccess={handleAddressFormSuccess}
            onCancel={handleAddressFormCancel}
            editingAddress={editingAddress} 
        />
      ) : (
        <div className="address-list-container">
          {loading ? (
             <p>Yükleniyor...</p>
          ) : addresses.length === 0 ? (
             <p>Kayıtlı adresiniz yok.</p>
          ) : (
             <Radio.Group onChange={(e) => setSelectedAddressId(e.target.value)} value={selectedAddressId} style={{ width: '100%' }}>
                <Space orientation="vertical" style={{ width: '100%' }}>
                    {addresses.map((addr) => (
                        <Radio key={addr.id} value={addr.id} className="address-radio-item address-radio-hover" style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px', width: '100%', display: 'flex', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                                <strong>{addr.title}</strong> - {addr.name} {addr.surname} <br/>
                                <span style={{ fontSize: '12px', color: '#555' }}>
                                    {addr.addressDetail}, {addr.neighborhood}, {addr.district}/{addr.city}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <span 
                                    onClick={(e) => { e.stopPropagation(); handleEditAddress(addr); }}
                                    style={{ 
                                        color: 'black', 
                                        fontWeight: 500, 
                                        cursor: 'pointer',
                                    }}
                                >
                                    Düzenle
                                </span>
                                <Popconfirm title="Silmek istediğine emin misin?" onConfirm={() => deleteAddress(addr.id)} okText="Evet" cancelText="Hayır">
                                    <span
                                        onClick={(e) => e.stopPropagation()} 
                                        style={{ color: 'darkred', fontWeight: 500, cursor: 'pointer' }}
                                    >
                                        Sil
                                    </span>
                                </Popconfirm>
                            </div>
                        </Radio>
                    ))}
                </Space>
             </Radio.Group>
          )}

          <Button
            type="dashed"
            style={{ width: '100%', marginTop: '15px', color: 'black', borderColor: 'black', backgroundColor: 'white' }}
            onClick={() => {
                setIsAddingNew(true);
                setEditingAddress(null); 
            }}
          >
            + Yeni Adres Ekle
          </Button>
        </div>
      )}
    </Modal>
  );
};

export default AddressModal;
