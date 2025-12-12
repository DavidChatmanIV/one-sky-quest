import React, { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import "aos/dist/aos.css";
import AOS from "aos";

// Layouts
import AppLayout from "./layouts/AppLayout";
import { LandingLayout, PageLayout } from "./components/PageLayout";

// Guards
import RequireRole from "./components/RequireRole";

// Public / marketing pages
import LandingPage from "./pages/LandingPage";
import BookingPage from "./pages/BookingPage";
import FeedPage from "./pages/FeedPage";
import DigitalPassportPage from "./pages/DigitalPassportPage";
import MembershipPage from "./pages/Membership";
import TeamTravelPage from "./pages/TeamTravelPage";
import NotFound from "./pages/NotFound";

// Auth pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Dashboard / app pages
import DashboardPage from "./pages/DashboardPage";
import UserBookingsPage from "./pages/UserBookingsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";

// 🔐 Admin user management page (new path)
import AdminUsersPage from "./pages/admin/AdminUsersPage";

// Global components
import CookieBanner from "./components/CookieBanner";

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
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 600,
      easing: "ease-out",
    });
  }, []);

  return (
    <>
      <Routes>
        {/* Landing (with Navbar / hero shell) */}
        <Route element={<WithLandingLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>

        {/* Public “plain” pages (still use marketing layout, no dashboard shell) */}
        <Route element={<WithPlainLayout />}>
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/digital-passport" element={<DigitalPassportPage />} />
          <Route path="/membership" element={<MembershipPage />} />
          <Route path="/team-travel" element={<TeamTravelPage />} />
        </Route>

        {/* Authenticated app shell (Dashboard, user area, admin area) */}
        <Route element={<AppLayout />}>
          {/* Normal user routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/bookings" element={<UserBookingsPage />} />
          {/* Add more normal user routes here as needed */}

          {/* Admin section (RBAC protected) */}
          <Route
            path="/admin/bookings"
            element={
              <RequireRole allowedRoles={["admin", "manager"]}>
                <AdminBookingsPage />
              </RequireRole>
            }
          />

          {/* 🔐 Admin-only user management page */}
          <Route
            path="/admin/users"
            element={
              <RequireRole allowedRoles={["admin"]}>
                <AdminUsersPage />
              </RequireRole>
            }
          />
        </Route>

        {/* Auth routes (outside AppLayout + marketing layouts) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Persist across all routes */}
      <CookieBanner />
    </>
  );
}