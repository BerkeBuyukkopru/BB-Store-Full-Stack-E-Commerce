import { useEffect, useState, useCallback } from "react";
import ProductDetail from "../components/ProductDetails/ProductDetail"; // Senin bileşen ismin
import { useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const [singleProduct, setSingleProduct] = useState(null);
  const { id: productId } = useParams();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchSingleProduct = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/product/${productId}`);

      if (!response.ok) {
        throw new Error("Ürün verileri getirilemedi.");
      }

      const data = await response.json();
      setSingleProduct(data);
    } catch (error) {
      console.log("Veri hatası:", error);
    }
  }, [apiUrl, productId]);

  useEffect(() => {
    fetchSingleProduct();
  }, [fetchSingleProduct]);

  return singleProduct ? (
    <ProductDetail singleProduct={singleProduct} setSingleProduct={setSingleProduct} onReviewAdded={fetchSingleProduct} />
  ) : (
    <div className="container" style={{ padding: "50px", textAlign: "center" }}>
      <p>Ürün Yükleniyor...</p>
    </div>
  );
};

export default ProductDetailsPage;
