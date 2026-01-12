import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function PageLayout({
  children,
  fullBleed = true,
  maxWidth = 1180,
  className = "",
  withNavOffset = false,
  showBackground = true, // ✅ NEW: enable/disable per page if needed
}) {
  const { pathname } = useLocation();

  const cleanPath = useMemo(() => {
    const p = (pathname || "/").replace(/\/+$/, "");
    return p === "" ? "/" : p;
  }, [pathname]);

  const isBooking = cleanPath.startsWith("/booking");
  const isPassport = cleanPath.startsWith("/passport");
  const isSkyStream = cleanPath.startsWith("/skystream");

  return (
    <main
      id="main"
      role="main"
      className={[
        "page-root",
        isBooking ? "page--booking" : "",
        isPassport ? "page--passport" : "",
        isSkyStream ? "page--skystream" : "",
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
      {/* ✅ Background layer (same concept as your Landing) */}
      {showBackground && <div className="sk-bg" aria-hidden="true" />}

      {/* ✅ Content layer */}
      <div className="page-content">{children}</div>
    </main>
  );
}