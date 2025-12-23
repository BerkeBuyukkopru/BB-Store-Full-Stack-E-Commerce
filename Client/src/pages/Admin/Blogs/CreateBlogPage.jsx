import { Button, Form, Input, message, Spin } from "antd";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const CreateBlogPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Blog başarıyla oluşturuldu.");
        navigate("/admin/blogs");
      } else {
        message.error("Blog oluşturulurken bir hata oluştu.");
      }
    } catch (error) {
      console.log("Blog oluşturma hatası:", error);
      message.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
        <h2>Yeni Blog Yazısı Oluştur</h2>
      <Spin spinning={loading}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Blog Başlığı"
            name="title"
            rules={[{ required: true, message: "Lütfen blog başlığını girin!" }]}
          >
            <Input placeholder="Blog Başlığı" />
          </Form.Item>

          <Form.Item
            label="Blog Görseli (URL)"
            name="imageUrl"
            rules={[{ required: true, message: "Lütfen blog görsel linkini girin!" }]}
          >
            <Input placeholder="Resim URL'si" />
          </Form.Item>

          <Form.Item
            label="Özet (İsteğe Bağlı)"
            name="summary"
          >
            <Input.TextArea rows={3} placeholder="Blog hakkında kısa bir özet..." />
          </Form.Item>

          <Form.Item
            label="İçerik"
            name="content"
            rules={[{ required: true, message: "Lütfen blog içeriğini girin!" }]}
          >
            <ReactQuill theme="snow" style={{ height: "300px", marginBottom: "50px" }} />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Oluştur
          </Button>
        </Form>
      </Spin>
    </div>
  );
};

export default CreateBlogPage;
