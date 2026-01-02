import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "./AuthContext";
import { message } from "antd";

export const FavoritesContext = createContext();

const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(AuthContext);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]); 

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/favorites`, {
        credentials: "include", // Cookie'yi otomatik gönder
      });
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {

    }
  };

  const addToFavorites = async (product) => {
    if (!user) {
      return message.warning("Favorilere eklemek için giriş yapmalısınız.");
    }

    const productItemId = product._id || product.id;
    const isAlreadyFavorite = favorites.some((fav) => 
        (fav._id || fav.id) === productItemId && 
        fav.selectedSize === product.selectedSize && 
        fav.selectedColor === product.selectedColor
    );
    
    if (isAlreadyFavorite) return;

    setFavorites((prev) => [...prev, product]);

    try {
       const payload = {
           productId: productItemId,
           size: product.selectedSize,
           color: product.selectedColor
       };

       const response = await fetch(`${apiUrl}/users/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Cookie'yi otomatik gönder
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
           setFavorites((prev) => prev.filter((item) => 
                !((item._id || item.id) === productItemId && 
                  item.selectedSize === product.selectedSize && 
                  item.selectedColor === product.selectedColor)
           ));
           message.error("Favorilere eklenirken hata oluştu.");
      } else {
          message.success("Favorilere eklendi.");
      }

    } catch (error) {

      setFavorites((prev) => prev.filter((item) => 
            !((item._id || item.id) === productItemId && 
              item.selectedSize === product.selectedSize && 
              item.selectedColor === product.selectedColor)
      ));
    }
  };

  const removeFromFavorites = async (productId, size, color) => {
    if (!user) return;

    setFavorites((prev) => prev.filter((item) => 
        !((item._id || item.id) === productId && 
          item.selectedSize === size && 
          item.selectedColor === color)
    ));

    try {
      const payload = {
          productId: productId,
          size: size,
          color: color
      };

      const response = await fetch(`${apiUrl}/users/favorites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Cookie'yi otomatik gönder
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        fetchFavorites();
        message.error("Favorilerden çıkarılırken hata oluştu.");
      } else {
          message.success("Favorilerden çıkarıldı.");
      }
    } catch (error) {

      fetchFavorites();
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;

FavoritesProvider.propTypes = {
  children: PropTypes.node,
};
