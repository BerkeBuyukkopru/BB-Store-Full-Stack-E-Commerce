import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { CartContext } from "../context/CartContext";
import { Table, Button, Space, message } from "antd";

import "./FavoritesPage.css";

const FavoritesPage = () => {
  const { favorites, removeFromFavorites } = useContext(FavoritesContext);
  const { addToCart, cartItems } = useContext(CartContext);

  const columns = [
    {
      title: "Ürün Görseli",
      dataIndex: "img",
      key: "img",
      render: (imgSrc) => (
        <img
          src={imgSrc && imgSrc.length > 0 ? imgSrc[0] : ""}
          alt="Ürün"
          style={{ width: "80px", height: "auto", objectFit: "cover", borderRadius: "5px" }}
        />
      ),
    },
    {
      title: "Ürün Adı",
      dataIndex: "name",
      key: "name",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Renk",
      dataIndex: "selectedColor",
      key: "selectedColor",
      render: (text) => <span>{text || "-"}</span>,
    },
    {
      title: "Beden",
      dataIndex: "selectedSize",
      key: "selectedSize",
      render: (text) => <span>{text ? text.toUpperCase() : "-"}</span>,
    },
    {
      title: "Fiyat",
      dataIndex: "productPrice",
      key: "price",
      render: (productPrice) => {
           const originalPrice = productPrice?.current || 0;
           const discountPercentage = productPrice?.discount || 0;
           const discountedPrice = originalPrice - (originalPrice * discountPercentage) / 100;
           return (
               <span>
                  {discountedPrice.toFixed(2)} TL
               </span>
           );
      }
    },
    {
      title: "İşlemler",
      key: "actions",
      render: (_, record) => {
        const isProductInCart = cartItems.some((item) => 
            item.id === (record._id || record.id) &&
            item.size === record.selectedSize &&
            item.color === record.selectedColor
        );
        
        return (
          <Space>
            <Button 
              className="add-to-cart-btn"
              onClick={() => {
                   if (isProductInCart) {
                       message.warning("Bu ürün zaten sepetinizde ekli.");
                       return;
                   }
                   const originalPrice = record.productPrice?.current || 0;
                   const discountPercentage = record.productPrice?.discount || 0;
                   const discountedPrice = originalPrice - (originalPrice * discountPercentage) / 100;
                   
                   addToCart({
                      ...record,
                      id: record._id || record.id,
                      price: discountedPrice,
                      size: record.selectedSize,
                      color: record.selectedColor,
                      quantity: 1
                   });
                   message.success("Ürün sepete eklendi.");
              }}
            >
              Sepete Ekle
            </Button>
            <Button 
              className="remove-from-fav-btn"
              onClick={() => removeFromFavorites(record._id || record.id, record.selectedSize, record.selectedColor)}
            >
              Favorilerden Kaldır
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <section className="favorites-page">
      <div className="container">
        <div className="section-title">
          <h2>Favorilerim</h2>
        </div>
        
        <div className="desktop-favorites-table">
             <Table
                dataSource={favorites}
                columns={columns}
                rowKey={(record) => `${record._id || record.id}-${record.selectedSize}-${record.selectedColor}`}
                locale={{ emptyText: "Henüz favorilere eklenmiş bir ürün yok." }}
                pagination={false}
            />
        </div>

        <div className="mobile-favorites-grid">
            {favorites.length > 0 ? (
                favorites.map((product) => {
                     const originalPrice = product.productPrice?.current || 0;
                     const discountPercentage = product.productPrice?.discount || 0;
                     const discountedPrice = originalPrice - (originalPrice * discountPercentage) / 100;
                     
                     const isProductInCart = cartItems.some((item) => 
                        item.id === (product._id || product.id) &&
                        item.size === product.selectedSize &&
                        item.color === product.selectedColor
                    );

                    return (
                        <div className="mobile-favorite-card" key={`${product._id || product.id}-${product.selectedSize}-${product.selectedColor}`}>
                            <div className="mobile-favorite-image">
                                <img src={product.img && product.img.length > 0 ? product.img[0] : ""} alt={product.name} />
                            </div>
                            <div className="mobile-favorite-info">
                                <h3>{product.name}</h3>
                                <div className="product-attrs">
                                    <span>Renk: {product.selectedColor || "-"}</span>
                                    <span>Beden: {product.selectedSize ? product.selectedSize.toUpperCase() : "-"}</span>
                                </div>
                                <div className="product-price">
                                    {discountedPrice.toFixed(2)} TL
                                </div>
                                <div className="mobile-favorite-actions">
                                    <Button 
                                      className="add-to-cart-btn"
                                      block
                                      onClick={() => {
                                           if (isProductInCart) {
                                               message.warning("Bu ürün zaten sepetinizde ekli.");
                                               return;
                                           }
                                           addToCart({
                                              ...product,
                                              id: product._id || product.id,
                                              price: discountedPrice,
                                              size: product.selectedSize,
                                              color: product.selectedColor,
                                              quantity: 1
                                           });
                                           message.success("Ürün sepete eklendi.");
                                      }}
                                    >
                                      Sepete Ekle
                                    </Button>
                                    <Button 
                                      className="remove-from-fav-btn"
                                      danger
                                      block
                                      onClick={() => removeFromFavorites(product._id || product.id, product.selectedSize, product.selectedColor)}
                                    >
                                      Sil
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )
                })
            ) : (
                <div style={{ textAlign: "center", width: "100%", padding: "20px" }}>Henüz favorilere eklenmiş bir ürün yok.</div>
            )}
        </div>
      </div>
    </section>
  );
};

export default FavoritesPage;
