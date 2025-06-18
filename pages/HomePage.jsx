import { useEffect, useState } from "react";
import ArtCardBig from "../components/ArtCardBig";
import CommentSection from "../components/CommentSection";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../style/pages/HomePage.css";
import axios from "axios";

export default function HomePage() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    async function fetchFollowedArtworks() {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/artworks/followed/${user.id}`
        );
        setArtworks(response.data);
      } catch (error) {
        console.error("Failed to fetch followed artworks:", error);
      }
    }

    fetchFollowedArtworks();
  }, [user]);

  const handleShowComments = (artwork) => {
    setSelectedArtwork(artwork);
  };

  const handleCloseComments = () => {
    setSelectedArtwork(null);
  };

  return (
    <div className="home-page">
      <Navbar />

      <div className="home-page__cards">
        {artworks.length > 0 ? (
          artworks.map((artwork) => (
            <ArtCardBig
              key={artwork.id}
              artwork={artwork}
              onCommentClick={() => handleShowComments(artwork)}
            />
          ))
        ) : (
          <p className="no-art-msg">No artworks from followed users.</p>
        )}
      </div>

      {selectedArtwork && (
        <CommentSection
          artwork={selectedArtwork}
          onClose={handleCloseComments}
        />
      )}

      <Footer />
    </div>
  );
}
