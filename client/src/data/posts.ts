/* ============================================================
   Single source of truth for /writing posts.
   Add a real post by pushing a new entry — the list and detail
   pages both read from here.

   The "home-lab" entry below is a SHELL, not a published post:
   the body is placeholder TODOs. Replace them with your actual
   home-lab writeup (real hardware, real failures, real lessons)
   before linking this page from the header nav — an empty post
   undermines the same credibility the writing is supposed to build.
   ============================================================ */

export interface Post {
  slug: string;
  title: string;
  dek: string;
  date: string; // ISO yyyy-mm-dd
  tags: string[];
  body: string[]; // paragraphs
  draft?: boolean;
}

export const posts: Post[] = [
  {
    slug: "home-lab",
    title: "Building My Home Lab",
    dek: "TODO — one line on what you built and why (this shows on the /writing index).",
    date: "2026-07-26",
    tags: ["Home Lab", "OpenShift"],
    draft: true,
    body: [
      "TODO: What's actually running — hardware, hypervisor, network layout?",
      "TODO: Why OpenShift/Kubernetes at home instead of just Docker Compose?",
      "TODO: What's the most interesting thing that broke, and how did you diagnose it?",
      "TODO: What did you learn here that you couldn't have learned just doing your day job?",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function publishedPosts(): Post[] {
  return posts.filter((p) => !p.draft);
}
