/* ============================================================
   DESIGN: terminal status-bar header.
   - Left: a shell-prompt path ("~/jared-bloch") standing in for
     the logo/home link.
   - Right: nav "tabs" with a sliding underline that animates
     between the active route (framer-motion layoutId).
   - Always visible — no hide-on-scroll. Only gains a blurred
     background once the page has scrolled past the top.
   - Collapses to a hamburger + slide-in drawer under 768px.
   ============================================================ */
import { EASE } from "@/lib/motion";
import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { url: "/about", name: "About" },
  { url: "/projects", name: "Projects" },
];

export default function Header() {
  const [location] = useLocation();
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolledToTop(window.pageYOffset < 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the drawer on Escape, on resize past breakpoint, and lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const onResize = () => window.innerWidth > 768 && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Close drawer whenever the route changes.
  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (url: string) =>
    url === "/projects"
      ? location === "/projects" || location.startsWith("/project")
      : location === url;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: "var(--nav-height)",
        background: scrolledToTop ? "transparent" : "color-mix(in srgb, var(--background) 88%, transparent)",
        backdropFilter: scrolledToTop ? "none" : "blur(10px)",
        WebkitBackdropFilter: scrolledToTop ? "none" : "blur(10px)",
        borderBottom: scrolledToTop ? "1px solid transparent" : "1px solid var(--border)",
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      <nav className="container mx-auto h-full flex items-center justify-between gap-4">
        {/* Prompt / home link */}
        <Link href="/" aria-label="home" className="group inline-flex items-center gap-3 min-w-0">
          <span
            className="truncate transition-colors duration-200 group-hover:text-foreground"
            style={{ fontFamily: "Fira Code, monospace", fontSize: "clamp(0.9rem, 1.4vw, 1.05rem)", color: "var(--muted-foreground)" }}
          >
            <span style={{ color: "var(--accent-1)" }}>~</span>/jared-bloch
          </span>
        </Link>

        {/* Desktop tabs */}
        <div className="hidden md:flex items-center gap-1">
          <ul className="relative flex items-center gap-1">
            {navLinks.map(({ url, name }) => (
              <li key={url} className="relative">
                <Link
                  href={url}
                  className="relative inline-flex px-3 py-2 text-sm transition-colors duration-200"
                  style={{ fontFamily: "Fira Code, monospace", color: isActive(url) ? "var(--foreground)" : "var(--muted-foreground)" }}
                >
                  {name}
                </Link>
                {isActive(url) && (
                  <motion.span
                    layoutId="nav-tab-underline"
                    className="absolute left-3 right-3 -bottom-0.5 h-[2px] rounded-full"
                    style={{ background: "var(--accent-gradient-h)" }}
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                )}
              </li>
            ))}
          </ul>
          <a
            href="/resume-jared-bloch.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold card-lift accent-border"
            style={{ fontFamily: "Fira Code, monospace", color: "#c7d2fe", background: "rgba(99,102,241,0.06)" }}
          >
            Resume
          </a>
        </div>

        {/* Hamburger (mobile) */}
        <button
          className="md:hidden relative z-[60] w-10 h-10 flex items-center justify-center flex-shrink-0"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span className="relative block w-6 h-4">
            <span
              className="absolute left-0 h-0.5 w-6 rounded-full transition-all duration-200"
              style={{ background: "var(--accent-2)", top: menuOpen ? "50%" : "0", transform: menuOpen ? "translateY(-50%) rotate(45deg)" : "none" }}
            />
            <span
              className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-6 rounded-full transition-all duration-200"
              style={{ background: "var(--accent-2)", opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="absolute left-0 h-0.5 w-6 rounded-full transition-all duration-200"
              style={{ background: "var(--accent-2)", bottom: menuOpen ? "50%" : "0", transform: menuOpen ? "translateY(50%) rotate(-45deg)" : "none" }}
            />
          </span>
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              ref={drawerRef}
              className="fixed left-0 right-0 z-40 flex flex-col items-center gap-6 py-8 md:hidden overflow-hidden"
              style={{
                top: "var(--nav-height)",
                background: "color-mix(in srgb, var(--card) 97%, transparent)",
                borderBottom: "1px solid var(--border)",
                boxShadow: "0 20px 40px -16px rgba(0,0,0,0.6)",
              }}
              initial={{ y: "-110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-110%", opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <ul className="flex flex-col items-center gap-6 w-full">
                {navLinks.map(({ url, name }, i) => (
                  <motion.li
                    key={url}
                    className="text-center"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.3, ease: EASE }}
                  >
                    <Link
                      href={url}
                      className="text-lg transition-colors duration-200"
                      style={{ fontFamily: "Fira Code, monospace", color: isActive(url) ? "var(--foreground)" : "var(--muted-foreground)" }}
                      onClick={() => setMenuOpen(false)}
                    >
                      {name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.a
                href="/resume-jared-bloch.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg px-8 py-3 font-semibold card-lift accent-border"
                style={{ fontFamily: "Fira Code, monospace", color: "#c7d2fe", background: "rgba(99,102,241,0.06)" }}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + navLinks.length * 0.06, duration: 0.3, ease: EASE }}
              >
                Resume
              </motion.a>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
