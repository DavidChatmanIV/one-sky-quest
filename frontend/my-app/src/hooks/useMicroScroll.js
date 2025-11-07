import { useEffect } from "react";

/** Adds `.in` to [data-reveal] when in view */
export function useScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.classList.add("in");
          else e.target.classList.remove("in");
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/** Updates CSS var --ms-parallax and toggles body.scrolled */
export function useParallax() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;

    const onScroll = () => {
      const y = window.scrollY || 0;
      root.style.setProperty("--ms-parallax", `${Math.min(y, 600)}px`);
      document.body.classList.toggle("scrolled", y > 24);
    };

    onScroll(); // initialize on mount
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
