/* ============================================================
   /projects — "Some Things I've Built"
   Responsive grid of project cards. Each card links to its own
   detail page. On narrow widths the layout collapses to a single
   column with the description stacked on top of the card body.
   Palette: blue → purple only.
   ============================================================ */
import { EASE } from "@/lib/motion";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Github, ExternalLink } from "lucide-react";
import { projects } from "@/data/projects";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen text-foreground">
      <div className="container mx-auto" style={{ paddingTop: "calc(var(--nav-height) + clamp(1rem,3vw,2.5rem))", paddingBottom: "clamp(4rem,8vw,7rem)" }}>
        {/* Page header */}
        <motion.div
          className="mb-[clamp(2.5rem,5vw,4rem)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="accent-text mb-2 text-sm tracking-[0.2em] uppercase" style={{ fontFamily: "Fira Code, monospace" }}>
            Projects
          </p>
          <h1 className="fluid-h1 font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
            Some Things I've Built
          </h1>
          <div className="accent-underline mt-4" />
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(1.25rem,2.5vw,2rem)]"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: (typeof projects)[0] }) {
  return (
    <Link href={`/project/${project.id}`} className="block group h-full">
      <article
        className="spotlight relative flex flex-col h-full rounded-xl overflow-hidden border"
        style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--card) 70%, transparent)" }}
      >
        {/* Accent "build kicking off" line across the top border on hover */}
        <span
          className="pointer-events-none absolute top-0 left-0 h-[2px] w-full z-[3] overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="block h-full w-full origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
            style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }}
          />
        </span>

        {/* Image (only when present) */}
        {project.image && (
          <div className="w-full overflow-hidden bg-background flex-shrink-0" style={{ aspectRatio: "16 / 9" }}>
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform ease-out group-hover:scale-[1.05]"
              style={{ transitionDuration: "var(--dur-slow)" }}
            />
          </div>
        )}

        <div className="flex-1 flex flex-col p-[clamp(1.25rem,1.8vw,1.5rem)]">
          {project.status === "concept" && (
            <span
              className="self-start mb-3 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border"
              style={{ fontFamily: "Fira Code, monospace", color: "#fbbf24", borderColor: "rgba(251,191,36,0.4)", background: "rgba(251,191,36,0.08)" }}
            >
              Concept · Planned
            </span>
          )}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h2 className="title-hover fluid-h4 font-bold text-foreground" style={{ fontFamily: "Syne, sans-serif" }}>
              {project.title}
            </h2>
            <div className="flex items-center gap-2 flex-shrink-0 pt-1">
              {project.github && (
                <Github className="w-4 h-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              )}
              {project.demo && (
                <ExternalLink className="w-4 h-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              )}
            </div>
          </div>

          <p className="fluid-small text-muted-foreground mb-4">{project.subtitle}</p>

          <div className="flex flex-wrap gap-2 mb-5">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs border text-muted-foreground"
                style={{ borderColor: "var(--border)", fontFamily: "Fira Code, monospace" }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            className="flex items-center gap-1 text-sm font-medium mt-auto"
            style={{ fontFamily: "Fira Code, monospace", color: project.accent }}
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}
