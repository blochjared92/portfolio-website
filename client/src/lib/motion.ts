import type { Variants } from "framer-motion";

/** Standard "settle" easing used across the site (motion language). */
export const EASE = [0.22, 1, 0.36, 1] as const;

/** Common staggered-reveal variants: fade + rise, indexed by `custom`. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.09, ease: EASE },
  }),
};
