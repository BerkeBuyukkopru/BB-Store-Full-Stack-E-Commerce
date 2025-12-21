import { Button, Form, message, Spin } from "antd"; 
import { useEffect, useState, useContext } from "react"; 
import ReactQuill from "react-quill-new"; 
import "react-quill-new/dist/quill.snow.css"; 
import { useNavigate } from "react-router-dom";
import { SiteContext } from "../../../context/SiteContext";

const AboutUsSettingsPage = () => {
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
          aboutUsPageContent: data.aboutUsPageContent,
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
      // Merge existing settings with new values
      const updatedSettings = {
        ...allSettings,
        aboutUsPageContent: values.aboutUsPageContent,
      };

      const response = await fetch(`${apiUrl}/sitesettings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSettings),
      });

      if (response.ok) {
        message.success("Hakkımızda sayfası güncellendi.");
        refreshSiteSettings(); // Refresh global context
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
      <h2>Hakkımızda Sayfası Düzenle</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ aboutUsPageContent: "" }}
      >
        <Form.Item
          label="İçerik"
          name="aboutUsPageContent"
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

export default AboutUsSettingsPage;
