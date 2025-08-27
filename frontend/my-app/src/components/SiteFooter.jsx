import React from "react";
import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="osq-footer">
      <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
        <Link to="/terms">Terms</Link>
        <Link to="/privacy">Privacy</Link>
        <a href="mailto:support@oneskyquest.com">Support</a>
      </div>
      <small>© {new Date().getFullYear()} One Sky Quest</small>
    </footer>
  );
}
