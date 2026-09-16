/* ============================================================
   Homepage — Hero + short intro + skills teaser + featured
   projects. Experience & Contact live on their own pages now.
   Palette: white + blue→purple gradient.
   ============================================================ */
import { EASE } from "@/lib/motion";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Award, ExternalLink, Mail, Github, Linkedin } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import SkillsSection from "@/components/SkillsSection";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/projects";
import { CONTACT } from "@/data/contact";

const PROFILE_IMG = "/Israel_pic.webp";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: EASE },
  }),
};

export default function Home() {
  const featured = projects.slice(0, 3);

  return (
    <div className="min-h-screen relative">
      <HeroSection />

      {/* Short intro band — text + portrait side by side */}
      <section id="intro" className="relative fluid-section-sm overflow-hidden">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center gap-[clamp(2rem,4vw,4rem)]">
            {/* Text */}
            <motion.div
              className="flex-1 order-last lg:order-first"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <p className="accent-text mb-3 text-sm tracking-[0.2em] uppercase" style={{ fontFamily: "Fira Code, monospace" }}>
                Hello
              </p>
              <p className="fluid-h4 text-foreground mb-4" style={{ fontFamily: "Syne, sans-serif", fontWeight: 600 }}>
                Hello! I'm a DevOps engineer and OpenShift administrator who likes making deployments boring, in the best way.
              </p>
              <p className="fluid-body text-muted-foreground mb-6">
                I've worked across the full deployment lifecycle: writing Dockerfiles and Helm
                charts, managing OpenShift clusters, and wiring up CI/CD pipelines that developers
                never have to think about.
              </p>
              <Link href="/about" className="link-anim inline-flex items-center gap-2 text-sm" style={{ fontFamily: "Fira Code, monospace" }}>
                More about me <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Portrait */}
            <motion.div
              className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-end order-first lg:order-last"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
              viewport={{ once: true, margin: "-80px" }}
            >
              <div className="relative" style={{ width: "clamp(200px, 26vw, 320px)" }}>
                <div className="absolute -inset-3 rounded-3xl blur-2xl opacity-50" style={{ background: "var(--accent-gradient)" }} />
                <div
                  className="relative rounded-3xl p-1.5 overflow-hidden"
                  style={{ aspectRatio: "1 / 1", background: "var(--accent-gradient)", boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)" }}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden" style={{ background: "rgba(15,23,42,0.5)" }}>
                    <img
                      src={PROFILE_IMG}
                      alt="Jared Bloch"
                      className="w-full h-full rounded-2xl"
                      style={{ objectFit: "cover", opacity: 0.9, filter: "saturate(0.95) brightness(0.95)" }}
                    />
                    <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: "linear-gradient(160deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))" }} />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills teaser */}
      <SkillsSection />

      {/* Featured projects teaser */}
      <section id="featured" className="relative fluid-section overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04] blur-[120px] pointer-events-none" style={{ background: "var(--accent-1)" }} />

        <div className="container mx-auto">
          <SectionHeading
            index="03"
            label="PROJECTS"
            title="Featured Work"
            action={
              <Link
                href="/projects"
                className="fluid-btn rounded-lg font-semibold card-lift accent-border inline-flex items-center gap-2"
                style={{ fontFamily: "Fira Code, monospace", color: "#c7d2fe", background: "rgba(99,102,241,0.06)" }}
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(1.25rem,2.5vw,2rem)]">
            {featured.map((project, idx) => (
              <motion.div
                key={project.id}
                custom={idx}
                variants={reveal}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
              >
                <Link href={`/project/${project.id}`} className="block group h-full">
                  <article
                    className="spotlight flex flex-col h-full rounded-xl overflow-hidden border"
                    style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--card) 70%, transparent)" }}
                  >
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
                      <h3 className="title-hover fluid-h4 font-bold text-foreground mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                        {project.title}
                      </h3>
                      <p className="fluid-small text-muted-foreground mb-4">{project.subtitle}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="px-2.5 py-1 rounded-full text-xs border text-muted-foreground" style={{ borderColor: "var(--border)", fontFamily: "Fira Code, monospace" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium mt-auto" style={{ fontFamily: "Fira Code, monospace", color: project.accent }}>
                        View Details <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="relative fluid-section overflow-hidden">
        <div className="container mx-auto">
          <SectionHeading index="04" label="CERTIFICATIONS" title="Certifications" />
          <div className="max-w-3xl">
            <motion.a
              href={CONTACT.credly}
              target="_blank"
              rel="noopener noreferrer"
              className="spotlight group flex items-center gap-5 rounded-xl p-[clamp(1.25rem,1.8vw,1.75rem)] border w-full"
              style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--card) 65%, transparent)" }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              viewport={{ once: true, margin: "-40px" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--accent-gradient)", boxShadow: "0 4px 18px rgba(99,102,241,0.35)" }}
              >
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="title-hover fluid-h4 font-bold text-foreground" style={{ fontFamily: "Syne, sans-serif" }}>
                    RHCSA
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="fluid-small text-muted-foreground">
                  Red Hat Certified System Administrator
                </p>
                <p className="mt-2 text-xs" style={{ fontFamily: "Fira Code, monospace", color: "var(--accent-1)" }}>
                  Red Hat
                </p>
              </div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* Closing contact band — the homepage now ends with an ask, not a list */}
      <section id="contact" className="relative fluid-section overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)" }}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full opacity-[0.05] blur-[120px] pointer-events-none" style={{ background: "var(--accent-2)" }} />

        <div className="container mx-auto">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            viewport={{ once: true, margin: "-60px" }}
          >
            <p className="accent-text mb-3 text-sm tracking-[0.2em] uppercase" style={{ fontFamily: "Fira Code, monospace" }}>
              05. Contact
            </p>
            <h2 className="fluid-h2 font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
              Let's make your deployments boring.
            </h2>
            <p className="fluid-body text-muted-foreground mb-8">
              I'm looking for cloud infrastructure and platform engineering roles. If your team
              ships often and wants the pipeline to be the least interesting part of the day,
              I'd like to hear about it.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={CONTACT.mailto}
                className="btn-glow fluid-btn rounded-lg font-semibold inline-flex items-center gap-2 text-white card-lift"
                style={{ background: "var(--accent-gradient)", fontFamily: "Syne, sans-serif", boxShadow: "0 0 28px rgba(99,102,241,0.4)" }}
              >
                <Mail className="w-4 h-4" /> Get In Touch
              </a>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border card-lift accent-border"
                style={{ background: "rgba(99,102,241,0.05)", fontFamily: "Fira Code, monospace", color: "#c7d2fe" }}
              >
                <Github className="w-4 h-4" /> <span className="text-sm">GitHub</span>
              </a>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border card-lift accent-border"
                style={{ background: "rgba(99,102,241,0.05)", fontFamily: "Fira Code, monospace", color: "#c7d2fe" }}
              >
                <Linkedin className="w-4 h-4" /> <span className="text-sm">LinkedIn</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
