import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileHeader from "../components/ProfileHeader";
import ArtCardSmall from "../components/ArtCardSmall";
import "../style/pages/ProfilePage.css";

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const res = await axios.get(`http://localhost:3001/api/users/${id}`);
        setUser(res.data);

        if (res.data.role === "artist") {
          const artRes = await axios.get(`http://localhost:3001/api/artworks?artist_id=${id}`);
          setArtworks(artRes.data);
        } else {
          const purchaseRes = await axios.get(`http://localhost:3001/api/purchases/${id}`);
          setArtworks(purchaseRes.data);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }

    fetchUserProfile();
  }, [id]);

  return (
    <>
      <Navbar />
      {user && <ProfileHeader user={user} currentUser={currentUser} />}

      <h2 className="gallery-heading">
        {user?.role === "artist" ? "Uploaded Artworks" : "Purchased Art"}
      </h2>

      <div className="explore-gallery">
        {artworks.length > 0 ? (
          artworks.map((artwork) => (
            <ArtCardSmall key={artwork.id} artwork={artwork} />
          ))
        ) : (
          <p className="no-art-message">No artworks yet.</p>
        )}
      </div>

      <Footer />
    </>
  );
}
