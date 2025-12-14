import { Layout, Menu, Button } from "antd"; // Button eklendi
import PropTypes from "prop-types";
import {
  UserOutlined,
  LaptopOutlined,
  RollbackOutlined,
  BarcodeOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  MenuOutlined, // Mobil menü butonu için eklendi
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react"; // Durum yönetimi için eklendi

const { Sider, Header, Content } = Layout;

const HEADER_HEIGHT = 64;
const SIDER_WIDTH = 200;

const getMenuItems = (navigate) => [
  {
    key: "/admin",
    icon: <DashboardOutlined />,
    label: "Dashboard",
    onClick: () => {
      navigate(`/admin`);
    },
  },
  {
    key: "sub1",
    icon: <AppstoreOutlined />,
    label: "Kategoriler",
    children: [
      {
        key: "/admin/categories",
        label: "Kategori Listesi",
        onClick: () => navigate(`/admin/categories`),
      },
      {
        key: "/admin/categories/create",
        label: "Yeni Kategori Oluştur",
        onClick: () => navigate("/admin/categories/create"),
      },
    ],
  },
  {
    key: "sub2",
    icon: <LaptopOutlined />,
    label: "Ürünler",
    children: [
      {
        key: "/admin/products",
        label: "Ürün Listesi",
        onClick: () => navigate(`/admin/products`),
      },
      {
        key: "/admin/products/create",
        label: "Yeni Ürün Oluştur",
        onClick: () => navigate("/admin/products/create"),
      },
    ],
  },
  {
    key: "sub3",
    icon: <BarcodeOutlined />,
    label: "Kuponlar",
    children: [
      {
        key: "/admin/coupons",
        label: "Kupon Listesi",
        onClick: () => navigate(`/admin/coupons`),
      },
      {
        key: "/admin/coupons/create",
        label: "Yeni Kupon Oluştur",
        onClick: () => navigate("/admin/coupons/create"),
      },
    ],
  },
  {
    key: "/admin/users",
    icon: <UserOutlined />,
    label: "Kullanıcı Listesi",
    onClick: () => navigate(`/admin/users`),
  },
  {
    key: "/admin/orders",
    icon: <ShoppingCartOutlined />,
    label: "Siparişler",
    onClick: () => navigate(`/admin/orders`),
  },
  {
    key: "/",
    icon: <RollbackOutlined />,
    label: "Ana Sayfaya Git",
    onClick: () => navigate(`/`),
  },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = getMenuItems(navigate);
  const selectedKeys = [location.pathname];
  const openKeys = menuItems
    .filter((item) => item.children)
    .find((item) =>
      item.children.some((child) => child.key === location.pathname)
    )?.key;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "fixed",
          width: "100%",
          height: HEADER_HEIGHT,
          zIndex: 20,
          padding: "0 20px",
          background: "#000",
          borderBottom: "1px solid #000",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            color: "#fff",
          }}
        >
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: HEADER_HEIGHT,
              height: HEADER_HEIGHT,
              color: "#fff",
              marginRight: 16,
              display: collapsed ? "inline-block" : "none",
            }}
          />
          <h1 style={{ color: "#fff", margin: 0 }}>Admin Paneli</h1>
        </div>
      </Header>

      <Sider
        width={SIDER_WIDTH}
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          position: "fixed",
          left: 0,
          top: HEADER_HEIGHT,
          bottom: 0,
          zIndex: 10,
        }}
      >
        <Menu
          mode="inline"
          theme="light"
          selectedKeys={selectedKeys}
          defaultOpenKeys={openKeys ? [openKeys] : []}
          style={{
            height: "100%",
            borderRight: 0,
            "--ant-menu-item-selected-bg": "#000",
            "--ant-menu-item-selected-color": "#fff",
          }}
          items={menuItems}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 0 : SIDER_WIDTH,
          marginTop: HEADER_HEIGHT,
          transition: "margin-left 0.2s",
        }}
      >
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
