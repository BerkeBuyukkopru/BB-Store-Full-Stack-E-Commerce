import Gallery from "./Gallery/Gallery";
import Info from "./Info/Info";
import Tabs from "./Tabs/Tabs";
import PropTypes from "prop-types";
import "./ProductDetail.css";

const ProductDetail = ({ singleProduct, onReviewAdded }) => {
  return (
    <section className="single-product">
      <div className="container">
        <div className="single-product-wrapper">

          <div className="single-content">
            <main className="site-main">
              {/* Veriyi Gallery'ye gönderiyoruz */}
              <Gallery singleProduct={singleProduct} />
              <Info singleProduct={singleProduct} />
            </main>
          </div>
          <Tabs singleProduct={singleProduct} onReviewAdded={onReviewAdded} />
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;

ProductDetail.propTypes = {
  singleProduct: PropTypes.object.isRequired,
};