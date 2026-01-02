import { useEffect, useState, useRef } from "react";
import CategoryItem from "./CategoryItem";
import "./Categories.css"; 
import { message, Carousel, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/category`);

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          message.error("Kategoriler yüklenirken bir hata oluştu.");
        }
      } catch (error) {

      }
    };
    fetchCategories();
  }, [apiUrl]);


  const responsiveSettings = [
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 576,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ];

  return (
    <section className="categories">
      <div className="container" style={{ position: "relative" }}>
        <div className="section-title">
          <h2>Kategoriler</h2>
        </div>
        
        <Button 
            shape="circle" 
            icon={<LeftOutlined />} 
            className="carousel-button prev-button"
            onClick={() => carouselRef.current.prev()}
        />
        
        <Carousel 
            ref={carouselRef}
            afterChange={onChange}
            slidesToShow={4}
            slidesToScroll={1}
            autoplay
            autoplaySpeed={10000} 
            infinite
            draggable
            dots={false}
            responsive={responsiveSettings}
            className="categories-carousel"
        >
          {categories.map((category) => (
            <div key={category._id || category.id} className="carousel-item-wrapper">

                <div style={{ padding: "0 10px" }}> 
                    <CategoryItem category={category} />
                </div>
            </div>
          ))}
        </Carousel>

         <Button 
            shape="circle" 
            icon={<RightOutlined />} 
            className="carousel-button next-button"
            onClick={() => carouselRef.current.next()}
        />

      </div>
    </section>
  );
};

export default Categories;
