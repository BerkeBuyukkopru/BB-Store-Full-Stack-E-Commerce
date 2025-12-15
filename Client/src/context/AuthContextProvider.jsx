import { useState, useEffect } from "react";
import { message } from "antd";
import { AuthContext } from "./AuthContext";

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      // Başarılı veya hatalı yanıt gelse bile Cookie silinmiş olmalı
      if (response.ok || response.status === 401 || response.status === 400) {
        setUser(null);
        message.success("Başarıyla çıkış yaptınız.");
        window.location.href = "/";
      } else {
        message.error("Çıkış yapılırken bir hata oluştu.");
      }
    } catch (error) {
      console.error("Logout hatası:", error);
      setUser(null);
      window.location.href = "/";
    }
  };

  // 3. Uygulama yüklendiğinde Oturum Kontrolü (`/auth/me` çağrılır)
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${apiUrl}/auth/me`, {
          method: "GET",
          credentials: "include", // Cookie'yi otomatik gönderir
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [apiUrl]);

  if (loading) {
    // Oturum kontrol edilirken bir yükleme ekranı göster
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        Oturum Kontrol Ediliyor...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
