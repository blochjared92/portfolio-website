/* ============================================================
   DESIGN: Dark Ops Dashboard — full-viewport hero.
   Restrained palette: white + blue→purple gradient accent.
   Staggered entrance (name → title → desc → CTAs → stats).
   ============================================================ */
import { EASE } from "@/lib/motion";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ServerCog, BadgeCheck, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import HeroMesh from "./HeroMesh";
import { CONTACT } from "@/data/contact";
import { useHeavyEffects } from "@/hooks/useHeavyEffects";

const roles = [
  "DevOps Engineer",
  "OpenShift Administrator",
  "CI/CD Pipeline Builder",
  "Cloud Automation Enthusiast",
];

function TypingText() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = roles[roleIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60);
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setRoleIdx((i) => (i + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, roleIdx]);

  return (
    <span className="accent-text" style={{ fontSize: "clamp(1.2rem, 2vw, 1.8rem)" }}>
      {displayed}
      <span className="animate-pulse" style={{ WebkitTextFillColor: "var(--accent-2)" }}>|</span>
    </span>
  );
}

/* Credentials, not self-reported metrics. Every line here is
   something a recruiter can independently verify. */
const credentials = [
  {
    icon: ServerCog,
    value: "2+",
    label: "Years running production OpenShift",
  },
  {
    icon: BadgeCheck,
    value: "RHCSA",
    label: "Red Hat Certified System Administrator",
  },
  {
    icon: GraduationCap,
    value: "M.S.",
    label: "Computer Science, in progress — NJIT",
  },
];

// Shared stagger config so children animate individually, not all at once.
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export default function HeroSection() {
  const heavyEffects = useHeavyEffects();

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-var(--nav-height))] flex flex-col justify-center scanlines"
      style={{ paddingTop: "clamp(4rem, 6vh, 6rem)", paddingBottom: "clamp(2rem, 3vh, 3rem)" }}
    >
      {/* Radial glow — blue/purple only */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)]" />

      {/* Service-mesh traces with traveling packet pulses — desktop only */}
      {heavyEffects && <HeroMesh />}

      <div className="relative z-10 container mx-auto">
        {/* Staggered story */}
        <motion.div
          className="max-w-4xl text-center lg:text-left w-full mx-auto lg:mx-0"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            variants={item}
            className="font-bold leading-[1.1] mb-4"
            style={{ fontFamily: "Syne, sans-serif", color: "#ffffff", fontSize: "clamp(2rem, 4.5vw, 3.75rem)", letterSpacing: "-0.02em" }}
          >
            Making deployments boring, in the best way.
          </motion.h1>

          <motion.p
            variants={item}
            className="font-semibold mb-4 typing-line"
            style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)" }}
          >
            <TypingText />
          </motion.p>

          <motion.p
            variants={item}
            className="mb-7 mx-auto lg:mx-0"
            style={{
              color: "#cbd5e1",
              maxWidth: "36rem",
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(1rem, 1.15vw, 1.1rem)",
              lineHeight: 1.65,
            }}
          >
            I build reliable cloud infrastructure with OpenShift, Kubernetes, Docker,
            Terraform, and CI/CD pipelines — creating scalable, automatable deployment
            systems engineers can trust.
          </motion.p>

          {/* CTAs — grid so they size equally and never overlap; stack < 480px */}
          <motion.div
            variants={item}
            className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-8 max-w-md mx-auto lg:mx-0"
          >
            <a
              href={CONTACT.mailto}
              className="btn-glow fluid-btn rounded-lg text-white font-semibold tracking-wide inline-flex items-center justify-center w-full card-lift"
              style={{
                background: "var(--accent-gradient)",
                boxShadow: "0 0 28px rgba(59, 130, 246, 0.4)",
                fontFamily: "Syne, sans-serif",
              }}
            >
              Get In Touch
            </a>
            <Link
              href="/projects"
              className="btn-glow fluid-btn rounded-lg font-semibold tracking-wide inline-flex items-center justify-center gap-2 w-full group accent-border card-lift"
              style={{
                fontFamily: "Syne, sans-serif",
                color: "#c7d2fe",
                background: "rgba(99,102,241,0.06)",
              }}
            >
              <span>View Work</span>
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </motion.div>

          {/* Credentials */}
          <motion.div variants={item} className="flex gap-7 sm:gap-9 justify-center lg:justify-start flex-wrap">
            {credentials.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center lg:text-left" style={{ maxWidth: "15rem" }}>
                <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                  <Icon className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent-1)" }} />
                  <span
                    className="font-bold text-foreground"
                    style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(1.35rem, 2vw, 1.85rem)" }}
                  >
                    {value}
                  </span>
                </div>
                <p
                  className="fluid-xs mt-1 uppercase"
                  style={{ color: "var(--muted-foreground)", letterSpacing: "0.08em", lineHeight: 1.5 }}
                >
                  {label}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
