import "./Contact.css"
import { startTransition, useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        message.success("Mesajınız başarıyla iletildi.");
        setFormData({ name: "", surname: "", email: "", message: "" });
        navigate("/");
      } else {
        message.error("Mesaj gönderilirken bir hata oluştu.");
      }
    } catch (error) {

      message.error("Bir sorun oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact">
      <div className="contact-bottom">
        <div className="container">
          <div className="contact-titles">
            <h2>Bize Ulaşın</h2>
            <p>
              Görüş, öneri ya da şikayetiniz paylaşmak isterseniz, "İletişim Formu"nu doldurarak bize ulaştırabilirsiniz.
              <br/>
              En kısa sürede değerlendirip size geri döneceğiz. 
            </p>
          </div>
          <div className="contact-elements">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="">
                <label>
                  Ad
                  <span> *</span>
                </label>
                <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    required 
                />
              </div>
              <div className="">
                <label>
                  Soyad
                  <span> *</span>
                </label>
                <input 
                    type="text" 
                    name="surname" 
                    value={formData.surname} 
                    onChange={handleInputChange} 
                    required 
                />
              </div>
              <div className="">
                <label>
                  Email
                  <span> *</span>
                </label>
                <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    required 
                />
              </div>
              <div className="">
                <label>
                  Mesaj
                  <span> *</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <button className="btn btn-sm form-button" disabled={loading}>
                {loading ? "Gönderiliyor..." : "Gönder"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;