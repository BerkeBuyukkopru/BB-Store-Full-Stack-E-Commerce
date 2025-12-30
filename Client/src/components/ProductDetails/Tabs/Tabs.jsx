import { useState } from "react";
import PropTypes from "prop-types";
import Review from "../../Reviews/Review";
import "./Tabs.css";

const Tabs = ({ singleProduct, onReviewAdded }) => {
  const [activeTab, setActiveTab] = useState("desc");

  const handleTabClick = (e, tab) => {
    e.preventDefault();
    setActiveTab(tab);
  };

  return (
    <div className="single-tabs">
      <ul className="tab-list">
        <li>
          <a
            href="#"
            className={`tab-button ${activeTab === "desc" ? "active" : ""}`}
            onClick={(e) => handleTabClick(e, "desc")}
          >
            Açıklama
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`tab-button ${activeTab === "info" ? "active" : ""}`}
            onClick={(e) => handleTabClick(e, "info")}
          >
            Ek Bilgi
          </a>
        </li>
        <li>
          <a
            href="#"
            className={`tab-button ${activeTab === "review" ? "active" : ""}`}
            onClick={(e) => handleTabClick(e, "review")}
          >
            Yorumlar
          </a>
        </li>
      </ul>
      <div className="tab-panel">
        {/* Açıklama Paneli */}
        <div
          className={`tab-panel-descriptions content ${
            activeTab === "desc" ? "active" : ""
          }`}
        >
          <div
            className="product-description"
            dangerouslySetInnerHTML={{ __html: singleProduct.description }}
          ></div>
        </div>

        {/* Ek Bilgi Paneli */}
        <div
          className={`tab-panel-information content ${
            activeTab === "info" ? "active" : ""
          }`}
          id="info"
        >
          <h3>Ek Bilgi</h3>
          <table>
            <tbody>
              <tr>
                <th>Renk</th>
                <td>
                  <p>
                    {/* ✨ RENK DİNAMİKLEŞTİRİLDİ */}
                    {(singleProduct.colors || []).map((item, index) => (
                      <span key={index}>
                        {item.toUpperCase()}
                        {index < singleProduct.colors.length - 1 && ", "}
                      </span>
                    ))}
                  </p>
                </td>
              </tr>
              <tr>
                <th>Beden</th>
                <td>
                  <p>
                    {(singleProduct.sizes || []).map((item, index) => {
                       const sizeLabel = typeof item === 'string' ? item : item.size;
                       return (
                          <span key={index}>
                            {sizeLabel.toUpperCase()}
                            {index < singleProduct.sizes.length - 1 && ", "}
                          </span>
                       );
                    })}
                  </p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Yorumlar Paneli */}
        <Review
          active={activeTab === "review" ? "content active" : "content"}
          singleProduct={singleProduct}
          type="product"
          onReviewAdded={onReviewAdded}
        />
      </div>
    </div>
  );
};

export default Tabs;

Tabs.propTypes = {
  singleProduct: PropTypes.object.isRequired,
  onReviewAdded: PropTypes.func
};