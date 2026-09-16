/* ============================================================
   Single source of truth for portfolio projects.
   Used by the homepage teaser, /projects, and /project/:id.
   Palette: blue (#3b82f6) / purple (#8b5cf6) only.
   ============================================================ */

// Self-hosted — these used to point at a Manus-platform CDN URL, which is
// fine for a preview session but not something to depend on for a live site.
const OPENSHIFT_IMG = "/openshift-app.webp";
const AUTOMATION_IMG = "/automation-infra.webp";

export interface ProjectMetric {
  label: string;
  value: string;
}
export interface ProjectChallenge {
  challenge: string;
  solution: string;
}
export interface Project {
  id: string;
  accent: string;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  github?: string;
  demo?: string;
  tags: string[];
  highlights: string[];
  metrics: ProjectMetric[];
  challenges?: ProjectChallenge[];
  impact?: string;
  /* "concept" = not yet built. A planned project shown for the technical
     thinking behind it, not as a claim of shipped work. Omit for real,
     shipped projects. See portfolio-website below for the one project on
     this list that's actually real and independently verifiable. */
  status?: "concept";
}

export const projects: Project[] = [
  {
    id: "openshift-app",
    accent: "#3b82f6",
    title: "Flask + React on OpenShift",
    subtitle: "Full-stack app with Kubernetes-native deployment",
    status: "concept",
    description:
      "Not built yet — this is the plan. I want a full-stack case study I can walk through in real depth: a Flask API and React front end, packaged and deployed on Red Hat OpenShift with proper containerization, Helm packaging, and CI/CD, not just infra YAML with no app behind it.",
    image: OPENSHIFT_IMG,
    github: undefined,
    tags: ["OpenShift", "Flask", "React", "Docker", "Helm", "PostgreSQL"],
    highlights: [
      "Multi-stage Docker builds to keep the image lean",
      "Helm chart with environment-specific value overrides",
      "OpenShift Routes with TLS termination",
      "Horizontal Pod Autoscaling based on CPU metrics",
      "Persistent Volume Claims for database storage",
    ],
    metrics: [
      { label: "Status", value: "Planned" },
      { label: "Stack", value: "Flask+React" },
      { label: "Target", value: "OpenShift" },
    ],
    challenges: [
      { challenge: "Image size", solution: "Plan to use multi-stage builds — no before/after numbers yet, since nothing's built" },
      { challenge: "Zero-downtime deploys", solution: "Leaning toward blue-green via OpenShift routes; still weighing it against rolling updates" },
    ],
    impact: "Why it's on the list: I want one project that pairs the app I'm deploying with the infra deploying it, so I can defend both halves in an interview.",
  },
  {
    id: "automation-infra",
    accent: "#8b5cf6",
    title: "Infrastructure Automation Suite",
    subtitle: "Helm charts, Docker pipelines, and GitOps workflows",
    status: "concept",
    description:
      "Not built yet — this is the plan. An automation toolkit for containerized workloads: reusable Helm chart templates, multi-environment pipeline configs, and a GitOps-driven deployment flow, sized to what I'd actually maintain solo rather than a fictional 10-microservice fleet.",
    image: AUTOMATION_IMG,
    // aap-hashi-lab-2 (github.com/blochjared92/aap-hashi-lab-2) is the likely
    // home for this once it's far enough along to link.
    github: undefined,
    tags: ["Helm", "Docker", "GitOps", "Ansible", "Kubernetes", "YAML"],
    highlights: [
      "A small reusable Helm chart library, not a claimed 10+ services",
      "GitOps workflow with drift detection via ArgoCD",
      "Ansible playbooks for environment provisioning",
      "Docker Compose → Kubernetes migration tooling",
      "Secret rotation via Vault integration",
    ],
    metrics: [
      { label: "Status", value: "Planned" },
      { label: "Core Tool", value: "ArgoCD" },
      { label: "Secrets", value: "Vault" },
    ],
    challenges: [
      { challenge: "Environment drift between dev/staging/prod", solution: "Plan to use GitOps with ArgoCD for automated sync — not yet implemented" },
      { challenge: "Manual secret management", solution: "Plan to integrate HashiCorp Vault with Kubernetes secrets" },
    ],
    impact: "Why it's on the list: automation work is easy to overstate. I'd rather ship a small version that's real than a bigger one that isn't.",
  },
  {
    id: "cicd-pipeline",
    accent: "#6366f1",
    title: "CI/CD Pipeline Framework",
    subtitle: "Reusable pipeline templates for multi-team delivery",
    status: "concept",
    description:
      "Not built yet — this is the plan. A modular CI/CD pipeline framework with standardized build, test, security-scan, and deploy stages behind configurable gates, aimed at teams shipping containerized apps.",
    image: "/cicd-pipeline-diagram.svg",
    github: undefined,
    tags: ["GitHub Actions", "Jenkins", "SonarQube", "Trivy", "ArgoCD"],
    highlights: [
      "Reusable GitHub Actions workflow templates",
      "Container image vulnerability scanning via Trivy",
      "Code quality gates with SonarQube",
      "Blue/green deployment strategy support",
      "Slack/Teams notification integration",
    ],
    metrics: [
      { label: "Status", value: "Planned" },
      { label: "Scanner", value: "Trivy" },
      { label: "Gate", value: "SonarQube" },
    ],
    challenges: [
      { challenge: "Slow security scanning in pipeline", solution: "Plan to parallelize scans and cache base images — not yet measured" },
      { challenge: "Inconsistent pipeline quality across teams", solution: "Plan to centralize reusable workflows behind a required template" },
    ],
    impact: "Why it's on the list: I want a template I can point to and say exactly which gate catches which class of problem, not a round percentage.",
  },
  {
    id: "portfolio-website",
    accent: "#8b5cf6",
    title: "This Portfolio Website",
    subtitle: "The site you're looking at — React front end, containerized and self-hosted",
    description:
      "The very site you're browsing. Built as a single-page React application with a component-driven architecture, then containerized and deployed on my own infrastructure. It doubles as a live demonstration of the same DevOps practices I write about — reproducible builds, a clean CI/CD flow, and container-based hosting. It's also where I go to practice reading my own build output instead of trusting it: the numbers below came from actually profiling `vite build`, not a vibe.",
    image: "/portfolio-architecture.svg",
    github: "https://github.com/blochjared92/portfolio-website",
    demo: "/",
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion", "Docker"],
    highlights: [
      "Component-driven React + TypeScript front end built with Vite",
      "Styling with Tailwind CSS and a custom blue→purple design system",
      "Animations and page transitions powered by Framer Motion",
      "Containerized with Docker for reproducible, portable deployments",
      "Self-hosted behind a reverse proxy on my own infrastructure",
      "Fully responsive layout with a persistent terminal-bar header and mobile drawer",
      "Heavy visual effects (particle canvas, mesh background) gated behind matchMedia checks for reduced-motion, small screens, and low core-count devices",
    ],
    // Every number here is reproducible: clone the repo, run `vite build`,
    // read the output. No Lighthouse score is quoted — this machine's Node
    // version couldn't run a real audit, and a made-up score is worse than
    // no score.
    metrics: [
      { label: "Initial JS+CSS (gzip)", value: "173KB" },
      { label: "Image Payload Cut", value: "96%" },
      { label: "Build Time", value: "<3s" },
    ],
    challenges: [
      { challenge: "Keeping the design consistent across many sections", solution: "Centralized design tokens (colors, spacing, motion durations) and a shared component library instead of one-off styles per section" },
      { challenge: "Smooth animations without hurting performance", solution: "GPU-friendly transforms and scroll-triggered reveals via Framer Motion, with a useHeavyEffects() hook that disables particle/mesh canvases on reduced-motion, small screens, and low-core devices" },
      { challenge: "A dev-only tool was shipping to every production page load", solution: "Auditing the build output turned up an unconditional plugin (vite-plugin-manus-runtime, left over from the tool this site was scaffolded with) inlining a ~368KB script into every page. Gated it to dev mode only in vite.config.ts — the built index.html dropped from 368KB to 1.2KB with zero behavior change" },
      { challenge: "A 709KB PNG profile photo", solution: "Re-encoded to WebP with cwebp at the display resolution actually used (never rendered wider than 320px) — 28KB, a 96% reduction, no visible quality loss" },
      { challenge: "Every route's code shipped in one JS bundle", solution: "Route-split with React.lazy() — Home stays eager since it's the most common landing page, everything else (About, Projects, project detail, Writing) loads its own chunk on first visit instead of on every visit" },
    ],
    impact: "Cut this site's built HTML from 368KB to 1.2KB by finding and removing dev-tooling that was silently shipping to production — the kind of bug that only shows up if you actually read your build output",
  },
];

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}
