import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CartProvider from "./context/CartProvider.jsx";
import { AuthContextProvider } from "./context/AuthContextProvider.jsx";
import SiteProvider from "./context/SiteContext";
import { Layout } from "./layouts/Layout.jsx";
import App from "./App.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css"; 

import ScrollToTop from "./components/ScrollToTop";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <AuthContextProvider>
        <SiteProvider>
            <Layout>
            <ScrollToTop />
            <App />
            </Layout>
        </SiteProvider>
      </AuthContextProvider>
    </CartProvider>
  </BrowserRouter>
);
