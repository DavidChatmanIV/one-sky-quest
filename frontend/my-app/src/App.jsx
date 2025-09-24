import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import FeedPage from "./pages/FeedPage";
import DigitalPassportPage from "./pages/DigitalPassportPage";
import MembershipPage from "./pages/Membership";
import TeamTravelPage from "./pages/TeamTravelPage";
import NotFound from "./pages/NotFound";

// Components
import CookieBanner from "./components/CookieBanner";
import { LandingLayout, PageLayout } from "./components/PageLayout";

function WithLandingLayout() {
  return (
    <LandingLayout>
      <Outlet />
    </LandingLayout>
  );
}

function WithPlainLayout() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing (with Navbar) */}
        <Route element={<WithLandingLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* All other pages (no Navbar) */}
        <Route element={<WithPlainLayout />}>
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/digital-passport" element={<DigitalPassportPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/team-travel" element={<TeamTravelPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Persist across all routes */}
      <CookieBanner />
    </BrowserRouter>
  );
}
