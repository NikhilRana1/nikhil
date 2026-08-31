"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/* Editor-only colours. The site palette is a light "Cool Paper", so the code
   window inverts to ink and needs its own syntax scale — kept deliberately
   narrow and tuned to the teal accent rather than a rainbow theme. */
const TOKEN_COLOR = {
  kw: "#7fd1c4", // const — light teal, a tint of --accent
  key: "#e6ebf1", // object keys
  str: "#d9b48f", // strings — warm sand, the accent's complement
  num: "#8fb8e0", // numbers
  punc: "#7d8794", // braces, colons, commas
  comment: "#5c6773", // --muted
};

/**
 * Renders the identity facts as a source file being typed out.
 *
 * `lines` is a token tree rather than a string so each fragment can be
 * coloured, while typing still advances one character at a time across the
 * whole file — the caret has to know its absolute position, not a per-line one.
 */
export default function CodeCard({ lines, statusLeft, statusRight, fileName }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();

  const lineLengths = lines.map((line) =>
    line.tokens.reduce((n, t) => n + t.v.length, line.indent * 2)
  );
  const totalChars = lineLengths.reduce((a, b) => a + b, 0);

  // With reduced motion the file is simply already written — derived rather
  // than set, so the effect never has to fire to show the content.
  const [typedState, setTyped] = useState(0);
  const typed = reduceMotion ? totalChars : typedState;
  const done = typed >= totalChars;

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const id = setInterval(() => {
      setTyped((n) => {
        if (n >= totalChars) {
          clearInterval(id);
          return n;
        }
        return n + 3;
      });
    }, 18);
    return () => clearInterval(id);
  }, [inView, reduceMotion, totalChars]);

  return (
    <div
      ref={ref}
      className="w-full max-w-md overflow-hidden rounded-xl border border-line bg-ink shadow-2xl shadow-graphite/25"
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f0705a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f0bf5a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
        </span>
        <span className="font-mono text-xs text-[#9aa4b0]">{fileName}</span>
      </div>

      {/* Code body */}
      <div className="overflow-x-auto px-4 py-5 font-mono text-[0.72rem] leading-[1.9] sm:text-[0.8rem]">
        {lines.map((line, i) => {
          const before = lineLengths.slice(0, i).reduce((a, b) => a + b, 0);
          const visible = Math.max(0, Math.min(typed - before, lineLengths[i]));
          const typing = visible > 0 && visible < lineLengths[i];

          // Walk the tokens, handing each one only the slice revealed so far.
          let budget = Math.max(0, visible - line.indent * 2);

          return (
            <div key={i} className="flex gap-3 whitespace-pre">
              <span className="w-5 shrink-0 select-none text-right text-[#3f4855]">
                {i + 1}
              </span>
              <span className="min-w-0">
                {visible > 0 && " ".repeat(line.indent * 2)}
                {line.tokens.map((t, j) => {
                  const slice = t.v.slice(0, budget);
                  budget = Math.max(0, budget - t.v.length);
                  if (!slice) return null;
                  return (
                    <span key={j} style={{ color: TOKEN_COLOR[t.t] }}>
                      {slice}
                    </span>
                  );
                })}
                {(typing || (done && i === lines.length - 1)) && (
                  <span className="ml-px inline-block h-[0.95em] w-[0.5em] translate-y-[0.12em] animate-pulse bg-accent" />
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-white/[0.04] px-4 py-2.5">
        <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] text-[#9aa4b0]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          {statusLeft}
        </span>
        <span className="truncate font-mono text-[0.7rem] text-[#6b7480]">
          {statusRight}
        </span>
      </div>
    </div>
  );
}
