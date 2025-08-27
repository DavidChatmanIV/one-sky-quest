import React from "react";
import AppRoutes from "./AppRoutes";
import CookieBanner from "./components/CookieBanner";
import { AssistantProvider } from "./context/AssistantContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* Your main routes */}
      <AppRoutes />

      {/* Cookie consent banner */}
      <CookieBanner />

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </>
  );
}

export default function AppRoot() {
  return (
    <AssistantProvider>
      <App />
    </AssistantProvider>
  );
}
