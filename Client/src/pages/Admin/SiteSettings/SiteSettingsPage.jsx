import { Button, Form, Input, message, Spin } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const SiteSettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/sitesettings`);
      if (response.ok) {
        const data = await response.json();
        form.setFieldsValue({
          logoUrl: data.logoUrl,
          globalNotification: data.globalNotification,
          footerPromotionTitle: data.footerPromotionTitle,
          footerPromotionDescription: data.footerPromotionDescription,
          aboutUsPageContent: data.aboutUsPageContent,
          privacyPolicyPageContent: data.privacyPolicyPageContent,
        });
      }
    } catch (error) {
      console.error("Ayarlar çekilemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [apiUrl, form]); // Added form to dependencies

  const onFinish = async (values) => {
    setProcessing(true);
    try {
      const response = await fetch(`${apiUrl}/sitesettings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Site ayarları güncellendi.");
        navigate("/admin");
      } else {
        message.error("Güncelleme başarısız.");
      }
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      message.error("Bir hata oluştu.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  return (
    <div>
      <h2>Site Ayarları</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
            logoUrl: "",
            globalNotification: "",
            footerPromotionTitle: "",
            footerPromotionDescription: "",
            aboutUsPageContent: "",
            privacyPolicyPageContent: ""
        }}
      >
        <Form.Item
          label="Logo URL"
          name="logoUrl"
          rules={[{ required: true, message: "Lütfen bir logo URL girin!" }]}
        >
          <Input placeholder="Örn: /logo.png veya https://..." />
        </Form.Item>

        <Form.Item
          label="Global Notification (Header)"
          name="globalNotification"
          rules={[{ required: true, message: "Lütfen bir duyuru metni girin!" }]}
        >
          <Input placeholder="Örn: THEME FAQ'S" />
        </Form.Item>

        <Form.Item
          label="Footer Promosyon Başlığı"
          name="footerPromotionTitle"
          rules={[{ required: true, message: "Başlık giriniz!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Footer Promosyon Açıklaması"
          name="footerPromotionDescription"
          rules={[{ required: true, message: "Açıklama giriniz!" }]}
        >
          <ReactQuill theme="snow" style={{ height: "150px", marginBottom: "50px" }} />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={processing}>
          Güncelle
        </Button>
      </Form>
    </div>
  );
};

export default SiteSettingsPage;
