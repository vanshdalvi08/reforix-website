"use client";

import { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ACCENT = "#E87722";
const GOLD = "#C0922A";
const BG = "#0a0a0a";

/** Renders only the edges of a geometry — the CAD-wireframe look. */
function Wire({
  geometry,
  color = ACCENT,
  opacity = 0.5,
  position,
  rotation,
}: {
  geometry: THREE.BufferGeometry;
  color?: string;
  opacity?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geometry, 1), [geometry]);
  return (
    <lineSegments geometry={edges} position={position} rotation={rotation}>
      <lineBasicMaterial color={color} transparent opacity={opacity} fog />
    </lineSegments>
  );
}

/** A vertical storage tank. */
function Tank({
  position,
  radius,
  height,
  color = ACCENT,
  opacity = 0.5,
}: {
  position: [number, number, number];
  radius: number;
  height: number;
  color?: string;
  opacity?: number;
}) {
  const geo = useMemo(() => new THREE.CylinderGeometry(radius, radius, height, 20, 3), [radius, height]);
  return <Wire geometry={geo} color={color} opacity={opacity} position={[position[0], position[1] + height / 2, position[2]]} />;
}

/** A tall tapered distillation column — the scene's focal object. */
function Column({ position }: { position: [number, number, number] }) {
  const bodyGeo = useMemo(() => new THREE.CylinderGeometry(1.1, 1.3, 14, 24, 6), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(1.35, 0.05, 6, 24), []);
  return (
    <group position={position}>
      <Wire geometry={bodyGeo} color={GOLD} opacity={0.6} position={[0, 7, 0]} />
      {[2, 5, 8, 11].map((y) => (
        <Wire key={y} geometry={ringGeo} color={ACCENT} opacity={0.35} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} />
      ))}
    </group>
  );
}

/** A horizontal pressure vessel. */
function HorizontalVessel({ position, length, radius }: { position: [number, number, number]; length: number; radius: number }) {
  const geo = useMemo(() => new THREE.CapsuleGeometry(radius, length, 4, 12), [radius, length]);
  return <Wire geometry={geo} color={ACCENT} opacity={0.45} position={position} rotation={[0, 0, Math.PI / 2]} />;
}

/** An elevated steel pipe-rack: columns + horizontal beams. */
function PipeRack({ position, length, levels }: { position: [number, number, number]; length: number; levels: number }) {
  const colGeo = useMemo(() => new THREE.BoxGeometry(0.15, levels * 1.6, 0.15), [levels]);
  const beamGeo = useMemo(() => new THREE.BoxGeometry(length, 0.12, 0.12), [length]);
  const columnCount = Math.max(2, Math.round(length / 2.5));

  const columns = useMemo(
    () => Array.from({ length: columnCount }, (_, i) => -length / 2 + (i * length) / (columnCount - 1)),
    [columnCount, length]
  );

  return (
    <group position={position}>
      {columns.map((x) => (
        <Wire key={x} geometry={colGeo} color={ACCENT} opacity={0.3} position={[x, (levels * 1.6) / 2, 0]} />
      ))}
      {Array.from({ length: levels }, (_, i) => (
        <Wire key={i} geometry={beamGeo} color={ACCENT} opacity={0.45} position={[0, 1 + i * 1.4, 0]} />
      ))}
    </group>
  );
}

/** Builds a cylinder geometry running from point `a` to point `b`. */
function segmentGeometry(a: [number, number, number], b: [number, number, number], radius: number) {
  const va = new THREE.Vector3(...a);
  const vb = new THREE.Vector3(...b);
  const length = va.distanceTo(vb);
  const geo = new THREE.CylinderGeometry(radius, radius, length, 10, 1);
  const midpoint = va.clone().add(vb).multiplyScalar(0.5);
  const dir = vb.clone().sub(va).normalize();
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
  geo.applyQuaternion(quat);
  geo.translate(midpoint.x, midpoint.y, midpoint.z);
  return geo;
}

/** Simple right-angle pipe run: two straight segments meeting at an elbow. */
function PipeRun({
  start,
  mid,
  end,
  radius = 0.06,
}: {
  start: [number, number, number];
  mid: [number, number, number];
  end: [number, number, number];
  radius?: number;
}) {
  const geoA = useMemo(() => segmentGeometry(start, mid, radius), [start, mid, radius]);
  const geoB = useMemo(() => segmentGeometry(mid, end, radius), [mid, end, radius]);
  return (
    <>
      <Wire geometry={geoA} color={GOLD} opacity={0.4} />
      <Wire geometry={geoB} color={GOLD} opacity={0.4} />
    </>
  );
}

/** Flare stack — thin tower with a small conical tip. */
function FlareStack({ position }: { position: [number, number, number] }) {
  const stemGeo = useMemo(() => new THREE.CylinderGeometry(0.12, 0.16, 16, 10), []);
  const tipGeo = useMemo(() => new THREE.ConeGeometry(0.3, 1, 10), []);
  return (
    <group position={position}>
      <Wire geometry={stemGeo} color={ACCENT} opacity={0.4} position={[0, 8, 0]} />
      <Wire geometry={tipGeo} color={GOLD} opacity={0.55} position={[0, 16.5, 0]} />
    </group>
  );
}

/** The full procedural plant layout. */
function Plant() {
  const groundGeo = useMemo(() => new THREE.PlaneGeometry(60, 60, 24, 24), []);
  return (
    <group>
      {/* Ground blueprint grid */}
      <Wire geometry={groundGeo} color={ACCENT} opacity={0.08} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} />

      <Column position={[-2, 0, -2]} />

      <Tank position={[6, 0, 3]} radius={2} height={5} />
      <Tank position={[9.5, 0, 1]} radius={1.4} height={3.5} opacity={0.4} />
      <Tank position={[-8, 0, 6]} radius={1.8} height={4} opacity={0.35} />

      <HorizontalVessel position={[2, 2, 8]} length={4} radius={0.9} />
      <HorizontalVessel position={[-4, 1.5, -7]} length={3} radius={0.7} />

      <PipeRack position={[0, 0, -1.5]} length={14} levels={2} />
      <PipeRack position={[3, 0, 5]} length={8} levels={1} />

      <PipeRun start={[-2, 3.5, -2]} mid={[-2, 5.5, 3]} end={[6, 5.5, 3]} />
      <PipeRun start={[6, 4, 3]} mid={[8, 4, 3]} end={[8, 1.4, 2]} />
      <PipeRun start={[0, 1, -1.5]} mid={[0, 1, 8]} end={[2, 1, 8]} />

      <FlareStack position={[-9, 0, -6]} />
    </group>
  );
}

/** Slow, continuous drone-style orbit over the plant. */
function DroneRig() {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime * 0.045;
    const radius = 20 + Math.sin(t * 0.6) * 3;
    const height = 9 + Math.sin(t * 0.9) * 2;
    camera.position.set(Math.cos(t) * radius, height, Math.sin(t) * radius + 2);
    camera.lookAt(0, 2.5, 0);
  });
  return null;
}

export default function PlantScene() {
  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 42, near: 0.1, far: 100 }}
      style={{ pointerEvents: "none" }}
    >
      <fog attach="fog" args={[BG, 14, 42]} />
      <DroneRig />
      <Plant />
    </Canvas>
  );
}
