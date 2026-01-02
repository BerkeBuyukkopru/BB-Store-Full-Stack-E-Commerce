import {
  Button,
  Form,
  Input,
  Spin,
  message,
  Card,
  Space,
  InputNumber,
} from "antd";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate eklendi

const UpdateCouponPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();

  const couponId = params.id;
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSingleCoupon = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${apiUrl}/coupon/${couponId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Kupon verileri getirilirken hata oluştu.");
        }

        const data = await response.json();



        if (data) {
          form.setFieldsValue({
            code: data.code,
            discountPercent: data.discountPercent,
          });
        }
      } catch (error) {
        console.error("Veri hatası:", error);
        message.error("Kupon bilgileri çekilirken hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    fetchSingleCoupon();
  }, [apiUrl, couponId, form]);

  // Güncelleme Formu Gönderme İşlemi (PUT)
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/coupon/${couponId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Kupon başarıyla güncellendi.");
        navigate("/admin/coupons");
      } else {
        const errorData = await response.json();
        message.error(
          errorData.message || "Kupon güncellenirken bir hata oluştu."
        );
      }
    } catch (error) {
      console.error("Kupon güncelleme hatası:", error);
      message.error("Sunucuya bağlanılamadı veya ağ hatası oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Kupon Düzenle" style={{ maxWidth: 600, margin: "20px auto" }}>
      <Spin spinning={loading}>
        <Form
          form={form}
          name="update-coupon"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label="Kupon Kodu"
            name="code"
            rules={[
              {
                required: true,
                message: "Lütfen Kupon kodunu girin!",
              },
            ]}
          >
            <Input placeholder="Kupon Kodu" />
          </Form.Item>
          <Form.Item
            label="Kupon İndirim Oranı"
            name="discountPercent"
            validateTrigger="onChange"
            rules={[
              {
                required: true,
                message: "Lütfen bir kupon indirim oranı girin!",
              },
              {
                type: "number",
                min: 0,
                max: 100,
                message: "İndirim oranı %100'den büyük olamaz!",
              },
            ]}
          >
            <InputNumber
              placeholder="Örn: 20"
              style={{ width: "100%" }}
              min={0}
              max={100}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Güncelle
              </Button>
              <Button onClick={() => navigate("/admin/coupons")}>İptal</Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default UpdateCouponPage;
