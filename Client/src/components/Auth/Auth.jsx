import Login from "./Login";
import Register from "./Register";
import "./Auth.css";

import { useState } from "react"; 

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section className="account-page">
      <div className="container">
        
        <div className="auth-buttons">
            <button 
                className={`auth-button ${isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(true)}
            >
                Giriş Yap
            </button>
            <button 
                className={`auth-button ${!isLogin ? 'active' : ''}`}
                onClick={() => setIsLogin(false)}
            >
                Kayıt Ol
            </button>
        </div>

        <div className="account-wrapper">
          {isLogin ? <Login /> : <Register />}
        </div>
      </div>
    </section>
  );
};

export default Auth;