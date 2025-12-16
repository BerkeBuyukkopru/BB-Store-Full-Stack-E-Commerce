import {
  Button,
  Form,
  Input,
  Spin,
  message,
  Card,
  Space,
  InputNumber,
  Select,
} from "antd";
import ReactQuill from "react-quill-new";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "react-quill-new/dist/quill.snow.css";

const CreateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // Kategori verilerini çekme (Aynı kalır, bu kısım çalışıyor)
  const fetchCategories = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/category`);

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        message.error("Kategoriler yüklenirken hata oluştu.");
      }
    } catch (error) {
      console.error("Veri hatası:", error);
      message.error("Sunucuya bağlanılamadı veya ağ hatası oluştu.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Ürün oluşturma (POST) fonksiyonu
  const onFinish = async (values) => {
    // Dizi dönüşümleri aynı kalır (doğru)
    const imgLinks = values.img
      .split("\n")
      .map((link) => link.trim())
      .filter((link) => link.length > 0);
    const colors = values.colors
      .split("\n")
      .map((color) => color.trim())
      .filter((color) => color.length > 0);
    const sizes = values.sizes
      .split("\n")
      .map((size) => size.trim())
      .filter((size) => size.length > 0);

    setLoading(true);
    try {
      // Rota düzeltildi: /product (Sizin verdiğiniz rotaya göre)
      const response = await fetch(`${apiUrl}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...values,
          productPrice: {
            current: values.current,
            discount: 0,
          },
          colors,
          sizes,
          img: imgLinks,
        }),
      });

      if (response.ok) {
        message.success("Ürün başarıyla oluşturuldu.");
        form.resetFields();
        navigate("/admin/products");
      } else {
        const errorData = await response.json();
        message.error(
          errorData.message || "Ürün oluşturulurken bir hata oluştu."
        );
      }
    } catch (error) {
      console.error("Ürün oluşturma hatası:", error);
      message.error("Sunucuya bağlanılamadı veya ağ hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Yeni Ürün Oluştur"
      style={{ maxWidth: 800, margin: "20px auto" }}
    >
      <Spin spinning={loading}>
        <Form
          name="create-product-form"
          layout="vertical"
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Ürün İsmi"
            name="name"
            rules={[{ required: true, message: "Lütfen Ürün adını girin!" }]}
          >
            <Input placeholder="Ürün adını giriniz." />
          </Form.Item>

          <Form.Item
            label="Ürün Kategorisi"
            name="category"
            rules={[{ required: true, message: "Lütfen 1 kategori seçin!" }]}
          >
            <Select
              placeholder="Kategori Seçiniz"
              loading={categories.length === 0}
            >
              {categories.map((category) => (
                <Select.Option
                  value={category._id || category.id}
                  key={category._id || category.id}
                >
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Fiyat"
            name="current"
            rules={[{ required: true, message: "Lütfen ürün fiyatını girin!" }]}
            style={{ flex: 1 }}
          >
            <InputNumber
              min={0}
              placeholder="125.00"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Ürün Açıklaması"
            name="description"
            rules={[
              {
                required: true,
                message: "Lütfen bir ürün açıklaması girin!",
              },
            ]}
          >
            <ReactQuill
              theme="snow"
              style={{
                backgroundColor: "white",
              }}
            />
          </Form.Item>

          <Form.Item
            label="Ürün Görselleri (Linkler)"
            name="img"
            rules={[
              {
                required: true,
                message: "Lütfen en az 4 ürün görsel linki girin!",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Her bir görsel linkini yeni bir satıra yazın."
              autoSize={{ minRows: 4 }}
            />
          </Form.Item>
          <Form.Item
            label="Ürün Renkleri (Hex Kodları veya İsimler)"
            name="colors"
            rules={[
              { required: true, message: "Lütfen en az 1 ürün rengi girin!" },
            ]}
          >
            <Input.TextArea
              placeholder="Her bir renk kodunu yeni bir satıra yazın."
              autoSize={{ minRows: 4 }}
            />
          </Form.Item>

          <Form.Item
            label="Ürün Bedenleri"
            name="sizes"
            rules={[
              {
                required: true,
                message: "Lütfen en az 1 ürün beden ölçüsü girin!",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Her bir beden ölçüsünü (S, M, L vb.) yeni bir satıra yazın."
              autoSize={{ minRows: 4 }}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Oluştur
              </Button>
              <Button onClick={() => navigate("/admin/products")}>İptal</Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default CreateProductPage;
