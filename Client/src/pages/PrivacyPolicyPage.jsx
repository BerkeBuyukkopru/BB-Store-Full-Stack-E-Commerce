import { useContext } from "react";
import { SiteContext } from "../context/SiteContext";

const PrivacyPolicyPage = () => {
  const { siteSettings } = useContext(SiteContext);

  return (
    <div className="container" style={{ padding: "50px 0" }}>
      <div
        dangerouslySetInnerHTML={{
             __html: siteSettings?.privacyPolicyPageContent || "<p>İçerik hazırlanıyor...</p>" 
        }}
      />
    </div>
  );
};

export default PrivacyPolicyPage;
