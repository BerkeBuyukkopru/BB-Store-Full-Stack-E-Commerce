import { Button, Form, Input, message, Spin } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBlogPage = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
        try {
            const response = await fetch(`${apiUrl}/blogs/${id}`);
            if (response.ok) {
                const data = await response.json();
                form.setFieldsValue({
                    title: data.title,
                    imageUrl: data.imageUrl,
                    content: data.content,
                    summary: data.summary
                });
            } else {
                message.error("Blog verileri yüklenemedi.");
            }
        } catch (error) {
            console.log("Veri hatası:", error);
        } finally {
            setFetching(false);
        }
    };
    if (id) fetchBlog();
  }, [apiUrl, id, form]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Blog başarıyla güncellendi.");
        navigate("/admin/blogs");
      } else {
        message.error("Blog güncellenirken bir hata oluştu.");
      }
    } catch (error) {
      console.log("Blog güncelleme hatası:", error);
      message.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
      return <div style={{textAlign: "center", padding: "50px"}}><Spin size="large" /></div>;
  }

  return (
    <div style={{ padding: "20px" }}>
        <h2>Blog Yazısını Düzenle</h2>
      <Spin spinning={loading}>
        <Form layout="vertical" onFinish={onFinish} form={form}>
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
            Güncelle
          </Button>
        </Form>
      </Spin>
    </div>
  );
};

export default UpdateBlogPage;
