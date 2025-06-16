import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import BookingDashboard from "./components/BookingDashboard";
import ProfilePage from "./pages/ProfilePage"; // ✅ Profile Page component

function App() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );
  const [isDark, setIsDark] = useState(false); // 🌗 Dark mode toggle

  // 👤 Mock user data (can later be fetched from API or context)
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
            className="absolute top-4 right-4 bg-gray-300 dark:bg-gray-800 text-sm px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-700 z-50"
          >
            {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <Routes>
            <Route
              path="/"
              element={
                <div className="p-4">
                  <h1 className="text-3xl font-bold mb-6">
                    One Sky Quest Admin Panel
                  </h1>
                  {isAdminLoggedIn ? (
                    <>
                      <button
                        className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>

                      {/* 👤 Profile Link */}
                      <Link
                        to="/profile"
                        className="text-blue-600 hover:underline mb-4 inline-block"
                      >
                        View Profile
                      </Link>

                      <BookingDashboard />
                    </>
                  ) : (
                    <AdminLogin
                      onLoginSuccess={() => setIsAdminLoggedIn(true)}
                    />
                  )}
                </div>
              }
            />

            {/* 🔗 Profile Route with User Data */}
            <Route path="/profile" element={<ProfilePage user={mockUser} />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
