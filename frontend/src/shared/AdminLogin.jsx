import React, { useState } from "react";

const AdminLogin = ({ onLoginSuccess }) => {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [msg, setMsg] = useState("");

const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
        setMsg(data.message || "Login failed.");
        return;
    }

      // Save token
    localStorage.setItem("adminToken", data.token);
    setMsg("Login successful ✅");

      // Notify parent or redirect
    if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
    console.error("Login error:", err);
    setMsg("An error occurred.");
    }
};

return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
    <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
    {msg && <p className="mb-4 text-sm text-red-500">{msg}</p>}

    <form onSubmit={handleSubmit}>
        <input
        type="email"
        className="w-full mb-4 p-2 border rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        />
        <input
        type="password"
        className="w-full mb-4 p-2 border rounded"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        />
        <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
        Log In
        </button>
    </form>
    </div>
);
};

export default AdminLogin;
