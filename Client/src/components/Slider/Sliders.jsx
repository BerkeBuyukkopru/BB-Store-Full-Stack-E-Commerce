import { useEffect, useState } from "react";
import SliderItem from "./SliderItem";
import "./Sliders.css";

const Sliders = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliders, setSliders] = useState([]);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchSliders = async () => {
        try {
            const response = await fetch(`${apiUrl}/sliders`);
            if (response.ok) {
                const data = await response.json();
                setSliders(data);
            }
        } catch (error) {
            console.error("Slider verisi alınamadı:", error);
        }
    };
    fetchSliders();
  }, [apiUrl]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  if (sliders.length === 0) return null; // Veya bir loading/default slider

  return (
    <section className="slider">
      <div className="slider-elements">
        {sliders.map((slider, index) => (
             <div key={slider.id} style={{ display: index === currentSlide ? "block" : "none" }}>
                 <SliderItem imageSrc={slider.imageUrl} title={slider.title} desc={slider.description} btnLink={slider.buttonLink} />
             </div>
        ))}
        <div className="slider-buttons">
          <button onClick={prevSlide}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button onClick={nextSlide}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
        <div className="slider-dots">
          {sliders.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            >
              <span></span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sliders;
