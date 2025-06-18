import { useEffect, useState } from "react";
import { BsHeartFill, BsChat } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import "../style/components/ArtCardBig.css";
import placeHolder from "../assets/landscape-placeholder-svgrepo-com.svg";
import axios from "axios";
import CommentSection from "./CommentSection";

export default function ArtCardBig({ artwork }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchEngagement = async () => {
    try {
      const likeRes = await axios.get(`http://localhost:3001/api/likes/${artwork.id}`);
      setLikes(likeRes.data.count);

      if (user) {
        const likedRes = await axios.get(
          `http://localhost:3001/api/likes/${artwork.id}/user/${user.id}`
        );
        setLiked(likedRes.data.liked);
      }

      const commentRes = await axios.get(
        `http://localhost:3001/api/comments/${artwork.id}/count`
      );
      setCommentCount(commentRes.data.count);
    } catch (err) {
      console.error("Error fetching engagement data:", err);
    }
  };

  useEffect(() => {
    if (artwork?.id) fetchEngagement();
  }, [artwork.id, user?.id]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return;

    const payload = {
      artwork_id: Number(artwork.id),
      user_id: Number(user.id),
    };

    try {
      if (liked) {
        await axios.delete("http://localhost:3001/api/likes", { data: payload });
        setLikes((prev) => prev - 1);
        setLiked(false);
      } else {
        await axios.post("http://localhost:3001/api/likes", payload);
        setLikes((prev) => prev + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleBuy = async (e) => {
    e.stopPropagation();
    if (!user) {
      alert("Please log in to purchase.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/purchases", {
        user_id: Number(user.id),
        artwork_id: Number(artwork.id),
      });
      setPurchased(true);
      alert("Artwork purchased successfully!");
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Failed to purchase artwork.");
    }
  };

  const handleCardClick = () => {
    navigate(`/art/${artwork.id}`);
  };

  const isArtistViewing = user?.id === artwork.artist_id;

  return (
    <div className="big-card" onClick={handleCardClick} style={{ cursor: "pointer" }}>
      <div className="big-card__image-container">
        <img
          src={artwork.image_url}
          alt={artwork.title}
          className="big-card__image"
        />
      </div>

      <div className="big-card__body">
        <div className="big-card__header">
          <h3 className="big-card__title">{artwork.title}</h3>
          <Link
            to={`/profile/${artwork.artist_id}`}
            onClick={(e) => e.stopPropagation()}
            className="big-card__user"
          >
            <img
              src={artwork.avatar_url || placeHolder}
              alt={artwork.username || "artist"}
              className="big-card__avatar"
            />
            <p className="big-card__username">@{artwork.username || "unknown"}</p>
          </Link>
        </div>

        <p className="big-card__description">{artwork.description}</p>

        <div className="big-card__engagement">
          <div className="big-card__metric" onClick={handleLike}>
            <BsHeartFill color={liked ? "#d94a4a" : "#bbb"} />
            <span>{likes}</span>
          </div>

          <div
            className="big-card__metric"
            onClick={(e) => {
              e.stopPropagation();
              setShowComments((prev) => !prev);
            }}
          >
            <BsChat />
            <span>{commentCount}</span>
          </div>
        </div>

        {/* Show buy section only if the user is not the artist */}
        {!isArtistViewing && (
          <div className="big-card__footer">
            <div className="big-card__price">
              <span className="price-label">Price</span>
              <span className="price-amount">{artwork.price || "1.63"} ETH</span>
            </div>
            <button
              className="buy-btn"
              onClick={handleBuy}
              disabled={purchased}
            >
              {purchased ? "Purchased" : "Buy"}
            </button>
          </div>
        )}

        {showComments && (
          <CommentSection
            artworkId={artwork.id}
            close={() => {
              setShowComments(false);
              fetchEngagement();
            }}
          />
        )}
      </div>
    </div>
  );
}
