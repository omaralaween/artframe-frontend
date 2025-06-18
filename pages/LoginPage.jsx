import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BackgroundLogin from "../assets/BackgroundLogin.jpg";
import "../style/pages/LoginPage.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate()

async function handleLogin(e) {
  e.preventDefault();
  const userData = {
    email : email,
    password : password
  }
  const response = await axios.post("http://localhost:3001/api/auth/login", userData);
  if (response.status === 200){
    localStorage.setItem("user", JSON.stringify(response.data));
    navigate("/home-page");
    alert("Login Succesful");
  } else {
    console.error("Error loging in: ", response.status)
  }
}

  return (
    <>
      <Navbar />

      <div className="login-page">
        <div className="login-page__image">
          <img src={BackgroundLogin} alt="Artwork" />
        </div>

        <div className="login-page__form">
          <h2 className="login-title">Hello Again,</h2>
          <p className="login-subtext">
            Back For More Beauty? We've Got Something Fresh.
          </p>

          <form onSubmit={(e) => handleLogin(e)}>
            <div className="form-group">
              <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)}/>
            </div>

            <div className="form-group">
              <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            </div>

            <button type="submit" className="login-submit">Login</button>
          </form>

          <p className="login-signup-link">
            Don't have an account? <a href="/signup">Sign up here!</a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
