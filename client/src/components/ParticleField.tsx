/* ============================================================
   DESIGN: Dark Ops Dashboard — floating particle field.
   Enhancements:
   - Audio-reactive: when music plays, brightness/line intensity
     "breathes" with the ambient pad via a shared AnalyserNode.
   - Scroll parallax: the field drifts slightly slower than scroll
     for a cheap depth illusion (paired with the starfield).
   - Pauses when the tab is hidden (battery/CPU friendly).
   - Respects prefers-reduced-motion (renders a static field).
   ============================================================ */
import { useEffect, useRef } from "react";
import { useSound } from "./AudioController";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; color: string;
}

const COLORS = ["#3b82f6", "#60a5fa", "#8b5cf6", "#a78bfa"];

export default function ParticleField({ count = 40 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const { getAnalyser, musicOn } = useSound();

  // Live refs so the animation loop always sees current values without restarting.
  const analyserActiveRef = useRef(false);
  useEffect(() => { analyserActiveRef.current = musicOn; }, [musicOn]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Cap particle count on reduced-motion / very small screens.
    const effectiveCount = reduceMotion
      ? Math.min(count, 18)
      : (window.innerWidth < 640 ? Math.min(count, 28) : count);

    particles.current = Array.from({ length: effectiveCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    // Scroll parallax — translate the canvas slower than the page.
    let scrollY = window.scrollY;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Audio analysis buffer
    let freqData: Uint8Array | null = null;

    // Pause when tab hidden
    let hidden = document.hidden;
    const onVis = () => {
      hidden = document.hidden;
      if (!hidden && !reduceMotion) { cancelAnimationFrame(animRef.current); animRef.current = requestAnimationFrame(draw); }
    };
    document.addEventListener("visibilitychange", onVis);

    // Static render (single frame) for reduced-motion users.
    const renderStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles.current) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.opacity * 255).toString(16).padStart(2, "0");
        ctx.fill();
      }
    };

    const draw = () => {
      if (hidden) return; // paused; will resume on visibilitychange

      // Parallax offset (subtle): move up as you scroll down.
      canvas.style.transform = `translateY(${-scrollY * 0.12}px)`;

      // Audio reactivity: sample the shared analyser when music is on.
      let level = 0;
      if (analyserActiveRef.current) {
        const analyser = getAnalyser();
        if (analyser) {
          if (!freqData || freqData.length !== analyser.frequencyBinCount) {
            freqData = new Uint8Array(analyser.frequencyBinCount);
          }
          analyser.getByteFrequencyData(freqData);
          let sum = 0;
          for (let i = 0; i < freqData.length; i++) sum += freqData[i];
          level = sum / freqData.length / 255; // 0..1
        }
      }
      // Smooth breathing multiplier: 1.0 baseline, up to ~1.9 with music.
      const boost = 1 + level * 0.9;
      const lineBoost = 1 + level * 2.2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const op = Math.min(1, p.opacity * boost);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(op * 255).toString(16).padStart(2, "0");
        ctx.fill();
      }

      for (let i = 0; i < particles.current.length; i++) {
        for (let j = i + 1; j < particles.current.length; j++) {
          const dx = particles.current[i].x - particles.current[j].x;
          const dy = particles.current[i].y - particles.current[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const a = Math.min(0.5, 0.06 * (1 - dist / 100) * lineBoost);
            ctx.beginPath();
            ctx.moveTo(particles.current[i].x, particles.current[i].y);
            ctx.lineTo(particles.current[j].x, particles.current[j].y);
            ctx.strokeStyle = `rgba(96,130,246,${a})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    if (reduceMotion) {
      renderStatic();
      // Still apply parallax on scroll, cheaply.
      const parallax = () => { canvas.style.transform = `translateY(${-window.scrollY * 0.12}px)`; };
      window.addEventListener("scroll", parallax, { passive: true });
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("scroll", parallax);
        document.removeEventListener("visibilitychange", onVis);
      };
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [count, getAnalyser]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2, willChange: "transform" }}
    />
  );
}
