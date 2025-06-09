import React, { useState } from "react";
import AdminLogin from "./components/AdminLogin";
import BookingDashboard from "./components/BookingDashboard";

function App() {
const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
);

const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
};

return (
    <div className="p-4">
    <h1 className="text-3xl font-bold mb-6">One Sky Quest Admin Panel</h1>
    {isAdminLoggedIn ? (
        <>
        <button
            className="mb-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleLogout}
        >
            Log Out
        </button>
        <BookingDashboard />
        </>
    ) : (
        <AdminLogin onLoginSuccess={() => setIsAdminLoggedIn(true)} />
    )}
    </div>
);
}

export default App;
