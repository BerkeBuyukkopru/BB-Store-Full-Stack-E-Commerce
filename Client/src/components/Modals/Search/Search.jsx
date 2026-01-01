import PropTypes from "prop-types";
import "./Search.css";
import { useState } from "react";

const Search = ({ isSearchShow, setIsSearchShow }) => {
  const [searchResults, setSearchResults] = useState(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleCloseModal = () => {
    setIsSearchShow(false);
    setSearchResults(null);
  };

  const handleSearch = async (e) => {
    const productName = e.target.value;

    if (productName.trim().length === 0) {
      setSearchResults(null);
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/product/search/${productName.trim()}`);

      if (!res.ok) {
        setSearchResults([]);
        return;
      }

      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.log("Arama hatası:", error);
    }
  };

  return (
    <div className={`modal-search ${isSearchShow ? "show" : ""} `}>
      <div className="modal-wrapper">
        <h3 className="modal-title">Ürün Ara</h3>
        <p className="modal-text">
          Aradığınız ürünleri görmek için yazmaya başlayın.
        </p>
        <form className="search-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Ne aramıştınız?"
            onChange={handleSearch}
          />
          <button type="button">
            <i className="bi bi-search"></i>
          </button>
        </form>
        <div className="search-results">
          <div className="search-heading">
            <h3>ARAMA SONUÇLARI</h3>
          </div>
          <div
            className="results"
            style={{
              display: `${
                searchResults?.length === 0 || !searchResults ? "flex" : "grid"
              }`,
            }}
          >
            {!searchResults && (
              <b
                className="result-item"
                style={{ justifyContent: "center", width: "100%" }}
              >
                Ürün Ara...
              </b>
            )}

            {searchResults?.length === 0 && (
              <a
                href="#"
                className="result-item"
                style={{ justifyContent: "center", width: "100%" }}
              >
                😔 Aradığınız Ürün Bulunamadı 😔
              </a>
            )}

            {searchResults?.length > 0 &&
              searchResults?.map((resultItem) => (
                <a
                  href={`/product/${resultItem.id}`}
                  className="result-item"
                  key={resultItem.id || resultItem._id}
                >
                  <img
                    src={resultItem.img[0]}
                    className="search-thumb"
                    alt={resultItem.name}
                  />
                  <div className="search-info">
                    <h4>{resultItem.name}</h4>

                    <div className="search-info-details" style={{fontSize: "12px", color: "#888", marginBottom: "5px"}}>
                        <span>
                            {resultItem.gender === "Man" ? "Erkek" : resultItem.gender === "Woman" ? "Kadın" : "Unisex"}
                        </span>
                         - 
                        <span>
                            {resultItem.colors && resultItem.colors.length > 0 ? resultItem.colors.join(", ") : ""}
                        </span>
                    </div>
                    <span className="search-price">
                      {resultItem.productPrice.current.toFixed(2)} TL
                    </span>
                  </div>
                </a>
              ))}
          </div>
        </div>
        <i
          className="bi bi-x-circle"
          id="close-search"
          onClick={handleCloseModal}
        ></i>
      </div>
      <div className="modal-overlay" onClick={handleCloseModal}></div>
    </div>
  );
};

export default Search;

Search.propTypes = {
  isSearchShow: PropTypes.bool,
  setIsSearchShow: PropTypes.func,
};
