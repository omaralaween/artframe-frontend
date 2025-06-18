import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import ArtCardSmall from "../components/ArtCardSmall";
import Footer from "../components/Footer";
import "../style/pages/ExplorePage.css";
import axios from "axios";

export default function ExplorePage() {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const response = await axios.get("http://localhost:3001/api/artworks");
        setArtworks(response.data);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      }
    }

    fetchArtworks();
  }, []);

  return (
    <div className="explore-page">
      <Navbar />
      <HeroSection />

      <div className="explore-gallery">
        {artworks.map((artwork) => (
          <ArtCardSmall key={artwork.id} artwork={artwork} />
        ))}
      </div>

      <Footer />
    </div>
  );
}
