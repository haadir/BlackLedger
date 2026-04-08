import Link from "next/link";
import { Newspaper, Terminal } from "lucide-react";
import DecodedTitle from "@/components/decoded-title";
import GlobeSection from "@/components/globe-section";
import WorkflowSection from "@/components/workflow-section";

const NODE_COUNT = 16;
const CONNECTION_COUNT = 25;

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-black font-mono text-zinc-300 selection:bg-green-400 selection:text-black">
      {/* sticky terminal navbar */}
      <nav className="sticky top-0 z-50 border-b border-green-500/20 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <div className="rounded border border-green-500/30 bg-green-500/10 p-2">
              <Terminal className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h1 className="font-mono text-base tracking-wider text-green-400 sm:text-lg">
                BLACKLEDGER
              </h1>
              <p className="hidden font-mono text-xs text-green-500/60 sm:block">
                Sentiment-Driven Predictive Intelligence System
              </p>
            </div>
            <Link
              href="/news"
              className="ml-2 flex items-center gap-2 rounded border border-green-500/30 bg-green-500/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-green-400 transition-colors hover:bg-green-500/15 sm:ml-4 sm:text-xs"
            >
              <Newspaper className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">news feed</span>
              <span className="sm:hidden">news</span>
            </Link>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs sm:gap-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
              <span className="text-green-400">OPERATIONAL</span>
            </div>
            <div className="hidden text-green-500/60 sm:block">
              <span className="text-green-400">{NODE_COUNT}</span> NODES
            </div>
            <div className="hidden text-green-500/60 sm:block">
              <span className="text-green-400">{CONNECTION_COUNT}</span>{" "}
              CONNECTIONS
            </div>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-12 sm:px-12 sm:py-24">
        {/* title */}
        <section className="">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 sm:text-[11px] sm:tracking-[0.4em]">
            ╱╱ a private ledger
          </p>
          <DecodedTitle />
          <p className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-500">
            inputs become artifacts. artifacts become signal. signal ships.
          </p>
        </section>

        <WorkflowSection />

        <GlobeSection />

        {/* footer */}
        <footer className="mt-auto pt-16 text-[9px] uppercase tracking-[0.25em] text-zinc-700 sm:pt-24 sm:text-[10px] sm:tracking-[0.3em]">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <span>// no telemetry</span>
            <span>// no audience</span>
            <span>// no exit</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
