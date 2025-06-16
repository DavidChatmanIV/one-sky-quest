import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = () => {
const [isDark, setIsDark] = useState(false);

return (
    <div className={isDark ? "dark" : ""}>
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-all">
        <nav className="flex justify-between items-center px-6 py-4 shadow bg-white dark:bg-gray-800">
        <h1 className="text-2xl font-bold">
            <Link to="/">🌍 One Sky Quest</Link>
        </h1>
        <div className="space-x-4">
            <Link to="/explore">Explore</Link>
            <Link to="/saved-trips">Saved Trips</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/login">Login</Link>
            <button
            onClick={() => setIsDark(!isDark)}
            className="ml-4 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
            >
            {isDark ? "☀️" : "🌙"}
            </button>
        </div>
        </nav>

        <main className="px-4 py-6">
        <Outlet />
        </main>
    </div>
    </div>
);
};

export default Layout;
