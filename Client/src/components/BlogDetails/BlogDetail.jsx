import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Review from "../Reviews/Review"; // Keeping existing Review component if valid, or maybe remove if not needed for Blogs yet. User said 'Blog Details'. Reviews might be for products. I will keep it but maybe comment out if it breaks. Actually reviews are usually for products. I'll keep it there for now as per original design.
import "./BlogDetail.css";
import { message, Spin } from "antd";

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const { id } = useParams();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(`${apiUrl}/blogs/${id}`);
        if (response.ok) {
          const data = await response.json();
          setBlog(data);
        } else {
          message.error("Blog bulunamadı.");
        }
      } catch (error) {
        console.log("Veri hatası:", error);
      }
    };
    if (id) {
      fetchBlog();
    }
  }, [id, apiUrl]);

  if (!blog) {
      return <div style={{textAlign: "center", padding: "50px"}}><Spin size="large" /></div>;
  }

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const createdDate = new Date(blog.createdAt).toLocaleDateString('tr-TR', options);
  const updatedDate = new Date(blog.updatedAt).toLocaleDateString('tr-TR', options);

  return (
    <section className="single-blog">
      <div className="container">
        <article>
          <figure>
            <a href="#">
              <img src={blog.imageUrl} alt={blog.title} style={{width: "100%", maxHeight: "500px", objectFit: "cover"}} />
            </a>
          </figure>
          <div className="blog-wrapper">
            <div className="blog-meta">
              <div className="blog-date">
                <span>Oluşturulma: {createdDate}</span>
              </div>
              {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                  <div className="blog-date" style={{marginLeft: "15px"}}>
                     <span>Güncellenme: {updatedDate}</span>
                  </div>
              )}
            </div>
            <h1 className="blog-title">{blog.title}</h1>
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }}></div>
          </div>
        </article>

        <div style={{ margin: "40px 0", borderTop: "1px solid #e0e0e0" }}></div>
        
        {/* Yorum Alanı */}
        <div className="tab-panel">
           <Review singleProduct={blog} type="blog" active="active" />
        </div>
      </div>
    </section>
  );
};

export default BlogDetail;
