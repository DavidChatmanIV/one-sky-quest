import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="osq-shell">
      <Navbar />
      <main className="osq-main">
        <Outlet />
      </main>
    </div>
  );
}
