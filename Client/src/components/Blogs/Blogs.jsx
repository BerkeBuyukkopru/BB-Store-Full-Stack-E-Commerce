import { useState, useEffect } from "react";
import BlogItem from "./BlogItem";
import "./Blogs.css";
import { message } from "antd";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

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

  return (
    <section className="blogs">
      <div className="container">
        <div className="section-title">
          <h2>B&B Blog</h2>
        </div>
        <ul className="blog-list">
          {blogs.map((blog) => (
            <BlogItem key={blog.id} blog={blog} />
          ))}
        </ul>
        {blogs.length === 0 && <p style={{textAlign:"center"}}>Henüz blog yazısı eklenmemiş.</p>}
      </div>
    </section>
  );
};

export default Blogs;