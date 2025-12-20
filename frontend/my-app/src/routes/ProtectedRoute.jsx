import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // 1️⃣ While auth state is resolving
  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <Spin size="large" />
        <div style={{ opacity: 0.75 }}>Checking your boarding pass…</div>
      </div>
    );
  }

  // 2️⃣ Extra safety: token fallback (covers refresh edge cases)
  const token = localStorage.getItem("token");

  // 3️⃣ Not authenticated → redirect to login
  if (!user && !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  // 4️⃣ Authenticated → allow access
  return <Outlet />;
}