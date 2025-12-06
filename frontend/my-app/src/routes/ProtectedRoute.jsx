import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ---- Show loading while we check the token / fetch / decode ----
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Checking your boarding pass…
      </div>
    );
  }

  // ---- Fallback: also check token directly ----
  const token = localStorage.getItem("token");

  // ---- If no user and no token, redirect ----
  if (!user && !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname || "/dashboard" }}
      />
    );
  }

  // Render protected content
  return <Outlet />;
}
