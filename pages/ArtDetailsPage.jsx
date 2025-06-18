import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { BsHeartFill, BsChatFill } from "react-icons/bs";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CommentSection from "../components/CommentSection";
import placeholder from "../assets/landscape-placeholder-svgrepo-com.svg";
import "../style/pages/ArtDetailsPage.css";
import MoreFromArtist from "../components/MoreFromArtist";
import { Link } from "react-router-dom";

export default function ArtDetailsPage() {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const isArtist = user && artwork && user.id === artwork.artist_id;

  useEffect(() => {
    async function fetchData() {
      try {
        const artRes = await axios.get(`http://localhost:3001/api/artworks/${id}`);
        setArtwork(artRes.data);

        const likeRes = await axios.get(`http://localhost:3001/api/likes/${id}`);
        setLikes(likeRes.data.count);

        if (user) {
          const likedRes = await axios.get(
            `http://localhost:3001/api/likes/${id}/user/${user.id}`
          );
          setLiked(likedRes.data.liked);
        }

        const commentRes = await axios.get(`http://localhost:3001/api/comments/${id}`);
        setComments(commentRes.data);
      } catch (error) {
        console.error("Error loading artwork:", error);
      }
    }

    fetchData();
  }, [id, user?.id]);

  const handleLike = async () => {
    if (!user) return;
    try {
      if (liked) {
        await axios.delete("http://localhost:3001/api/likes", {
          data: { artwork_id: Number(id), user_id: Number(user.id) },
        });
        setLikes((prev) => prev - 1);
        setLiked(false);
      } else {
        await axios.post("http://localhost:3001/api/likes", {
          artwork_id: Number(id),
          user_id: Number(user.id),
        });
        setLikes((prev) => prev + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };


  const handleBuy = async () => {
    if (!user) {
      alert("Please log in to buy this artwork.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/purchases", {
        user_id: Number(user.id),
        artwork_id: Number(id),
      });
      setPurchased(true);
      alert("Artwork purchased successfully!");
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Failed to purchase artwork.");
    }
  };

  if (!artwork) return <p>Loading...</p>;

  return (
    <div className="art-details-page">
      <Navbar />

      <div className="art-banner">
        <img src={artwork.image_url} alt={artwork.title} />
      </div>

      <div className="art-details">
        <div className="art-details__info">
          <div className="art-details__title">
            <h2>{artwork.title}</h2>
            <p>{new Date(artwork.created_at).toLocaleDateString()}</p>
          </div>

          <div className="art-details__artist">
            <h3>Artist</h3>
            <Link to={`/profile/${artwork.artist_id}`} className="artist-link">
              <div>
                <img src={artwork.avatar_url || placeholder} alt="artist" />
                <p>@{artwork.username || "unknown"}</p>
              </div>
            </Link>
          </div>

          <div className="art-details__engagement">
            <div
              className="engagement-icon"
              onClick={handleLike}
              style={{ cursor: "pointer" }}
            >
              <BsHeartFill color={liked ? "#d94a4a" : "#bbb"} /> <span>{likes}</span>
            </div>
            <div
              className="engagement-icon"
              onClick={() => setShowComments((prev) => !prev)}
              style={{ cursor: "pointer" }}
            >
              <BsChatFill /> <span>{comments.length}</span>
            </div>
          </div>

          <div className="art-details__description">
            <h3>Description</h3>
            <p>{artwork.description}</p>
          </div>
        </div>

        {!isArtist && (
          <div className="art-details__purchase1">
            <div className="art-details__purchase2">
              <p>{artwork.price || "N/A"} ETH</p>
              <button onClick={handleBuy} disabled={purchased}>
                {purchased ? "Purchased" : "Buy"}
              </button>
            </div>
          </div>
        )}
      </div>

      {showComments && (
        <CommentSection
          artworkId={artwork.id}
          onClose={() => setShowComments(false)}
        />
      )}
      <MoreFromArtist artistId={artwork.artist_id} />
      <Footer />
    </div>
  );
}
