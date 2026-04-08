import Link from "next/link";
import { ArrowLeft, ExternalLink, RefreshCw, Terminal } from "lucide-react";
import { DUMMY_HEADLINES, LAST_FETCHED_AT, type Headline } from "@/lib/dummy-news";

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

function formatAbsolute(iso: string): string {
  return new Date(iso).toISOString().replace("T", " ").replace(/\..+/, "Z");
}

export default function NewsPage() {
  const lastFetchedRel = formatRelative(LAST_FETCHED_AT);
  const lastFetchedAbs = formatAbsolute(LAST_FETCHED_AT);
  const sources = Array.from(new Set(DUMMY_HEADLINES.map((h) => h.source)));

  return (
    <div className="relative min-h-screen w-full bg-black font-mono text-zinc-300 selection:bg-green-400 selection:text-black">
      <nav className="sticky top-0 z-50 border-b border-green-500/20 bg-black/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded border border-green-500/30 bg-green-500/10 p-2 transition-colors hover:bg-green-500/20"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-4 w-4 text-green-400" />
            </Link>
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-green-400" />
              <h1 className="font-mono text-base tracking-wider text-green-400 sm:text-lg">
                NEWS FEED
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs sm:gap-6">
            <div className="flex items-center gap-2">
              <RefreshCw className="h-3 w-3 text-green-400" />
              <span className="hidden text-green-500/60 sm:inline">last fetch</span>
              <span className="text-green-400">{lastFetchedRel}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative mx-auto flex min-h-screen max-w-4xl flex-col px-5 py-10 sm:px-12 sm:py-16">
        <section>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 sm:text-[11px] sm:tracking-[0.4em]">
            ╱╱ ingest log
          </p>
          <h2 className="mt-3 font-mono text-2xl font-light leading-tight text-zinc-100 sm:text-4xl">
            recent headlines
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-600">
            <span>
              <span className="text-zinc-400">{DUMMY_HEADLINES.length}</span> headlines
            </span>
            <span>
              <span className="text-zinc-400">{sources.length}</span> sources
            </span>
            <span>
              last api call <span className="text-green-400">{lastFetchedAbs}</span>
            </span>
          </div>
        </section>

        <section className="mt-10 space-y-3">
          {DUMMY_HEADLINES.map((h) => (
            <HeadlineCard key={h.raw_id ?? h.url} headline={h} />
          ))}
        </section>

        <section className="mt-12 rounded border border-zinc-800 bg-zinc-950/50 p-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
            // dummy data — not yet wired to backend.
          </p>
          <p className="mt-2 font-mono text-xs text-zinc-500">
            once the backend is connected, this page will fetch from{" "}
            <code className="text-green-400">/sources/news</code> and display live headlines from
            NewsAPI, Reuters, Bloomberg, and other configured sources.
          </p>
        </section>
      </main>
    </div>
  );
}

function HeadlineCard({ headline }: { headline: Headline }) {
  return (
    <a
      href={headline.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded border border-zinc-900 bg-black/40 p-4 transition-colors hover:border-green-500/40 hover:bg-zinc-950/60"
    >
      <div className="flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em]">
        <div className="flex items-center gap-3">
          <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-cyan-300">
            {headline.source}
          </span>
          {headline.ticker && (
            <span className="text-green-400">${headline.ticker}</span>
          )}
        </div>
        <span className="text-zinc-600">{formatRelative(headline.published_at)}</span>
      </div>
      <h3 className="mt-3 font-mono text-sm leading-snug text-zinc-100 group-hover:text-white">
        {headline.title}
      </h3>
      {headline.body && (
        <p className="mt-2 font-mono text-xs leading-relaxed text-zinc-500">
          {headline.body}
        </p>
      )}
      <div className="mt-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600 group-hover:text-green-500/70">
        <ExternalLink className="h-3 w-3" />
        <span className="truncate">{new URL(headline.url).hostname}</span>
      </div>
    </a>
  );
}
