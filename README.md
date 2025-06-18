# ArtFrame Frontend

ArtFrame is a digital art marketplace where artists can upload, showcase, and sell their artworks, while buyers can browse, like, comment, save, and purchase their favorite pieces. The frontend is built using **React.js** and styled with custom CSS to deliver a modern, gallery-style experience.

---

## User Requirements

- **Artists** should be able to:
  - Sign up, log in, and manage their profiles.
  - Upload artwork posts with title, description, price, and image.
  - View their uploaded artwork and engagement stats.

- **Buyers** should be able to:
  - Sign up, log in, and follow their favorite artists.
  - Browse and interact with artworks (like, comment, save).
  - Purchase artwork.
  - View their own collection of saved and purchased pieces.

---

## Technologies Used

- **React.js** (Frontend framework)
- **Vite** (Build tool)
- **Axios** (HTTP client for API requests)
- **React Router** (Page routing)
- **Plain CSS** (Custom styling)
- **React Icons** (Icon library)
- **Swiper.js** (Carousel in artist profile)
- **LocalStorage** (For session persistence)
- **Environment Variables** with Vite (e.g. `VITE_BACKEND_URL`)

---

## How to Clone and Run This Frontend Locally

### Prerequisites
- Node.js & npm installed on your machine
- Backend server running locally (e.g. on `http://localhost:3001`)

---

### Step-by-step

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/artframe-frontend.git
   cd artframe-frontend
