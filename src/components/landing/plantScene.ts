/**
 * The 3D process skid behind the landing page.
 *
 * One anime.js timeline, scrubbed by scroll through the hero stage, drives every value in `S`
 * (build height, layer fill, explode, clash, render, camera). Each frame reads `S` and draws.
 * After the hero, the finished model stays fixed behind the page, dimmed and slowly orbiting.
 */
import * as THREE from "three";
import { createTimeline, onScroll } from "animejs";
import { clamp01, isNarrow } from "./motion";

export type LayerKey = "struct" | "equip" | "proc" | "stm" | "cw" | "air" | "drn";

export const LAYER_KEYS: LayerKey[] = ["struct", "equip", "proc", "stm", "cw", "air", "drn"];

/** Balloons shown in the exploded view, in order. `left` puts the label on the left of its balloon. */
export const LAYER_BALLOONS: { key: LayerKey; label: string; leader: number; left: boolean; colorVar: string }[] = [
  { key: "struct", label: "Structure", leader: 30, left: false, colorVar: "--c-st" },
  { key: "equip", label: "Equipment", leader: 58, left: true, colorVar: "--c-eq" },
  { key: "proc", label: "Process", leader: 30, left: false, colorVar: "--c-proc" },
  { key: "stm", label: "Steam", leader: 58, left: true, colorVar: "--c-stm" },
  { key: "air", label: "Instrument air", leader: 30, left: false, colorVar: "--c-air" },
  { key: "cw", label: "Cooling water", leader: 58, left: true, colorVar: "--c-cw" },
  { key: "drn", label: "Drains", leader: 30, left: true, colorVar: "--c-drn" },
];

/** Clash markers sit where the demo model really does overlap. */
export const CLASHES: { id: string; at: [number, number, number] }[] = [
  { id: "C-014", at: [-9, 7.4, -7.2] },
  { id: "C-015", at: [3, 14.8, -2.5] },
  { id: "C-016", at: [-5, 8.6, -1] },
  { id: "C-017", at: [4, 8.6, -1] },
  { id: "C-018", at: [8, 7, -1] },
];

/** Scroll progress (0 to 100) at which each hero chapter ends. */
const CHAPTER_ENDS = [10, 30, 46.5, 70, 89.5, Infinity];

export interface PlantSceneOptions {
  canvas: HTMLCanvasElement;
  /** The tall hero element whose scroll range drives the timeline. */
  stage: HTMLElement;
  /** One element per entry in LAYER_BALLOONS, positioned each frame. */
  layerBalloons: HTMLElement[];
  /** One element per entry in CLASHES. */
  clashBalloons: HTMLElement[];
  reduceMotion: boolean;
  /** Family used for the dimension labels drawn in the plan view. */
  labelFont: string;
  onChapter: (index: number) => void;
  /** How many layers are currently switched on (0 to 7). */
  onLayers: (count: number) => void;
  onHint: (visible: boolean) => void;
}

interface LayerSpec {
  edge: number;
  wire: number;
  render: number;
  metal: number;
  rough: number;
  explode: THREE.Vector3;
  delay: number;
}

interface Layer {
  spec: LayerSpec;
  wire: THREE.Color;
  render: THREE.Color;
  edge: THREE.LineBasicMaterial;
  fill: THREE.MeshStandardMaterial;
  group: THREE.Group;
}

const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const smooth = (t: number) => {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
};

type Track = [at: number, value: number][];

/** Builds the scene and starts drawing. Returns a function that tears everything down. */
export function createPlantScene(opts: PlantSceneOptions): () => void {
  const { canvas, stage, layerBalloons, clashBalloons, reduceMotion } = opts;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return () => {};
  }

  // The look was tuned without colour management, so keep the output linear.
  THREE.ColorManagement.enabled = false;
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.localClippingEnabled = true;

  const abort = new AbortController();
  const scene = new THREE.Scene();
  const FOV = 28;
  const TAN = Math.tan((FOV * Math.PI) / 360);
  const camera = new THREE.PerspectiveCamera(FOV, 1, 1, 1600);

  /* studio environment for metal: a dark gradient with a few soft boxes, filtered into a reflection map */
  {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const k = c.getContext("2d");
    if (k) {
      const g = k.createLinearGradient(0, 0, 0, 256);
      g.addColorStop(0, "#cfd9e3");
      g.addColorStop(0.5, "#5d6b7a");
      g.addColorStop(0.52, "#1a2028");
      g.addColorStop(1, "#0e1217");
      k.fillStyle = g;
      k.fillRect(0, 0, 512, 256);
      k.fillStyle = "#fff";
      k.fillRect(70, 30, 90, 40);
      k.fillRect(300, 22, 130, 30);
      k.fillStyle = "#9fd8ff";
      k.fillRect(200, 60, 40, 24);
      const tex = new THREE.CanvasTexture(c);
      tex.mapping = THREE.EquirectangularReflectionMapping;
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromEquirectangular(tex).texture;
      pmrem.dispose();
      tex.dispose();
    }
  }
  // Intensities are multiplied by pi to match the pre-physical lighting the look was tuned with.
  scene.add(new THREE.AmbientLight(0xffffff, 0.4 * Math.PI));
  const sun = new THREE.DirectionalLight(0xffffff, 0.8 * Math.PI);
  sun.position.set(30, 70, 45);
  scene.add(sun);
  const pointerLight = new THREE.PointLight(0xbfe6ff, 0, 0, 2);
  scene.add(pointerLight);

  /* ---------- layers ---------- */
  const clipY = new THREE.Plane(V(0, -1, 0), 0.02);
  const SPEC: Record<LayerKey, LayerSpec> = {
    struct: { edge: 0xd5dde6, wire: 0x2b333c, render: 0x7e8a97, metal: 0.6, rough: 0.5, explode: V(0, 0, -5), delay: 0 },
    equip: { edge: 0x35d0e6, wire: 0x1d3a44, render: 0xb4c0ca, metal: 0.7, rough: 0.4, explode: V(0, 3, 10), delay: 0.08 },
    proc: { edge: 0xf04fc0, wire: 0x4a1f3d, render: 0xf04fc0, metal: 0.3, rough: 0.35, explode: V(0, 16, 0), delay: 0.2 },
    stm: { edge: 0xff4a3d, wire: 0x4d2420, render: 0xff4a3d, metal: 0.3, rough: 0.35, explode: V(0, 27, 0), delay: 0.3 },
    cw: { edge: 0x3fd17a, wire: 0x1c4a31, render: 0x3fd17a, metal: 0.3, rough: 0.35, explode: V(0, -8, 0), delay: 0.25 },
    air: { edge: 0x3d8bff, wire: 0x1d3050, render: 0x3d8bff, metal: 0.3, rough: 0.35, explode: V(0, 38, 0), delay: 0.4 },
    drn: { edge: 0xffd43b, wire: 0x4d4220, render: 0xffd43b, metal: 0.3, rough: 0.35, explode: V(0, -16, 0), delay: 0.35 },
  };
  const plant = new THREE.Group();
  scene.add(plant);
  const layers = {} as Record<LayerKey, Layer>;
  for (const key of LAYER_KEYS) {
    const spec = SPEC[key];
    const group = new THREE.Group();
    plant.add(group);
    layers[key] = {
      spec,
      group,
      wire: new THREE.Color(spec.wire),
      render: new THREE.Color(spec.render),
      edge: new THREE.LineBasicMaterial({ color: spec.edge, transparent: true, clippingPlanes: [clipY] }),
      fill: new THREE.MeshStandardMaterial({
        color: spec.wire,
        metalness: 0,
        roughness: 0.85,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        clippingPlanes: [clipY],
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
    };
  }

  /* ---------- geometry helpers ---------- */
  const box = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
  const cylY = (r: number, h: number, seg = 24) => new THREE.CylinderGeometry(r, r, h, seg);
  const cylX = (r: number, len: number, seg = 32) => {
    const g = new THREE.CylinderGeometry(r, r, len, seg);
    g.rotateZ(Math.PI / 2);
    return g;
  };
  const cylZ = (r: number, len: number, seg = 24) => {
    const g = new THREE.CylinderGeometry(r, r, len, seg);
    g.rotateX(Math.PI / 2);
    return g;
  };
  /** Adds a filled mesh with its edge lines to a layer. */
  function part(key: LayerKey, geo: THREE.BufferGeometry, x = 0, y = 0, z = 0, q?: THREE.Quaternion) {
    const layer = layers[key];
    const mesh = new THREE.Mesh(geo, layer.fill);
    mesh.position.set(x, y, z);
    if (q) mesh.quaternion.copy(q);
    mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 30), layer.edge));
    layer.group.add(mesh);
  }
  function ring(key: LayerKey, x: number, y: number, z: number, r: number, axis: "x" | "y") {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(axis === "x" ? V(0, Math.cos(a) * r, Math.sin(a) * r) : V(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
    const loop = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), layers[key].edge);
    loop.position.set(x, y, z);
    layers[key].group.add(loop);
  }
  function strut(key: LayerKey, a: THREE.Vector3, b: THREE.Vector3, r: number) {
    const d = b.clone().sub(a);
    const q = new THREE.Quaternion().setFromUnitVectors(V(0, 1, 0), d.clone().normalize());
    const mid = a.clone().add(b).multiplyScalar(0.5);
    part(key, cylY(r, d.length(), 8), mid.x, mid.y, mid.z, q);
  }

  /* ---------- structure: two-level pipe rack, grating, bracing ---------- */
  const XS = [-14, -5, 4, 13];
  const ZS = [-9, -1];
  for (const x of XS)
    for (const z of ZS) {
      part("struct", box(0.7, 14.3, 0.7), x, 7.15, z);
      part("struct", box(1.3, 0.2, 1.3), x, 0.1, z);
    }
  for (const y of [7, 14]) {
    for (const z of ZS) part("struct", box(27.7, 0.5, 0.5), -0.5, y, z);
    for (const x of XS) part("struct", box(0.5, 0.5, 8), x, y, -5);
  }
  part("struct", box(9, 0.25, 8), -9.5, 7.38, -5);
  strut("struct", V(-14, 0, -9), V(-5, 7, -9), 0.16);
  strut("struct", V(-5, 0, -1), V(-14, 7, -1), 0.16);
  strut("struct", V(4, 7, -9), V(13, 14, -9), 0.16);

  /* ---------- equipment: two vertical vessels, a shell and tube exchanger, a pump set ---------- */
  function vessel(x: number, z: number, r: number, h: number, skirt: number, nozzle: number) {
    part("equip", cylY(r * 0.96, skirt, 48), x, skirt / 2, z);
    part("equip", cylY(r, h, 48), x, skirt + h / 2, z);
    const head = new THREE.SphereGeometry(r, 48, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    head.scale(1, 0.4, 1);
    part("equip", head, x, skirt + h, z);
    const bottom = head.clone();
    bottom.rotateX(Math.PI);
    part("equip", bottom, x, skirt, z);
    part("equip", cylY(0.45, nozzle, 16), x, skirt + h + 0.4 * r + nozzle / 2 - 0.1, z);
    part("equip", cylZ(0.4, 1, 16), x, skirt + h * 0.4, z + r + 0.4);
    for (let k = 1; k < 5; k++) ring("equip", x, skirt + (h * k) / 5, z, r, "y");
  }
  vessel(-9, 5, 3, 7, 1.2, 1.2);
  vessel(-2, 5, 2.2, 5.2, 1, 1.0);
  part("equip", cylX(1.6, 9, 48), 7, 2.4, 5);
  part("equip", cylX(1.75, 1.6, 48), 1.7, 2.4, 5);
  part("equip", cylX(1.6, 1.2, 48), 12.1, 2.4, 5);
  part("equip", box(1.2, 0.8, 2.8), 4.5, 0.4, 5);
  part("equip", box(1.2, 0.8, 2.8), 9.5, 0.4, 5);
  part("equip", cylY(0.45, 1, 16), 3, 4.5, 5);
  part("equip", cylY(0.45, 0.8, 16), 10.5, 0.4, 5);
  for (const x of [3.5, 5.5, 7.5, 9.5, 11]) ring("equip", x, 2.4, 5, 1.62, "x");
  ring("equip", 2.5, 2.4, 5, 1.9, "x");
  ring("equip", 11.5, 2.4, 5, 1.9, "x");
  part("equip", box(5, 0.4, 2.4), 13.6, 0.2, 6);
  part("equip", cylX(0.9, 2.6, 24), 15, 1.4, 6);
  part("equip", cylX(1.1, 1, 24), 12.6, 1.4, 6);
  part("equip", cylY(0.35, 1.3, 16), 12.6, 2.85, 6);
  part("equip", cylX(0.4, 1, 16), 11.6, 1.4, 6);
  for (const x of [14.2, 14.7, 15.2, 15.7]) ring("equip", x, 1.4, 6, 0.95, "x");

  /* ---------- piping: rounded tube runs, one layer per service ---------- */
  function pipeGeometry(points: THREE.Vector3[], r: number) {
    const path = new THREE.CurvePath<THREE.Vector3>();
    const bend = Math.max(r * 2.6, 0.7);
    let prev = points[0].clone();
    for (let i = 1; i < points.length - 1; i++) {
      const p = points[i];
      const a = points[i - 1];
      const b = points[i + 1];
      const rr = Math.min(bend, a.distanceTo(p) / 2.05, b.distanceTo(p) / 2.05);
      const p1 = p.clone().sub(a).normalize().multiplyScalar(-rr).add(p);
      const p2 = b.clone().sub(p).normalize().multiplyScalar(rr).add(p);
      path.add(new THREE.LineCurve3(prev, p1));
      path.add(new THREE.QuadraticBezierCurve3(p1, p, p2));
      prev = p2;
    }
    path.add(new THREE.LineCurve3(prev, points[points.length - 1]));
    return new THREE.TubeGeometry(path, Math.ceil(path.getLength() / 0.25), r, 10, false);
  }
  type Run = [number, number, number][];
  const PIPES: Partial<Record<LayerKey, { r: number; runs: Run[] }>> = {
    proc: {
      r: 0.34,
      runs: [
        [[-9, 14.8, -4], [12.6, 14.8, -4]],
        [[-9, 14.8, -4], [-9, 14.8, 5], [-9, 10.6, 5]],
        [[3, 14.8, -4], [3, 14.8, 5], [3, 5, 5]],
        [[12.6, 14.8, -4], [12.6, 14.8, 6], [12.6, 3.5, 6]],
      ],
    },
    stm: { r: 0.26, runs: [[[-14, 16.2, -5.5], [6, 16.2, -5.5]], [[-2, 16.2, -5.5], [-2, 16.2, 5], [-2, 8.1, 5]]] },
    air: { r: 0.16, runs: [[[-6, 14.8, -2.5], [10, 14.8, -2.5]], [[-5.1, 14.8, -2.5], [-5.1, 14.8, 5.8], [-5.1, 6.5, 5.8]]] },
    cw: {
      r: 0.3,
      runs: [
        [[-12, 7.8, -7.2], [12, 7.8, -7.2]],
        [[-9, 7.8, -7.2], [-9, 1.4, -7.2]],
        [[10.5, 7.8, -7.2], [10.5, 7.8, 8.5], [10.5, 0.2, 8.5], [10.5, 0.2, 5]],
      ],
    },
    drn: { r: 0.22, runs: [[[-12, 8.6, -1], [8, 8.6, -1]], [[8, 8.6, -1], [8, 0.6, -1], [8, 0.6, 3.2]]] },
  };
  for (const key of LAYER_KEYS) {
    const def = PIPES[key];
    if (!def) continue;
    for (const run of def.runs) part(key, pipeGeometry(run.map(([x, y, z]) => V(x, y, z)), def.r));
  }
  function valve(key: LayerKey, x: number, y: number, z: number, r: number) {
    const big = r * 1.9;
    const small = r * 0.6;
    const len = r * 5;
    const a = new THREE.CylinderGeometry(big, small, len / 2, 16);
    const b = new THREE.CylinderGeometry(big, small, len / 2, 16);
    a.rotateZ(-Math.PI / 2);
    a.translate(-len / 4, 0, 0);
    b.rotateZ(Math.PI / 2);
    b.translate(len / 4, 0, 0);
    part(key, a, x, y, z);
    part(key, b, x, y, z);
    part(key, cylY(0.07, 1.2, 8), x, y + big + 0.5, z);
    const wheel = new THREE.TorusGeometry(0.5, 0.06, 8, 24);
    wheel.rotateX(Math.PI / 2);
    part(key, wheel, x, y + big + 1.1, z);
  }
  valve("proc", -3, 14.8, -4, 0.34);
  valve("stm", -8, 16.2, -5.5, 0.26);
  valve("air", 0, 14.8, -2.5, 0.16);
  valve("cw", 2, 7.8, -7.2, 0.3);
  valve("drn", -8, 8.6, -1, 0.22);

  /* ---------- clash markers ---------- */
  const clashGroup = new THREE.Group();
  scene.add(clashGroup);
  const clashMat = new THREE.MeshBasicMaterial({ color: 0xff4a3d, transparent: true, opacity: 0, depthWrite: false });
  const clashLine = new THREE.LineBasicMaterial({ color: 0xff4a3d, transparent: true, opacity: 0 });
  const clashPoints = CLASHES.map((c) => V(c.at[0], c.at[1], c.at[2]));
  const clashSpheres: THREE.Mesh[] = [];
  for (const p of clashPoints) {
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.1, 20, 14), clashMat);
    sphere.position.copy(p);
    clashGroup.add(sphere);
    clashSpheres.push(sphere);
    for (const axis of [0, 1, 2]) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        const u = Math.cos(a) * 1.5;
        const w = Math.sin(a) * 1.5;
        pts.push(axis === 0 ? V(0, u, w) : axis === 1 ? V(u, 0, w) : V(u, w, 0));
      }
      const loop = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), clashLine);
      loop.position.copy(p);
      clashGroup.add(loop);
    }
  }

  /* ---------- plan view furniture: grid, footprints, centrelines, dimensions in mm ---------- */
  const grid = new THREE.GridHelper(400, 200, 0x2a323c, 0x1c222a);
  grid.position.y = -0.02;
  const gridMat = grid.material as THREE.LineBasicMaterial;
  gridMat.transparent = true;
  gridMat.opacity = 0.7;
  scene.add(grid);
  const planMat = new THREE.LineBasicMaterial({ color: 0x8fa0b3, transparent: true });
  const dashMat = new THREE.LineDashedMaterial({ color: 0x6f8296, dashSize: 1.2, gapSize: 0.5, transparent: true });
  const solid: number[] = [];
  const dashed: number[] = [];
  const seg = (a: number, b: number, c: number, d: number) => solid.push(a, 0.02, b, c, 0.02, d);
  const dash = (a: number, b: number, c: number, d: number) => dashed.push(a, 0.02, b, c, 0.02, d);
  const rect = (a: number, b: number, c: number, d: number) => {
    seg(a, b, c, b);
    seg(c, b, c, d);
    seg(c, d, a, d);
    seg(a, d, a, b);
  };
  const circle = (x: number, z: number, r: number) => {
    const n = 40;
    const step = (Math.PI * 2) / n;
    for (let i = 0; i < n; i++)
      seg(x + Math.cos(i * step) * r, z + Math.sin(i * step) * r, x + Math.cos((i + 1) * step) * r, z + Math.sin((i + 1) * step) * r);
  };
  rect(-14.3, -9.3, 13.3, -0.7);
  circle(-9, 5, 3);
  circle(-2, 5, 2.2);
  rect(1.5, 3.4, 12.5, 6.6);
  rect(11.1, 4.8, 16.1, 7.2);
  for (const x of XS) seg(x, -12, x, 10);
  for (const z of ZS) seg(-16.5, z, 15, z);
  seg(-14.3, 11, 13.3, 11);
  seg(-14.3, 10.5, -14.3, 11.5);
  seg(13.3, 10.5, 13.3, 11.5);
  seg(17.5, -9.3, 17.5, -0.7);
  seg(17, -9.3, 18, -9.3);
  seg(17, -0.7, 18, -0.7);
  dash(-9, -1, -9, 9);
  dash(-2, 2, -2, 8.5);
  dash(7, 2.5, 7, 7.5);
  const planGeo = new THREE.BufferGeometry();
  planGeo.setAttribute("position", new THREE.Float32BufferAttribute(solid, 3));
  scene.add(new THREE.LineSegments(planGeo, planMat));
  const dashGeo = new THREE.BufferGeometry();
  dashGeo.setAttribute("position", new THREE.Float32BufferAttribute(dashed, 3));
  const centrelines = new THREE.LineSegments(dashGeo, dashMat);
  centrelines.computeLineDistances();
  scene.add(centrelines);

  const labels: { text: string; ctx: CanvasRenderingContext2D; tex: THREE.CanvasTexture; mat: THREE.SpriteMaterial }[] = [];
  function paintLabels() {
    for (const l of labels) {
      l.ctx.clearRect(0, 0, 256, 64);
      l.ctx.fillStyle = "#c9d4df";
      l.ctx.textAlign = "center";
      l.ctx.textBaseline = "middle";
      l.ctx.font = `500 40px ${opts.labelFont}`;
      l.ctx.fillText(l.text, 128, 34);
      l.tex.needsUpdate = true;
    }
  }
  function label(text: string, x: number, z: number, rotation = 0, scale = 1) {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 64;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, rotation, depthTest: false });
    const sprite = new THREE.Sprite(mat);
    sprite.position.set(x, 0.1, z);
    sprite.scale.set(5.2 * scale, 1.3 * scale, 1);
    scene.add(sprite);
    labels.push({ text, ctx, tex, mat });
  }
  label("13 500", -0.5, 12.3);
  label("4 000", 19.2, -5, Math.PI / 2);
  label("V-101", -9, 5, 0, 0.8);
  label("V-102", -2, 5, 0, 0.8);
  label("E-101", 7, 5, 0, 0.8);
  label("P-101", 13.6, 6, 0, 0.7);
  ["A", "B", "C", "D"].forEach((t, i) => label(t, XS[i], -13, 0, 0.7));
  paintLabels();

  /* the plane that rises with the model while it is being built */
  const scan = new THREE.Group();
  scene.add(scan);
  const scanFill = new THREE.Mesh(
    new THREE.PlaneGeometry(38, 24),
    new THREE.MeshBasicMaterial({ color: 0x35d0e6, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false }),
  );
  scanFill.rotation.x = -Math.PI / 2;
  scanFill.position.set(0, 0, 1);
  scan.add(scanFill);
  scan.add(
    new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints([V(-19, 0, -11), V(19, 0, -11), V(19, 0, 13), V(-19, 0, 13)]),
      new THREE.LineBasicMaterial({ color: 0x35d0e6, transparent: true }),
    ),
  );

  /* ---------- the scroll timeline ---------- */
  const S = { clip: 0.02, solid: 0, ren: 0, plan: 1, ex: 0, red: 0, az: 0, el: 88, Wd: 40, Hd: 26, ty: 0 };
  type StateKey = keyof typeof S;
  const timeline = createTimeline({
    autoplay: onScroll({ target: stage, enter: "top top", leave: "bottom bottom", sync: reduceMotion ? true : 0.25 }),
  });
  function track(key: StateKey, frames: Track, ease = "inOutQuad") {
    for (let i = 1; i < frames.length; i++) {
      const [from, a] = frames[i - 1];
      const [to, b] = frames[i];
      timeline.add(S, { [key]: [a, b], duration: to - from, ease }, from);
    }
  }
  track("plan", [[0, 1], [8, 1], [17, 0], [100, 0]]);
  track("clip", [[0, 0.02], [8, 0.02], [28, 17.4], [29, 60], [100, 60]]);
  track("solid", [[0, 0], [30, 0], [46, 7], [100, 7]], "linear");
  track("ex", [[0, 0], [47, 0], [58, 1], [66, 1], [74, 0], [100, 0]]);
  track("red", [[0, 0], [74, 0], [78, 1], [88, 1], [91, 0], [100, 0]]);
  track("ren", [[0, 0], [89, 0], [97, 1], [100, 1]]);
  track("az", [[0, 0], [8, 0], [28, 32], [46, 42], [58, 30], [66, 24], [74, 26], [86, 8], [100, -30]]);
  track("el", [[0, 88], [8, 88], [28, 26], [46, 22], [58, 12], [66, 12], [74, 30], [86, 36], [100, 16]]);
  track("Wd", [[0, 40], [8, 40], [28, 46], [46, 46], [58, 54], [66, 54], [74, 46], [86, 44], [100, 46]]);
  track("Hd", [[0, 26], [8, 26], [28, 30], [46, 30], [58, 76], [66, 76], [74, 34], [86, 34], [100, 30]]);
  track("ty", [[0, 0], [8, 0], [28, 7.5], [46, 7.5], [58, 19], [66, 19], [74, 8], [100, 8]]);

  /* ---------- sizing ---------- */
  const ANCHOR: Record<LayerKey, THREE.Vector3> = {
    struct: V(13, 14.4, -9),
    equip: V(-9, 9.4, 5),
    proc: V(12.6, 14.8, -4),
    stm: V(-14, 16.2, -5.5),
    air: V(10, 14.8, -2.5),
    cw: V(-12, 7.8, -7.2),
    drn: V(-12, 8.6, -1),
  };
  let vw = 1;
  let vh = 1;
  let narrow = false;
  let heroEnd = 0;
  let docHeight = 0;
  let dirty = true;
  let px = 0;
  let py = 0;
  let tpx = 0;
  let tpy = 0;
  const v3 = new THREE.Vector3();

  function measurePage() {
    heroEnd = stage.offsetTop + stage.offsetHeight - window.innerHeight;
    docHeight = document.documentElement.scrollHeight;
  }
  function resize() {
    vw = window.innerWidth || 1;
    vh = window.innerHeight || 1;
    narrow = isNarrow();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh;
    // Shift the model right of the text on desktop, and below it on phones.
    if (narrow) camera.setViewOffset(vw, vh, 0, -vh * 0.17, vw, vh);
    else camera.setViewOffset(vw, vh, -vw * 0.14, 0, vw, vh);
    camera.updateProjectionMatrix();
    measurePage();
    dirty = true;
  }
  window.addEventListener("resize", resize, { signal: abort.signal });
  window.addEventListener(
    "pointermove",
    (e) => {
      tpx = e.clientX / window.innerWidth - 0.5;
      tpy = e.clientY / window.innerHeight - 0.5;
    },
    { passive: true, signal: abort.signal },
  );
  const measureTimer = window.setInterval(measurePage, 1200);
  document.fonts?.ready.then(() => {
    if (abort.signal.aborted) return;
    paintLabels();
    measurePage();
    dirty = true;
  });

  /* ---------- draw ---------- */
  let chapter = -1;
  let layersOn = -1;
  let hintOn: boolean | null = null;
  let lastKey = "";
  let raf = 0;

  function setPlaced(el: HTMLElement, opacity: number, world: THREE.Vector3) {
    el.style.opacity = String(opacity);
    if (opacity < 0.01) return;
    v3.copy(world).project(camera);
    el.style.transform = `translate(${((v3.x * 0.5 + 0.5) * vw).toFixed(1)}px,${((-v3.y * 0.5 + 0.5) * vh).toFixed(1)}px)`;
  }

  function draw(time: number) {
    raf = requestAnimationFrame(draw);
    const scrollY = window.scrollY;
    const parallax = narrow || reduceMotion ? 0 : 1;
    px += (tpx - px) * 0.06;
    py += (tpy - py) * 0.06;

    // Skip the frame when nothing that affects the picture has changed.
    const pulsing = S.red > 0.01;
    const key = `${scrollY}|${timeline.currentTime.toFixed(3)}|${(px * parallax).toFixed(3)}|${(py * parallax).toFixed(3)}`;
    if (!dirty && !pulsing && key === lastKey) return;
    lastKey = key;
    dirty = false;

    /* model state */
    clipY.constant = S.clip >= 17.5 ? 1000 : S.clip;
    scan.visible = S.clip > 0.3 && S.clip < 17.5;
    scan.position.y = S.clip;
    const edgeOpacity = (1 - 0.72 * S.ren) * (1 - 0.6 * S.red);
    LAYER_KEYS.forEach((k, idx) => {
      const l = layers[k];
      const a = clamp01(S.solid - idx) * (1 - 0.5 * S.red);
      l.edge.opacity = edgeOpacity;
      l.fill.opacity = a;
      l.fill.visible = a > 0.01;
      const transparent = a < 0.995 || S.red > 0.01;
      if (l.fill.transparent !== transparent) {
        l.fill.transparent = transparent;
        l.fill.needsUpdate = true;
      }
      l.fill.color.copy(l.wire).lerp(l.render, S.ren);
      l.fill.metalness = l.spec.metal * S.ren;
      l.fill.roughness = 0.85 + (l.spec.rough - 0.85) * S.ren;
      l.group.position.copy(l.spec.explode).multiplyScalar(smooth(S.ex * 1.4 - l.spec.delay));
    });
    planMat.opacity = S.plan * 0.9;
    planMat.visible = S.plan > 0.01;
    dashMat.opacity = S.plan * 0.8;
    centrelines.visible = S.plan > 0.01;
    for (const l of labels) {
      l.mat.opacity = S.plan;
      l.mat.visible = S.plan > 0.01;
    }
    grid.position.y = -0.02 - 17 * smooth(S.ex * 1.2);
    gridMat.opacity = 0.7 * (1 - 0.5 * S.ren);
    const pulse = Math.sin(time * 0.006);
    clashMat.opacity = S.red * (0.28 + 0.12 * pulse);
    clashLine.opacity = S.red;
    clashGroup.visible = pulsing;
    for (const s of clashSpheres) s.scale.setScalar(1 + 0.12 * pulse);

    /* camera: framing is solved from the width and height each stage must show */
    const aspect = vw / vh;
    const fitW = narrow ? 0.92 : 0.58;
    const fitH = narrow ? 0.5 : 0.78;
    const dist = Math.max(S.Wd / (2 * TAN * aspect * fitW), S.Hd / (2 * TAN * fitH));
    // After the hero: keep orbiting slowly and dim the model so page text stays readable.
    const post = clamp01((scrollY - heroEnd) / Math.max(1, docHeight - heroEnd - vh));
    const fade = clamp01((scrollY - heroEnd) / (vh * 0.7));
    canvas.style.opacity = (1 - 0.8 * fade).toFixed(3);
    const az = ((S.az + post * 150 + px * 5 * parallax * Math.min(1, S.el / 20)) * Math.PI) / 180;
    const el = (Math.min(89, S.el + Math.sin(post * Math.PI) * 8 - py * 3 * parallax) * Math.PI) / 180;
    camera.position.set(dist * Math.cos(el) * Math.sin(az), S.ty + dist * Math.sin(el), dist * Math.cos(el) * Math.cos(az));
    camera.lookAt(0, S.ty, 0);
    pointerLight.intensity = parallax * S.ren * 22000;
    pointerLight.position.set(camera.position.x + px * 100, camera.position.y + 50 - py * 40, camera.position.z + 30);
    renderer.render(scene, camera);

    /* page furniture tied to progress */
    const progress = (timeline.currentTime / timeline.duration) * 100;
    const nextChapter = CHAPTER_ENDS.findIndex((end) => progress < end);
    if (nextChapter !== chapter) {
      chapter = nextChapter;
      opts.onChapter(chapter);
    }
    const nextLayers = LAYER_KEYS.filter((_, idx) => S.solid > idx + 0.4).length;
    if (nextLayers !== layersOn) {
      layersOn = nextLayers;
      opts.onLayers(layersOn);
    }
    const nextHint = progress < 3;
    if (nextHint !== hintOn) {
      hintOn = nextHint;
      opts.onHint(hintOn);
    }
    const balloonOpacity = clamp01((S.ex - 0.75) / 0.25);
    LAYER_BALLOONS.forEach((b, idx) => {
      const el2 = layerBalloons[idx];
      if (!el2) return;
      v3.copy(ANCHOR[b.key]);
      layers[b.key].group.localToWorld(v3);
      setPlaced(el2, balloonOpacity, v3.clone());
    });
    const clashOpacity = clamp01(S.red * 1.4 - 0.2);
    clashPoints.forEach((p, idx) => {
      const el2 = clashBalloons[idx];
      if (el2) setPlaced(el2, clashOpacity, p);
    });
  }

  resize();
  raf = requestAnimationFrame(draw);

  return () => {
    abort.abort();
    cancelAnimationFrame(raf);
    window.clearInterval(measureTimer);
    timeline.revert();
    scene.traverse((obj) => {
      const o = obj as THREE.Mesh;
      o.geometry?.dispose();
      const mat = o.material;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    });
    for (const l of labels) l.tex.dispose();
    scene.environment?.dispose();
    renderer.dispose();
  };
}
