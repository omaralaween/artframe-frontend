import { useState } from "react";
import axios from "axios";
import "../style/components/CreatePostModal.css";
import { BsImageFill } from "react-icons/bs";

const API = import.meta.env.VITE_API;

async function fetchRandomArtImage() {
  try {
    const response = await fetch(API);

    if (!response.ok) {
      throw new Error("Failed to fetch image");
    }

    const data = await response.json();

    const artworks = data.data.filter(item => item.image_id);
    if (artworks.length === 0) throw new Error("No valid images found.");

    const randomIndex = Math.floor(Math.random() * artworks.length);
    const imageId = artworks[randomIndex].image_id;

    const imageUrl = `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
    return imageUrl;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}



export default function CreatePostModal({ closeModal }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");


  const user = JSON.parse(localStorage.getItem("user"));

  const handleImageClick = async () => {
    const url = await fetchRandomArtImage();
    if (url) setImageUrl(url);
  };

  const handlePost = async () => {
    if (!title || !description || !imageUrl || !price) {
      alert("Please fill in all fields and add an image.");
      return;
    }

    const newArtwork = {
      artist_id: user?.id,
      title,
      description,
      image_url: imageUrl,
      price: parseFloat(price),
    };


    try {
      const response = await axios.post("http://localhost:3001/api/artworks", newArtwork);

      if (response.status === 201) {
        alert("Artwork posted successfully!");
        setTitle("");
        setDescription("");
        setImageUrl("");
        closeModal();
      }
    } catch (error) {
      console.error("Failed to post artwork:", error);
      alert("There was an error posting your artwork.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-post-container">
        <div className="create-post-left" onClick={handleImageClick}>
          {imageUrl ? (
            <img src={imageUrl} alt="Preview" className="uploaded-image" />
          ) : (
            <div className="image-placeholder-icon">
              <BsImageFill className="image-icon" />
              <p>Click to add an image</p>
            </div>
          )}
        </div>

        <div className="create-post-right">
          <div className="create-post-header">
            <h3>Create New Post</h3>
          </div>

          <div className="create-post-inputs">
            <input
              type="text"
              placeholder="Add a Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Add a Description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              placeholder="Add a Price..."
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="create-post-buttons">
            <button className="cancel-btn" onClick={closeModal}>Cancel</button>
            <button className="post-btn" onClick={handlePost}>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}
