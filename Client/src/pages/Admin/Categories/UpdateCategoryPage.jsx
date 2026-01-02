import { Button, Form, Input, Spin, message, Card, Space, Select } from "antd";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate eklendi

const UpdateCategoryPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const params = useParams();
    const navigate = useNavigate(); 
    
    const categoryId = params.id;
    const apiUrl = import.meta.env.VITE_API_BASE_URL; 


    useEffect(() => {
        const fetchSingleCategory = async () => {
            setLoading(true);
            
            try {
                const response = await fetch(`${apiUrl}/category/${categoryId}`, {
                    credentials: "include" // Admin yetkilendirmesi için
                });

                if (!response.ok) {
                    throw new Error("Kategori verileri getirilirken hata oluştu.");
                }

                const data = await response.json();

                if (data) {
                    // Form alanlarını çekilen verilerle doldur
                    form.setFieldsValue({
                        name: data.name,
                        img: data.img,
                        gender: data.gender || "Unisex",
                    });
                }
            } catch (error) {
                console.error("Veri hatası:", error);
                message.error("Kategori bilgileri çekilirken hata oluştu.");
            } finally {
                setLoading(false);
            }
        };
        fetchSingleCategory();
    }, [apiUrl, categoryId, form]);


    // Güncelleme Formu Gönderme İşlemi (PUT)
    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/category/${categoryId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Admin yetkilendirmesi için
                body: JSON.stringify(values),
            });

            if (response.ok) {
                message.success("Kategori başarıyla güncellendi.");
                // Başarılı güncellemeden sonra listeleme sayfasına yönlendir
                navigate("/admin/categories"); 
            } else {
                const errorData = await response.json();
                message.error(errorData.message || "Kategori güncellenirken bir hata oluştu.");
            }
        } catch (error) {
            console.error("Kategori güncelleme hatası:", error);
            message.error("Sunucuya bağlanılamadı veya ağ hatası oluştu.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Card title="Kategori Düzenle" style={{ maxWidth: 600, margin: '20px auto' }}>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    name="update-category" 
                    layout="vertical"
                    autoComplete="off"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Kategori Adı"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Lütfen kategori adını girin!",
                            },
                        ]}
                    >
                        <Input placeholder="Kategori adı" />
                    </Form.Item>

                    <Form.Item
                        label="Cinsiyet"
                        name="gender"
                        rules={[{ required: true, message: "Lütfen cinsiyet seçin!" }]}
                    >
                        <Select>
                            <Select.Option value="Man">Erkek</Select.Option>
                            <Select.Option value="Woman">Kadın</Select.Option>
                            <Select.Option value="Unisex">Unisex</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Görsel URL'si"
                        name="img"
                        rules={[
                            {
                                required: true,
                                message: "Lütfen kategori görsel linkini girin!",
                            },
                        ]}
                    >
                        <Input placeholder="Görsel linki" />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Güncelle
                            </Button>
                            <Button onClick={() => navigate("/admin/categories")}>
                                İptal
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Spin>
        </Card>
    );
};

export default UpdateCategoryPage;