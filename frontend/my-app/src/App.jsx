import React from "react";
import AppRoutes from "./AppRoutes";
import CookieBanner from "./components/CookieBanner";

export default function AppRoot() {
  return (
    <>
      <AppRoutes />
      <CookieBanner />
    </>
  );
}
