import React from "react";
import { useNavigate } from "react-router-dom";

export default function Subnav() {
  const navigate = useNavigate();

  return (
    <div className="osq-subnav">
      <button className="pill" onClick={() => navigate("/membership")}>
        👑 Membership
      </button>

      {/* Keep tutorial simple (route to a page or section) */}
      <button className="pill" onClick={() => navigate("/tutorial")}>
        📖 Tutorial
      </button>

      {/* XP store name the way you asked: Sky Vault */}
      <button
        className="skyvault-badge"
        onClick={() => navigate("/sky-vault")}
        aria-label="Open Sky Vault XP Store"
      >
        <span className="dot" />
        Sky Vault
      </button>
    </div>
  );
}
