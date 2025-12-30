import PropTypes from "prop-types";
import { Rate } from "antd";

const ReviewItem = ({ item }) => {
  const { userName, comment, rating, createdAt } = item;

  const formattedDate = new Date(createdAt).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <li className="comment-item">
      <div className="comment-text">
        <ul className="comment-star">
             {rating > 0 && <Rate disabled defaultValue={rating} />}
        </ul>
        <div className="comment-meta">
          <strong>{userName}</strong>
          <span>-</span>
          <time>{formattedDate}</time>
        </div>
        <div className="comment-description">
          <p>{comment}</p>
        </div>
      </div>
    </li>
  );
};

ReviewItem.propTypes = {
  item: PropTypes.shape({
    userName: PropTypes.string,
    comment: PropTypes.string,
    rating: PropTypes.number,
    createdAt: PropTypes.string,
  }),
};

export default ReviewItem;
