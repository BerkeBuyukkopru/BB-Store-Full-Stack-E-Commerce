import { Form, Input, Button, message, Spin } from "antd";
import { useState } from "react";

const UserPasswordChange = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/auth/change-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword
                }),
                credentials: "include"
            });

            if (response.ok) {
                const data = await response.json();
                message.success(data.message);
                form.resetFields();
            } else {
                const errorData = await response.json();
                message.error(errorData.error || "Şifre değiştirilemedi.");
            }
        } catch (error) {
            console.log("Password change error", error);
            message.error("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600 }}>
            <h2 style={{ marginBottom: 20 }}>Şifre Değiştir</h2>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Mevcut Şifre"
                        name="currentPassword"
                        rules={[{ required: true, message: "Lütfen mevcut şifrenizi girin!" }]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Yeni Şifre"
                        name="newPassword"
                        rules={[
                            { required: true, message: "Lütfen yeni şifrenizi girin!" },
                            { min: 6, message: "Şifre en az 6 karakter olmalıdır." }
                        ]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Yeni Şifre (Tekrar)"
                        name="confirmPassword"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: "Lütfen şifrenizi tekrar girin!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Şifreler eşleşmiyor!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ background: "black", borderColor: "black" }}>
                            Şifreyi Güncelle
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
};

export default UserPasswordChange;
