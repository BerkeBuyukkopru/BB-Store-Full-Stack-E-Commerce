import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductItem from "./ProductItem";
import SortSelect from "./SortSelect";
import FilterSidebar from "./FilterSidebar";
import "./Products.css";
import { message, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";

const Products = ({ isHome }) => {
  const [products, setProducts] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);

  const sortOption = searchParams.get("sort") || "newest";
  
  const filters = {
      categories: searchParams.getAll("categories"),
      genders: searchParams.getAll("genders"),
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      colors: searchParams.getAll("colors"),
      sizes: searchParams.getAll("sizes")
  };

  const genderParam = searchParams.get("gender");
  const categoryParam = searchParams.get("categoryId");

  if (genderParam && !filters.genders.includes(genderParam)) filters.genders.push(genderParam);
  if (categoryParam && !filters.categories.includes(categoryParam)) filters.categories.push(categoryParam);


  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `${apiUrl}/product`;
        
        // Query params oluşturma
        const params = new URLSearchParams();

        // 1. URL'den gelen temel filtreler
        if (filters.categories && filters.categories.length > 0) {
            filters.categories.forEach(c => params.append("Categories", c));
        }
        if (filters.genders && filters.genders.length > 0) {
            filters.genders.forEach(g => params.append("Genders", g));
        }
        if (filters.colors && filters.colors.length > 0) {
            filters.colors.forEach(c => params.append("Colors", c));
        }
        if (filters.sizes && filters.sizes.length > 0) {
            filters.sizes.forEach(s => params.append("Sizes", s));
        }
        
        if (filters.minPrice !== undefined) params.append("MinPrice", filters.minPrice);
        if (filters.maxPrice !== undefined) params.append("MaxPrice", filters.maxPrice);

        params.append("SortBy", sortOption);


        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);

        if (response.ok) {
          const data = await response.json();
          if (isHome) {
              const newestProducts = [...data].slice(0, 4); 
              setProducts(newestProducts);
          } else {
              setProducts(data);
          }
        } else {
          message.error("Ürünler getirilemedi.");
        }
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };
    
    if (isHome) {
        const fetchHome = async () => {
             const response = await fetch(`${apiUrl}/product?SortBy=newest`);
             if (response.ok) {
                 const data = await response.json();
                 setProducts(data.slice(0, 4));
             }
        }
        fetchHome();
    } else {
        fetchProducts();
    }
    
  }, [apiUrl, sortOption, isHome, JSON.stringify(filters)]);

  const handleFilterApply = (newFilters) => {
      const params = new URLSearchParams();

      if (newFilters.categories) newFilters.categories.forEach(c => params.append("categories", c));
      if (newFilters.genders) newFilters.genders.forEach(g => params.append("genders", g));
      if (newFilters.colors) newFilters.colors.forEach(c => params.append("colors", c));
      if (newFilters.sizes) newFilters.sizes.forEach(s => params.append("sizes", s));
      
      if (newFilters.minPrice !== undefined) params.set("minPrice", newFilters.minPrice);
      if (newFilters.maxPrice !== undefined) params.set("maxPrice", newFilters.maxPrice);
      
      params.set("sort", sortOption);

      setSearchParams(params);
  };

  const handleSortChange = (value) => {
      const params = new URLSearchParams(searchParams);
      params.set("sort", value);
      setSearchParams(params);
  };

  // Başlık belirleme
  let pageTitle = "Ürünler";
  if (isHome) {
      pageTitle = "En Yeniler";
  } else if (filters.genders.includes("Man")) {
      pageTitle = "Erkek Ürünleri";
  } else if (filters.genders.includes("Woman")) {
      pageTitle = "Kadın Ürünleri";
  }

  return (
    <section className="products">
      <div className="container">
        <div className="section-title">
          <h2>{pageTitle}</h2>
          
           {!isHome && (
              <div className="product-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Button 
                    icon={<FilterOutlined />} 
                    onClick={() => setFilterVisible(true)}
                    type="default"
                  >
                      Filtrele
                  </Button>
                  <SortSelect onChange={handleSortChange} value={sortOption} />
              </div>
           )}
        </div>
        
        <FilterSidebar 
            visible={filterVisible} 
            onClose={() => setFilterVisible(false)} 
            onFilterApply={handleFilterApply}
            initialFilters={filters}
        />
        <div className="product-wrapper product-grid">
            {products.length > 0 ? (
                products.map((product) => (
                    <ProductItem productItem={product} key={product._id || product.id} />
                ))
            ) : (
                !loading && (
                    <div className="no-products-found" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', fontSize: '18px', color: '#555' }}>
                        Seçtiğiniz Kriterlere Uygun Ürün Bulunamadı.
                    </div>
                )
            )}
        </div>
      </div>
    </section>
  );
};

export default Products;