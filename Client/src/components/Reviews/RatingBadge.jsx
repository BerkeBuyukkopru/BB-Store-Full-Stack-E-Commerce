import PropTypes from "prop-types";

const RatingBadge = ({ rating, reviewCount, showCount = true }) => {
  const getBadgeClass = (score) => {
    if (score >= 4) return "rating-badge-green";
    if (score >= 3) return "rating-badge-yellow";
    if (score >= 2) return "rating-badge-orange";
    return "rating-badge-red"; // 0-1.9 matches this or 0
  };

  // If no rating yet (0), we can decide to show grey or red. Let's stick to standard behavior.
  // Assuming 0 is "No rating" -> maybe grey or just hide? 
  // User asked for 1-2 red. 0 isn't specified but logically maybe just "No Rating" or grey.
  // For now, I'll allow 0 to be red or handle it specifically if needed.
  // But let's assume 0 rating products might exist.
  // User Requirements:
  // 1-2: Red
  // 2-3: Orange
  // 3-4: Yellow
  // 4-5: Green
  
  // Handling 0 separately might be better visually.
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
