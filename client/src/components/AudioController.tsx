/* ============================================================
   AudioController — optional background music. Off by default,
   never autoplays. A single <audio> element is routed through
   the Web Audio API so the particle background can react to
   whatever's currently playing.

   Tracks live in /client/public/audio/. Track preference persists
   in localStorage.
   ============================================================ */
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Music, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type TrackId = "midnight-blue" | "sunrise" | "atmosphere" | "realize";

const TRACKS: { id: TrackId; label: string; src: string }[] = [
  { id: "midnight-blue", label: "Midnight Blue", src: "/audio/midnight-blue.mp3" },
  { id: "sunrise", label: "Sunrise", src: "/audio/sunrise.mp3" },
  { id: "atmosphere", label: "Atmosphere", src: "/audio/atmosphere.mp3" },
  { id: "realize", label: "Realize", src: "/audio/realize.mp3" },
];

interface AudioAPI {
  musicOn: boolean;
  getAnalyser: () => AnalyserNode | null;
}
const AudioContext_ = createContext<AudioAPI>({
  musicOn: false,
  getAnalyser: () => null,
});
export const useSound = () => useContext(AudioContext_);

const DEFAULT_TRACK: TrackId = "midnight-blue";

export function AudioProvider({ children }: { children: ReactNode }) {
  const [musicOn, setMusicOn] = useState(false);
  const [track, setTrack] = useState<TrackId>(() => {
    if (typeof window === "undefined") return DEFAULT_TRACK;
    const saved = localStorage.getItem("jb_track");
    return (TRACKS.some((t) => t.id === saved) ? saved : DEFAULT_TRACK) as TrackId;
  });
  const [open, setOpen] = useState(false);

  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // One <audio> element, reused across tracks. Created lazily so nothing
  // loads until the user actually opts in.
  const getAudioEl = useCallback(() => {
    if (!audioElRef.current) {
      const el = new Audio();
      el.loop = true;
      el.preload = "none";
      audioElRef.current = el;
    }
    return audioElRef.current;
  }, []);

  // Routes the <audio> element through gain -> analyser -> speakers, so the
  // reactive background glow (see ParticleField) can read the spectrum.
  const getCtx = useCallback(() => {
    const el = getAudioEl();
    if (!ctxRef.current) {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AC();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      const source = ctx.createMediaElementSource(el);
      source.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      gainRef.current = gain;
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, [getAudioEl]);

  const getAnalyser = useCallback(() => analyserRef.current, []);

  const playTrack = useCallback((id: TrackId) => {
    const meta = TRACKS.find((t) => t.id === id);
    if (!meta) return;
    const ctx = getCtx();
    const el = getAudioEl();
    const gain = gainRef.current!;

    el.src = meta.src;
    el.currentTime = 0;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 1.2);
    el.play().catch(() => {});
  }, [getCtx, getAudioEl]);

  const stopMusic = useCallback(() => {
    const ctx = ctxRef.current;
    const gain = gainRef.current;
    const el = audioElRef.current;
    if (!ctx || !gain || !el) return;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
    window.setTimeout(() => el.pause(), 650);
  }, []);

  // Start/stop + switch tracks
  useEffect(() => {
    if (musicOn) {
      playTrack(track);
    } else {
      stopMusic();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicOn, track]);

  useEffect(() => { localStorage.setItem("jb_track", track); }, [track]);

  // Stop playback if the whole provider unmounts.
  useEffect(() => () => { audioElRef.current?.pause(); }, []);

  return (
    <AudioContext_.Provider value={{ musicOn, getAnalyser }}>
      {children}

      {/* Floating audio control (bottom-left) */}
      <div className="fixed left-4 bottom-4 z-[95] flex flex-col items-start gap-2">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-1 p-2 rounded-xl border w-56"
              style={{ borderColor: "var(--border)", background: "color-mix(in srgb, var(--card) 94%, transparent)", backdropFilter: "blur(10px)" }}
            >
              <div className="px-2 pt-1 pb-1.5 text-[10px] uppercase tracking-[0.18em]" style={{ fontFamily: "Fira Code, monospace", color: "var(--muted-foreground)" }}>
                Music
              </div>
              {TRACKS.map((tk) => {
                const isCurrent = musicOn && track === tk.id;
                return (
                  <button
                    key={tk.id}
                    onClick={() => {
                      getCtx();
                      if (musicOn && track === tk.id) { setMusicOn(false); }
                      else { setTrack(tk.id); setMusicOn(true); }
                    }}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors"
                    style={{ fontFamily: "Fira Code, monospace", color: isCurrent ? "#fff" : "var(--muted-foreground)", background: isCurrent ? "var(--accent-gradient)" : "transparent" }}
                  >
                    <span className="flex items-center gap-2">
                      <Music className="w-3.5 h-3.5" /> {tk.label}
                    </span>
                    {isCurrent && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}

            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => { getCtx(); setOpen((v) => !v); }}
          aria-label="Audio settings"
          className="w-11 h-11 rounded-full flex items-center justify-center border card-lift"
          style={{
            borderColor: "var(--border)",
            background: (musicOn || open) ? "var(--accent-gradient)" : "color-mix(in srgb, var(--card) 92%, transparent)",
            backdropFilter: "blur(10px)",
            color: (musicOn || open) ? "#fff" : "var(--muted-foreground)",
          }}
        >
          {musicOn ? (
            <span className="flex items-end gap-[2px] h-4" aria-hidden>
              <span className="eq-bar" style={{ animationDelay: "0ms" }} />
              <span className="eq-bar" style={{ animationDelay: "150ms" }} />
              <span className="eq-bar" style={{ animationDelay: "300ms" }} />
            </span>
          ) : (
            <Music className="w-5 h-5" />
          )}
        </button>
      </div>
    </AudioContext_.Provider>
  );
}
