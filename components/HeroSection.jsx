import { FiSearch } from "react-icons/fi";
import "../style/components/HeroSection.css";
import "../style/components/SearchBar.css";

export default function HeroSection() {
  return (
    <>
      <div className="hero">
        <h2 className="hero__title">Discover Curated Digital Art</h2>
        <p className="hero__subtitle">
          Explore top digital art. Collect or display instantly on your ArtFrame.
        </p>

        <div className="search">
          <input
            type="text"
            className="search__input"
            placeholder="Search artworks, artists, or styles..."
          />
          <FiSearch className="search__icon" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
