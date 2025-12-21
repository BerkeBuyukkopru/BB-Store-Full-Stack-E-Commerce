import PropTypes from "prop-types";

const SliderItem = ({ imageSrc }) => {
  return (
    <div className="slider-item fade">
      <div className="slider-image">
        <img src={imageSrc} className="img-fluid" alt="" />
      </div>
    </div>
  );
};
export default SliderItem;

SliderItem.propTypes = {
  imageSrc: PropTypes.string,
};
