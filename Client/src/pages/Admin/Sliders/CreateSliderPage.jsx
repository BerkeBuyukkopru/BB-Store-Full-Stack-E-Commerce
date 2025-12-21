import { Button, Form, Input, InputNumber, message, Spin } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateSliderPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/sliders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Slider başarıyla oluşturuldu.");
        navigate("/admin/sliders");
      } else {
        message.error("Oluşturulamadı.");
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <h2>Yeni Slider Oluştur</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Görsel URL"
          name="imageUrl"
          rules={[{ required: true, message: "Lütfen görsel URL girin!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Sıra"
          name="order"
          rules={[{ required: true, message: "Lütfen bir sıra girin!" }]}
        >
          <Input type="number" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Oluştur
        </Button>
      </Form>
    </Spin>
  );
};

export default CreateSliderPage;
