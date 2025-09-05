import React from "react";
import Navbar from "../components/Navbar";
import Subnav from "../components/Subnav";
import "../styles/nav.css";

export default function AppLayout({ children, hasSubnav = true }) {
  return (
    <div className={hasSubnav ? "has-subnav" : ""}>
      <Navbar />
      {hasSubnav && <Subnav />}
      <main className="app-main">{children}</main>
    </div>
  );
}
