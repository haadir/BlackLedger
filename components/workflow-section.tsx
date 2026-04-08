"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AgentNode,
  APINode,
  GrokNode,
  PredictionNode,
  SignalNode,
} from "@/components/workflow/nodes";

const nodeTypes = {
  agent: AgentNode,
  api: APINode,
  grok: GrokNode,
  prediction: PredictionNode,
  signal: SignalNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "agent",
    position: { x: 50, y: 100 },
    data: {
      label: "Intelligence Agent",
      status: "active",
      description: "Primary data collection agent",
    },
  },
  { id: "2", type: "api", position: { x: 50, y: 250 }, data: { label: "Yahoo Finance", service: "Price & Options Data", status: "connected", latency: "18ms" } },
  { id: "3", type: "api", position: { x: 50, y: 370 }, data: { label: "NewsAPI.org", service: "Market Headlines", status: "connected", latency: "32ms" } },
  { id: "4", type: "api", position: { x: 50, y: 490 }, data: { label: "Alpha Vantage", service: "Technical Indicators", status: "connected", latency: "24ms" } },
  { id: "5", type: "api", position: { x: 50, y: 610 }, data: { label: "Truth Social", service: "Social Sentiment Feed", status: "connected", latency: "45ms" } },
  { id: "6", type: "api", position: { x: 50, y: 730 }, data: { label: "Reddit/WSB", service: "Retail Sentiment", status: "connected", latency: "38ms" } },
  { id: "7", type: "api", position: { x: 50, y: 850 }, data: { label: "Geopolitical Feed", service: "CNN · Reuters · Al Jazeera", status: "connected", latency: "52ms" } },
  { id: "8", type: "api", position: { x: 50, y: 970 }, data: { label: "CBOE", service: "VIX & Options Chain", status: "connected", latency: "15ms" } },
  { id: "9", type: "agent", position: { x: 400, y: 220 }, data: { label: "VADER Sentiment Engine", status: "processing", description: "Custom financial lexicon analyzer" } },
  { id: "10", type: "agent", position: { x: 400, y: 420 }, data: { label: "Technical Analysis", status: "processing", description: "MA · RSI · MACD · Aroon" } },
  { id: "11", type: "agent", position: { x: 400, y: 620 }, data: { label: "Oil Correlation Engine", status: "processing", description: "Brent/WTI vs Tech Sector" } },
  { id: "12", type: "agent", position: { x: 400, y: 820 }, data: { label: "Pattern Matcher", status: "processing", description: "TF-IDF historical similarity" } },
  { id: "13", type: "grok", position: { x: 750, y: 470 }, data: { label: "Grok AI Processor", model: "grok-2-beta", status: "processing", tokensProcessed: "2.8M" } },
  { id: "14", type: "signal", position: { x: 1080, y: 380 }, data: { label: "Signal Alignment", status: "active", description: "4/4 Signal Consensus Model" } },
  {
    id: "15",
    type: "prediction",
    position: { x: 1380, y: 430 },
    data: {
      label: "BlackLedger Predictions",
      confidence: "92.3%",
      predictions: [
        { symbol: "QQQ", action: "PUT", confidence: 94, target: "$555-560" },
        { symbol: "TSM", action: "CALL", confidence: 88, target: "$185" },
        { symbol: "SNDK", action: "PUT", confidence: 91, target: "$590" },
      ],
    },
  },
];

const green = { stroke: "#00ff41", strokeWidth: 2 };
const amber = { stroke: "#fbbf24", strokeWidth: 2 };
const pink = { stroke: "#ff0080", strokeWidth: 2 };
const pinkThick = { stroke: "#ff0080", strokeWidth: 3 };

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: green },
  { id: "e1-3", source: "1", target: "3", animated: true, style: green },
  { id: "e1-4", source: "1", target: "4", animated: true, style: green },
  { id: "e1-5", source: "1", target: "5", animated: true, style: green },
  { id: "e1-6", source: "1", target: "6", animated: true, style: green },
  { id: "e1-7", source: "1", target: "7", animated: true, style: green },
  { id: "e1-8", source: "1", target: "8", animated: true, style: green },
  { id: "e2-9", source: "2", target: "9", animated: true, style: green },
  { id: "e3-9", source: "3", target: "9", animated: true, style: green },
  { id: "e5-9", source: "5", target: "9", animated: true, style: green },
  { id: "e6-9", source: "6", target: "9", animated: true, style: green },
  { id: "e4-10", source: "4", target: "10", animated: true, style: green },
  { id: "e2-10", source: "2", target: "10", animated: true, style: green },
  { id: "e2-11", source: "2", target: "11", animated: true, style: green },
  { id: "e7-11", source: "7", target: "11", animated: true, style: green },
  { id: "e3-12", source: "3", target: "12", animated: true, style: green },
  { id: "e7-12", source: "7", target: "12", animated: true, style: green },
  { id: "e9-13", source: "9", target: "13", animated: true, style: amber },
  { id: "e10-13", source: "10", target: "13", animated: true, style: amber },
  { id: "e11-13", source: "11", target: "13", animated: true, style: amber },
  { id: "e12-13", source: "12", target: "13", animated: true, style: amber },
  { id: "e8-14", source: "8", target: "14", animated: true, style: green },
  { id: "e13-14", source: "13", target: "14", animated: true, style: pink },
  { id: "e14-15", source: "14", target: "15", animated: true, style: pinkThick },
];

function WorkflowCanvas() {
  const nodes = useMemo(() => initialNodes, []);
  const edges = useMemo(() => initialEdges, []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.15 }}
      nodesDraggable={false}
      nodesConnectable={false}
      elementsSelectable={false}
      panOnDrag={false}
      panOnScroll={false}
      zoomOnScroll={false}
      zoomOnPinch={false}
      zoomOnDoubleClick={false}
      preventScrolling={false}
      proOptions={{ hideAttribution: true }}
      className="bg-black"
    >
      <Background color="#00ff41" gap={20} size={1} variant={BackgroundVariant.Dots} className="opacity-10" />
    </ReactFlow>
  );
}

const NoSSRCanvas = dynamic(() => Promise.resolve(WorkflowCanvas), { ssr: false });

// Condensed mobile pipeline — 1 API node, then agent → grok → signal → predictions.
type MobileStage = {
  tag: string;
  title: string;
  meta: string;
  color: string;
  details: { label: string; value: string }[];
};

const mobileStages: MobileStage[] = [
  {
    tag: "01 · ingest",
    title: "Market Data APIs",
    meta: "7 live sources",
    color: "border-cyan-400/40 text-cyan-300",
    details: [
      { label: "Yahoo Finance", value: "price & options · 18ms" },
      { label: "NewsAPI.org", value: "market headlines · 32ms" },
      { label: "Alpha Vantage", value: "technical indicators · 24ms" },
      { label: "Truth Social", value: "social sentiment · 45ms" },
      { label: "Reddit / WSB", value: "retail sentiment · 38ms" },
      { label: "Geopolitical Feed", value: "cnn · reuters · al jazeera · 52ms" },
      { label: "CBOE", value: "vix & options chain · 15ms" },
    ],
  },
  {
    tag: "02 · agents",
    title: "Processing Agents",
    meta: "4 parallel pipelines",
    color: "border-purple-400/40 text-purple-300",
    details: [
      { label: "VADER Sentiment", value: "custom financial lexicon" },
      { label: "Technical Analysis", value: "ma · rsi · macd · aroon" },
      { label: "Oil Correlation", value: "brent / wti vs tech sector" },
      { label: "Pattern Matcher", value: "tf-idf historical similarity" },
    ],
  },
  {
    tag: "03 · ai",
    title: "Grok AI Processor",
    meta: "grok-2-beta",
    color: "border-amber-400/40 text-amber-300",
    details: [
      { label: "Model", value: "grok-2-beta" },
      { label: "Tokens processed", value: "2.8M" },
      { label: "Inputs", value: "4/4 agent streams" },
    ],
  },
  {
    tag: "04 · align",
    title: "Signal Alignment",
    meta: "4/4 consensus",
    color: "border-orange-400/40 text-orange-300",
    details: [
      { label: "Model", value: "4/4 signal consensus" },
      { label: "Status", value: "active" },
      { label: "Cross-check", value: "cboe vix overlay" },
    ],
  },
  {
    tag: "05 · output",
    title: "Predictions",
    meta: "92.3% confidence",
    color: "border-red-500/40 text-red-300",
    details: [
      { label: "QQQ", value: "PUT · 94% · $555-560" },
      { label: "TSM", value: "CALL · 88% · $185" },
      { label: "SNDK", value: "PUT · 91% · $590" },
    ],
  },
];

function MobilePipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".mp-stage", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative flex flex-col items-stretch gap-3 px-2 py-6">
      {mobileStages.map((s, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={s.tag} className="mp-stage">
            <button
              type="button"
              onClick={() => setOpenIdx(isOpen ? null : i)}
              aria-expanded={isOpen}
              className={`w-full rounded border bg-black/60 px-4 py-3 text-left transition-colors active:bg-black/80 ${s.color}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-60">{s.tag}</div>
                  <div className="mt-1 font-mono text-sm">{s.title}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">{s.meta}</div>
                </div>
                <span
                  className={`font-mono text-[10px] opacity-60 transition-transform ${isOpen ? "rotate-90" : ""}`}
                  aria-hidden
                >
                  ▶
                </span>
              </div>

              <div
                className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0">
                  <div className="border-t border-current/20 pt-3">
                    <ul className="space-y-2">
                      {s.details.map((d) => (
                        <li
                          key={d.label}
                          className="flex items-start justify-between gap-3 font-mono text-[10px] uppercase tracking-wider"
                        >
                          <span className="text-zinc-300">{d.label}</span>
                          <span className="text-right text-zinc-500">{d.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </button>
            {i < mobileStages.length - 1 && (
              <div className="mx-auto h-6 w-px bg-gradient-to-b from-green-500/60 to-transparent" />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(".workflow-canvas", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative mt-12 sm:mt-20">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-0 h-full w-screen -translate-x-1/2 bg-black"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 10%, #000 90%, transparent 100%)",
        }}
      />

      <div className="relative z-10">
        {/* Desktop full-bleed canvas */}
        <div className="workflow-canvas pointer-events-none relative left-1/2 hidden h-[85vh] min-h-[760px] w-screen -translate-x-1/2 overflow-hidden border-y border-zinc-900 bg-black md:block">
          <NoSSRCanvas />
        </div>

        {/* Mobile condensed pipeline */}
        <div className="md:hidden">
          <MobilePipeline />
        </div>

        <div className="mt-6 hidden flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.25em] text-zinc-600 md:flex">
          <span><span className="mr-2 inline-block h-2 w-2 rounded-full bg-cyan-400" />api sources</span>
          <span><span className="mr-2 inline-block h-2 w-2 rounded-full bg-purple-400" />processing agents</span>
          <span><span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-400" />grok ai hub</span>
          <span><span className="mr-2 inline-block h-2 w-2 rounded-full bg-orange-400" />signal alignment</span>
          <span><span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500" />predictions</span>
        </div>
      </div>
    </section>
  );
}
