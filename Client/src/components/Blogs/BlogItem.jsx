import "./BlogItem.css"
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const BlogItem = ({ blog }) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const createdDate = new Date(blog.createdAt).toLocaleDateString('tr-TR', options);
  const updatedDate = new Date(blog.updatedAt).toLocaleDateString('tr-TR', options);

  return (
    <li className="blog-item">
      <Link to={`/blog/${blog.id}`} className="blog-image">
        <img src={blog.imageUrl} alt={blog.title} />
      </Link>
      <div className="blog-info">
        <div className="blog-info-top">
          <span>Oluşturulma: {createdDate}</span>
          {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
             <span style={{marginLeft: "10px"}}>Güncellenme: {updatedDate}</span>
          )}
        </div>
        <div className="blog-info-center">
          <Link to={`/blog/${blog.id}`}>{blog.title}</Link>
        </div>
        {blog.summary && (
            <div className="blog-summary" style={{fontSize: "14px", color: "#666", marginBottom: "10px"}}>
                {blog.summary}
            </div>
        )}
        <div className="blog-info-bottom">
          <Link to={`/blog/${blog.id}`}>Devamını Oku</Link>
        </div>
      </div>
    </li>
  );
};

BlogItem.propTypes = {
  blog: PropTypes.object,
};

export default BlogItem;