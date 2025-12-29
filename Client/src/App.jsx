import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import BlogPage from "./pages/BlogPage";
import ContactPage from "./pages/ContactPage";
import CategoriesPage from "./pages/CategoriesPage";
import CartPage from "./pages/CartPage";
import AuthPage from "./pages/AuthPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailurePage from "./pages/PaymentFailurePage";
import ProductDetailsPage from "./pages/ProductsDetailsPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import ProfileLayout from "./pages/Profile/ProfileLayout";
import UserProfileInfo from "./pages/Profile/UserProfileInfo";
import UserPasswordChange from "./pages/Profile/UserPasswordChange";
import UserAddressManager from "./pages/Profile/UserAddressManager";
import UserOrders from "./pages/Profile/UserOrders";
import "./App.css";
import UserPage from "./pages/Admin/Users/UserPage";
import CategoryPage from "./pages/Admin/Categories/CategoryPage";
import UpdateCategoryPage from "./pages/Admin/Categories/UpdateCategoryPage";
import CreateCategoryPage from "./pages/Admin/Categories/CreateCategoryPage";
import CreateProductPage from "./pages/Admin/Products/CreateProductPage";
import ProductPage from "./pages/Admin/Products/ProductPage";
import UpdateProductPage from "./pages/Admin/Products/UpdateProductPage";
import CouponPage from "./pages/Admin/Coupons/CouponPage";
import CreateCouponPage from "./pages/Admin/Coupons/CreateCouponPage";
import UpdateCouponPage from "./pages/Admin/Coupons/UpdateCategoryPage";
import OrderPage from "./pages/Admin/Orders/OrderPage";
import SiteSettingsPage from "./pages/Admin/SiteSettings/SiteSettingsPage";
import AboutUsSettingsPage from "./pages/Admin/SiteSettings/AboutUsSettingsPage";
import PrivacyPolicySettingsPage from "./pages/Admin/SiteSettings/PrivacyPolicySettingsPage";
import SliderPage from "./pages/Admin/Sliders/SliderPage";
import CreateSliderPage from "./pages/Admin/Sliders/CreateSliderPage";
import UpdateSliderPage from "./pages/Admin/Sliders/UpdateSliderPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import FavoritesPage from "./pages/FavoritesPage";
import BlogListPage from "./pages/Admin/Blogs/BlogListPage";
import CreateBlogPage from "./pages/Admin/Blogs/CreateBlogPage";
import UpdateBlogPage from "./pages/Admin/Blogs/UpdateBlogPage";
import AdminContactPage from "./pages/Admin/Contacts/ContactPage";
import CargoPage from "./pages/Admin/Cargo/CargoPage";
import CreateCargoPage from "./pages/Admin/Cargo/CreateCargoPage";
import UpdateCargoPage from "./pages/Admin/Cargo/UpdateCargoPage";
import UserLayout from "./layouts/UserLayout"; // Assuming UserLayout exists and is imported
import AdminLayoutWrapper from "./layouts/AdminLayoutWrapper";

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="favorites" element={<FavoritesPage />} />
        <Route path="product/:id" element={<ProductDetailsPage />} />
        <Route path="blog/:id" element={<BlogDetailsPage />} />
        
        {/* Profile Routes - Nested inside UserLayout to keep Header/Footer */}
        <Route path="profile" element={<ProfileLayout />}>
          <Route index element={<UserProfileInfo />} />
          <Route path="password" element={<UserPasswordChange />} />
          <Route path="address" element={<UserAddressManager />} />
          <Route path="orders" element={<UserOrders />} />
        </Route>
      </Route>

      {/* Routes that might not use UserLayout or have specific absolute paths */}
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route path="/payment/failure" element={<PaymentFailurePage />} />
      {/* The following routes are already defined as relative paths under UserLayout,
          but if they need to be accessible directly without UserLayout, they can be
          defined as absolute paths here. However, for consistency, it's often better
          to keep them under UserLayout if they share the same layout.
          The instruction implies adding them as absolute paths outside UserLayout. */}


      <Route path="/admin/*" element={<AdminLayoutWrapper />}>
        <Route index element={<Navigate to="orders" replace />} />
        <Route path="users" element={<UserPage />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route path="categories/update/:id" element={<UpdateCategoryPage />} />
        <Route path="categories/create" element={<CreateCategoryPage />} />
        <Route path="products" element={<ProductPage />} />
        <Route path="products/create" element={<CreateProductPage />} />
        <Route path="products/update/:id" element={<UpdateProductPage />} />
        <Route path="coupons" element={<CouponPage />} />
        <Route path="coupons/create" element={<CreateCouponPage />} />
        <Route path="coupons/update/:id" element={<UpdateCouponPage />} />
        <Route path="orders" element={<OrderPage />} />
        
        {/* Site Yönetimi */}
        <Route path="site-settings" element={<SiteSettingsPage />} />
        <Route path="site-settings/about" element={<AboutUsSettingsPage />} />
        <Route path="site-settings/privacy" element={<PrivacyPolicySettingsPage />} />
        <Route path="sliders" element={<SliderPage />} />
        <Route path="sliders/create" element={<CreateSliderPage />} />
        <Route path="sliders/update/:id" element={<UpdateSliderPage />} />
        
        {/* Blog Yönetimi */}
        <Route path="blogs" element={<BlogListPage />} />
        <Route path="blogs/create" element={<CreateBlogPage />} />
        <Route path="blogs/update/:id" element={<UpdateBlogPage />} />

        {/* İletişim Mesajları */}
        <Route path="contacts" element={<AdminContactPage />} />

        {/* Kargo Yönetimi */}
        <Route path="cargo" element={<CargoPage />} />
        <Route path="cargo/create" element={<CreateCargoPage />} />
        <Route path="cargo/update/:id" element={<UpdateCargoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
