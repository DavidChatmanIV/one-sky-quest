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

/** 2) Tailwind + global utilities */
import "./style.css"; // Tailwind entry

/** 3) App / page styles */
import "./styles/global.css";
import "./styles/Navbar.css";
import "./styles/LandingPage.css";
import "./styles/BookingPage.css";

/** 🔥 SkyStream styles (replaces QuestFeed) */
import "./styles/skystream.css";

import "./styles/profile-passport.css";
import "./styles/SmartPlan.css";
import "./styles/surfaces.css";
import "./styles/OverlayTone.css";

/** 4) THEME LAST (overrides everything above) */
import "./styles/theme.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AssistantProvider>
      <ConfigProvider
        theme={{
          components: {
            Card: {
              variant: "outlined",
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