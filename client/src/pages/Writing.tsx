/* ============================================================
   /writing — index of posts. Only published (non-draft) posts
   are listed here; draft posts stay reachable at /writing/:slug
   directly so they can be previewed before going live.
   ============================================================ */
import { EASE } from "@/lib/motion";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { publishedPosts } from "@/data/posts";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function Writing() {
  const list = publishedPosts();

  return (
    <div className="min-h-screen text-foreground">
      <div className="container mx-auto" style={{ paddingTop: "calc(var(--nav-height) + clamp(1rem,3vw,2.5rem))", paddingBottom: "clamp(4rem,8vw,7rem)" }}>
        <motion.div
          className="mb-[clamp(2.5rem,5vw,4rem)]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="accent-text mb-2 text-sm tracking-[0.2em] uppercase" style={{ fontFamily: "Fira Code, monospace" }}>
            Writing
          </p>
          <h1 className="fluid-h1 font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
            Notes From the Terminal
          </h1>
          <div className="accent-underline mt-4" />
        </motion.div>

        {list.length === 0 ? (
          <motion.p
            className="fluid-body text-muted-foreground max-w-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            Nothing published yet — check back soon.
          </motion.p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1.25rem,2.5vw,2rem)]"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {list.map((post) => (
              <motion.div key={post.slug} variants={item}>
                <Link href={`/writing/${post.slug}`} className="block group h-full">
                  <article
                    className="spotlight flex flex-col h-full rounded-xl overflow-hidden border p-[clamp(1.25rem,1.8vw,1.5rem)]"
                    style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--card) 70%, transparent)" }}
                  >
                    <p className="text-xs mb-2" style={{ fontFamily: "Fira Code, monospace", color: "var(--accent-1)" }}>
                      {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <h2 className="title-hover fluid-h4 font-bold text-foreground mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                      {post.title}
                    </h2>
                    <p className="fluid-small text-muted-foreground mb-4">{post.dek}</p>
                    <div className="flex items-center gap-1 text-sm font-medium mt-auto" style={{ fontFamily: "Fira Code, monospace", color: "var(--accent-1)" }}>
                      Read <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
