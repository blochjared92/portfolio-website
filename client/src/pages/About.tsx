/* ============================================================
   /about — the full story: intro, what I do, experience
   timeline, a bit of personality, and contact.
   Palette: white + blue→purple gradient only.
   ============================================================ */
import { EASE } from "@/lib/motion";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import {
  GitCommit, Terminal, Code2, Briefcase, Calendar,
  Github, Linkedin, Mail, Music, Mountain, Dices, ChefHat,
  GraduationCap, ImagePlus,
} from "lucide-react";
import { useEffect } from "react";
import SectionHeading from "@/components/SectionHeading";
import { CONTACT } from "@/data/contact";

const reveal = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.09, ease: EASE },
  }),
};

const principles = [
  { icon: GitCommit, title: "Pipeline-First Mindset", desc: "Every project starts with a CI/CD pipeline design, not an afterthought." },
  { icon: Terminal, title: "Automation Obsessed", desc: "If I do it twice manually, I automate it. Helm, Ansible, shell — whatever it takes." },
  { icon: Code2, title: "Full-Stack Awareness", desc: "React + Flask + PostgreSQL — I understand the apps I deploy, not just the infra." },
];

const experiences = [
  {
    role: "Application Infrastructure Engineer / OpenShift Administrator",
    company: "Auto-Owners Insurance",
    period: "Nov 2024 – Present",
    description:
      "Leading OpenShift platform initiatives to drive operational excellence and developer productivity. Championed observability best practices across teams, strengthened platform security through proactive vulnerability management, and built integrations between OpenShift and enterprise systems.",
    tags: ["OpenShift", "Kubernetes", "Platform Engineering", "Security", "Monitoring"],
    active: true,
  },
  {
    role: "OpenShift Administrator Consultant",
    company: "Brooksource",
    period: "May 2024 – Nov 2024",
    description:
      "Delivered OpenShift cluster implementations focused on stability, performance, and scalability for diverse client environments. Established monitoring strategies, enhanced security posture through standardized configurations, and integrated logging solutions and identity providers.",
    tags: ["OpenShift", "Kubernetes", "Platform Engineering", "Security", "Monitoring"],
    active: false,
  },
  {
    role: "Technology Support Specialist Intern",
    company: "Rocket Central",
    period: "May 2023 – Aug 2023",
    description:
      "Provided technical support to 350+ users across VPN, firewall configurations, and hardware troubleshooting. Leveraged ITSM tools like ServiceNow and Cherwell, and earned a perfect score in the 2023 intern Phishing Derby cybersecurity competition.",
    tags: ["IT Support", "Networking", "Security", "VPN", "Firewall"],
    active: false,
  },
  {
    role: "Undergraduate Learning Assistant",
    company: "Michigan State University",
    period: "Aug 2022 – Apr 2024",
    description:
      "Not something that lines up with what I do day-to-day now, but it's where I really learned that I like taking something confusing and getting good enough at it to teach it. Facilitated Python-based computational modeling for 40+ students in Matrix Algebra (MTH 314) and managed assignments through Jupyter Notebooks. Teaching it turned out to be one of the best ways to actually learn it myself, and watching students go from stuck to confident was genuinely one of my favorite parts of college.",
    tags: ["Teaching", "Python", "Matrix Algebra", "Jupyter"],
    active: false,
  },
];

/* Each item pairs a real interest with one or more polaroid-style photo
   accents. Drop a real photo in at /client/public/about/<file> and set
   `photos[i].src` — until then it renders as an intentional-looking
   empty frame instead of a broken box. `rotate` gives each polaroid its
   own tilt so the section doesn't read as a rigid grid. */
type Photo = { src?: string; caption: string; rotate: number };
type PersonalityItem = {
  icon: typeof Music;
  title: string;
  desc: string;
  photos: Photo[];
};

const personality: PersonalityItem[] = [
  {
    icon: Music,
    title: "Music",
    desc: "Been playing viola for 13 years now, all through college and still going. Spent a few years as president of The Spartan Dischords, MSU's oldest a cappella group — took us to colleges across the country, a handful of collegiate halftime shows, and singing live on air at the Detroit tree lighting in front of thousands.",
    photos: [{ caption: "Spartan Dischords", rotate: -4 }],
  },
  {
    icon: Mountain,
    title: "Staying Active",
    desc: "As much as I love a good project, I need to get outside and move — hiking, pickleball, ultimate frisbee, rock climbing, whatever's on offer. I usually end up losing an hour to whatever forest I'm in, or crouched over some rock formation that caught my eye.",
    photos: [
      { caption: "Climbing", rotate: -6 },
      { caption: "Frisbee", rotate: 5 },
      { caption: "Rock climbing", rotate: -2 },
    ],
  },
  {
    icon: Dices,
    title: "Board & Card Games",
    desc: "Euchre (Michigan rules, obviously), Hearts, Egyptian Rat Screw, Wingspan, Catan, Everdell, Clank — if there's a table and a deck of cards, I'm in. The list keeps growing.",
    photos: [{ caption: "Game night", rotate: 4 }],
  },
  {
    icon: ChefHat,
    title: "Cooking",
    desc: "I treat a recipe as a starting point, not a rulebook — always tinkering with whatever's in the fridge and seeing what happens.",
    photos: [{ caption: "Cooking", rotate: -3 }],
  },
];

const socials = [
  { icon: Github, href: CONTACT.github, label: "GitHub" },
  { icon: Linkedin, href: CONTACT.linkedin, label: "LinkedIn" },
  { icon: Mail, href: CONTACT.mailto, label: "Email" },
];

function PolaroidTile({ photo, width }: { photo: Photo; width: string }) {
  return (
    <div
      className="rounded-[3px] p-2.5 pb-5"
      style={{ width, background: "#f4f2ec", boxShadow: "0 16px 32px -10px rgba(0,0,0,0.6)" }}
    >
      {photo.src ? (
        <img src={photo.src} alt={photo.caption} className="w-full aspect-square object-cover rounded-[2px]" />
      ) : (
        <div
          className="w-full aspect-square rounded-[2px] flex items-center justify-center border border-dashed"
          style={{ background: "#e4e1d8", borderColor: "#b7b3a6" }}
        >
          <ImagePlus className="w-8 h-8" style={{ color: "#8a8677" }} />
        </div>
      )}
      <p
        className="text-center mt-2 truncate"
        style={{ fontFamily: "Fira Code, monospace", fontSize: "12px", color: "#4a473e" }}
      >
        {photo.caption}
      </p>
    </div>
  );
}

export default function About() {
  const [location] = useLocation();

  // Scroll to a target section when arriving with a hash or a pending-scroll
  // signal (set by cross-page CTAs like "Get In Touch").
  useEffect(() => {
    const hash = window.location.hash ? window.location.hash.slice(1) : "";
    const pending = sessionStorage.getItem("jb_scrollTo");
    const id = hash || pending || "";
    if (!id) return;
    sessionStorage.removeItem("jb_scrollTo");

    let count = 0;
    const timers: number[] = [];
    const doScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 16;
        window.scrollTo({ top, behavior: count === 0 ? "auto" : "smooth" });
        count++;
      }
    };
    // Fire a few times to win against the global scroll-to-top / late layout.
    [80, 260, 520, 900, 1400, 2000].forEach((delay) => {
      timers.push(window.setTimeout(doScroll, delay));
    });
    return () => timers.forEach(clearTimeout);
  }, [location]);

  return (
    <div className="min-h-screen text-foreground">
      <div className="container mx-auto" style={{ paddingTop: "calc(var(--nav-height) + clamp(1rem,3vw,2.5rem))", paddingBottom: "clamp(3rem,6vw,5rem)" }}>

        {/* Intro */}
        <motion.header
          className="max-w-3xl mb-[clamp(3rem,6vw,5rem)]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <p className="accent-text mb-3 text-sm tracking-[0.2em] uppercase" style={{ fontFamily: "Fira Code, monospace" }}>
            About Me
          </p>
          <h1 className="fluid-h1 font-bold mb-5" style={{ fontFamily: "Syne, sans-serif" }}>
            Hi, I'm Jared Bloch.
          </h1>
          <p className="fluid-body text-muted-foreground mb-4">
            I'm a DevOps engineer and OpenShift administrator who's gotten hands-on with the
            full deployment lifecycle — from writing Dockerfiles and Helm charts to managing
            OpenShift clusters and wiring up CI/CD pipelines.
          </p>
          <p className="fluid-body text-muted-foreground mb-4">
            I treat infrastructure as code and believe the best DevOps work is the kind
            developers never have to think about. I'm actively learning, building, and looking
            for opportunities where I can keep growing alongside a strong team.
          </p>
          <p className="fluid-body text-muted-foreground">
            Lately I've been getting into building out my own home lab, and I've loved every
            minute of it — there's nothing quite like breaking and fixing your own infrastructure
            to really learn how it works.
          </p>
        </motion.header>

        {/* Education */}
        <section className="mb-[clamp(3.5rem,7vw,6rem)]">
          <SectionHeading label="EDUCATION" title="Education" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(1rem,2vw,1.5rem)]">
            {[
              {
                degree: "M.S. in Computer Science",
                school: "New Jersey Institute of Technology",
                detail: "Currently pursuing my Master's while working full time.",
                period: "In Progress",
              },
              {
                degree: "B.S. — Michigan State University",
                school: "Michigan State University",
                detail: "Go Green! 🌱",
                period: "Graduated",
              },
            ].map((ed, i) => (
              <motion.div
                key={ed.degree}
                custom={i} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
                className="spotlight rounded-xl p-[clamp(1.25rem,1.8vw,1.5rem)] border flex items-start gap-4"
                style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--card) 60%, transparent)" }}
              >
                <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 accent-border" style={{ background: "rgba(99,102,241,0.08)" }}>
                  <GraduationCap className="w-5 h-5" style={{ color: "var(--accent-1)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <h3 className="fluid-h4 font-semibold" style={{ fontFamily: "Syne, sans-serif" }}>{ed.degree}</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full border flex-shrink-0" style={{ color: "var(--accent-1)", borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.08)", fontFamily: "Fira Code, monospace" }}>{ed.period}</span>
                  </div>
                  <p className="fluid-small text-muted-foreground mt-1">{ed.school}</p>
                  <p className="fluid-small text-muted-foreground mt-2 leading-relaxed">{ed.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Principles */}
        <section className="mb-[clamp(3.5rem,7vw,6rem)]">
          <SectionHeading label="HOW I WORK" title="Principles" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[clamp(1rem,2vw,1.5rem)]">
            {principles.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                custom={i} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
                className="spotlight rounded-xl p-[clamp(1.25rem,1.8vw,1.5rem)] border"
                style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--card) 60%, transparent)" }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 accent-border" style={{ background: "rgba(99,102,241,0.08)" }}>
                  <Icon className="w-5 h-5" style={{ color: "var(--accent-1)" }} />
                </div>
                <h3 className="fluid-h4 font-semibold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>{title}</h3>
                <p className="fluid-small text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience timeline */}
        <section id="experience" className="mb-[clamp(3.5rem,7vw,6rem)]">
          <SectionHeading label="CAREER" title="Experience" />
          <div className="relative">
            <div className="absolute left-4 top-1 bottom-1 w-px hidden md:block" style={{ background: "linear-gradient(180deg, rgba(59,130,246,0.4), rgba(139,92,246,0.25), transparent)" }} />
            <div className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
              {experiences.map((exp, i) => (
                <motion.div
                  key={exp.role}
                  className="relative flex gap-6 md:gap-10"
                  custom={i} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
                >
                  <div className="hidden md:flex flex-col items-center flex-shrink-0 w-8">
                    <div className="w-4 h-4 rounded-full border-2 mt-1.5"
                      style={{
                        borderColor: "var(--accent-1)",
                        background: exp.active ? "var(--accent-1)" : "transparent",
                        boxShadow: exp.active ? "0 0 10px rgba(59,130,246,0.6)" : "none",
                      }} />
                  </div>
                  <div className="flex-1 spotlight rounded-xl p-[clamp(1.25rem,1.8vw,1.5rem)] border" style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--card) 55%, transparent)" }}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="fluid-h4 font-bold" style={{ fontFamily: "Syne, sans-serif" }}>{exp.role}</h3>
                        <p className="fluid-small mt-1 flex items-center gap-1.5 text-muted-foreground">
                          <Briefcase className="w-3.5 h-3.5" /> {exp.company}
                        </p>
                      </div>
                      <span className="text-xs font-medium flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1 rounded border h-fit"
                        style={{ color: "var(--accent-1)", borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.08)", fontFamily: "Fira Code, monospace" }}>
                        <Calendar className="w-3 h-3" /> {exp.period}
                      </span>
                    </div>
                    <p className="fluid-small leading-relaxed mb-4 text-muted-foreground">{exp.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2.5 py-1 rounded-full border text-muted-foreground" style={{ borderColor: "var(--border)", fontFamily: "Fira Code, monospace" }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Beyond the terminal — a real polaroid photo alongside each
            story, alternating sides, in normal document flow (no
            absolute-position overlap tricks that can collide with
            neighboring rows or cover the text). */}
        <section className="mb-[clamp(4.5rem,8vw,7rem)]">
          <SectionHeading label="BEYOND THE TERMINAL" title="A Bit More About Me" />
          <div className="flex flex-col gap-[clamp(3rem,6vw,5rem)]">
            {personality.map(({ icon: Icon, title, desc, photos }, i) => (
              <motion.div
                key={title}
                custom={i} variants={reveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}
                className={`flex flex-col ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"} items-center gap-[clamp(1.5rem,3vw,3rem)]`}
              >
                {photos.length === 1 ? (
                  <motion.div
                    className="flex-shrink-0"
                    initial={{ rotate: photos[0].rotate }}
                    whileHover={{ rotate: 0, scale: 1.04 }}
                    animate={{ rotate: photos[0].rotate }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <PolaroidTile photo={photos[0]} width="min(52vw, 200px)" />
                  </motion.div>
                ) : (
                  // Multiple photos: a small contained collage, not an overlap
                  // hack — the wrapper's own size already accounts for every
                  // tile's full height (image + caption) at its offset, so
                  // nothing can spill into the row above or below.
                  <div
                    className="relative flex-shrink-0"
                    style={{ width: "min(60vw, 220px)", height: "min(74vw, 270px)" }}
                  >
                    {photos.map((p, pi) => {
                      const pos = [
                        { top: "0%", left: "0%" },
                        { top: "9%", left: "38%" },
                        { top: "21%", left: "6%" },
                      ][pi % 3];
                      return (
                        <motion.div
                          key={p.caption}
                          className="absolute"
                          style={{ top: pos.top, left: pos.left, width: "52%", zIndex: pi }}
                          initial={{ rotate: p.rotate }}
                          whileHover={{ rotate: 0, scale: 1.08, zIndex: 10 }}
                          animate={{ rotate: p.rotate }}
                          transition={{ duration: 0.3, ease: EASE }}
                        >
                          <PolaroidTile photo={p} width="100%" />
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Story */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2.5 mb-2 justify-center sm:justify-start">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 accent-border" style={{ background: "rgba(99,102,241,0.08)" }}>
                      <Icon className="w-4 h-4" style={{ color: "var(--accent-2)" }} />
                    </div>
                    <h3 className="fluid-h4 font-semibold" style={{ fontFamily: "Syne, sans-serif" }}>{title}</h3>
                  </div>
                  <p className="fluid-small text-muted-foreground leading-relaxed max-w-md mx-auto sm:mx-0">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <SectionHeading label="CONTACT" title="Let's Build Something" />
          <div className="max-w-2xl">
            <p className="fluid-body text-muted-foreground mb-8">
              I'm actively looking for opportunities in cloud infrastructure and platform
              engineering. If you've got a team that ships often and wants their deployments
              boring (in the best way), I'd love to talk.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={CONTACT.mailto}
                className="fluid-btn rounded-lg font-semibold inline-flex items-center gap-2 text-white card-lift"
                style={{ background: "var(--accent-gradient)", fontFamily: "Syne, sans-serif", boxShadow: "0 0 28px rgba(99,102,241,0.4)" }}
              >
                <Mail className="w-4 h-4" /> Send a Message
              </a>
              {socials.slice(0, 2).map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border card-lift accent-border"
                  style={{ background: "rgba(99,102,241,0.05)", fontFamily: "Fira Code, monospace", color: "#c7d2fe" }}>
                  <Icon className="w-4 h-4" /> <span className="text-sm">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
