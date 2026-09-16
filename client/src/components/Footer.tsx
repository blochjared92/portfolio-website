/* ============================================================
   DESIGN: Dark Ops Dashboard — footer with social links
   ============================================================ */
import { Github, Linkedin, Mail } from "lucide-react";
import { CONTACT } from "@/data/contact";

export default function Footer() {
   return (
       <footer
         className="border-t py-5 mt-auto"
          style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--background) 80%, transparent)", backdropFilter: "blur(8px)" }}
       >
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="fluid-xs" style={{ color: "var(--muted-foreground)", fontFamily: "Fira Code, monospace" }}>
              Copyright © Jared Bloch {new Date().getFullYear()}.
            </div>
            <div className="flex items-center gap-[clamp(1rem,2vw,2rem)]">
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors"
                style={{ color: "var(--muted-foreground)", fontFamily: "Fira Code, monospace" }}
              >
                <Linkedin className="w-4 h-4" />
                <span className="fluid-xs">LINKEDIN</span>
              </a>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors"
                style={{ color: "var(--muted-foreground)", fontFamily: "Fira Code, monospace" }}
              >
                <Github className="w-4 h-4" />
                <span className="fluid-xs">GITHUB</span>
              </a>
              <a
                href={CONTACT.mailto}
                className="flex items-center gap-1.5 transition-colors"
                style={{ color: "var(--muted-foreground)", fontFamily: "Fira Code, monospace" }}
              >
                <Mail className="w-4 h-4" />
                <span className="fluid-xs">CONTACT</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
