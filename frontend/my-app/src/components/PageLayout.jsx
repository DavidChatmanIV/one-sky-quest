import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

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
        "no-nav", // base layout has no navbar (navbar handled by AppLayout)
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
  );
}