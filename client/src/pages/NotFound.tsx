import { Link } from "wouter";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import { EASE } from "@/lib/motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4" style={{ paddingTop: "var(--nav-height)" }}>
      <motion.div
        className="text-center max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <p className="accent-text font-bold mb-4" style={{ fontFamily: "Syne, sans-serif", fontSize: "clamp(4rem, 12vw, 7rem)", lineHeight: 1 }}>
          404
        </p>
        <h1 className="fluid-h3 font-bold text-foreground mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
          Page Not Found
        </h1>
        <p className="fluid-body text-muted-foreground mb-8">
          The page you're looking for doesn't exist — it may have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="fluid-btn rounded-lg text-white font-semibold inline-flex items-center justify-center gap-2 card-lift"
            style={{ background: "var(--accent-gradient)", fontFamily: "Syne, sans-serif" }}
          >
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link
            href="/projects"
            className="fluid-btn rounded-lg font-semibold inline-flex items-center justify-center gap-2 card-lift accent-border"
            style={{ color: "#c7d2fe", background: "rgba(99,102,241,0.06)", fontFamily: "Fira Code, monospace" }}
          >
            <ArrowLeft className="w-4 h-4" /> View Projects
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
