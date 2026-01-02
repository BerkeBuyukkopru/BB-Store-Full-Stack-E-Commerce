import PropTypes from "prop-types";

const RatingBadge = ({ rating, reviewCount, showCount = true }) => {
  const getBadgeClass = (score) => {
    if (score >= 4) return "rating-badge-green";
    if (score >= 3) return "rating-badge-yellow";
    if (score >= 2) return "rating-badge-orange";
    return "rating-badge-red"; 
  };
  const badgeColor = rating > 0 ? getBadgeClass(rating) : "rating-badge-gray";

  return (
    <div className="rating-badge-container">
      <div className={`rating-badge ${badgeColor}`}>
        {rating > 0 ? rating.toFixed(1) : "-"}
      </div>
      {showCount && (
        <span className="rating-count">
           {reviewCount} Değerlendirme
        </span>
      )}
    </div>
  );
};

RatingBadge.propTypes = {
  rating: PropTypes.number.isRequired,
  reviewCount: PropTypes.number,
  showCount: PropTypes.bool,
};

export default RatingBadge;
