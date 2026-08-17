import * as THREE from "three";

/**
 * Ambient WebGL particle field behind the hero card sequence.
 *
 * The cloud holds four formations that mirror the story the cards tell:
 * scattered silos -> a unified shell -> flowing streams -> an ordered field.
 * Scroll progress morphs between them, so the backdrop illustrates the same
 * narrative the copy is making without competing with it for attention.
 */

const COUNT = 3200;
const TAU = Math.PI * 2;

type Field = {
  setProgress: (p: number) => void;
  destroy: () => void;
};

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Deterministic pseudo-random so formations are stable between reloads. */
const rand = (i: number, salt: number) => {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return v - Math.floor(v);
};

/** 1. Six disconnected clusters — data sitting in separate systems. */
const silos = (out: Float32Array) => {
  for (let i = 0; i < COUNT; i++) {
    const k = i % 6;
    const a = (k / 6) * TAU;
    const cx = Math.cos(a) * 3.5;
    const cz = Math.sin(a) * 3.5;
    const cy = (rand(k, 5) - 0.5) * 1.6;
    const spread = 0.62;
    out[i * 3] = cx + (rand(i, 1) - 0.5) * spread * 2;
    out[i * 3 + 1] = cy + (rand(i, 2) - 0.5) * spread * 2;
    out[i * 3 + 2] = cz + (rand(i, 3) - 0.5) * spread * 2;
  }
};

/** 2. A single organized shell — everything pulled into one layer. */
const shell = (out: Float32Array) => {
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const jitter = 1 + (rand(i, 7) - 0.5) * 0.12;
    const radius = 2.25 * jitter;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
};

/** 3. Helical streams — work moving through the system. */
const streams = (out: Float32Array) => {
  for (let i = 0; i < COUNT; i++) {
    const strand = i % 7;
    const u = i / COUNT;
    const angle = u * Math.PI * 7 + (strand / 7) * TAU;
    const r = 1.15 + Math.sin(u * Math.PI) * 0.75 + (rand(i, 11) - 0.5) * 0.16;
    out[i * 3] = Math.cos(angle) * r;
    out[i * 3 + 1] = (u - 0.5) * 6.4;
    out[i * 3 + 2] = Math.sin(angle) * r;
  }
};

/** 4. A calm ordered plane — the settled result. */
const grid = (out: Float32Array) => {
  const cols = 80;
  for (let i = 0; i < COUNT; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const rows = Math.ceil(COUNT / cols);
    const x = (col / (cols - 1) - 0.5) * 9;
    const z = (row / (rows - 1) - 0.5) * 5.5;
    out[i * 3] = x;
    out[i * 3 + 1] = Math.sin(x * 0.8) * 0.25 + Math.cos(z * 0.9) * 0.2 - 0.4;
    out[i * 3 + 2] = z;
  }
};

/** Soft round sprite so points read as glowing dots, not squares. */
const dotTexture = () => {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
};

export function initFlowField(canvas: HTMLCanvasElement): Field | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
  } catch {
    return null; // No WebGL — the page still works, just without the backdrop.
  }

  const parent = canvas.parentElement ?? document.body;
  const sizeTo = () => {
    const { clientWidth: w, clientHeight: h } = parent;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 100);
  camera.position.set(0, 0, 7.4);

  // Precompute every formation once; the loop only ever interpolates.
  const forms = [new Float32Array(COUNT * 3), new Float32Array(COUNT * 3), new Float32Array(COUNT * 3), new Float32Array(COUNT * 3)];
  silos(forms[0]);
  shell(forms[1]);
  streams(forms[2]);
  grid(forms[3]);

  const palette = [
    new THREE.Color("#4c6b8f"), // muted: siloed and inert
    new THREE.Color("#3b82f6"), // accent: the AI layer switches on
    new THREE.Color("#5b9bff"), // brighter: work in motion
    new THREE.Color("#22d3ee"), // cyan: the result
  ];

  const positions = new Float32Array(COUNT * 3);
  positions.set(forms[0]);
  const colors = new Float32Array(COUNT * 3);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.055,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    map: dotTexture(),
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const pointer = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
    pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  let progress = 0;
  let visible = true;
  let raf = 0;
  const tmp = new THREE.Color();

  const frame = (time: number) => {
    raf = requestAnimationFrame(frame);
    if (!visible) return;

    // Hold each formation steady while the card is being read, then morph
    // over the tail of the step so the change lands with the card swap.
    const t = progress * 4;
    const step = Math.min(3, Math.floor(t));
    const blend = smoothstep(0.55, 1, t - step);
    const from = forms[step];
    const to = forms[Math.min(3, step + 1)];

    const cFrom = palette[step];
    const cTo = palette[Math.min(3, step + 1)];
    tmp.copy(cFrom).lerp(cTo, blend);

    const wobble = time * 0.0004;
    for (let i = 0; i < COUNT; i++) {
      const j = i * 3;
      // Per-particle drift keeps the cloud alive when progress is static.
      const d = Math.sin(wobble + i * 0.35) * 0.045;
      positions[j] = from[j] + (to[j] - from[j]) * blend + d;
      positions[j + 1] = from[j + 1] + (to[j + 1] - from[j + 1]) * blend + d * 0.7;
      positions[j + 2] = from[j + 2] + (to[j + 2] - from[j + 2]) * blend;

      colors[j] = tmp.r;
      colors[j + 1] = tmp.g;
      colors[j + 2] = tmp.b;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    points.rotation.y = time * 0.00007 + progress * 1.4;
    points.rotation.x = Math.sin(time * 0.00013) * 0.12;

    // Gentle parallax toward the cursor.
    camera.position.x += (pointer.x * 0.55 - camera.position.x) * 0.04;
    camera.position.y += (-pointer.y * 0.35 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  // Skip all GPU work while the hero is scrolled off screen.
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), { threshold: 0 });
  io.observe(parent);

  sizeTo();
  window.addEventListener("resize", sizeTo, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  raf = requestAnimationFrame(frame);

  return {
    setProgress: (p: number) => (progress = p),
    destroy: () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", sizeTo);
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      renderer.dispose();
    },
  };
}
