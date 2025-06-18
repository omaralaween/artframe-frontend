import { Route, Routes } from "react-router-dom";
import ExplorePage from "../pages/ExplorePage";
import LoginPage from "../pages/LoginPage";
import SignUp from "../pages/SignUpPage";
import ArtDetails from "../pages/ArtDetailsPage";
import EditProfile from "../pages/EditProfilePage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<ExplorePage />}/>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/art/:id" element={<ArtDetails />}/>
            <Route path="/edit-profile" element={<EditProfile />}/>
            <Route path="explore-page" element={<ExplorePage />}/>
            <Route path="/home-page" element={<HomePage />}/>
            <Route path="/profile/:id" element={<ProfilePage />}/>
        </Routes>
    );
}