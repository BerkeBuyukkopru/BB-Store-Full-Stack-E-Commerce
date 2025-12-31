import { useState, useEffect, useRef } from "react";
import BlogItem from "./BlogItem";
import "./Blogs.css";
import { message, Carousel, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const Blogs = ({ isHome }) => {
  const [blogs, setBlogs] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${apiUrl}/blogs`);
        if (response.ok) {
          const data = await response.json();
          setBlogs(data);
        } else {
          message.error("Bloglar getirilirken bir hata oluştu.");
        }
      } catch (error) {
        console.log("Veri hatası:", error);
      }
    };
    fetchBlogs();
  }, [apiUrl]);

  const responsiveSettings = [
    {
       breakpoint: 992,
       settings: { slidesToShow: 2 }
    },
    {
       breakpoint: 768,
       settings: { slidesToShow: 1 }
    }
  ];

  return (
    <section className="blogs">
      <div className="container" style={{ position: "relative" }}>
        <div className="section-title">
          <h2>B&B Blog</h2>
        </div>
        
        {isHome ? (
           /* Carousel Layout (Homepage) */
           <>
            <Button 
                shape="circle" 
                icon={<LeftOutlined />} 
                className="carousel-button prev-button"
                style={{top: '60%'}}
                onClick={() => carouselRef.current.prev()}
            />

            <Carousel
                ref={carouselRef}
                slidesToShow={3}
                slidesToScroll={1}
                autoplay
                autoplaySpeed={10000}
                infinite
                draggable
                dots={false}
                responsive={responsiveSettings}
                className="blogs-carousel"
            >
              {blogs.map((blog) => (
                 <div key={blog.id} className="carousel-item-wrapper">
                     <div style={{ padding: "0 10px" }}>
                        <BlogItem blog={blog} />
                     </div>
                </div>
              ))}
            </Carousel>

            <Button 
                shape="circle" 
                icon={<RightOutlined />} 
                className="carousel-button next-button"
                style={{top: '60%'}}
                onClick={() => carouselRef.current.next()}
            />
           </>
        ) : (
           /* Grid Layout (Blog Page) */
           <ul className="blog-list" style={{ marginTop: "30px" }}>
              {blogs.map((blog) => (
                <BlogItem key={blog.id} blog={blog} />
              ))}
           </ul>
        )}

        {blogs.length === 0 && <p style={{textAlign:"center"}}>Henüz blog yazısı eklenmemiş.</p>}
      </div>
    </section>
  );
};

export default Blogs;