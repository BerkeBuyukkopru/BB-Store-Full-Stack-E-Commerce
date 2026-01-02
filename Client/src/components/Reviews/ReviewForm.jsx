import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { Rate, message, Button, Input } from "antd";
import { AuthContext } from "../../context/AuthContext";

const ReviewForm = ({ singleProduct, type = "product", onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext); 
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      message.warning("Yorum yapabilmek için giriş yapmalısınız.");
      return;
    }

    if (type === "product" && rating === 0) {
      message.error("Lütfen puan veriniz!");
      return;
    }

    if (comment.trim().length < 5) {
      message.error("Yorumunuz çok kısa!");
      return;
    }

    setLoading(true);
    try {
      const targetId = singleProduct?._id || singleProduct?.id;
      const payload = {
        TargetId: targetId,
        TargetType: type === "blog" ? "Blog" : "Product",
        Comment: comment,
        Rating: type === "blog" ? 0 : rating
      };

      const response = await fetch(`${apiUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify(payload) 
      });

      if (response.ok) {
        setComment("");
        setRating(0);
        if (onSuccess) onSuccess();
      } else {
        const errorData = await response.json();
        message.error(errorData.error || "Yorum gönderilirken bir hata oluştu.");
      }
    } catch (error) {

       message.error("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form-wrapper">
      {!user ? (
        <p>Yorum yapabilmek için <a href="/auth">giriş yapmalısınız</a>.</p>
      ) : (
        <form className="comment-form" onSubmit={handleSubmit}>
          {type === "product" && (
            <div className="comment-form-rating">
              <label>
                Puanınız
                <span className="required">*</span>
              </label>
              <div className="stars">
                 <Rate onChange={setRating} value={rating} />
              </div>
            </div>
          )}
          
          <div className="comment-form-comment form-comment">
            <label htmlFor="comment">
              Yorumunuz
              <span className="required">*</span>
            </label>
            <Input.TextArea 
              id="comment" 
              rows={4} 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
              placeholder="Düşüncelerinizi paylaşın..."
            />
          </div>

          <div className="form-submit">
             <Button type="primary" htmlType="submit" loading={loading}>
               Gönder
             </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;

ReviewForm.propTypes = {
  singleProduct: PropTypes.object,
  type: PropTypes.string,
  onSuccess: PropTypes.func
};
