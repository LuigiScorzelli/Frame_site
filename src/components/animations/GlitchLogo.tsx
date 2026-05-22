"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const LOGO_TEXT = "FR>ME";
const GLITCH_CHARS = "!@#$%&*<>{}[]01";
const TICK_MS = 40;
const TICKS_PER_CHAR = 3;

function randomGlitchChar() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

export default function GlitchLogo({ className }: { className?: string }) {
  const [displayChars, setDisplayChars] = useState<
    { char: string; accent: boolean }[] | null
  >(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef(0);

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    tickRef.current = 0;
    setDisplayChars(null);
  }, []);

  const startAnimation = useCallback(() => {
    stopAnimation();
    tickRef.current = 0;

    intervalRef.current = setInterval(() => {
      tickRef.current += 1;
      const resolved = Math.floor(tickRef.current / TICKS_PER_CHAR);

      if (resolved >= LOGO_TEXT.length) {
        // All resolved — show final text briefly then clear
        setDisplayChars(
          LOGO_TEXT.split("").map((ch) => ({ char: ch, accent: false }))
        );
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return;
      }

      const chars = LOGO_TEXT.split("").map((ch, i) => {
        if (i < resolved) {
          return { char: ch, accent: false };
        }
        return { char: randomGlitchChar(), accent: true };
      });
      setDisplayChars(chars);
    }, TICK_MS);
  }, [stopAnimation]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Static render
  if (!displayChars) {
    return (
      <span
        className={className}
        onMouseEnter={startAnimation}
        style={{ letterSpacing: "-0.4px" }}
      >
        <span className="text-text-0">FR</span>
        <span className="text-accent">&gt;</span>
        <span className="text-text-0">ME</span>
      </span>
    );
  }

  // Animated render
  return (
    <span
      className={className}
      onMouseLeave={stopAnimation}
      style={{ letterSpacing: "-0.4px" }}
    >
      {displayChars.map((d, i) => (
        <span key={i} className={d.accent ? "text-accent" : "text-text-0"}>
          {d.char === ">" ? <>&gt;</> : d.char}
        </span>
      ))}
    </span>
  );
}
