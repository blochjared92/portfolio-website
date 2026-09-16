/* ============================================================
   DESIGN: Welcome loader shown once on first site load.
   "Generates" the name Jared Bloch: letters rise in sequence
   with a blue→purple gradient, an accent line sweeps under it,
   then the overlay fades out.
   Palette: blue→purple gradient only.
   ============================================================ */
import { EASE } from "@/lib/motion";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoaderProps {
  onFinish: () => void;
}

const NAME = "Jared Bloch";

export default function Loader({ onFinish }: LoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const done = setTimeout(() => setVisible(false), 2300);
    return () => clearTimeout(done);
  }, []);

  const letters = NAME.split("");

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center px-6"
          style={{ background: "var(--background)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {/* Name */}
          <div className="flex items-end overflow-hidden" aria-label={NAME}>
            {letters.map((ch, i) => (
              <motion.span
                key={i}
                className="accent-text font-bold"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontSize: "clamp(2.25rem, 7vw, 4.25rem)",
                  letterSpacing: "-0.02em",
                  whiteSpace: "pre",
                  lineHeight: 1.1,
                }}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: EASE }}
              >
                {ch}
              </motion.span>
            ))}
          </div>

          {/* Accent line sweeps in under the name */}
          <motion.div
            className="mt-4 h-[3px] rounded-full"
            style={{ background: "var(--accent-gradient-h)", transformOrigin: "left" }}
            initial={{ scaleX: 0, width: "min(70vw, 360px)" }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.15 + letters.length * 0.06, ease: EASE }}
          />

          {/* Welcome tag */}
          <motion.p
            className="mt-6 tracking-[0.35em] uppercase"
            style={{ fontFamily: "Fira Code, monospace", fontSize: "0.7rem", color: "var(--muted-foreground)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 + letters.length * 0.06 }}
          >
            Welcome
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
