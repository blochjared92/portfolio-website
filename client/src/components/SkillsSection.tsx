/* ============================================================
   DESIGN: Dark Ops Dashboard — Skills & Toolchain
   Tag-pill grid grouped by category, each skill shows its brand
   icon (via Simple Icons CDN). Spotlight cards + hover reactions.
   ============================================================ */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Cloud } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { EASE } from "@/lib/motion";

/* Map each skill to a Simple Icons slug + brand hex.
   Icons are served as SVGs from cdn.simpleicons.org.
   Tools without a distinct brand icon fall back to a generic dot. */
type Skill = { name: string; slug?: string; hex?: string; cloud?: boolean };

const skillCategories: { label: string; skills: Skill[] }[] = [
  {
    label: "Container Orchestration",
    skills: [
      { name: "OpenShift", slug: "redhatopenshift", hex: "EE0000" },
      { name: "Kubernetes", slug: "kubernetes", hex: "326CE5" },
      { name: "Docker", slug: "docker", hex: "2496ED" },
      { name: "Helm", slug: "helm", hex: "0F1689" },
      { name: "Podman", slug: "podman", hex: "892CA0" },
    ],
  },
  {
    label: "CI/CD & Automation",
    skills: [
      { name: "GitHub Actions", slug: "githubactions", hex: "2088FF" },
      { name: "Jenkins", slug: "jenkins", hex: "D24939" },
      { name: "ArgoCD", slug: "argo", hex: "EF7B4D" },
      { name: "Ansible", slug: "ansible", hex: "EE0000" },
    ],
  },
  {
    label: "Infrastructure as Code",
    skills: [
      { name: "Terraform", slug: "terraform", hex: "7B42BC" },
      { name: "CloudFormation", cloud: true },
      { name: "Kustomize", slug: "kubernetes", hex: "326CE5" },
      { name: "YAML", slug: "yaml", hex: "CB171E" },
    ],
  },
  {
    label: "Monitoring & Observability",
    skills: [
      { name: "Prometheus", slug: "prometheus", hex: "E6522C" },
      { name: "Grafana", slug: "grafana", hex: "F46800" },
      { name: "ELK Stack", slug: "elastic", hex: "005571" },
      { name: "Jaeger", slug: "jaeger", hex: "66CFE3" },
      { name: "AlertManager", slug: "prometheus", hex: "E6522C" },
    ],
  },
  {
    label: "Cloud Platforms",
    skills: [
      { name: "AWS", cloud: true },
      { name: "Azure", cloud: true },
      { name: "GCP", slug: "googlecloud", hex: "4285F4" },
    ],
  },
  {
    label: "Programming & Scripting",
    skills: [
      { name: "Python", slug: "python", hex: "3776AB" },
      { name: "Bash", slug: "gnubash", hex: "4EAA25" },
      { name: "Go", slug: "go", hex: "00ADD8" },
      { name: "JavaScript", slug: "javascript", hex: "F7DF1E" },
      { name: "Java/Kotlin", slug: "kotlin", hex: "7F52FF" },
    ],
  },
];

function SkillPill({ skill }: { skill: Skill }) {
  return (
    <span
      className="skill-pill inline-flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-sm font-medium"
      style={{
        color: "var(--foreground)",
        borderColor: "rgba(var(--accent-1-rgb),0.28)",
        background: "rgba(var(--accent-1-rgb),0.06)",
        fontFamily: "Fira Code, monospace",
      }}
    >
      {skill.slug ? (
        <img
          src={`https://cdn.simpleicons.org/${skill.slug}/${skill.hex}`}
          alt=""
          aria-hidden="true"
          width={16}
          height={16}
          loading="lazy"
          className="w-4 h-4 flex-shrink-0"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      ) : skill.cloud ? (
        <Cloud className="w-4 h-4 flex-shrink-0" style={{ color: "var(--accent-1)" }} />
      ) : (
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--accent-1)" }} />
      )}
      {skill.name}
    </span>
  );
}

export default function SkillsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="relative fluid-section overflow-hidden">
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04] bg-blue-500 blur-[100px] pointer-events-none" />

      <div ref={ref} className="container mx-auto">
        {/* Section header */}
        <SectionHeading index="02" label="SKILLS" title="Skills &amp; Toolchain" />

        {/* Category grid */}
        <div className="grid md:grid-cols-2 gap-[clamp(1rem,2vw,1.5rem)]">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.label}
              className="spotlight rounded-xl p-[clamp(1rem,1.5vw,1.5rem)] border bg-secondary/30 backdrop-blur-sm"
              style={{ borderColor: "var(--border)" }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
            >
              <h3
                className="fluid-h4 font-bold mb-[clamp(0.75rem,1vw,1rem)] accent-text inline-block"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                {cat.label}
              </h3>
              <div className="flex flex-wrap gap-[clamp(0.5rem,1vw,0.75rem)]">
                {cat.skills.map((skill) => (
                  <SkillPill key={skill.name} skill={skill} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
