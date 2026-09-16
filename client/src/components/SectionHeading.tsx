/* ============================================================
   DESIGN: Dark Ops Dashboard — shared section heading
   Reused by every home-page section (About, Skills, Experience,
   Projects, Contact) so hierarchy and spacing stay identical
   site-wide instead of each section inventing its own header.
   ============================================================ */
import { EASE } from "@/lib/motion";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  index?: string; // e.g. "01" (optional)
  label: string; // e.g. "ABOUT"
  title: ReactNode;
  action?: ReactNode; // optional trailing element (e.g. "View All" button)
  className?: string;
}

export default function SectionHeading({
  index,
  label,
  title,
  action,
  className = "",
}: SectionHeadingProps) {
  return (
    <motion.div
      className={`mb-[clamp(2rem,4vw,3.5rem)] ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE }}
      viewport={{ once: true, margin: "-80px" }}
    >
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span
            className="accent-text inline-block mb-2 text-sm tracking-[0.2em] uppercase"
            style={{ fontFamily: "Fira Code, monospace" }}
          >
            {index ? `${index} · ${label}` : label}
          </span>
          <h2
            className="fluid-h2 font-bold text-foreground"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            {title}
          </h2>
          <div className="accent-underline mt-[clamp(0.75rem,1vw,1rem)]" />
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </motion.div>
  );
}
