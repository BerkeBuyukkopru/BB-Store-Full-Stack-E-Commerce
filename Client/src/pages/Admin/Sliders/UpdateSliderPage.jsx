import { Button, Form, Input, InputNumber, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateSliderPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSlider = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/sliders/${id}`);
        if (response.ok) {
          const data = await response.json();
          form.setFieldsValue(data);
        }
      } catch (error) {
        console.error("Hata:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlider();
  }, [apiUrl, id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/sliders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Slider güncellendi.");
        navigate("/admin/sliders");
      } else {
        message.error("Güncelleme başarısız.");
      }
    } catch (error) {
      console.error("Hata:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Spin spinning={loading}>
      <h2>Slider Güncelle</h2>
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
          Güncelle
        </Button>
      </Form>
    </Spin>
  );
};

export default UpdateSliderPage;
