import React, { useState, useMemo, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import { Button } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import AdminLogin from "./components/AdminLogin";
import BookingDashboard from "./components/BookingDashboard";
import ProfilePage from "./pages/ProfilePage";
import PreviewGallery from "./pages/PreviewGallery";

// 🔁 Animation wrapper for each route
const PageWrapper = ({ children, keyName }) => (
  <motion.div
    key={keyName}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="p-4"
  >
    {children}
  </motion.div>
);

// 🔁 AppRoutes component for transitions + auto-close menu
function AppRoutes({
  isAdminLoggedIn,
  handleLogout,
  setIsAdminLoggedIn,
  mockUser,
  setShowMenu,
}) {
  const location = useLocation();

  // Close dev menu on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setShowMenu(false);
  }, [location]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper keyName="admin">
              <h1 className="text-3xl font-bold mb-6">
                One Sky Quest Admin Panel
              </h1>
              {isAdminLoggedIn ? (
                <>
                  <Button
                    danger
                    type="primary"
                    onClick={handleLogout}
                    className="mb-4"
                  >
                    Log Out
                  </Button>
                  <Link
                    to="/profile"
                    className="text-blue-600 hover:underline mb-4 inline-block"
                  >
                    View Profile
                  </Link>
                  <BookingDashboard />
                </>
              ) : (
                <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
              )}
            </PageWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <PageWrapper keyName="profile">
              <ProfilePage user={mockUser} />
            </PageWrapper>
          }
        />
        <Route
          path="/preview"
          element={
            <PageWrapper keyName="preview">
              <PreviewGallery />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );
  const [isDark, setIsDark] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // 👤 Mock user
  const mockUser = useMemo(
    () => ({
      name: "Anna Santander",
      location: "Santa Fe, NM",
      avatar: "/images/anna.png",
      bio: "Travel enthusiast & sky kid",
      points: 230,
    }),
    []
  );

  // 🌗 Auto-sync dark mode with system
  useEffect(() => {
    const match = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(match.matches);
    const handleChange = (e) => setIsDark(e.matches);
    match.addEventListener("change", handleChange);
    return () => match.removeEventListener("change", handleChange);
  }, []);

  // ⌨️ Toggle dev menu with "D" key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key.toLowerCase() === "d") {
        setShowMenu((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
  };

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-all">
        <Router>
          {/* 🌗 Dark Mode Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="fixed top-4 right-4 bg-gray-300 dark:bg-gray-800 text-sm px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-700 z-50"
          >
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          {/* 🧪 Slide-Out Dev Menu */}
          <div
            className={`fixed top-0 left-0 h-full bg-gradient-to-b from-sky-600 to-sky-300 text-white shadow-lg transform transition-transform duration-300 z-40 w-52
            ${showMenu ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-bold text-yellow-200">🧪 Dev Menu</h2>
              <Link
                to="/"
                onClick={() => setShowMenu(false)}
                className="block hover:text-yellow-200 font-medium"
              >
                Admin Panel
              </Link>
              <Link
                to="/profile"
                onClick={() => setShowMenu(false)}
                className="block hover:text-yellow-200 font-medium"
              >
                Profile
              </Link>
              <Link
                to="/preview"
                onClick={() => setShowMenu(false)}
                className="block hover:text-yellow-200 font-medium"
              >
                Preview
              </Link>
              <p className="text-xs text-yellow-100 mt-4">
                Press <kbd>D</kbd> to toggle
              </p>
            </div>
          </div>

          {/* 📎 Toggle Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="fixed top-4 left-4 z-50 bg-sky-700 text-white px-3 py-1 rounded shadow hover:bg-sky-800"
          >
            {showMenu ? "Close" : "Dev Menu"}
          </button>

          {/* 📦 Routes */}
          <AppRoutes
            isAdminLoggedIn={isAdminLoggedIn}
            handleLogout={handleLogout}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            mockUser={mockUser}
            setShowMenu={setShowMenu}
          />
        </Router>
      </div>
    </div>
  );
}

export default App;

