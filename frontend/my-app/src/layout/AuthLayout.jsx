import React from "react";
import "../styles/AuthLayout.css";

export default function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      {/* Background Glow Orbs */}
      <div className="glow g1" aria-hidden="true" />
      <div className="glow g2" aria-hidden="true" />
      <div className="glow g3" aria-hidden="true" />

      {/* Content */}
      <div className="auth-shell">{children}</div>
    </div>
  );
}