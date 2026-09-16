/* ============================================================
   useHeavyEffects — one place to decide whether the decorative,
   GPU-hungry layers (particle canvas, hero mesh) should render.

   Off when any of these are true:
     - the user asked for reduced motion
     - the viewport is phone-sized
     - the device reports few CPU cores (cheap Android, older iPhone)
     - the browser reports a metered/slow connection

   Re-evaluates on resize so rotating a tablet does the right thing.
   ============================================================ */
import { useEffect, useState } from "react";

const SMALL_SCREEN = "(max-width: 767px)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function evaluate(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia(REDUCED_MOTION).matches) return false;
  if (window.matchMedia(SMALL_SCREEN).matches) return false;

  const cores = navigator.hardwareConcurrency;
  if (typeof cores === "number" && cores > 0 && cores <= 4) return false;

  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;

  return true;
}

export function useHeavyEffects(): boolean {
  const [enabled, setEnabled] = useState(evaluate);

  useEffect(() => {
    const small = window.matchMedia(SMALL_SCREEN);
    const motion = window.matchMedia(REDUCED_MOTION);
    const update = () => setEnabled(evaluate());

    small.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      small.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  return enabled;
}
