import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoot from "./App.jsx";
import { AssistantProvider } from "./context";

/* ---------- CSS: Load Order ---------- */
// 1) Ant reset FIRST
import "antd/dist/reset.css";

// 2) All app/page styles
import "./styles/global.css";
import "./styles/Navbar.css";
import "./styles/LandingPage.css";
import "./styles/BookingPage.css";
import "./styles/QuestFeed.css";
import "./styles/profile-passport.css";
import "./styles/SmartPlan.css";
import "./styles/surfaces.css";
import "./styles/OverlayTone.css";

/* 3) THEME LAST so gradient + glow always win */
import "./styles/theme.css";

/* ---------- Render Root ---------- */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AssistantProvider>
      <BrowserRouter>
        <AppRoot />
      </BrowserRouter>
    </AssistantProvider>
  </React.StrictMode>
);
