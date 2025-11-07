import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";

// Providers
import { AssistantProvider } from "./context";

// Routes
import AppRoutes from "./AppRoutes";

/* ---------- CSS: Load Order ---------- */
/** 1) Ant reset FIRST (normalize component defaults) */
import "antd/dist/reset.css";

/** 2) Tailwind + global utilities (Tailwind entry via PostCSS) */
import "./style.css"; // <- Your Tailwind entry (replaces App.css as Tailwind entry)

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
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AssistantProvider>
      <ConfigProvider
        theme={{
          components: {
            Card: {
              variant: "outlined", // change to "borderless" if you prefer no borders globally
            },
          },
        }}
      >
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ConfigProvider>
    </AssistantProvider>
  </React.StrictMode>
);
