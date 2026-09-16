/* ============================================================
   /project/:id — individual project case-study page.
   Problem → solution narrative, metrics, challenges, and impact.
   Prev/next navigation between projects. Blue → purple palette.
   ============================================================ */
import { EASE } from "@/lib/motion";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useParams, Link } from "wouter";
import { projects, getProject } from "@/data/projects";
import { ArrowLeft, ArrowRight, Github, ExternalLink, CheckCircle2, Circle, Zap, Compass, Info } from "lucide-react";
import NotFound from "@/pages/NotFound";
import CountUp from "@/components/CountUp";

const section = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE },
  }),
};

/* Challenges list with a left "pipeline" border that fills top-to-bottom
   tied to scroll progress through the section — like a stage executing. */
function ChallengesSection({
  challenges,
  accent,
  title = "Challenges & Solutions",
}: {
  challenges: { challenge: string; solution: string }[];
  accent: string;
  title?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.section
      custom={5}
      variants={section}
      initial="hidden"
      animate="show"
      className="mb-[clamp(2.5rem,4vw,3.5rem)]"
    >
      <h2 className="fluid-h3 font-bold mb-5" style={{ fontFamily: "Syne, sans-serif" }}>{title}</h2>
      <div ref={ref} className="relative pl-4">
        {/* Track */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full" style={{ background: `${accent}22` }} />
        {/* Progress fill */}
        <motion.div
          className="absolute left-0 top-0 w-[2px] rounded-full"
          style={{ height, background: `linear-gradient(180deg, ${accent}, ${accent}66)`, boxShadow: `0 0 8px ${accent}88` }}
        />
        <div className="space-y-5">
          {challenges.map((c, i) => (
            <div key={i}>
              <p className="fluid-small font-semibold text-foreground mb-1">{c.challenge}</p>
              <p className="fluid-small" style={{ color: "var(--muted-foreground)" }}>{c.solution}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = id ? getProject(id) : undefined;
  const prevIndexRef = useRef<number>(-1);

  // Scroll to top whenever the project changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [id]);

  // Real 404 for unknown ids instead of silently showing the wrong project.
  if (!project) return <NotFound />;

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  // Direction: +1 if we moved to a later project, -1 if earlier.
  const direction = prevIndexRef.current === -1 ? 0 : Math.sign(currentIndex - prevIndexRef.current);
  prevIndexRef.current = currentIndex;

  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const offset = reduce ? 0 : 60;

  return (
    <div className="min-h-screen text-foreground overflow-x-clip">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={project.id}
          custom={direction}
          initial={{ opacity: 0, x: direction * offset }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction * -offset }}
          transition={{ duration: 0.32, ease: EASE }}
        >
          <ProjectContent project={project} currentIndex={currentIndex} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ProjectContent({
  project,
  currentIndex,
}: {
  project: NonNullable<ReturnType<typeof getProject>>;
  currentIndex: number;
}) {
  const prev = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const next = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;
  const accent = project.accent;
  const isConcept = project.status === "concept";

  return (
    <div className="container mx-auto" style={{ paddingTop: "calc(var(--nav-height) + clamp(1rem,3vw,2rem))", paddingBottom: "clamp(4rem,8vw,7rem)" }}>
        {/* Back link */}
        <Link
          href="/projects"
          className="link-anim inline-flex items-center gap-2 mb-8 text-sm"
          style={{ fontFamily: "Fira Code, monospace" }}
        >
          <ArrowLeft className="w-4 h-4" /> All Projects
        </Link>

        {/* Header */}
        <motion.header custom={0} variants={section} initial="hidden" animate="show" className="max-w-3xl">
          <p className="mb-2 text-sm tracking-[0.2em] uppercase" style={{ fontFamily: "Fira Code, monospace", color: isConcept ? "#fbbf24" : accent }}>
            {isConcept ? "Concept — Planned" : "Case Study"}
          </p>
          <h1 className="fluid-h1 font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>
            {project.title}
          </h1>
          <p className="fluid-body-lg text-muted-foreground">{project.subtitle}</p>

          {isConcept && (
            <div
              className="flex items-start gap-3 rounded-lg p-4 border mt-5"
              style={{ borderColor: "rgba(251,191,36,0.35)", background: "rgba(251,191,36,0.06)" }}
            >
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#fbbf24" }} />
              <p className="fluid-small" style={{ color: "var(--foreground)" }}>
                This hasn't been built yet. Everything below is the plan and the technical
                decisions I'd make — not a claim of finished, shipped work.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3 mt-6">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm card-lift accent-border"
                style={{ fontFamily: "Fira Code, monospace", color: "#c7d2fe", background: "rgba(99,102,241,0.06)" }}>
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-white card-lift"
                style={{ fontFamily: "Fira Code, monospace", background: "var(--accent-gradient)" }}>
                <ExternalLink className="w-4 h-4" /> Live Demo
              </a>
            )}
          </div>
        </motion.header>

        {/* Hero image */}
        {project.image && (
          <motion.div custom={1} variants={section} initial="hidden" animate="show" className="my-[clamp(2rem,4vw,3.5rem)]">
            <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
              <img src={project.image} alt={project.title} className="w-full" style={{ aspectRatio: "16 / 9", objectFit: "cover" }} />
            </div>
          </motion.div>
        )}

        <div className="max-w-3xl">
          {/* Overview */}
          <motion.section custom={2} variants={section} initial="hidden" animate="show" className="mb-[clamp(2.5rem,4vw,3.5rem)]">
            <p className="fluid-body leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {project.description}
            </p>
          </motion.section>

          {/* Metrics */}
          <motion.section custom={3} variants={section} initial="hidden" animate="show" className="mb-[clamp(2.5rem,4vw,3.5rem)]">
            <div className="grid grid-cols-3 gap-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="rounded-lg p-4 text-center border" style={{ borderColor: "var(--border)", background: `${accent}0a` }}>
                  <div className="fluid-h3 font-bold mb-1" style={{ fontFamily: "Syne, sans-serif", color: accent }}>
                    <CountUp value={m.value} />
                  </div>
                  <div className="fluid-xs" style={{ color: "var(--muted-foreground)" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Key features (or, for a concept project, the planned approach) */}
          <motion.section custom={4} variants={section} initial="hidden" animate="show" className="mb-[clamp(2.5rem,4vw,3.5rem)]">
            <h2 className="fluid-h3 font-bold mb-5" style={{ fontFamily: "Syne, sans-serif" }}>
              {isConcept ? "Planned Approach" : "Key Features"}
            </h2>
            <ul className="space-y-3">
              {project.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  {isConcept ? (
                    <Circle className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: accent }} />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: accent }} />
                  )}
                  <span className="fluid-small" style={{ color: "var(--muted-foreground)" }}>{h}</span>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Challenges & solutions (or, for a concept project, open questions) */}
          {project.challenges && project.challenges.length > 0 && (
            <ChallengesSection
              challenges={project.challenges}
              accent={accent}
              title={isConcept ? "Open Questions I'm Still Working Through" : "Challenges & Solutions"}
            />
          )}

          {/* Impact (or, for a concept project, why it's on the list) */}
          {project.impact && (
            <motion.section custom={6} variants={section} initial="hidden" animate="show" className="mb-[clamp(2.5rem,4vw,3.5rem)]">
              <div className="flex items-center gap-3 rounded-lg p-4 border" style={{ borderColor: `${accent}30`, background: `${accent}0a` }}>
                {isConcept ? (
                  <Compass className="w-5 h-5 flex-shrink-0" style={{ color: accent }} />
                ) : (
                  <Zap className="w-5 h-5 flex-shrink-0" style={{ color: accent }} />
                )}
                <span className="fluid-small font-medium" style={{ color: "var(--foreground)" }}>{project.impact}</span>
              </div>
            </motion.section>
          )}

          {/* Tech tags */}
          <motion.section custom={7} variants={section} initial="hidden" animate="show" className="mb-[clamp(2.5rem,4vw,3.5rem)]">
            <h2 className="fluid-h4 font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>Built With</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-full text-xs border text-muted-foreground"
                  style={{ borderColor: "var(--border)", fontFamily: "Fira Code, monospace" }}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Prev / next */}
        <div className="flex items-stretch justify-between gap-4 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
          {prev ? (
            <Link href={`/project/${prev.id}`} className="group flex items-center gap-3 spotlight rounded-lg p-4 border flex-1 max-w-[48%]" style={{ borderColor: "var(--border)" }}>
              <ArrowLeft className="w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Previous</div>
                <div className="fluid-xs font-medium text-foreground truncate" style={{ fontFamily: "Fira Code, monospace" }}>{prev.title}</div>
              </div>
            </Link>
          ) : <div className="flex-1 max-w-[48%]" />}

          {next ? (
            <Link href={`/project/${next.id}`} className="group flex items-center justify-end gap-3 spotlight rounded-lg p-4 border flex-1 max-w-[48%] text-right" style={{ borderColor: "var(--border)" }}>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Next</div>
                <div className="fluid-xs font-medium text-foreground truncate" style={{ fontFamily: "Fira Code, monospace" }}>{next.title}</div>
              </div>
              <ArrowRight className="w-4 h-4 flex-shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          ) : <div className="flex-1 max-w-[48%]" />}
        </div>
    </div>
  );
}
