import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundSignup from "../assets/BackgroundSignup.jpg";
import "../style/pages/SignUpPage.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate()

  async function handleSignup(e) {
    e.preventDefault();
    const userData = {
      username: username,
      email: email,
      password: password,
      role: role
    }
    const response = await axios.post("http://localhost:3001/api/auth/signup", userData)

    if (response.status === 201) {
      const user = response.data;
      navigate("/login");
    } else {
      console.error("Signup failed with status:", response.status);
      alert("Something went wrong. Please try again.");
    }

  }

  return (
    <>
      <Navbar />

      <div className="signup-page">
        <div className="signup-page__image">
          <img src={backgroundSignup} alt="Artwork" />
        </div>

        <div className="signup-page__form">
          <h2 className="signup-title">Join ArtFrame</h2>
          <p className="signup-subtext">
            Join A Community Of Collectors, Artists, And Curators.
          </p>

          <form onSubmit={(e) => handleSignup(e)}>
            <div className="form-group">
              <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            </div>

            <div className="form-group">
              <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            </div>

            <div className={confirmPassword !== password ? "input-error" : "form-group"}>
              <input
                type="password"
                id="confirm_passwrod"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>



            <div className="form-group user-type-buttons">
              <button type="button" onClick={(e) => setRole("buyer")}>Art Lover</button>
              <button type="button" onClick={(e) => setRole("artist")}>Artist</button>
            </div>

            <button type="submit" className="signup-submit">Sign up</button>
          </form>

          <p className="signup-login-link">
            Already have an account? <a href="/login">login here</a>
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
