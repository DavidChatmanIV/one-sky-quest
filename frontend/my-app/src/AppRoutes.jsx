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
import NotFound from "./pages/NotFound";

// 🔹 Components
import SavedExcursions from "./components/excursions/SavedExcursions";

const AppRoutes = () => (
  <Routes>
    {/* 🔹 Main Pages */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/booking" element={<BookingPage />} />
    <Route path="/questfeed" element={<QuestFeed />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/dm" element={<DmPage />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/about" element={<About />} />

    {/* 🔹 Extras */}
    <Route path="/saved-excursions" element={<SavedExcursions />} />

    {/* 🔁 Redirect old index.html to root */}
    <Route path="/index.html" element={<Navigate to="/" replace />} />

    {/* ⚠️ Catch-All 404 Page */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
