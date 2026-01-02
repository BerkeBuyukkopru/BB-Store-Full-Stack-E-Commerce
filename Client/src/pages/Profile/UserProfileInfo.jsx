import { Form, Input, Button, message, Spin } from "antd";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const UserProfileInfo = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { user, login } = useContext(AuthContext); // Re-login to update context if needed, or we might need a separate updateContext function
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    // Fetch latest user data or use context
    // It is safer to fetch fresh data
    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/auth/me`, {
                credentials: "include"
            });
            if(response.ok){
                const data = await response.json();
                form.setFieldsValue({
                    name: data.name,
                    surname: data.surname,
                    email: data.email
                });
            }
        } catch(error){

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, []);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/auth/update-profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values),
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                message.success(data.message);
                // Update local context if possible, or just re-fetch
                // Assuming AuthContext has a way to update user, or we relying on next page load.
                // For better UX, we could force a context reload if AuthProvider supported it. 
                // For now, visual feedback is enough.
            } else {
                message.error("Profil güncellenemedi.");
            }
        } catch (error) {

            message.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600 }}>
            <h2 style={{ marginBottom: 20 }}>Hesap Bilgileri</h2>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Ad"
                        name="name"
                        rules={[{ required: true, message: "Lütfen adınızı girin!" }]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Soyad"
                        name="surname"
                        rules={[{ required: true, message: "Lütfen soyadınızı girin!" }]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item
                        label="E-posta"
                        name="email"
                        rules={[
                            { required: true, message: "Lütfen e-posta adresinizi girin!" },
                            { type: "email", message: "Geçerli bir e-posta girin!" }
                        ]}
                    >
                        <Input size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ background: "black", borderColor: "black" }}>
                            Bilgileri Güncelle
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
};

export default UserProfileInfo;
