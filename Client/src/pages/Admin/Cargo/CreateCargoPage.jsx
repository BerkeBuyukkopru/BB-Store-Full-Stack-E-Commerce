import {
  Button,
  Form,
  Input,
  InputNumber,
  Spin,
  message,
  Card,
  Space
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateCargoPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/CargoCompany`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include"
      });

      if (response.ok) {
        message.success("Kargo firması başarıyla oluşturuldu.");
        navigate("/admin/cargo");
      } else {
        message.error("Kargo firması oluşturulurken bir hata oluştu.");
      }
    } catch (error) {

      message.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Yeni Kargo Firması Ekle" style={{ maxWidth: 600, margin: "20px auto" }}>
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
            <Input placeholder="Firma Adı" />
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
             <InputNumber min={0} style={{ width: '100%' }} placeholder="Örn: 50" />
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
            <Input placeholder="Logo Linki" />
          </Form.Item>

          <Form.Item>
             <Space>
                <Button type="primary" htmlType="submit">
                    Oluştur
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

export default CreateCargoPage;
