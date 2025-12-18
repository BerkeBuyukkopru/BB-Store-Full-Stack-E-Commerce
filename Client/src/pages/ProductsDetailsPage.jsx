import { useEffect, useState } from "react";
import ProductDetail from "../components/ProductDetails/ProductDetail"; // Senin bileşen ismin
import { useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const [singleProduct, setSingleProduct] = useState(null);
  const { id: productId } = useParams();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSingleProduct = async () => {
      try {
        // ✨ Senin Backend rotan: /product/${productId}
        const response = await fetch(`${apiUrl}/product/${productId}`);

        if (!response.ok) {
          throw new Error("Ürün verileri getirilemedi.");
        }

        const data = await response.json();
        setSingleProduct(data);
      } catch (error) {
        console.log("Veri hatası:", error);
      }
    };
    fetchSingleProduct();
  }, [apiUrl, productId]);

  return singleProduct ? (
    <ProductDetail singleProduct={singleProduct} />
  ) : (
    <div className="container" style={{ padding: "50px", textAlign: "center" }}>
      <p>Ürün Yükleniyor...</p>
    </div>
  );
};

export default ProductDetailsPage;
