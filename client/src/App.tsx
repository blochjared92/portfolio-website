import { useState, useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Spinner } from "@/components/ui/spinner";
import { Route, Switch, Redirect, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
// Home stays eager — it's what most visitors land on first, and there's
// no benefit to a Suspense flash on the single most common page. Every
// other route lazy-loads its own chunk on first visit instead of
// shipping in the one JS bundle everyone downloads up front.
import Home from "./pages/Home";
import ParticleField from "./components/ParticleField";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import SpotlightTracker from "./components/SpotlightTracker";
import { AudioProvider } from "./components/AudioController";
import { useHeavyEffects } from "./hooks/useHeavyEffects";

const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ProjectDetail = lazy(() => import("./components/ProjectDetail"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const Writing = lazy(() => import("./pages/Writing"));
const WritingPost = lazy(() => import("./pages/WritingPost"));

function RouteFallback() {
  return (
    <div className="flex-1 flex items-center justify-center" style={{ minHeight: "60vh" }}>
      <Spinner className="size-6" style={{ color: "var(--accent-1)" }} />
    </div>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    // Don't force-scroll to top when navigating to an in-page anchor.
    if (window.location.hash) return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location]);
  return null;
}

/* Drives the starfield parallax (far layer — slower than the particle
   canvas) via a CSS variable. Disabled for reduced-motion users. */
function StarParallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    const update = () => {
      document.documentElement.style.setProperty("--star-parallax", `${window.scrollY * 0.04}px`);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}

function Router() {
  const [location] = useLocation();
  return (
    <Switch location={location}>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/project/:id" component={ProjectDetail} />
      <Route path="/projects" component={ProjectsPage} />
      <Route path="/writing/:slug" component={WritingPost} />
      <Route path="/writing" component={Writing} />
      {/* Redirect legacy routes to their new homes */}
      <Route path="/personal"><Redirect to="/about" /></Route>
      <Route path="/about-site"><Redirect to="/about" /></Route>
      <Route path="/resume"><Redirect to="/about" /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Decorative canvas layers are skipped on phones / low-power devices.
  const heavyEffects = useHeavyEffects();

  // Show the welcome loader only on the very first load of the session.
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("jb_loaded");
  });

  const finishLoading = () => {
    sessionStorage.setItem("jb_loaded", "1");
    setLoading(false);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable={false}>
        <TooltipProvider>
          <AudioProvider>
            <Toaster />
            <SpotlightTracker />
            {loading && <Loader onFinish={finishLoading} />}
            <div className="min-h-screen relative flex flex-col">
              {/* Particle background — desktop / capable devices only */}
              {heavyEffects && (
                <div className="fixed inset-0 pointer-events-none z-0">
                  <ParticleField count={50} />
                </div>
              )}

              <ScrollToTop />
              <StarParallax />
              <Header />

              {/* Content */}
              <div className="relative z-10 flex-1 flex flex-col">
                <Suspense fallback={<RouteFallback />}>
                  <Router />
                </Suspense>
              </div>
              <Footer />
            </div>
          </AudioProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
