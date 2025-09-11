// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// App + context
import AppRoot from "./App.jsx";
import { AssistantProvider } from "./context";

/* ---------- CSS: Load Order ---------- */
/** 1) Ant reset FIRST (normalize component defaults) */
import "antd/dist/reset.css";

/** 2) Tailwind + global utilities (lives in src/App.css) */
import "./App.css";

/** 3) App/page styles */
import "./styles/global.css";
import "./styles/Navbar.css";
import "./styles/LandingPage.css";
import "./styles/BookingPage.css";
import "./styles/QuestFeed.css";
import "./styles/profile-passport.css";
import "./styles/SmartPlan.css";
import "./styles/surfaces.css";
import "./styles/OverlayTone.css";

/** 4) THEME LAST so gradient/glow tokens override when needed */
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
