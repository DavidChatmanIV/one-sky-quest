import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import ProfilePage from "./pages/ProfilePage";
import PreviewGallery from "./pages/PreviewGallery";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route
          path="/profile"
          element={
            <ProfilePage
              user={{
                name: "Anna",
                avatar: "/images/anna.png",
                bio: "Sky kid",
                location: "Santa Fe",
                points: 230,
              }}
            />
          }
        />
        <Route path="/preview" element={<PreviewGallery />} />
      </Routes>
    </Router>
  );
}

export default App;
