import { Modal, Descriptions, Table, Tag, Divider, Row, Col, Card } from "antd";
import PropTypes from "prop-types";

const OrderDetailModal = ({ open, onCancel, order }) => {
  if (!order) return null;

  const {
    orderNumber,
    user,
    basketItems,
    totalPrice,
    status,
    createdAt,
    address,
    cargoFee,
  } = order;

  // Durum çevirisi ve renk belirleme
  const getStatusTag = (status) => {
    let color = "red";
    let text = status;

    if (status === "PaymentSuccess") {
      color = "green";
      text = "Ödeme Başarılı";
    } else if (status === "Pending") {
      color = "orange";
      text = "Ödeme Bekleniyor";
    } else if (status === "PaymentFailed") {
      color = "red";
      text = "Ödeme Başarısız";
    }

    return <Tag color={color}>{text}</Tag>;
  };

  const productColumns = [
    {
      title: "Ürün Resmi",
      dataIndex: "img",
      key: "img",
      render: (img) => (
        <img
          src={img?.[0]}
          alt="Product"
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Ürün ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Ürün Adı",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Adet",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Birim Fiyat",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toFixed(2)}₺`,
    },
    {
      title: "Toplam",
      key: "total",
      render: (_, record) => `${(record.price * record.quantity).toFixed(2)}₺`,
    },
  ];

  return (
    <Modal
      title={`Sipariş Detayı: #${orderNumber}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
      centered
    >
      <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "5px" }}>
        
        <Card variant="borderless" style={{ background: "#f9f9f9", marginBottom: 20 }}>
          <Descriptions title="Genel Bilgiler" bordered size="small" column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Sipariş Numarası">{orderNumber}</Descriptions.Item>
            <Descriptions.Item label="Sipariş Durumu">{getStatusTag(status)}</Descriptions.Item>
            <Descriptions.Item label="Sipariş Tarihi">
              {new Date(createdAt).toLocaleDateString("tr-TR")} {new Date(createdAt).toLocaleTimeString("tr-TR")}
            </Descriptions.Item>
            <Descriptions.Item label="Toplam Tutar" contentStyle={{ fontWeight: "bold", color: "green" }}>
              {totalPrice.toFixed(2)}₺
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <Card title="Müşteri Bilgileri" size="small" variant="outlined">
              <p><strong>Ad Soyad:</strong> {user?.name} {user?.surname}</p>
              <p><strong>E-posta:</strong> {user?.email}</p>
              <p><strong>Kullanıcı ID:</strong> {user?.id || "-"}</p>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Teslimat Adresi" size="small" variant="outlined">
              {address ? (
                <>
                  <p><strong>Başlık:</strong> {address.title} ({address.name} {address.surname})</p>
                  <p><strong>Telefon:</strong> {address.phone}</p>
                  <p><strong>Şehir/İlçe:</strong> {address.city} / {address.district}</p>
                  <p><strong>Detay:</strong> {address.neighborhood}, {address.addressDetail}</p>
                </>
              ) : (
                <p style={{ color: "gray" }}>Adres bilgisi bulunamadı.</p>
              )}
            </Card>
          </Col>
        </Row>

        <Divider titlePlacement="left" style={{ margin: "20px 0" }}>Sipariş Edilen Ürünler</Divider>

        <Table
          dataSource={basketItems}
          columns={productColumns}
          rowKey={(record) => record.productId || record._id || Math.random()}
          pagination={false}
          size="small"
          bordered
        />

        <div style={{ marginTop: 20, textAlign: "right" }}>
            <p><strong>Ara Toplam:</strong> {(totalPrice - cargoFee).toFixed(2)}₺</p>
            <p>
                <strong>Kargo:</strong> 
                {cargoFee > 0 ? `${cargoFee.toFixed(2)}₺` : "Ücretsiz"}
                {order.cargoCompanyName && <span style={{ marginLeft: 5 }}>({order.cargoCompanyName})</span>}
            </p>
            <Divider style={{ margin: "10px 0" }} />
            <h3 style={{ color: "green" }}>GENEL TOPLAM: {totalPrice.toFixed(2)}₺</h3>
        </div>

      </div>
    </Modal>
  );
};

OrderDetailModal.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  order: PropTypes.object,
};

export default OrderDetailModal;
