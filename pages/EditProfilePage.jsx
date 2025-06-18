import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import placeholder from "../assets/landscape-placeholder-svgrepo-com.svg";
import "../style/pages/EditProfilePage.css";
import { BsPencilFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EditProfilePage() {
  const UNSPLASH_KEY = import.meta.env.VITE_API_II;
  const [bannerUrl, setBannerUrl] = useState(placeholder);
  const [avatarUrl, setAvatarUrl] = useState(placeholder);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
      setAvatarUrl(user.avatar_url || placeholder);
      setBannerUrl(user.banner_url || placeholder);
    }
  }, []);

  async function fetchPortraitImage() {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=portrait&orientation=portrait&per_page=10`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_KEY}`,
          },
        }
      );

      const data = await response.json();
      if (data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        return data.results[randomIndex].urls.regular;
      }
    } catch (error) {
      console.error("Error fetching portrait:", error);
      return null;
    }
  }

  async function fetchLandscapeImage() {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=banner&orientation=landscape&per_page=10`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_KEY}`,
          },
        }
      );

      const data = await response.json();
      if (data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        return data.results[randomIndex].urls.regular;
      }
    } catch (error) {
      console.error("Error fetching landscape image:", error);
      return null;
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:3001/api/users/${user.id}`, {
        username,
        email,
        password,
        bio,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
      });

      alert("Profile updated!");
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to save changes");
    }
  };

  return (
    <>
      <Navbar />

      <div className="edit-profile-page">
        <div className="edit-profile__banner">
          <img src={bannerUrl} alt="Banner" className="banner-img" />

          <button
            className="edit-icon edit-banner"
            onClick={async () => {
              const newImg = await fetchLandscapeImage();
              if (newImg) setBannerUrl(newImg);
            }}
          >
            <BsPencilFill />
          </button>


          <div className="avatar-wrapper">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="edit-profile__avatar"
            />
            <button
              className="edit-icon edit-avatar"
              onClick={async () => {
                const newImg = await fetchPortraitImage();
                if (newImg) setAvatarUrl(newImg);
              }}
            >
              <BsPencilFill />
            </button>
          </div>
        </div>

        <form className="edit-profile__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Write something about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <button type="submit" className="edit-profile__submit">
            Submit Changes
          </button>
        </form>
      </div>

      <Footer />
    </>
  );
}
