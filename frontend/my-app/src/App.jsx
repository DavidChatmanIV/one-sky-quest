import React from "react";
import AppRoutes from "./AppRoutes";
import CookieBanner from "./components/CookieBanner";

const App = () => {
  return (
    <>
      <AppRoutes />
      <CookieBanner /> {/* Displayed at bottom of all pages */}
    </>
  );
};

export default App;
