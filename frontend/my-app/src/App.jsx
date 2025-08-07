import React from "react";
import AppRoutes from "./AppRoutes";
import CookieBanner from "./components/CookieBanner";
import { AssistantProvider } from "./context/AssistantContext";

const App = () => {
  return (
    <>
      <AppRoutes />
      <CookieBanner /> {/* Displayed at bottom of all pages */}
    </>
  );
};

export default function AppRoot() {
  return (
    <AssistantProvider>
      <App />
    </AssistantProvider>
  );
}
