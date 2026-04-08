"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$*+=/<>?";
const TARGET = "BLACK·LEDGER";

function randomChar() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

export default function DecodedTitle() {
  // Deterministic initial state so SSR + first client render match.
  // Real scrambling kicks in inside useEffect (client only).
  const [chars, setChars] = useState<string[]>(() =>
    TARGET.split("").map((c) => (c === "·" ? "·" : "#"))
  );
  const [locked, setLocked] = useState<boolean[]>(() =>
    TARGET.split("").map((c) => c === "·")
  );
  const lockedRef = useRef(locked);
  lockedRef.current = locked;

  useEffect(() => {
    const total = TARGET.length;
    const scramble = setInterval(() => {
      setChars((prev) =>
        prev.map((ch, i) => (lockedRef.current[i] ? ch : randomChar()))
      );
    }, 55);

    const unlocks: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < total; i++) {
      if (TARGET[i] === "·") continue;
      unlocks.push(
        setTimeout(
          () => {
            setLocked((prev) => {
              const next = [...prev];
              next[i] = true;
              return next;
            });
            setChars((prev) => {
              const next = [...prev];
              next[i] = TARGET[i];
              return next;
            });
          },
          350 + i * 160
        )
      );
    }

    const stop = setTimeout(
      () => clearInterval(scramble),
      350 + total * 160 + 200
    );

    return () => {
      clearInterval(scramble);
      clearTimeout(stop);
      unlocks.forEach(clearTimeout);
    };
  }, []);

  return (
    <h1
      aria-label="BLACK LEDGER"
      className="mt-6 font-mono text-5xl font-light leading-[1.05] tracking-tight text-zinc-100 sm:text-7xl"
    >
      {chars.map((ch, i) => (
        <span
          key={i}
          className={
            ch === "·"
              ? "text-zinc-500"
              : locked[i]
                ? "text-zinc-100"
                : "text-emerald-400/80"
          }
        >
          {ch}
        </span>
      ))}
    </h1>
  );
}
