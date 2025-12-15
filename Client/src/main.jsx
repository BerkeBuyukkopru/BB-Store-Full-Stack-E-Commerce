import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CartProvider from "./context/CartProvider.jsx";
import { AuthContextProvider } from "./context/AuthContextProvider.jsx";
import { Layout } from "./layouts/Layout.jsx";
import App from "./App.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CartProvider>
      <AuthContextProvider>
        <Layout>
          <App />
        </Layout>
      </AuthContextProvider>
    </CartProvider>
  </BrowserRouter>
);
