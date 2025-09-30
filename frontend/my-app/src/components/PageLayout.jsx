import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

/**
 * Base PageLayout (no Navbar).
 *
 * Props:
 * - fullBleed  : boolean — children span full width (default true)
 * - maxWidth   : number  — max width when not fullBleed (default 1180)
 * - className  : string  — extra class on the main wrapper
 */
export default function PageLayout({
  children,
  fullBleed = true,
  maxWidth = 1180,
  className = "",
}) {
  const { pathname } = useLocation();

  // Normalize trailing slash
  const cleanPath = useMemo(() => {
    const p = (pathname || "/").replace(/\/+$/, "");
    return p === "" ? "/" : p;
  }, [pathname]);

  const isBooking = cleanPath.startsWith("/booking");

  return (
    <>
      {/* Accessibility: Skip to content link */}
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      {/* Main content — no Navbar here */}
      <main
        id="main"
        role="main"
        className={[
          "page-root",
          "no-nav", // base layout has no navbar
          isBooking ? "page--booking" : "",
          fullBleed ? "full-bleed" : "constrained",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          fullBleed
            ? undefined
            : { maxWidth, margin: "0 auto", paddingLeft: 16, paddingRight: 16 }
        }
      >
        {children}
      </main>
    </>
  );
}

/**
 * LandingLayout — ONLY for the landing route.
 * Wraps PageLayout and adds Navbar once.
 */
export function LandingLayout(props) {
  return (
    <>
      <Navbar />
      <PageLayout {...props} />
    </>
  );
}
