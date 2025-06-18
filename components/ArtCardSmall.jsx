import { useEffect, useState } from "react";
import { BsHeartFill, BsChatFill } from "react-icons/bs";
import "../style/components/ArtCardSmall.css";
import placeHolder from "../assets/landscape-placeholder-svgrepo-com.svg";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function ArtCardSmall({ artwork }) {
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [likesRes, commentsRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/likes/${artwork.id}`),
          axios.get(`http://localhost:3001/api/comments/${artwork.id}/count`)
        ]);

        setLikeCount(likesRes.data.count);
        setCommentCount(commentsRes.data.count);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    }

    if (artwork?.id) fetchCounts();
  }, [artwork?.id]);

  if (!artwork) return null;

  const navigateToArtwork = () => {
    navigate(`/art/${artwork.id}`);
  };

  return (
    <div className="card" onClick={navigateToArtwork} style={{ cursor: "pointer" }}>
      <img
        src={artwork.image_url}
        alt={artwork.title}
        className="card__image"
      />

      <div className="card__body">
        <p className="card__title">{artwork.title}</p>

        <Link
          to={`/profile/${artwork.artist_id}`}
          onClick={(e) => e.stopPropagation()}
          className="card__artist"
        >
          <img
            src={artwork.avatar_url || placeHolder}
            alt={artwork.username || "Artist"}
            className="card__avatar"
          />
          <p className="card__username">@{artwork.username || "artist"}</p>
        </Link>

        <div className="card__info-row">
          <div className="card__price">
            <span className="card__label">Price</span>
            <span className="card__amount">{artwork.price || "N/A"} ETH</span>
          </div>

          <div className="card__engagement">
            <div className="card__engagement-icons">
              <BsHeartFill />
              <BsChatFill />
            </div>
            <div className="card__engagement-numbers">
              <span>{likeCount}</span>
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
