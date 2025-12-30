import { Layout, Menu } from "antd";
import { 
  UserOutlined, 
  LockOutlined, 
  EnvironmentOutlined, 
  ShoppingOutlined 
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const { Sider, Content } = Layout;

const ProfileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("info");

  // Sync menu selection with URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/profile/orders")) setSelectedKey("orders");
    else if (path.includes("/profile/password")) setSelectedKey("password");
    else if (path.includes("/profile/address")) setSelectedKey("address");
    else if (path.includes("/profile/reviews")) setSelectedKey("reviews");
    else setSelectedKey("info");
  }, [location]);

  const menuItems = [
    {
      key: "info",
      icon: <UserOutlined />,
      label: "Hesap Bilgileri",
      onClick: () => navigate("/profile"),
    },
    {
      key: "password",
      icon: <LockOutlined />,
      label: "Şifre Değiştir",
      onClick: () => navigate("/profile/password"),
    },
    {
      key: "address",
      icon: <EnvironmentOutlined />,
      label: "Adreslerim",
      onClick: () => navigate("/profile/address"),
    },
    {
      key: "orders",
      icon: <ShoppingOutlined />,
      label: "Siparişlerim",
      onClick: () => navigate("/profile/orders"),
    },
    {
      key: "reviews",
      icon: <span role="img" aria-label="star" className="anticon"><i className="bi bi-star"></i></span>,
      label: "Yorumlarım",
      onClick: () => navigate("/profile/reviews"),
    },
  ];

  return (
    <div className="container" style={{ padding: "50px 0", maxWidth: "1500px" }}>
      <Layout style={{ background: "white", minHeight: "60vh" }}>
        <Sider width={250} style={{ background: "white", borderRight: "1px solid #f0f0f0" }} breakpoint="lg" collapsedWidth="0">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: "100%", borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: "0 24px", background: "white" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: "white",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default ProfileLayout;
