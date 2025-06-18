import { Link, useNavigate } from "react-router-dom";
import { BsPerson } from "react-icons/bs";
import "../style/components/Navbar.css";
import logo from "../assets/logo.png";
import placeholder from "../assets/landscape-placeholder-svgrepo-com.svg";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user"));
    setUser(localUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar__logo">
        <Link to="/" className="navbar__brand-wrapper">
          <img src={logo} alt="ArtFrame Logo" className="navbar__logo-img" />
          <h1 className="navbar__brand">ArtFrame</h1>
        </Link>
      </div>

      <nav className="navbar__menu">
        <ul className="navbar__links">
          <li><Link to="/">Discover</Link></li>
          {user && <li><Link to="/home-page">Home</Link></li>}
          {user && <li><Link to={`/profile/${user.id}`}>Profile</Link></li>}
        </ul>
      </nav>

      <div className="navbar__signup">
        {!user ? (
          <Link to="/login">
            <button className="signup-btn">
              <BsPerson className="signup-icon" />
              Sign Up
            </button>
          </Link>
        ) : (
          <div className="navbar__profile">
            <img
              src={user.avatar_url || placeholder}
              alt="User avatar"
              className="navbar__avatar"
              onClick={() => navigate(`/profile/${user.id}`)}
            />
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}
