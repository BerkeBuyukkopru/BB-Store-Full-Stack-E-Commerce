import { Layout, Menu, Button, message } from "antd"; // Button eklendi
import PropTypes from "prop-types";
import {
  UserOutlined,
  LaptopOutlined,
  RollbackOutlined,
  BarcodeOutlined,
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  MenuOutlined,
  FileTextOutlined,
  RocketOutlined, // Kargo ikonu
  MessageOutlined // Yorum ikonu
} from "@ant-design/icons";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useState, useContext, useEffect } from "react"; // Durum yönetimi için eklendi
import { AuthContext } from "../context/AuthContext";



const { Sider, Header, Content } = Layout;

const HEADER_HEIGHT = 64;
const SIDER_WIDTH = 200;

const getMenuItems = (navigate) => [
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
    key: "/admin/reviews",
    icon: <MessageOutlined />,
    label: "Yorumlar",
    onClick: () => navigate(`/admin/reviews`),
  },
  {
    key: "sub5",
    icon: <FileTextOutlined />,
    label: "Blog Yönetimi",
    children: [
      {
        key: "/admin/blogs",
        label: "Blog Listesi",
        onClick: () => navigate(`/admin/blogs`),
      },
      {
        key: "/admin/blogs/create",
        label: "Yeni Blog Ekle",
        onClick: () => navigate("/admin/blogs/create"),
      },
    ],
  },
  {
    key: "sub4",
    icon: <DashboardOutlined />,
    label: "Site Yönetimi",
    children: [
      {
        key: "/admin/site-settings",
        label: "Genel Ayarlar",
        onClick: () => navigate(`/admin/site-settings`),
      },
      {
        key: "/admin/site-settings/about",
        label: "Hakkımızda",
        onClick: () => navigate(`/admin/site-settings/about`),
      },
      {
        key: "/admin/site-settings/privacy",
        label: "M.S.S (Gizlilik)",
        onClick: () => navigate(`/admin/site-settings/privacy`),
      },
      {
        key: "/admin/sliders",
        label: "Sliderlar",
        onClick: () => navigate(`/admin/sliders`),
      },
    ],
  },
  {
    key: "sub_cargo",
    icon: <RocketOutlined />,
    label: "Kargo Yöntemleri",
    children: [
      {
        key: "/admin/cargo",
        label: "Kargo Listesi",
        onClick: () => navigate("/admin/cargo"),
      },
      {
        key: "/admin/cargo/create",
        label: "Yeni Kargo Ekle",
        onClick: () => navigate("/admin/cargo/create"),
      },
    ],
  },
  {
    key: "13",
    icon: <i className="bi bi-envelope"></i>,
    label: "Mesajlar",
    onClick: () => navigate("/admin/contacts"),
  },
  {
    key: "/",
    icon: <RollbackOutlined />,
    label: "Ana Sayfaya Git",
    onClick: () => window.location.href = "/",
  },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const { user, loading } = useContext(AuthContext);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (loading) {
      return; 
    }
    if (!isAdmin) {

      if (user) { 
        message.warning("Bu sayfaya erişim yetkiniz bulunmamaktadır.");
      }
      navigate("/", { replace: true });
      window.location.href = "/";
    }
  }, [loading, isAdmin, navigate, user]); 

  if (loading) {
    return (
      <div style={{ padding: 50, textAlign: "center" }}>
        Yetki Kontrol Ediliyor...
      </div>
    );
  }
  if (!isAdmin) {
    return null; 
  }

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
              fontSize: "18px",
              width: HEADER_HEIGHT,
              height: HEADER_HEIGHT,
              color: "#fff",
              marginRight: 16,
              display: collapsed ? "inline-block" : "none",
            }}
          />
          <Link 
              to={"/admin/orders"} 
              className="admin-logo" 
              style={{marginRight: 20, height: '100%', display: 'flex', alignItems: 'center'}}
          >
            <img 
                src="/logo.png" 
                alt="Logo" 
                style={{marginLeft: 20, height: '55px', objectFit: 'cover' }} 
            />
          </Link>
          
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
