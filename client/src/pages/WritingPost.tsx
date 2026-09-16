/* ============================================================
   /writing/:slug — single post. Draft posts render with a visible
   DRAFT badge so they stay previewable without being mistaken for
   a published, finished piece.
   ============================================================ */
import { EASE } from "@/lib/motion";
import { motion } from "framer-motion";
import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { getPost } from "@/data/posts";
import NotFound from "@/pages/NotFound";

const section = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: EASE },
  }),
};

export default function WritingPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPost(slug) : undefined;

  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen text-foreground">
      <div className="container mx-auto max-w-3xl" style={{ paddingTop: "calc(var(--nav-height) + clamp(1rem,3vw,2rem))", paddingBottom: "clamp(4rem,8vw,7rem)" }}>
        <Link
          href="/writing"
          className="link-anim inline-flex items-center gap-2 mb-8 text-sm"
          style={{ fontFamily: "Fira Code, monospace" }}
        >
          <ArrowLeft className="w-4 h-4" /> All Writing
        </Link>

        <motion.header custom={0} variants={section} initial="hidden" animate="show" className="mb-[clamp(2rem,4vw,3rem)]">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <p className="text-sm" style={{ fontFamily: "Fira Code, monospace", color: "var(--accent-1)" }}>
              {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            {post.draft && (
              <span
                className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
                style={{ fontFamily: "Fira Code, monospace", color: "#fca5a5", borderColor: "rgba(248,113,113,0.4)", background: "rgba(248,113,113,0.08)" }}
              >
                Draft — not yet published
              </span>
            )}
          </div>
          <h1 className="fluid-h1 font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-full text-xs border text-muted-foreground" style={{ borderColor: "var(--border)", fontFamily: "Fira Code, monospace" }}>
                {tag}
              </span>
            ))}
          </div>
        </motion.header>

        <motion.div custom={1} variants={section} initial="hidden" animate="show" className="space-y-5">
          {post.body.map((para, i) => (
            <p key={i} className="fluid-body leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
              {para}
            </p>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
