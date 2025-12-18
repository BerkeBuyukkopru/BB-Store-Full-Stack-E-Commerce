import CategoryItem from "./CategoryItem";
import { useEffect, useState } from "react";
import "./Categories.css";
import { message } from "antd";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/category`);

        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          message.error("Kategoriler yüklenirken bir hata oluştu.");
        }
      } catch (error) {
        console.log("Veri hatası:", error);
      }
    };
    fetchCategories();
  }, [apiUrl]);

  return (
    <section className="categories">
      <div className="container">
        <div className="section-title">
          <h2>Kategoriler</h2> 
        </div>
        <ul className="category-list">
          {categories.map((category) => (
            <CategoryItem
              key={category._id || category.id}
              category={category}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Categories;
