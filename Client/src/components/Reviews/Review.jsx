import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";
import PropTypes from "prop-types";
import "./Review.css";
import { useEffect, useState } from "react";
import { message } from "antd";

const Review = ({ active, singleProduct, type = "product", onReviewAdded }) => {
  const [reviews, setReviews] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchReviews = async () => {
    try {
      const targetId = singleProduct?._id || singleProduct?.id;
      const endpoint = type === "blog" ? `blog/${targetId}` : `product/${targetId}`;
      
      const response = await fetch(`${apiUrl}/reviews/${endpoint}`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.log("Reviews fetch error:", error);
    }
  };

  useEffect(() => {
    if (singleProduct) {
      fetchReviews();
    }
  }, [singleProduct, type]);

  return (
    <div className={`tab-panel-reviews ${active}`}>
      <h3>{reviews.length} Yorum</h3>
      <div className="comments">
        <ol className="comment-list">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewItem key={review.id} item={review} />
            ))
          ) : (
            <p>Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
          )}
        </ol>
      </div>
      <div className="review-form-wrapper">
        <h2>Yorum Yaz</h2>
        <ReviewForm 
          singleProduct={singleProduct} 
          type={type} 
          onSuccess={() => {
            fetchReviews();
            if (onReviewAdded) onReviewAdded();
            message.success("Yorumunuz başarıyla eklendi.");
          }}
        />
      </div>
    </div>
  );
};

export default Review;

Review.propTypes = {
  active: PropTypes.string,
  singleProduct: PropTypes.object,
  type: PropTypes.string,
  onReviewAdded: PropTypes.func
};
