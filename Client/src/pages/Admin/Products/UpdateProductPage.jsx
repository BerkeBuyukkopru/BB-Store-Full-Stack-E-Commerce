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
import ReactQuill from "react-quill-new"; // Sizin kullandığınız kütüphane
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "react-quill-new/dist/quill.snow.css";

const UpdateProductPage = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const params = useParams();
  const productId = params.id;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // ✨ DÜZELTME 1: API Rotaları ve Yetkilendirme (Sizin API yapısına uygun: /category ve /product)
        const [categoriesResponse, singleProductResponse] = await Promise.all([
          fetch(`${apiUrl}/category`, { credentials: "include" }),
          fetch(`${apiUrl}/product/${productId}`, { credentials: "include" }),
        ]);

        if (!categoriesResponse.ok || !singleProductResponse.ok) {
          message.error("Veri getirme başarısız veya yetkiniz yok.");
          return;
        }

        const [categoriesData, singleProductData] = await Promise.all([
          categoriesResponse.json(),
          singleProductResponse.json(),
        ]);

        setCategories(categoriesData);

        if (singleProductData) {
          form.setFieldsValue({
            name: singleProductData.name,
            current: singleProductData.productPrice?.current,
            discount: singleProductData.productPrice?.discount,
            description: singleProductData.description,
            img: (singleProductData.img || []).join("\n"),
            colors: (singleProductData.colors || []).join("\n"),
            sizes: (singleProductData.sizes || []).join("\n"),
            category:
              singleProductData.category?._id || singleProductData.category,
          });
        }
      } catch (error) {
        console.error("Veri hatası:", error);
        message.error("Sunucuya bağlanılamadı veya ağ hatası oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // Bağımlılık dizisi, Form'un veriyi set etmesini engellememek için sade bırakıldı.
  }, [apiUrl, productId, form]);

  const onFinish = async (values) => {
    // Dizi dönüşümleri ve temizleme
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
      // ✨ DÜZELTME 4: PUT Rotası ve Yetkilendirme
      const response = await fetch(`${apiUrl}/product/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ...values,
          // ✨ DÜZELTME 5: Backend'deki 'productPrice' DTO alanı ile eşleştirme
          productPrice: {
            current: values.current,
            discount: values.discount || 0,
          },
          colors,
          sizes,
          img: imgLinks,
        }),
      });

      if (response.ok) {
        message.success("Ürün başarıyla güncellendi.");
        navigate("/admin/products");
      } else {
        const errorData = await response.json();
        message.error(
          errorData.message || "Ürün güncellenirken bir hata oluştu."
        );
      }
    } catch (error) {
      console.error("Ürün güncelleme hatası:", error);
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
            label="Fiyat (Güncel)"
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
            label="İndirim Oranı"
            name="discount"
            rules={[
              {
                required: true,
                message: "Lütfen bir ürün indirim oranı girin!",
              },
            ]}
            style={{ flex: 1 }}
          >
            <InputNumber
              min={0}
              placeholder="Opsiyonel"
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

export default UpdateProductPage;
