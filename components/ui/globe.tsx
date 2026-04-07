"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, extend, useThree, type ThreeElement } from "@react-three/fiber";
import ThreeGlobe from "three-globe";
import { Color, Fog, PerspectiveCamera, Scene, AmbientLight, DirectionalLight, PointLight } from "three";
import countries from "@/data/globe.json";

extend({ ThreeGlobe });

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElement<typeof ThreeGlobe>;
  }
}

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: { lat: number; lng: number };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

export type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

type WorldProps = {
  globeConfig: GlobeConfig;
  data: Position[];
};

function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);

  const defaultProps: Required<Omit<GlobeConfig, "initialPosition">> & {
    initialPosition: { lat: number; lng: number };
  } = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#062056",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    autoRotate: true,
    autoRotateSpeed: 0.5,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    ...globeConfig,
  };

  useEffect(() => {
    if (!globeRef.current) return;
    const globe = globeRef.current;

    const material = globe.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    material.color = new Color(defaultProps.globeColor);
    material.emissive = new Color(defaultProps.emissive);
    material.emissiveIntensity = defaultProps.emissiveIntensity;
    material.shininess = defaultProps.shininess;

    globe
      .hexPolygonsData((countries as { features: object[] }).features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    globe
      .arcsData(data)
      .arcStartLat((d) => (d as Position).startLat)
      .arcStartLng((d) => (d as Position).startLng)
      .arcEndLat((d) => (d as Position).endLat)
      .arcEndLng((d) => (d as Position).endLng)
      .arcColor((d: object) => (d as Position).color)
      .arcAltitude((d) => (d as Position).arcAlt)
      .arcStroke(() => [0.32, 0.28, 0.3][Math.floor(Math.random() * 3)])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((d) => (d as Position).order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    const ringPoints = data.map((d) => ({
      lat: d.startLat,
      lng: d.startLng,
      color: d.color,
    }));
    globe
      .ringsData(ringPoints)
      .ringColor(() => (t: number) => `rgba(255,255,255,${1 - t})`)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(3)
      .ringRepeatPeriod((defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings);
  }, [data, defaultProps]);

  return (
    <threeGlobe
      ref={(r: ThreeGlobe | null) => {
        globeRef.current = r;
      }}
    />
  );
}

function Rig({ autoRotate, speed }: { autoRotate: boolean; speed: number }) {
  const { scene, camera } = useThree();
  useEffect(() => {
    scene.fog = new Fog(0x000000, 400, 2000);
  }, [scene]);
  useEffect(() => {
    if (!autoRotate) return;
    let raf = 0;
    let angle = 0;
    const radius = 300;
    const tick = () => {
      angle += 0.0015 * speed;
      camera.position.x = Math.sin(angle) * radius;
      camera.position.z = Math.cos(angle) * radius;
      camera.position.y = 80;
      camera.lookAt(0, 0, 0);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [autoRotate, speed, camera]);
  return null;
}

export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = useMemo(() => {
    const s = new Scene();
    s.fog = new Fog(0x000000, 400, 2000);
    return s;
  }, []);
  const camera = useMemo(() => new PerspectiveCamera(50, 1, 180, 1800), []);

  return (
    <Canvas scene={scene} camera={camera}>
      <ambientLight color={globeConfig.ambientLight ?? "#ffffff"} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight ?? "#ffffff"}
        position={[-400, 100, 400]}
      />
      <directionalLight
        color={globeConfig.directionalTopLight ?? "#ffffff"}
        position={[-200, 500, 200]}
      />
      <pointLight
        color={globeConfig.pointLight ?? "#ffffff"}
        position={[-200, 500, 200]}
        intensity={0.8}
      />
      <Globe {...props} />
      <Rig
        autoRotate={globeConfig.autoRotate ?? true}
        speed={globeConfig.autoRotateSpeed ?? 0.5}
      />
    </Canvas>
  );
}

// silence unused warnings for re-exported three primitives consumed by JSX intrinsics
export type _Unused = AmbientLight | DirectionalLight | PointLight;
