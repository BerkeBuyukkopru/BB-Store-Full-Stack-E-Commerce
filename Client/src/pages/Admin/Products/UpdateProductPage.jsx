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
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill-new";
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
        const [categoriesResponse, singleProductResponse] = await Promise.all([
          fetch(`${apiUrl}/category`, { credentials: "include" }),
          fetch(`${apiUrl}/product/${productId}`, { credentials: "include" }),
        ]);

        if (!categoriesResponse.ok || !singleProductResponse.ok) {
          message.error("Veri getirme başarısız veya yetkiniz yok.");
          return;
        }

        const categoriesData = await categoriesResponse.json();
        const singleProductData = await singleProductResponse.json();

        setCategories(categoriesData);

        if (singleProductData) {
          form.setFieldsValue({
            name: singleProductData.name,
            current: singleProductData.productPrice?.current,
            discount: singleProductData.productPrice?.discount,
            description: singleProductData.description,

            img: (singleProductData.img || []).map(url => ({ url })),
            colors: (singleProductData.colors || []).map(color => ({ color })),
            // Eski veri (string array) gelirse objeye çevir, yeni veri ise olduğu gibi kullan
            sizes: (singleProductData.sizes || []).map(s => {
                if (typeof s === 'string') return { size: s, stock: 0 };
                return s;
            }),
            category:
              singleProductData.category?._id || singleProductData.category,
            gender: singleProductData.gender || "Unisex",
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
  }, [apiUrl, productId, form]);

  const onFinish = async (values) => {
    const imgLinks = values.img ? values.img.map(i => i.url) : [];
    const colors = values.colors ? values.colors.map(c => c.color) : [];
    
    const sizes = values.sizes.map(s => ({ ...s, size: s.size.toUpperCase() }));

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/product/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...values,
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
        message.error(errorData.message || "Ürün güncellenirken hata oluştu.");
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
          name="update-product-form"
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
              onChange={(value) => {
                const selectedCategory = categories.find(
                  (c) => c._id === value || c.id === value
                );
                if (selectedCategory && selectedCategory.gender !== "Unisex") {
                  form.setFieldsValue({ gender: selectedCategory.gender });
                }
              }}
            >
              {categories.map((category) => (
                <Select.Option
                  value={category._id || category.id}
                  key={category._id || category.id}
                >
                  {category.name} ({category.gender === "Man" ? "Erkek" : category.gender === "Woman" ? "Kadın" : "Unisex"})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.category !== currentValues.category}
          >
            {({ getFieldValue }) => {
              const selectedCategoryId = getFieldValue("category");
              const selectedCategory = categories.find(
                (c) => c._id === selectedCategoryId || c.id === selectedCategoryId
              );
              const isGenderFixed =
                selectedCategory && selectedCategory.gender !== "Unisex";

              return (
                <Form.Item
                  label="Cinsiyet"
                  name="gender"
                  rules={[{ required: true, message: "Lütfen cinsiyet seçin!" }]}
                >
                  <Select disabled={isGenderFixed}>
                    <Select.Option value="Man">Erkek</Select.Option>
                    <Select.Option value="Woman">Kadın</Select.Option>
                    <Select.Option value="Unisex">Unisex</Select.Option>
                  </Select>
                </Form.Item>
              );
            }}
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
                validator: async (_, names) => {
                   if (!names || names.length < 2) {
                       return Promise.reject(new Error("Lütfen en az 2 ürün görsel linki girin!"));
                   }
                   return Promise.resolve();
                },
              },
            ]}
          >
            <Form.List name="img">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "url"]}
                        rules={[{ required: true, message: "Görsel linki giriniz" }]}
                        style={{ flex: 1, width: "400px" }}
                      >
                        <Input placeholder="Görsel Linki (https://...)" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Görsel Ekle
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item
            label="Ürün Rengi (Tekil)"
            name="colors"
            rules={[
                {
                  required: true,
                  validator: async (_, names) => {
                     if (!names || names.length < 1) {
                         return Promise.reject(new Error("Lütfen 1 renk girin!"));
                     }
                     return Promise.resolve();
                  },
                },
              ]}
          >
            <Form.List name="colors">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "color"]}
                        rules={[{ required: true, message: "Renk giriniz" }]}
                        style={{ flex: 1, width: "200px" }}
                      >
                        <Input placeholder="Renk (Örn: Mavi, Red, #FFF)" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  {fields.length < 1 && (
                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Renk Ekle
                        </Button>
                      </Form.Item>
                  )}
                </>
              )}
            </Form.List>
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
            <Form.List name="sizes">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "size"]}
                        rules={[{ required: true, message: "Beden giriniz" }]}
                      >
                        <Input placeholder="Beden (S, M, 36 vs.)" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "stock"]}
                        rules={[{ required: true, message: "Stok giriniz" }]}
                      >
                         <InputNumber min={0} placeholder="Stok Adedi" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Beden Ekle
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
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
