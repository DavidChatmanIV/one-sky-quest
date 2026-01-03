import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function PageLayout({
  children,
  fullBleed = true,
  maxWidth = 1180,
  className = "",
  withNavOffset = false, // ✅ DEFAULT OFF (IMPORTANT)
}) {
  const { pathname } = useLocation();

  const cleanPath = useMemo(() => {
    const p = (pathname || "/").replace(/\/+$/, "");
    return p === "" ? "/" : p;
  }, [pathname]);

  const isBooking = cleanPath.startsWith("/booking");

  return (
    <main
      id="main"
      role="main"
      className={[
        "page-root",
        isBooking ? "page--booking" : "",
        fullBleed ? "full-bleed" : "constrained",
        withNavOffset ? "with-nav-offset" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        fullBleed
          ? undefined
          : {
              maxWidth,
              margin: "0 auto",
              paddingLeft: 16,
              paddingRight: 16,
            }
      }
    >
      {children}
    </main>
  );
}
