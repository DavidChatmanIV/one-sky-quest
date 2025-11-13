import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token"); // swap to your AuthContext when ready
  const loc = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: loc }} />;
  return <Outlet />;
}
