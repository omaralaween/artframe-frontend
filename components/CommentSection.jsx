import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5"; // close icon
import placeholder from "../assets/landscape-placeholder-svgrepo-com.svg";
import "../style/components/CommentSection.css";
import axios from "axios";

export default function CommentSection({ artworkId, onClose }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await axios.get(`http://localhost:3001/api/comments/${artworkId}`);
        setComments(res.data);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    }

    if (artworkId) fetchComments();
  }, [artworkId]);

  const handlePost = async () => {
    if (!text.trim() || !user) return;
    try {
      await axios.post(`http://localhost:3001/api/comments`, {
        artwork_id: artworkId,
        user_id: user.id,
        text,
      });
      setText("");
      const res = await axios.get(`http://localhost:3001/api/comments/${artworkId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  return (
    <div className="comment-overlay">
      <div className="comment-container">
        <button className="comment-close" onClick={onClose}>
          <IoClose />
        </button>

        <h3 className="comment-title">Comments</h3>

        <div className="comment-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <img
                src={comment.avatar_url || placeholder}
                alt="user avatar"
                className="comment-avatar"
              />
              <div>
                <strong>{comment.username}</strong>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
        </div>

        {user && (
          <div className="comment-input">
            <input
              type="text"
              placeholder="Comment..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePost()}
            />
            <button onClick={handlePost}>Post</button>
          </div>
        )}
      </div>
    </div>
  );
}
