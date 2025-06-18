import { useEffect, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ArtCardSmall from "./ArtCardSmall";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function MoreFromArtist({ artistId }) {
  const [artworks, setArtworks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchArtworks() {
      try {
        const res = await axios.get(`http://localhost:3001/api/artworks`);
        const filtered = res.data.filter((art) => art.artist_id === artistId);
        setArtworks(filtered);
      } catch (error) {
        console.error("Error fetching artist artworks:", error);
      }
    }

    if (artistId) fetchArtworks();
  }, [artistId]);

  return (
    <Box sx={{ padding: "2rem 4rem", backgroundColor: "#F6F1E7" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <Typography variant="h6" fontWeight={600} fontFamily={"Playfair Display"}>
          More From This Artist
        </Typography>

        <Button
          variant="outlined"
          endIcon={<BsArrowRight />}
          onClick={() => navigate(`/profile/${artistId}`)}
          sx={{
            borderColor: "#D4AF7F",
            color: "#3D3D3D",
            textTransform: "none",
            fontWeight: 500,
            borderRadius: "12px",
            padding: "0.4rem 1.2rem",
            "&:hover": {
              backgroundColor: "#f0e4d2",
              borderColor: "#D4AF7F",
            },
          }}
        >
          Go To Artist Page
        </Button>
      </Box>

      <Swiper spaceBetween={20} slidesPerView={"auto"}>
        {artworks.map((artwork) => (
          <SwiperSlide key={artwork.id} style={{ width: "280px" }}>
            <ArtCardSmall artwork={artwork} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
