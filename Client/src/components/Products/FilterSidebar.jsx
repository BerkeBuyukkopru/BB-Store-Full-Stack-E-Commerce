import React, { useEffect, useState } from "react";
import { Drawer, Checkbox, Slider, Button, Spin, Typography, InputNumber } from "antd";
import "./FilterSidebar.css";

const { Title } = Typography;

const FilterSidebar = ({ visible, onClose, onFilterApply, initialFilters }) => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState({
    categories: [],
    genders: [],
    minPrice: 0,
    maxPrice: 1000,
    colors: [],
    sizes: [],
  });
  
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
      if (visible && initialFilters) {
          if (initialFilters.categories) setSelectedCategories(initialFilters.categories);
          if (initialFilters.genders) setSelectedGenders(initialFilters.genders);
          if (initialFilters.colors) setSelectedColors(initialFilters.colors);
          if (initialFilters.sizes) setSelectedSizes(initialFilters.sizes);
          
          if (initialFilters.minPrice !== undefined && initialFilters.maxPrice !== undefined) {
             setPriceRange([Number(initialFilters.minPrice), Number(initialFilters.maxPrice)]);
          } else if (options.minPrice !== undefined && options.maxPrice !== undefined) {
             setPriceRange([options.minPrice, options.maxPrice]);
          }
      }
  }, [visible, initialFilters, options.minPrice, options.maxPrice]);

  useEffect(() => {
    const fetchOptions = async () => {
        try {
            const response = await fetch(`${apiUrl}/product/filter-options`);
            if (response.ok) {
                const data = await response.json();
                setOptions(data);
                
                 if (data.minPrice !== undefined && data.maxPrice !== undefined && (!initialFilters || !initialFilters.minPrice)) {
                    setPriceRange([data.minPrice, data.maxPrice]);
                }
            }
        } catch (error) {
            console.error("Filter options error:", error);
        } finally {
            setLoading(false);
        }
    };

    if (visible && options.categories.length === 0) {
        fetchOptions();
    }
  }, [visible, apiUrl]);

  const handleApply = () => {
      onFilterApply({
          categories: selectedCategories,
          genders: selectedGenders,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          colors: selectedColors,
          sizes: selectedSizes
      });
      onClose();
  };

  const handleClear = () => {
      setSelectedCategories([]);
      setSelectedGenders([]);
      if (options.minPrice !== undefined) setPriceRange([options.minPrice, options.maxPrice]);
      setSelectedColors([]);
      setSelectedSizes([]);
  };

  return (
    <Drawer
      title="Filtrele"
      placement="right"
      onClose={onClose}
      open={visible}
      className="filter-sidebar"
      size="default"
      extra={
        <Button onClick={handleClear} type="link">
            Temizle
        </Button>
      }
      footer={
          <div style={{ textAlign: 'right' }}>
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                  Kapat
              </Button>
              <Button onClick={handleApply} type="primary">
                  Uygula
              </Button>
          </div>
      }
    >
      {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}><Spin /></div>
      ) : (
          <div className="filter-groups">
              
               <div className="filter-group">
                  <Title level={5}>Cinsiyet</Title>
                  <Checkbox.Group 
                        options={options.genders.map(g => ({ label: g === 'Man' ? 'Erkek' : g === 'Woman' ? 'Kadın' : 'Unisex', value: g }))} 
                        value={selectedGenders} 
                        onChange={setSelectedGenders} 
                        className="vertical-checkbox-group"
                  />
              </div>

              <div className="filter-group">
                  <Title level={5}>Fiyat Aralığı</Title>
                  <Slider 
                      range 
                      min={options.minPrice} 
                      max={options.maxPrice} 
                      value={priceRange} 
                      onChange={setPriceRange} 
                  />
                  <div className="price-inputs" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <InputNumber
                            min={options.minPrice}
                            max={options.maxPrice}
                            value={priceRange[0]}
                            onChange={(value) => setPriceRange([value, priceRange[1]])}
                            style={{ width: '70px' }}
                            size="small"
                        />
                        <InputNumber
                            min={options.minPrice}
                            max={options.maxPrice}
                            value={priceRange[1]}
                            onChange={(value) => setPriceRange([priceRange[0], value])}
                            style={{ width: '70px' }}
                            size="small"
                        />
                  </div>
              </div>

               <div className="filter-group">
                  <Title level={5}>Renk</Title>
                   <Checkbox.Group 
                        options={options.colors.map(c => ({ label: c, value: c }))} 
                        value={selectedColors} 
                        onChange={setSelectedColors} 
                        className="vertical-checkbox-group"
                  />
              </div>

               <div className="filter-group">
                  <Title level={5}>Beden</Title>
                   <Checkbox.Group 
                        options={options.sizes.map(s => ({ label: s, value: s }))} 
                        value={selectedSizes} 
                        onChange={setSelectedSizes} 
                        className="vertical-checkbox-group"
                  />
              </div>

          </div>
      )}
    </Drawer>
  );
};

export default FilterSidebar;
