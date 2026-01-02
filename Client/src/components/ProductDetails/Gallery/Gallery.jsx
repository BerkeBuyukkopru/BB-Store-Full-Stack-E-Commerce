import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "./Gallery.css";

function PrevBtn({ onClick }) {
  return (
    <button
      className="glide__arrow glide__arrow--left"
      onClick={onClick}
      style={{ zIndex: "2" }}
    >
      <i className="bi bi-chevron-left"></i>
    </button>
  );
}

function NextBtn({ onClick }) {
  return (
    <button
      className="glide__arrow glide__arrow--right"
      onClick={onClick}
      style={{ zIndex: "2" }}
    >
      <i className="bi bi-chevron-right"></i>
    </button>
  );
}

const Gallery = ({ singleProduct }) => {
  // İlk görseli başlangıç değeri yapıyoruz
  const [activeImg, setActiveImg] = useState({
    img: singleProduct.img[0],
    imgIndex: 0,
  });

  // Ürün değiştiğinde (örneğin başka bir ürüne tıklandığında) resmi sıfırla
  useEffect(() => {
    setActiveImg({
      img: singleProduct.img[0],
      imgIndex: 0,
    });
  }, [singleProduct]);

  const sliderSettings = {
    dots: false,
    infinite: singleProduct.img.length > 3,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextBtn />,
    prevArrow: <PrevBtn />,
  };

  return (
    <div className="product-gallery">
      <div className="single-image-wrapper">
        {/* Aktif resmi göster */}
        <img src={`${activeImg.img}`} id="single-image" alt="" />
      </div>
      <div className="product-thumb">
        <div className="glide__track">
          <ol className="gallery-thumbs glide__slides">
            <Slider {...sliderSettings}>
              {singleProduct.img.map((itemImg, index) => (
                <li
                  className="glide__slide glide__slide--active"
                  key={index}
                  onClick={() =>
                    setActiveImg({
                      img: itemImg,
                      imgIndex: index,
                    })
                  }
                >
                  <img
                    src={`${itemImg}`}
                    alt=""
                    className={`img-fluid ${
                      activeImg.imgIndex === index ? "active" : ""
                    } `}
                  />
                </li>
              ))}
            </Slider>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Gallery;

Gallery.propTypes = {
  singleProduct: PropTypes.object.isRequired,
};
