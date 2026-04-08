"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Activity,
  Bot,
  Brain,
  CheckCircle2,
  Cpu,
  Crosshair,
  Database,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Wifi,
} from "lucide-react";

type AgentData = { label: string; description: string; status: string };
type ApiData = { label: string; service: string; status: string; latency: string };
type GrokData = { label: string; model: string; status: string; tokensProcessed: string };
type ClaudeData = { label: string; model: string; status: string; tokensProcessed: string; reasoning?: string };
type SignalData = { label: string; description: string };
type Prediction = { symbol: string; action: "PUT" | "CALL" | string; confidence: number; target?: string };
type PredictionData = { label: string; confidence: string; predictions: Prediction[] };

export function AgentNode({ data }: NodeProps) {
  const d = data as unknown as AgentData;
  return (
    <div className="min-w-[200px] rounded-lg border-2 border-purple-500/50 bg-black shadow-lg shadow-purple-500/20">
      <div className="flex items-center gap-2 border-b border-purple-500/30 bg-purple-950/50 px-3 py-2">
        <Bot className="h-4 w-4 text-purple-400" />
        <span className="font-mono text-xs uppercase tracking-wider text-purple-300">Agent</span>
      </div>
      <div className="p-3">
        <div className="mb-2 font-mono text-sm text-white">{d.label}</div>
        <div className="mb-2 font-mono text-xs text-purple-400/70">{d.description}</div>
        <div className="mt-3 flex items-center gap-2">
          <Activity className="h-3 w-3 animate-pulse text-green-400" />
          <span className="font-mono text-xs uppercase text-green-400">{d.status}</span>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="h-3 w-3 border-2 border-purple-300 bg-purple-500" />
      <Handle type="source" position={Position.Right} className="h-3 w-3 border-2 border-purple-300 bg-purple-500" />
    </div>
  );
}

export function APINode({ data }: NodeProps) {
  const d = data as unknown as ApiData;
  return (
    <div className="min-w-[200px] rounded-lg border-2 border-cyan-500/50 bg-black shadow-lg shadow-cyan-500/20">
      <div className="flex items-center gap-2 border-b border-cyan-500/30 bg-cyan-950/50 px-3 py-2">
        <Database className="h-4 w-4 text-cyan-400" />
        <span className="font-mono text-xs uppercase tracking-wider text-cyan-300">API Service</span>
      </div>
      <div className="p-3">
        <div className="mb-1 font-mono text-sm text-white">{d.label}</div>
        <div className="mb-3 font-mono text-xs text-cyan-400/70">{d.service}</div>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="h-3 w-3 text-green-400" />
            <span className="font-mono text-xs uppercase text-green-400">{d.status}</span>
          </div>
          <span className="font-mono text-xs text-cyan-400/60">{d.latency}</span>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="h-3 w-3 border-2 border-cyan-300 bg-cyan-500" />
      <Handle type="source" position={Position.Right} className="h-3 w-3 border-2 border-cyan-300 bg-cyan-500" />
    </div>
  );
}

export function GrokNode({ data }: NodeProps) {
  const d = data as unknown as GrokData;
  return (
    <div className="min-w-[220px] rounded-lg border-2 border-amber-500/50 bg-black shadow-lg shadow-amber-500/20">
      <div className="flex items-center gap-2 border-b border-amber-500/30 bg-amber-950/50 px-3 py-2">
        <Sparkles className="h-4 w-4 text-amber-400" />
        <span className="font-mono text-xs uppercase tracking-wider text-amber-300">Grok AI</span>
      </div>
      <div className="p-3">
        <div className="mb-1 font-mono text-sm text-white">{d.label}</div>
        <div className="mb-3 font-mono text-xs text-amber-400/70">Model: {d.model}</div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <Cpu className="h-3 w-3 animate-pulse text-amber-400" />
            <span className="font-mono text-xs uppercase text-amber-400">{d.status}</span>
          </div>
          <div className="rounded border border-amber-500/20 bg-amber-500/10 px-2 py-1">
            <div className="font-mono text-xs text-amber-400/80">
              Tokens: <span className="text-amber-300">{d.tokensProcessed}</span>
            </div>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="h-3 w-3 border-2 border-amber-300 bg-amber-500" />
      <Handle type="source" position={Position.Right} className="h-3 w-3 border-2 border-amber-300 bg-amber-500" />
    </div>
  );
}

export function ClaudeNode({ data }: NodeProps) {
  const d = data as unknown as ClaudeData;
  return (
    <div className="min-w-[240px] rounded-lg border-2 border-indigo-400/60 bg-black shadow-lg shadow-indigo-500/30">
      <div className="flex items-center gap-2 border-b border-indigo-400/40 bg-indigo-950/60 px-3 py-2">
        <Brain className="h-4 w-4 text-indigo-300" />
        <span className="font-mono text-xs uppercase tracking-wider text-indigo-200">Claude · Reasoner</span>
      </div>
      <div className="p-3">
        <div className="mb-1 font-mono text-sm text-white">{d.label}</div>
        <div className="mb-3 font-mono text-xs text-indigo-300/70">Model: {d.model}</div>
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <Cpu className="h-3 w-3 animate-pulse text-indigo-300" />
            <span className="font-mono text-xs uppercase text-indigo-300">{d.status}</span>
          </div>
          <div className="rounded border border-indigo-400/30 bg-indigo-500/10 px-2 py-1">
            <div className="font-mono text-xs text-indigo-200/80">
              Tokens: <span className="text-indigo-100">{d.tokensProcessed}</span>
            </div>
          </div>
          {d.reasoning && (
            <div className="rounded border border-indigo-400/20 bg-indigo-500/5 px-2 py-1">
              <div className="font-mono text-[10px] uppercase tracking-wider text-indigo-300/70">
                {d.reasoning}
              </div>
            </div>
          )}
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="h-3 w-3 border-2 border-indigo-200 bg-indigo-400" />
      <Handle type="source" position={Position.Right} className="h-3 w-3 border-2 border-indigo-200 bg-indigo-400" />
    </div>
  );
}

export function SignalNode({ data }: NodeProps) {
  const d = data as unknown as SignalData;
  const signals = [
    { name: "Sentiment", weight: 25 },
    { name: "Technicals", weight: 25 },
    { name: "Price Action", weight: 25 },
    { name: "Catalysts", weight: 25 },
  ];
  return (
    <div className="min-w-[200px] rounded-lg border-2 border-orange-500/50 bg-black shadow-lg shadow-orange-500/20">
      <div className="flex items-center gap-2 border-b border-orange-500/30 bg-orange-950/50 px-3 py-2">
        <Crosshair className="h-4 w-4 text-orange-400" />
        <span className="font-mono text-xs uppercase tracking-wider text-orange-300">Signal Align</span>
      </div>
      <div className="p-3">
        <div className="mb-1 font-mono text-sm text-white">{d.label}</div>
        <div className="mb-3 font-mono text-xs text-orange-400/70">{d.description}</div>
        <div className="mt-3 space-y-1.5">
          {signals.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded border border-orange-500/20 bg-orange-500/5 px-2 py-1"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-green-400" />
                <span className="font-mono text-xs text-white/80">{s.name}</span>
              </div>
              <span className="font-mono text-xs text-orange-400/70">{s.weight}%</span>
            </div>
          ))}
        </div>
        <div className="mt-3 border-t border-orange-500/20 pt-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-orange-400/70">Consensus</span>
            <span className="font-mono text-sm text-green-400">4/4</span>
          </div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="h-3 w-3 border-2 border-orange-300 bg-orange-500" />
      <Handle type="source" position={Position.Right} className="h-3 w-3 border-2 border-orange-300 bg-orange-500" />
    </div>
  );
}

export function PredictionNode({ data }: NodeProps) {
  const d = data as unknown as PredictionData;
  return (
    <div className="min-w-[280px] rounded-lg border-2 border-red-500/50 bg-black shadow-lg shadow-red-500/20">
      <div className="flex items-center gap-2 border-b border-red-500/30 bg-red-950/50 px-3 py-2">
        <Target className="h-4 w-4 text-red-400" />
        <span className="font-mono text-xs uppercase tracking-wider text-red-300">Predictions</span>
      </div>
      <div className="p-3">
        <div className="mb-1 font-mono text-sm text-white">{d.label}</div>
        <div className="mb-3 font-mono text-xs text-red-400/70">
          Confidence: <span className="text-red-400">{d.confidence}</span>
        </div>
        <div className="mt-3 space-y-1.5">
          {d.predictions?.slice(0, 3).map((p, i) => (
            <div key={i} className="space-y-1 rounded border border-red-500/20 bg-red-500/5 px-2 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {p.action === "PUT" ? (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-green-400" />
                  )}
                  <span className="font-mono text-xs text-white">{p.symbol}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-xs ${
                      p.action === "CALL"
                        ? "border border-green-500/30 bg-green-500/20 text-green-400"
                        : "border border-red-500/30 bg-red-500/20 text-red-400"
                    }`}
                  >
                    {p.action}
                  </span>
                </div>
                <span className="font-mono text-xs text-red-400/80">{p.confidence}%</span>
              </div>
              {p.target && (
                <div className="pl-5 font-mono text-xs text-red-400/60">Target: {p.target}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="h-3 w-3 border-2 border-red-300 bg-red-500" />
    </div>
  );
}
