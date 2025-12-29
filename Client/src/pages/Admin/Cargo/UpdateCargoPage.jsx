import { Button, Form, Input, InputNumber, Spin, message, Card, Space } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCargoPage = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { id } = useParams();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchCargo = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${apiUrl}/CargoCompany/${id}`, {
                    credentials: "include"
                });
                if (response.ok) {
                    const data = await response.json();
                    form.setFieldsValue(data);
                } else {
                    message.error("Kargo bilgisi getirilemedi.");
                }
            } catch (error) {
                console.log("Veri hatası:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCargo();
    }, [apiUrl, id, form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/CargoCompany/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
                credentials: "include"
            });

            if (response.ok) {
                message.success("Kargo firması güncellendi.");
                navigate("/admin/cargo");
            } else {
                message.error("Güncelleme başarısız.");
            }
        } catch (error) {
            console.log("Güncelleme hatası:", error);
            message.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Kargo Firmasını Güncelle" style={{ maxWidth: 600, margin: "20px auto" }}>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    name="basic"
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Kargo Firma Adı"
                        name="companyName"
                        rules={[
                            {
                                required: true,
                                message: "Lütfen kargo firma adını girin!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Kargo Ücreti"
                        name="price"
                        rules={[
                            {
                                required: true,
                                message: "Lütfen kargo ücretini girin!",
                            },
                        ]}
                    >
                        <InputNumber min={0} style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                        label="Logo URL"
                        name="logoUrl"
                        rules={[
                            {
                                required: true,
                                message: "Lütfen logo URL'sini girin!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Güncelle
                            </Button>
                            <Button onClick={() => navigate("/admin/cargo")}>
                                İptal
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Spin>
        </Card>
    );
};

export default UpdateCargoPage;
