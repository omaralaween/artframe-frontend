import { Link } from "react-router-dom";
import placeholder from "../assets/landscape-placeholder-svgrepo-com.svg";
import "../style/components/ProfileHeader.css";
import { useState, useEffect } from "react";
import CreatePostModal from "./CreatePostModal";
import axios from "axios";

export default function ProfileHeader({ user }) {
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isOwner = loggedInUser?.id === user?.id;
  const isArtist = user?.role === "artist";
  const [showModal, setShowModal] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [followerCount, setFollowerCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [salesCount, setSalesCount] = useState(0);
  const [artistsFollowed, setArtistsFollowed] = useState(0);
  const [ownedCount, setOwnedCount] = useState(0);

  const bannerSrc = user?.banner_url || placeholder;
  const avatarSrc = user?.avatar_url || placeholder;
  const bioText = user?.bio || "This user hasn't written a bio yet.";

  // Fetch follow status
  useEffect(() => {
    async function checkFollow() {
      if (!loggedInUser || isOwner || !user?.id) return;

      try {
        const res = await axios.get(`http://localhost:3001/api/follows/check`, {
          params: {
            follower_id: loggedInUser.id,
            followed_artist_id: user.id,
          },
        });
        setIsFollowing(res.data.isFollowing);
      } catch (err) {
        console.error("Error checking follow status", err);
      }
    }

    checkFollow();
  }, [loggedInUser?.id, user?.id, isOwner]);

  // Fetch profile stats
  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return;

      try {
        if (user.role === "artist") {
          const [followersRes, likesRes, salesRes] = await Promise.all([
            axios.get(`http://localhost:3001/api/follows/followers/${user.id}`),
            axios.get(`http://localhost:3001/api/likes/artist/${user.id}`),
            axios.get(`http://localhost:3001/api/purchases/artist/${user.id}`)
          ]);

          setFollowerCount(followersRes.data.count);
          setLikesCount(likesRes.data.count);
          setSalesCount(salesRes.data.count);
        }

        if (user.role === "buyer") {
          const [followedRes, ownedRes] = await Promise.all([
            axios.get(`http://localhost:3001/api/follows/followed/${user.id}`),
            axios.get(`http://localhost:3001/api/purchases/${user.id}`)
          ]);

          setArtistsFollowed(followedRes.data.count);
          setOwnedCount(ownedRes.data.length);
        }
      } catch (err) {
        console.error("Error fetching profile stats", err);
      }
    }

    fetchStats();
  }, [user?.id]);

  const handleFollowToggle = async () => {
    if (!loggedInUser || !user?.id) return;

    try {
      if (isFollowing) {
        await axios.delete("http://localhost:3001/api/follows", {
          data: {
            follower_id: loggedInUser.id,
            followed_artist_id: user.id,
          },
        });
        setIsFollowing(false);
      } else {
        await axios.post("http://localhost:3001/api/follows", {
          follower_id: loggedInUser.id,
          followed_artist_id: user.id,
        });
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Follow toggle error", err);
    }
  };

  return (
    <div className="profile-header">
      <div className="profile-header__banner">
        <img src={bannerSrc} alt="Banner image" />
      </div>

      <div className="profile-header__content">
        <img
          src={avatarSrc}
          alt="Profile image"
          className="profile-header__avatar"
        />

        <div className="profile-header__main">
          <div className="profile-header__top">
            <h2 className="profile-header__username">{user?.username}</h2>

            <div className="profile-header__buttons">
              {isOwner && (
                <>
                  <Link to="/edit-profile">
                    <button className="btn outline">Edit Profile</button>
                  </Link>
                  {isArtist && (
                    <button className="btn solid" onClick={() => setShowModal(true)}>
                      Add Artwork
                    </button>
                  )}
                </>
              )}

              {!isOwner && (
                <button className="btn outline" onClick={handleFollowToggle}>
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </div>

          {isArtist && (
            <div className="profile-header__stats-group artist">
              <div>
                <p className="stat-count">{followerCount}</p>
                <p className="stat-label">Followers</p>
              </div>
              <div>
                <p className="stat-count">{likesCount}</p>
                <p className="stat-label">Likes</p>
              </div>
              <div>
                <p className="stat-count">{salesCount}</p>
                <p className="stat-label">Pieces Sold</p>
              </div>
            </div>
          )}

          {user?.role === "buyer" && (
            <div className="profile-header__stats-group user">
              <div>
                <p className="stat-count">{artistsFollowed}</p>
                <p className="stat-label">Artists Followed</p>
              </div>
              <div>
                <p className="stat-count">{ownedCount}</p>
                <p className="stat-label">Pieces Owned</p>
              </div>
            </div>
          )}

          <div className="profile-header__bio">
            <p className="bio-label">Bio</p>
            <p className="bio-text">{bioText}</p>
          </div>
        </div>
      </div>

      {showModal && <CreatePostModal closeModal={() => setShowModal(false)} />}
    </div>
  );
}
