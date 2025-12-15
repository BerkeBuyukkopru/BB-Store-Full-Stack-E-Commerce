import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { login } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        message.success("Giriş işlemi başarılı.");
        const data = await response.json();
        login(data);

        if (data.role === "admin") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } else {
        const errorData = await response.json();
        let errorMessage =
          errorData.error ||
          "Giriş işlemi başarısız oldu. Lütfen tekrar deneyiniz.";

        if (errorMessage === "Invalid credentials.") {
          errorMessage = "E-posta veya şifre yanlış.";
        }
        message.error(errorMessage);
      }
    } catch (error) {
      console.error("Giriş Hatası:", error);
      message.error("Sunucuya bağlanılamadı.");
    }
  };

  return (
    <div className="account-column">
      <h2>Giriş Yap</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            <span>
              Email <span className="required">*</span>
            </span>
            <input type="email" name="email" onChange={handleInputChange} />
          </label>
        </div>
        <div>
          <label>
            <span>
              Şifre <span className="required">*</span>
            </span>
            <input
              type="password"
              name="password"
              onChange={handleInputChange}
            />
          </label>
        </div>
        <p className="login">
          <button className="btn btn-sm">Giriş Yap</button>
        </p>
        <a href="#" className="form-link">
          Şifremi Unuttum
        </a>
      </form>
    </div>
  );
};

export default Login;
