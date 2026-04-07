"use client";

import dynamic from "next/dynamic";
import type { GlobeConfig, Position } from "@/components/ui/globe";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  { ssr: false }
);

const globeConfig: GlobeConfig = {
  pointSize: 4,
  globeColor: "#0a0a0a",
  showAtmosphere: true,
  atmosphereColor: "#ffffff",
  atmosphereAltitude: 0.12,
  emissive: "#000000",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.6)",
  ambientLight: "#a3a3a3",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 1800,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 22.3193, lng: 114.1694 },
  autoRotate: true,
  autoRotateSpeed: 0.6,
};

const c = "#ffffff";
const sampleArcs: Position[] = [
  { order: 1, startLat: 40.7128, startLng: -74.006, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.3, color: c },
  { order: 1, startLat: 35.6762, startLng: 139.6503, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.2, color: c },
  { order: 2, startLat: 51.5074, startLng: -0.1278, endLat: 28.6139, endLng: 77.209, arcAlt: 0.35, color: c },
  { order: 2, startLat: -33.8688, startLng: 151.2093, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.25, color: c },
  { order: 3, startLat: 37.7749, startLng: -122.4194, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.4, color: c },
  { order: 3, startLat: 19.4326, startLng: -99.1332, endLat: 40.7128, endLng: -74.006, arcAlt: 0.2, color: c },
  { order: 4, startLat: -23.5505, startLng: -46.6333, endLat: 38.7223, endLng: -9.1393, arcAlt: 0.35, color: c },
  { order: 4, startLat: 55.7558, startLng: 37.6173, endLat: 39.9042, endLng: 116.4074, arcAlt: 0.3, color: c },
  { order: 5, startLat: 1.3521, startLng: 103.8198, endLat: -1.2921, endLng: 36.8219, arcAlt: 0.4, color: c },
  { order: 5, startLat: 25.2048, startLng: 55.2708, endLat: 51.5074, endLng: -0.1278, arcAlt: 0.3, color: c },
  { order: 6, startLat: 48.8566, startLng: 2.3522, endLat: 40.7128, endLng: -74.006, arcAlt: 0.35, color: c },
  { order: 6, startLat: 31.2304, startLng: 121.4737, endLat: 37.5665, endLng: 126.978, arcAlt: 0.15, color: c },
  { order: 7, startLat: -34.6037, startLng: -58.3816, endLat: 40.4168, endLng: -3.7038, arcAlt: 0.4, color: c },
  { order: 7, startLat: 41.0082, startLng: 28.9784, endLat: 30.0444, endLng: 31.2357, arcAlt: 0.2, color: c },
  { order: 8, startLat: 13.7563, startLng: 100.5018, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.15, color: c },
  { order: 8, startLat: 52.52, startLng: 13.405, endLat: 41.9028, endLng: 12.4964, arcAlt: 0.2, color: c },
];

export default function GlobeSection() {
  return (
    <section className="relative mt-32 sm:mt-40">
      {/* full-bleed black backdrop that hides the page grid behind the globe.
          extends past the section edges and fades top/bottom for seamless blend. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-0 h-full w-screen -translate-x-1/2 bg-black"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)",
        }}
      />

      <div className="relative z-10">
        <div className="mb-8 flex items-center gap-4 text-[11px] uppercase tracking-[0.25em] text-zinc-600">
          <span>signal · ingest</span>
          <span className="h-px flex-1 bg-zinc-800" />
          <span>realtime</span>
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-mono text-3xl font-light leading-tight text-zinc-100 sm:text-5xl">
            the world speaks.
            <br />
            <span className="text-zinc-500">we listen first.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-zinc-500">
            BlackLedger continuously ingests the freshest world news — wires,
            filings, market microstructure, and geopolitical chatter — and
            distills it into world-class predictive signal. every arc on the
            globe is a story being read, scored, and fed forward into the
            ledger before the rest of the room has finished its coffee.
          </p>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[11px] uppercase tracking-[0.25em] text-zinc-600">
            <li>// 2.4M sources monitored</li>
            <li>// sub-second classification</li>
            <li>// forecasts ranked, never averaged</li>
          </ul>
        </div>

        <div className="relative mx-auto mt-12 aspect-square w-full max-w-[1100px]">
          {/* radial vignette so the globe edges dissolve into pure black */}
          <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_58%,#000_85%)]" />
          <World globeConfig={globeConfig} data={sampleArcs} />
        </div>
      </div>
    </section>
  );
}
