/* ============================================================
   CountUp — animates a numeric value from 0 to its target when
   scrolled into view. Preserves any non-numeric prefix/suffix
   (e.g. "< 2min", "99.9%", "40+", "~160KB") by only animating
   the first number it finds in the string.
   ============================================================ */
import { useEffect, useRef, useState } from "react";

export default function CountUp({ value, duration = 1200 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  // Parse once.
  const match = value.match(/(\d[\d,]*\.?\d*)/);
  const numStr = match ? match[1].replace(/,/g, "") : "";
  const target = match ? parseFloat(numStr) : 0;
  const decimals = numStr.includes(".") ? (numStr.split(".")[1]?.length ?? 0) : 0;
  const prefix = match ? value.slice(0, match.index) : value;
  const suffix = match ? value.slice((match.index ?? 0) + match[1].length) : "";

  const [display, setDisplay] = useState(() =>
    match ? `${prefix}${(0).toFixed(decimals)}${suffix}` : value
  );

  // Observe when the element enters the viewport (or is already in it).
  useEffect(() => {
    if (!match) { setDisplay(value); return; }
    const el = ref.current;
    if (!el) return;

    const trigger = () => setStarted(true);

    // Already visible on mount? start right away.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      trigger();
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { trigger(); io.disconnect(); }
    }, { rootMargin: "-40px" });
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Run the animation once triggered (guarded so re-renders can't restart it).
  const ranRef = useRef(false);
  useEffect(() => {
    if (!started || !match || ranRef.current) return;
    ranRef.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = target * eased;
      const shown = decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
      setDisplay(`${prefix}${shown}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started]);

  return <span ref={ref}>{display}</span>;
}
