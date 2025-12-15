import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        message.success("Kayıt işlemi başarılı.");

        navigate("/");
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.error ||
          "Kayıt işlemi başarısız oldu. Lütfen tekrar deneyiniz.";
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Kayıt Hatası:", error);
      message.error("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="account-column">
      <h2>Kayıt Ol</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>
            <span>
              Ad
              <span className="required"> *</span>
            </span>
            <input type="text" onChange={handleInputChange} name="name" />
          </label>
          <label>
            <span>
              Soyad
              <span className="required"> *</span>
            </span>
            <input type="text" onChange={handleInputChange} name="surname" />
          </label>
        </div>
        <div>
          <label>
            <span>
              Email
              <span className="required"> *</span>
            </span>
            <input type="email" onChange={handleInputChange} name="email" />
          </label>
        </div>
        <div>
          <label>
            <span>
              Şifre
              <span className="required"> *</span>
            </span>
            <input
              type="password"
              onChange={handleInputChange}
              name="password"
            />
          </label>
        </div>
        <div className="register login">
          <button className="btn btn-sm">Kayıt Ol</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
