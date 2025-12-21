import { useContext } from "react";
import { SiteContext } from "../context/SiteContext";

const AboutPage = () => {
  const { siteSettings } = useContext(SiteContext);

  return (
    <div className="container" style={{ padding: "50px 0" }}>
      <div
        dangerouslySetInnerHTML={{
             __html: siteSettings?.aboutUsPageContent || "<p>İçerik hazırlanıyor...</p>" 
        }}
      />
    </div>
  );
};

export default AboutPage;
