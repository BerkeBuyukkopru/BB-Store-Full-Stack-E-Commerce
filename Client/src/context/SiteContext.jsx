import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const SiteContext = createContext();

const SiteProvider = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${apiUrl}/sitesettings`);
      if (response.ok) {
        const data = await response.json();
        setSiteSettings(data);
      }
    } catch (error) {
      console.error("Site ayarları yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [apiUrl]);

  return (
    <SiteContext.Provider value={{ siteSettings, loading, fetchSettings }}>
        {children}
    </SiteContext.Provider>
  );
};

export default SiteProvider;

SiteProvider.propTypes = {
  children: PropTypes.node,
};
