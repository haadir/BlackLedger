import DecodedTitle from "@/components/decoded-title";
import GlobeSection from "@/components/globe-section";

const PHASES = [
  { id: "00", name: "DISCUSS", desc: "gather context · surface assumptions" },
  { id: "01", name: "PLAN", desc: "decompose · sequence · verify backwards" },
  { id: "02", name: "EXECUTE", desc: "atomic commits · checkpointed state" },
  { id: "03", name: "VERIFY", desc: "goal-backward audit · UAT · nyquist" },
  { id: "04", name: "REVIEW", desc: "code · security · ui · integration" },
  { id: "05", name: "SHIP", desc: "pr · merge · archive" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-mono text-zinc-300 selection:bg-zinc-200 selection:text-black">
      {/* grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />
      {/* vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]"
      />

      <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-8 py-16 sm:px-12 sm:py-24">
        {/* header */}
        <header className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            blackledger // online
          </span>
          <span>v0.0.1 · 2026.04</span>
        </header>

        {/* title */}
        <section className="mt-24 sm:mt-32">
          <p className="text-[11px] uppercase tracking-[0.4em] text-zinc-600">
            ╱╱ a private ledger for things that should not exist
          </p>
          <DecodedTitle />
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-500">
            an opaque system. inputs become artifacts. artifacts become signal.
            signal becomes shipped. nothing is forgotten and nothing is loud.
          </p>
        </section>

        {/* workflow */}
        <section className="mt-24 sm:mt-32">
          <div className="mb-8 flex items-center gap-4 text-[11px] uppercase tracking-[0.25em] text-zinc-600">
            <span>workflow</span>
            <span className="h-px flex-1 bg-zinc-800" />
            <span>6 phases</span>
          </div>

          <ol className="divide-y divide-zinc-900 border-y border-zinc-900">
            {PHASES.map((phase, i) => (
              <li
                key={phase.id}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-6 px-2 py-5 transition-colors hover:bg-zinc-950"
              >
                <span className="text-xs tabular-nums text-zinc-700 group-hover:text-zinc-500">
                  {phase.id}
                </span>
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-6">
                  <span className="text-sm tracking-[0.2em] text-zinc-200">
                    {phase.name}
                  </span>
                  <span className="text-xs text-zinc-600">{phase.desc}</span>
                </div>
                <span className="text-xs text-zinc-700 group-hover:text-zinc-400">
                  {i === PHASES.length - 1 ? "∎" : "→"}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <GlobeSection />

        {/* footer */}
        <footer className="mt-auto pt-24 text-[10px] uppercase tracking-[0.3em] text-zinc-700">
          <div className="flex items-center justify-between">
            <span>// no telemetry</span>
            <span>// no audience</span>
            <span>// no exit</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
