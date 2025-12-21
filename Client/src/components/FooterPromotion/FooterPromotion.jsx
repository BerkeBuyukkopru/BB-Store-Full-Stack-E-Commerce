import { useContext } from "react";
import { SiteContext } from "../../context/SiteContext";
import "./FooterPromotion.css";

const FooterPromotion = () => {
    const { siteSettings } = useContext(SiteContext);

    if (!siteSettings) return null; // veya loading state

  return (
    <div className="promotion-row">
      <div className="container">
        <div className="footer-row-wrapper">
          <div className="footer-promotion-wrapper">
            <div className="footer-promotion">
              <h2 className="promotion-title">{siteSettings.footerPromotionTitle}</h2>
              <div 
                className="promotion-desc-item"
                dangerouslySetInnerHTML={{ __html: siteSettings.footerPromotionDescription }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterPromotion;