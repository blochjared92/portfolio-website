/* ============================================================
   SpotlightTracker — keeps the pointer-follow glow on .spotlight
   and .btn-glow elements working, without drawing a custom cursor.
   (The visible custom cursor was removed; this is the minimal bit
   needed so hover glows still track the pointer.)
   ============================================================ */
import { useEffect } from "react";

export default function SpotlightTracker() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest?.(".spotlight, .btn-glow") as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return null;
}
