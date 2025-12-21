import { Button, Form, message, Spin } from "antd"; 
import { useEffect, useState, useContext } from "react"; 
import ReactQuill from "react-quill-new"; 
import "react-quill-new/dist/quill.snow.css"; 
import { useNavigate } from "react-router-dom";
import { SiteContext } from "../../../context/SiteContext";

const PrivacyPolicySettingsPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [allSettings, setAllSettings] = useState({});
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { fetchSettings: refreshSiteSettings } = useContext(SiteContext);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/sitesettings`);
      if (response.ok) {
        const data = await response.json();
        setAllSettings(data);
        form.setFieldsValue({
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
  }, [apiUrl, form]);

  const onFinish = async (values) => {
    setProcessing(true);
    try {
      const updatedSettings = {
        ...allSettings,
        privacyPolicyPageContent: values.privacyPolicyPageContent,
      };

      const response = await fetch(`${apiUrl}/sitesettings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        message.success("M.S.S Sayfası güncellendi.");
        refreshSiteSettings();
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
      <h2>M.S.S (Gizlilik Politikası) Düzenle</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ privacyPolicyPageContent: "" }}
      >
        <Form.Item
          label="İçerik"
          name="privacyPolicyPageContent"
        >
          <ReactQuill theme="snow" style={{ height: "400px", marginBottom: "50px" }} />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={processing}>
          Güncelle
        </Button>
      </Form>
    </div>
  );
};

export default PrivacyPolicySettingsPage;
