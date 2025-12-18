import { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import Slider from "react-slick";
import "./Products.css";
import { message } from "antd";

const Products = () => {
  const [products, setProducts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // ✨ Senin Backend rotan: /product
        const response = await fetch(`${apiUrl}/product`);

        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          message.error("Ürünler getirilemedi.");
        }
      } catch (error) {
        console.log("Veri hatası:", error);
      }
    };
    fetchProducts();
  }, [apiUrl]);

  const sliderSettings = {
    dots: false,
    infinite: products.length > 3, // Ürün azsa slider bozulmasın
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 520, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="products">
      <div className="container">
        <div className="section-title">
          <h2>Öne Çıkanlar</h2>
          <p>Yaz Koleksiyonu Yeni Modern Tasarımlar</p>
        </div>
        <div className="product-wrapper product-carousel">
          <Slider {...sliderSettings}>
            {products.map((product) => (
              <ProductItem productItem={product} key={product._id || product.id} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default Products;