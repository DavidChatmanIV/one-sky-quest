import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 🔹 Pages
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import ProfilePage from "./pages/ProfilePage";
import DmPage from "./pages/DmPage";
import QuestFeed from "./pages/QuestFeed";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import About from "./pages/About";
import MembershipPage from "./pages/MembershipPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import TeamTravelPage from "./pages/TeamTravelPage"; 

// 🔹 Components
import SavedExcursions from "./components/excursions/SavedExcursions";
import NotFound from "./pages/NotFound";

const AppRoutes = () => (
  <Routes>
    {/* 🔹 Main Pages */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/booking" element={<BookingPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/questfeed" element={<QuestFeed />} />
    <Route path="/dm" element={<DmPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/membership" element={<MembershipPage />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/about" element={<About />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/team-travel" element={<TeamTravelPage />} /> 
    {/* 🔸 Extra Tools */}
    <Route path="/saved-excursions" element={<SavedExcursions />} />
    {/* 🔁 Redirect index.html to "/" */}
    <Route path="/index.html" element={<Navigate to="/" replace />} />
    {/* ⚠️ 404 Fallback */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
