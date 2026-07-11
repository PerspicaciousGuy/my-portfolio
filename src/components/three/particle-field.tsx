"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 4200;

/** Cursor repulsion. The particles spring back because the easing above
 *  always pulls them toward their target — the push is a per-frame nudge. */
const REPEL_RADIUS = 1.5;
const REPEL_STRENGTH = 0.28;

/** Rough humanoid point cloud — a nod to the Open Muscle Map project. */
function humanoidTarget(i: number, rng: () => number): THREE.Vector3 {
  const t = i / COUNT;
  const r = rng();

  // head
  if (t < 0.09) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(0.52);
    return v.add(new THREE.Vector3(0, 2.35, 0));
  }
  // torso
  if (t < 0.42) {
    const y = 0.35 + rng() * 1.55;
    const taper = 1 - Math.abs(y - 1.15) * 0.18;
    const a = rng() * Math.PI * 2;
    const rad = (0.42 + rng() * 0.34) * taper;
    return new THREE.Vector3(Math.cos(a) * rad * 1.5, y, Math.sin(a) * rad * 0.62);
  }
  // arms
  if (t < 0.62) {
    const side = rng() > 0.5 ? 1 : -1;
    const d = rng();
    const x = side * (0.72 + d * 1.28);
    const y = 1.86 - d * 1.45;
    const j = 0.13;
    return new THREE.Vector3(
      x + (rng() - 0.5) * j,
      y + (rng() - 0.5) * j,
      (rng() - 0.5) * j,
    );
  }
  // legs
  if (t < 0.92) {
    const side = rng() > 0.5 ? 1 : -1;
    const d = rng();
    const x = side * (0.3 + d * 0.12);
    const y = 0.35 - d * 2.15;
    const j = 0.17;
    return new THREE.Vector3(
      x + (rng() - 0.5) * j,
      y + (rng() - 0.5) * j,
      (rng() - 0.5) * j,
    );
  }
  // ambient dust
  const v = new THREE.Vector3().randomDirection().multiplyScalar(2.6 + r * 2.4);
  return v;
}

function sphereTarget(rng: () => number): THREE.Vector3 {
  return new THREE.Vector3().randomDirection().multiplyScalar(2.1 + rng() * 0.45);
}

function fieldTarget(rng: () => number): THREE.Vector3 {
  return new THREE.Vector3(
    (rng() - 0.5) * 13,
    (rng() - 0.5) * 8,
    (rng() - 0.5) * 6 - 1,
  );
}

function convergeTarget(rng: () => number): THREE.Vector3 {
  const v = new THREE.Vector3().randomDirection();
  return v.multiplyScalar(0.35 + Math.pow(rng(), 3) * 2.6);
}

/** Deterministic PRNG so server and client agree and reloads are stable. */
function makeRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

type Props = {
  /** 0 → 1 scroll progress through the page. */
  scroll: React.RefObject<number>;
  isDark: boolean;
};

export function ParticleField({ scroll, isDark }: Props) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);
  const { viewport, pointer } = useThree();

  // Four morph targets, generated once.
  const { positions, targets, seeds } = useMemo(() => {
    const rng = makeRng(20260711);
    const stages: Float32Array[] = [];

    for (let stage = 0; stage < 4; stage++) {
      const arr = new Float32Array(COUNT * 3);
      const r = makeRng(1000 + stage * 77);
      for (let i = 0; i < COUNT; i++) {
        let v: THREE.Vector3;
        if (stage === 0) v = humanoidTarget(i, r);
        else if (stage === 1) v = sphereTarget(r);
        else if (stage === 2) v = fieldTarget(r);
        else v = convergeTarget(r);
        arr[i * 3] = v.x;
        arr[i * 3 + 1] = v.y;
        arr[i * 3 + 2] = v.z;
      }
      stages.push(arr);
    }

    const s = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) s[i] = rng();

    return {
      positions: new Float32Array(stages[0]),
      targets: stages,
      seeds: s,
    };
  }, []);

  // Reused each frame — allocating vectors inside useFrame would churn the GC.
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const cursor = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const mesh = points.current;
    if (!mesh) return;

    const t = state.clock.elapsedTime;
    const p = THREE.MathUtils.clamp(scroll.current ?? 0, 0, 1);

    // Map scroll onto the 4 stages with smooth crossfades.
    const stageF = p * 3;
    const from = Math.min(Math.floor(stageF), 2);
    const to = from + 1;
    const mix = THREE.MathUtils.smoothstep(stageF - from, 0, 1);

    const a = targets[from];
    const b = targets[to];
    const attr = mesh.geometry.attributes.position;
    const arr = attr.array as Float32Array;

    // Ease actual positions toward the blended target — gives the cloud
    // a soft, springy feel rather than snapping to the scroll value.
    const ease = 1 - Math.pow(0.0015, delta);

    // Pointer in the mesh's local space, so particles can be pushed away from
    // it. Doing this once per frame rather than once per particle.
    tmp.set(pointer.x, pointer.y, 0.5).unproject(state.camera);
    tmp.sub(state.camera.position).normalize();
    const dist = -state.camera.position.z / tmp.z;
    cursor
      .copy(state.camera.position)
      .add(tmp.multiplyScalar(dist))
      .sub(mesh.position);

    const R2 = REPEL_RADIUS * REPEL_RADIUS;

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const s = seeds[i];

      const tx = a[i3] + (b[i3] - a[i3]) * mix;
      const ty = a[i3 + 1] + (b[i3 + 1] - a[i3 + 1]) * mix;
      const tz = a[i3 + 2] + (b[i3 + 2] - a[i3 + 2]) * mix;

      // Per-particle drift so it breathes even when idle.
      const wob = 0.06 + s * 0.05;
      const dx = Math.sin(t * (0.4 + s * 0.5) + s * 12) * wob;
      const dy = Math.cos(t * (0.35 + s * 0.45) + s * 20) * wob;

      arr[i3] += (tx + dx - arr[i3]) * ease;
      arr[i3 + 1] += (ty + dy - arr[i3 + 1]) * ease;
      arr[i3 + 2] += (tz - arr[i3 + 2]) * ease;

      // Repel from the cursor. Squared distance keeps this cheap — no sqrt
      // unless the particle is actually inside the radius.
      const ox = arr[i3] - cursor.x;
      const oy = arr[i3 + 1] - cursor.y;
      const d2 = ox * ox + oy * oy;

      if (d2 < R2 && d2 > 0.0001) {
        const d = Math.sqrt(d2);
        // Falls off to nothing at the edge of the radius.
        const force = (1 - d / REPEL_RADIUS) ** 2 * REPEL_STRENGTH;
        arr[i3] += (ox / d) * force;
        arr[i3 + 1] += (oy / d) * force;
      }
    }
    attr.needsUpdate = true;

    // Cursor parallax — the cloud leans toward the pointer.
    const targetX = (pointer.y * viewport.height) / 90;
    const targetY = (pointer.x * viewport.width) / 70 + t * 0.045;
    mesh.rotation.x += (targetX - mesh.rotation.x) * 0.04;
    mesh.rotation.y += (targetY - mesh.rotation.y) * 0.04;

    // Keep the cloud out of the reading column. It sits right of centre in the
    // hero (clear of the headline), stays right through the copy-heavy middle
    // sections, and only returns to centre for the contact pulse. It also
    // recedes in Z so it reads as depth rather than as noise over the text.
    const wide = viewport.width > 8;
    const centred = THREE.MathUtils.smoothstep(p, 0.88, 1);
    const offsetX = wide ? 3.1 * (1 - centred) : 0;
    const offsetZ = -2.2 * (1 - centred);
    mesh.position.x += (offsetX - mesh.position.x) * 0.05;
    mesh.position.z += (offsetZ - mesh.position.z) * 0.05;

    // Ease off through the copy-heavy middle so the cloud never competes with
    // body text — but only gently. It stays clearly visible: the cloud is kept
    // out of the reading column by the X offset below, which does the real
    // work. Fading it to a ghost here just makes the page look empty to anyone
    // who scrolls past the hero, which is everyone.
    if (material.current) {
      const enterCopy = THREE.MathUtils.smoothstep(p, 0.04, 0.16);
      const leaveCopy = THREE.MathUtils.smoothstep(p, 0.84, 0.96);
      const opacity = 0.9 - enterCopy * 0.28 + leaveCopy * 0.28;
      material.current.opacity +=
        (opacity - material.current.opacity) * 0.06;
    }
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      {/* Light mode can't use additive blending (it washes out to nothing on a
          pale background), so compensate with larger, denser, darker points. */}
      <pointsMaterial
        ref={material}
        size={isDark ? 0.028 : 0.036}
        color={isDark ? "#f87171" : "#c81e1e"}
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}
