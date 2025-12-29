import { Table, Button, Popconfirm, message, Space } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CargoPage = () => {
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const fetchCargoCompanies = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/CargoCompany`, {
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setDataSource(data);
            } else {
                message.error("Veri getirme başarısız.");
            }
        } catch (error) {
            console.log("Veri hatası:", error);
            message.error("Veri hatası.");
        } finally {
            setLoading(false);
        }
    };

    const deleteCargo = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/CargoCompany/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                message.success("Kargo firması silindi.");
                fetchCargoCompanies();
            } else {
                message.error("Silme başarısız.");
            }
        } catch (error) {
            console.log("Silme hatası:", error);
        }
    };

    useEffect(() => {
        fetchCargoCompanies();
    }, []);

    const columns = [
        {
            title: "Logo",
            dataIndex: "logoUrl",
            key: "logoUrl",
            render: (imgSrc) => (
                <img src={imgSrc} alt="Logo" style={{ width: "50px", objectFit: "contain" }} />
            ),
        },
        {
            title: "Firma Adı",
            dataIndex: "companyName",
            key: "companyName",
            render: (text) => <b>{text}</b>,
        },
        {
            title: "Fiyat",
            dataIndex: "price",
            key: "price",
            render: (price) => <span>{price} TL</span>,
        },
        {
            title: "İşlemler",
            dataIndex: "id",
            key: "id",
            render: (id, record) => (
                <Space>
                <Space>
                    <Button className="admin-edit-btn" onClick={() => navigate(`/admin/cargo/update/${id}`)}>
                        Düzenle
                    </Button>
                    <Popconfirm
                        title="Kargo firmasını silmek istediğinize emin misiniz?"
                        onConfirm={() => deleteCargo(id)}
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
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h1 style={{ fontSize: '24px' }}>Kargo Firmaları</h1>
                <Button type="primary" onClick={() => navigate("/admin/cargo/create")}>
                     Kargo Firması Ekle
                </Button>
            </div>
            <Table
                dataSource={dataSource}
                columns={columns}
                rowKey={(record) => record.id}
                loading={loading}
            />
        </div>
    );
};

export default CargoPage;
