"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";

/* gsap is a real npm dependency now, not a global UMD <script> tag — no
   more reading window.gsap/window.ScrollTrigger off the standalone doc's
   vendor bundle. Register the plugin once at module scope. */
if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════════
   REALM HERO SCENE — golden pollen field + butterflies + the
   metamorphosis pinned scroll-scrub. Ported near-verbatim from the
   standalone doc's "THREE.JS HERO" module (public/realm/js/main.js) —
   the user asked explicitly to keep this untouched, so every constant,
   curve and easing below is the original, unchanged. What HAD to
   change, because a standalone `<script type="module">` and a React
   effect have different lifetimes:

   1. The old page never tore this down — it was the top of a full page
      load that only ever unloaded via a hard navigation. Mounted inside
      an SPA route, it must clean up properly on unmount (cancel the rAF
      loop, drop listeners, dispose the renderer) or repeat visits leak
      a WebGL context per visit. The original frame() already guards on
      `alive`, so cleanup is just: set alive=false, remove listeners,
      dispose.
   2. `window.__beginWarp()` was an external hook the standalone
      preloader called once its own cover had faded — the "second
      particle moment" in a two-part illusion. There's no cover to wait
      for anymore (the SITE's own dust-warp dive plays that beat for
      real), so this scene now just begins its own portal-in the moment
      it mounts.
   3. `document.body.classList.add("entered")` toggled the hero's
      reveal timing on <body>; the scoped root here is `.realm-doc`,
      not <body>, so it walks up from the canvas instead.
   4. `reduceMotion` reads the site's real preference (manual override +
      OS query), not a bare matchMedia call.
   5. `scrollProgress` (native window.scrollY ÷ scrollable height) drove
      the camera's scroll-out dolly and the old #scrollProgress bar.
      Lenis (this site's smooth-scroll) runs in its default "smooth the
      native scrollTop" mode, not a transform-virtualized one, so
      window.scrollY still tracks the real, smoothed position frame to
      frame — the calculation below is unchanged; only the now-removed
      visual progress-bar DOM write is gone (the site has its own).
   ══════════════════════════════════════════════════════════════════ */

export default function RealmHeroScene() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = prefersReducedMotionNow();

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b07, 0.055);

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    function size() {
      const w = canvas!.clientWidth, h = canvas!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h; camera.updateProjectionMatrix();
    }

    /* ---- soft round sprite texture ---- */
    function dotTexture() {
      const c = document.createElement("canvas"); c.width = c.height = 64;
      const g = c.getContext("2d")!;
      const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grd.addColorStop(0, "rgba(255,240,200,1)");
      grd.addColorStop(0.25, "rgba(241,216,163,0.8)");
      grd.addColorStop(1, "rgba(217,180,106,0)");
      g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
      return new THREE.CanvasTexture(c);
    }
    /* ---- butterfly silhouette texture ---- */
    function butterflyTexture() {
      const c = document.createElement("canvas"); c.width = c.height = 128;
      const g = c.getContext("2d")!;
      g.translate(64, 64);
      g.fillStyle = "rgba(241,216,163,0.92)";
      g.shadowColor = "rgba(241,216,163,0.9)"; g.shadowBlur = 14;
      const wing = (sx: number) => {
        g.beginPath();
        g.moveTo(0, 0);
        g.bezierCurveTo(sx * 10, -44, sx * 58, -46, sx * 52, -8);
        g.bezierCurveTo(sx * 50, 18, sx * 22, 16, 0, 4);
        g.closePath(); g.fill();
        g.beginPath();
        g.moveTo(0, 2);
        g.bezierCurveTo(sx * 16, 14, sx * 44, 22, sx * 40, 42);
        g.bezierCurveTo(sx * 34, 56, sx * 12, 34, 0, 16);
        g.closePath(); g.fill();
      };
      wing(1); wing(-1);
      g.fillRect(-1.6, -14, 3.2, 42);
      return new THREE.CanvasTexture(c);
    }

    const dotTex = dotTexture();

    /* ---- pollen / bokeh points ---- */
    const COUNT = window.innerWidth < 760 ? 1100 : 2400;
    const positions = new Float32Array(COUNT * 3);
    const vel = new Float32Array(COUNT * 3);
    const target = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    const sizesArr = new Float32Array(COUNT);
    function placeIdle(i: number) {
      positions[i * 3] = (Math.random() - 0.5) * 36;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 26;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22 - 4;
    }
    function placeWarpFar(i: number) {
      const a = Math.random() * Math.PI * 2, r = Math.random() * 15;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r;
      positions[i * 3 + 2] = -22 - Math.random() * 150;
    }
    for (let i = 0; i < COUNT; i++) {
      placeWarpFar(i);
      speeds[i] = 0.2 + Math.random() * 0.7;
      sizesArr[i] = 0.06 + Math.random() * 0.28;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizesArr, 1));

    const mat = new THREE.PointsMaterial({
      size: 0.5, map: dotTex, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, color: 0xf1d8a3, sizeAttenuation: true, opacity: 0.9,
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const coreMat = new THREE.SpriteMaterial({
      map: dotTex, color: 0xd9b46a, transparent: true,
      blending: THREE.AdditiveBlending, opacity: 0.5, depthWrite: false,
    });
    const core = new THREE.Sprite(coreMat);
    core.scale.set(26, 26, 1); core.position.set(0, 0, -6);
    scene.add(core);

    /* ---- butterflies ---- */
    const bfTex = butterflyTexture();
    interface ButterflyData {
      sc: number; phase: number; flap: number; driftX: number; driftY: number;
      sx: number; svx: number; svy: number; emT: number; emDelay: number;
    }
    const butterflies: THREE.Sprite[] = [];
    const BF = window.innerWidth < 760 ? 4 : 7;
    for (let i = 0; i < BF; i++) {
      const m = new THREE.SpriteMaterial({ map: bfTex, transparent: true, depthWrite: false, opacity: 0.92 });
      const s = new THREE.Sprite(m);
      const sc = 1.1 + Math.random() * 1.6;
      s.scale.set(sc, sc, 1);
      s.position.set((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10);
      const data: ButterflyData = {
        sc,
        phase: Math.random() * Math.PI * 2,
        flap: 2 + Math.random() * 2.5,
        driftX: (Math.random() - 0.5) * 0.5,
        driftY: 0.1 + Math.random() * 0.25,
        sx: 0.6 + Math.random() * 0.8,
        svx: 0, svy: 0,
        emT: 0, emDelay: 0.4 + i * 0.32,
      };
      s.userData = data;
      scene.add(s); butterflies.push(s);
    }

    /* ============================================================
       METAMORPHOSIS — pinned scroll-scrub through egg → caterpillar →
       chrysalis → butterfly, reusing this scene's own pollen-dot
       vocabulary. Lives in the "lifecycle" section elsewhere on this
       same page; queried by id exactly as the original did, since both
       are part of one page tree and mount together. See the module
       comment above for what's ported unchanged vs. surgically adapted.
       ============================================================ */
    let lifecycleMat: THREE.PointsMaterial | null = null;
    let metamorphosisTrigger: ScrollTrigger | null = null;
    if (!reduceMotion) {
      (function metamorphosis() {
        const pin = document.getElementById("cyclePin");
        if (!pin) return;

        pin.classList.add("is-scrub");

        const N = window.innerWidth < 760 ? 1100 : 2400;
        const hash = (i: number, s: number) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

        function buildShape(kind: string) {
          const arr = new Float32Array(N * 3);
          for (let i = 0; i < N; i++) {
            const u = i / N;
            const r1 = hash(i, 1.7), r2 = hash(i, 5.3), r3 = hash(i, 9.1);
            let x = 0, y = 0, z = 0;
            if (kind === "egg") {
              const phi = r1 * Math.PI * 2, ct = r2 * 2 - 1, th = Math.acos(ct), rad = Math.cbrt(r3);
              const sx = rad * Math.sin(th) * Math.cos(phi), sy = rad * ct, sz = rad * Math.sin(th) * Math.sin(phi);
              const taper = 1 - 0.28 * Math.max(0, sy) - 0.12 * Math.max(0, -sy);
              x = sx * 1.05 * taper; y = sy * 1.55; z = sz * 1.05 * taper;
            } else if (kind === "caterpillar") {
              const L = 6.2, env = Math.sin(Math.PI * Math.min(1, Math.max(0, u)));
              const seg = 0.78 + 0.22 * Math.sin(u * Math.PI * 6.5);
              const radius = 0.82 * env * seg;
              const ang = r1 * Math.PI * 2, rr = Math.sqrt(r2) * radius;
              x = (u - 0.5) * L + (r3 - 0.5) * 0.12;
              y = Math.cos(ang) * rr; z = Math.sin(ang) * rr * 0.9;
            } else if (kind === "chrysalis") {
              const envelope = Math.max(0, Math.sin(Math.PI * u) * (1 - 0.5 * u));
              const radius = 0.95 * envelope;
              const ang = r1 * Math.PI * 2, rr = Math.sqrt(r2) * radius;
              y = 1.6 - u * 3.6; x = Math.cos(ang) * rr; z = Math.sin(ang) * rr * 0.85;
            } else {
              const th = u * 12 * Math.PI;
              let rC = Math.exp(Math.cos(th)) - 2 * Math.cos(4 * th) + Math.pow(Math.sin(th / 12), 5);
              rC *= (1 + (r2 - 0.5) * 0.22);
              x = Math.sin(th) * rC * 0.62; y = Math.cos(th) * rC * 0.62; z = (r3 - 0.5) * 0.6;
            }
            arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z;
          }
          return arr;
        }

        const shapes = ["egg", "caterpillar", "chrysalis", "butterfly"].map(buildShape) as Float32Array[];
        const mPositions = new Float32Array(N * 3);
        mPositions.set(shapes[0]);

        const mGeo = new THREE.BufferGeometry();
        mGeo.setAttribute("position", new THREE.BufferAttribute(mPositions, 3));
        const mMat = new THREE.PointsMaterial({
          size: 0.55, map: dotTex, transparent: true, depthWrite: false,
          blending: THREE.AdditiveBlending, color: 0xf1d8a3, sizeAttenuation: true, opacity: 0,
        });
        const morphPoints = new THREE.Points(mGeo, mMat);
        morphPoints.scale.setScalar(1.25);
        morphPoints.position.y = 2.2;
        scene.add(morphPoints);
        lifecycleMat = mMat;

        const stages = [...pin.querySelectorAll(".cycle-pin__stage")];
        const dots = [...pin.querySelectorAll(".cycle-pin__dot")];
        const fill = document.getElementById("cyclePinFill");
        let lastStage = 0;

        function setProgress(p: number) {
          const segF = Math.min(0.999999, Math.max(0, p)) * 3;
          const idx = Math.floor(segF);
          const t = segF - idx;
          const a = shapes[idx], b = shapes[Math.min(3, idx + 1)];
          const pos = mGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < N; i++) {
            pos[i * 3] = a[i * 3] + (b[i * 3] - a[i * 3]) * t;
            pos[i * 3 + 1] = a[i * 3 + 1] + (b[i * 3 + 1] - a[i * 3 + 1]) * t;
            pos[i * 3 + 2] = a[i * 3 + 2] + (b[i * 3 + 2] - a[i * 3 + 2]) * t;
          }
          mGeo.attributes.position.needsUpdate = true;

          const nearest = Math.round(segF);
          if (nearest !== lastStage) {
            lastStage = nearest;
            stages.forEach((el, i) => el.classList.toggle("is-active", i === nearest));
            dots.forEach((el, i) => el.classList.toggle("is-active", i <= nearest));
          }
          if (fill) fill.style.width = (p * 100) + "%";
        }

        metamorphosisTrigger = ScrollTrigger.create({
          trigger: pin,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 0.5,
          onUpdate(self) { setProgress(self.progress); },
          onEnter() { gsap.to(mMat, { opacity: 0.95, duration: 0.6, overwrite: true }); },
          onEnterBack() { gsap.to(mMat, { opacity: 0.95, duration: 0.6, overwrite: true }); },
          onLeave() { gsap.to(mMat, { opacity: 0, duration: 0.6, overwrite: true }); },
          onLeaveBack() { gsap.to(mMat, { opacity: 0, duration: 0.6, overwrite: true }); },
        });
      })();
    }

    /* ---- input parallax: mouse, touch, and device tilt ---- */
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const setTarget = (cx: number, cy: number) => {
      mouse.tx = (cx / window.innerWidth - 0.5);
      mouse.ty = (cy / window.innerHeight - 0.5);
    };
    const onPointerMove = (e: PointerEvent) => setTarget(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      const t0 = e.touches && e.touches[0];
      if (t0) setTarget(t0.clientX, t0.clientY);
    };
    const onDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma == null && e.beta == null) return;
      const g = Math.max(-45, Math.min(45, e.gamma || 0));
      const b = Math.max(-45, Math.min(45, (e.beta || 0) - 40));
      mouse.tx = Math.max(-0.75, Math.min(0.75, g / 52));
      mouse.ty = Math.max(-0.75, Math.min(0.75, b / 52));
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("deviceorientation", onDeviceOrientation);

    /* ---- native scroll progress: drives the camera's scroll-out dolly.
       Lenis (this site's smooth-scroll) runs in its default mode, which
       smooths window.scrollY directly rather than virtualizing it behind
       a transform — so this reads the real, already-smoothed position. ---- */
    let scrollProgress = 0;
    function onScroll() {
      const y = window.scrollY || document.documentElement.scrollTop;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const clock = new THREE.Clock();
    let alive = true;

    /* ---- portal warp intro state ---- */
    const WARP_DUR = 2.4;
    const SETTLE_DUR = 1.6;
    let warpElapsed = 0, settleT = 0, mode: "warp" | "settle" | "idle" = reduceMotion ? "idle" : "warp", smoothP = 0;
    let begun = false;
    const root = canvas.closest(".realm-doc");
    const revealHero = () => { if (root && !root.classList.contains("entered")) root.classList.add("entered"); };

    /* ---- tap scatter: particles flee a "foreign presence", butterflies startle ---- */
    const tmpV = new THREE.Vector3();
    function screenToWorld(cx: number, cy: number) {
      tmpV.set((cx / canvas!.clientWidth) * 2 - 1, -(cy / canvas!.clientHeight) * 2 + 1, 0.5);
      tmpV.unproject(camera);
      tmpV.sub(camera.position).normalize();
      const dist = -camera.position.z / tmpV.z;
      return new THREE.Vector3().copy(camera.position).add(tmpV.multiplyScalar(dist));
    }
    function scatter(cx: number, cy: number) {
      const p = screenToWorld(cx, cy);
      const R = 6.5, R2 = R * R, strength = 30;
      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        const dx = pos[i * 3] - p.x, dy = pos[i * 3 + 1] - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R2) {
          const d = Math.sqrt(d2) || 0.001;
          const f = (1 - d / R) * strength;
          vel[i * 3] += (dx / d) * f + (Math.random() - 0.5) * 3;
          vel[i * 3 + 1] += (dy / d) * f + (Math.random() - 0.5) * 3;
          vel[i * 3 + 2] += (Math.random() - 0.5) * f * 0.5;
        }
      }
      butterflies.forEach((s) => {
        const u = s.userData as ButterflyData;
        const dx = s.position.x - p.x, dy = s.position.y - p.y;
        const d = Math.hypot(dx, dy) || 0.001;
        const SR = R * 1.7;
        if (d < SR) { const f = (1 - d / SR) * 9; u.svx += (dx / d) * f; u.svy += (dy / d) * f + 2; }
      });
    }
    const heroEl = document.querySelector(".realm-doc .hero");
    const onHeroPointerDown = (e: PointerEvent) => {
      if (e.clientX == null) return;
      scatter(e.clientX, e.clientY);
    };
    if (heroEl && !reduceMotion) heroEl.addEventListener("pointerdown", onHeroPointerDown as EventListener);

    function ambient(t: number, dt: number, damp: number, driftEase: number) {
      const dim = lifecycleMat ? lifecycleMat.opacity / 0.95 : 0;

      butterflies.forEach((s) => {
        const u = s.userData as ButterflyData;
        u.emT += dt;
        const e = Math.max(0, Math.min(1, (u.emT - u.emDelay) / 2.2));
        const em = e * e * (3 - 2 * e);
        const startled = Math.hypot(u.svx, u.svy);
        s.position.x += Math.sin(t * 0.5 + u.phase) * 0.006 + u.driftX * dt + u.svx * dt;
        s.position.y += u.driftY * dt + u.svy * dt;
        u.svx *= damp; u.svy *= damp;
        if (s.position.y > 9) { s.position.y = -9; s.position.x = (Math.random() - 0.5) * 22; }
        if (s.position.x > 13) s.position.x = -13;
        if (s.position.x < -13) s.position.x = 13;
        (s.material as THREE.SpriteMaterial).opacity = 0.92 * em * (1 - dim * 0.7);
        const grow = 0.28 + 0.72 * em;
        const flapAmp = 0.85 * em;
        const flap = (Math.sin(t * (u.flap + startled * 0.6) + u.phase) * 0.5 + 0.5);
        s.scale.x = u.sc * grow * (0.25 + flap * flapAmp) * u.sx;
        s.scale.y = u.sc * grow;
      });

      coreMat.opacity = (0.42 + Math.sin(t * 0.6) * 0.08) * (1 - dim * 0.55);
      core.scale.setScalar(26);
      mat.opacity = 0.9 * (1 - dim * 0.7);

      smoothP += (scrollProgress - smoothP) * 0.06;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      const driftX = Math.sin(t * 0.13) * 1.1;
      const driftY = Math.cos(t * 0.17) * 0.7;
      camera.position.x = (driftX + mouse.x * 3.6) * driftEase;
      camera.position.y = (driftY - mouse.y * 2.6) * driftEase;
      camera.position.z = 14 + smoothP * 20;
      camera.lookAt(0, 0, 0);
    }

    let rafId = 0;
    function frame() {
      if (!alive) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const damp = Math.pow(0.9, dt * 60);
      const pos = geo.attributes.position.array as Float32Array;

      if (mode === "warp") {
        const lin = WARP_DUR > 0 ? Math.min(1, warpElapsed / WARP_DUR) : 1;
        const ease = 1 - Math.pow(1 - lin, 3);
        const w = 1 - ease;
        if (begun) {
          warpElapsed += dt;
          const speed = 5 + (w * w) * 46;
          for (let i = 0; i < COUNT; i++) {
            pos[i * 3 + 2] += speed * dt;
            if (pos[i * 3 + 2] > camera.position.z + 4) placeWarpFar(i);
          }
          geo.attributes.position.needsUpdate = true;
        }
        mat.size = 0.5 + w * 0.6;
        camera.fov = 60 + w * 10; camera.updateProjectionMatrix();
        coreMat.opacity = 0.3 + w * 0.22;
        core.scale.setScalar(22 + w * 12);
        camera.position.set(0, 0, 14); camera.lookAt(0, 0, 0);
        for (const s of butterflies) { const sm = s.material as THREE.SpriteMaterial; sm.opacity += (0 - sm.opacity) * 0.18; }

        if (begun && lin >= 0.3) revealHero();

        if (lin >= 1) {
          for (let i = 0; i < COUNT; i++) {
            target[i * 3] = (Math.random() - 0.5) * 36;
            target[i * 3 + 1] = (Math.random() - 0.5) * 26;
            target[i * 3 + 2] = (Math.random() - 0.5) * 22 - 4;
            vel[i * 3] = vel[i * 3 + 1] = vel[i * 3 + 2] = 0;
          }
          mat.size = 0.5; camera.fov = 60; camera.updateProjectionMatrix();
          settleT = 0; mode = "settle";
          revealHero();
        }
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(frame);
        return;
      }

      if (mode === "settle") {
        settleT += dt;
        const k = 1 - Math.pow(0.9, dt * 60);
        for (let i = 0; i < COUNT; i++) {
          pos[i * 3] += (target[i * 3] - pos[i * 3]) * k;
          pos[i * 3 + 1] += (target[i * 3 + 1] - pos[i * 3 + 1]) * k;
          pos[i * 3 + 2] += (target[i * 3 + 2] - pos[i * 3 + 2]) * k;
        }
        geo.attributes.position.needsUpdate = true;
        points.rotation.z = Math.sin(t * 0.05) * 0.06;
        ambient(t, dt, damp, Math.min(1, settleT / SETTLE_DUR));
        if (settleT >= SETTLE_DUR) mode = "idle";
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(frame);
        return;
      }

      for (let i = 0; i < COUNT; i++) {
        pos[i * 3] += vel[i * 3] * dt + Math.sin(t * 0.3 + i) * 0.0016;
        pos[i * 3 + 1] += vel[i * 3 + 1] * dt + speeds[i] * dt * 0.7;
        pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
        vel[i * 3] *= damp; vel[i * 3 + 1] *= damp; vel[i * 3 + 2] *= damp;
        if (pos[i * 3 + 1] > 14) { pos[i * 3 + 1] = -14; pos[i * 3] = (Math.random() - 0.5) * 36; vel[i * 3] = vel[i * 3 + 1] = vel[i * 3 + 2] = 0; }
        if (pos[i * 3 + 2] > 9) pos[i * 3 + 2] = 9; else if (pos[i * 3 + 2] < -20) pos[i * 3 + 2] = -20;
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.z = Math.sin(t * 0.05) * 0.06;

      ambient(t, dt, damp, 1);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      size();
      if (reduceMotion) {
        for (let i = 0; i < COUNT; i++) placeIdle(i);
        geo.attributes.position.needsUpdate = true;
        revealHero();
        renderer.render(scene, camera);
        return;
      }
      // No external cover to wait for anymore — begin the portal-in the
      // instant the scene is ready (was window.__beginWarp(), called by
      // the standalone doc's now-removed preloader).
      begun = true; clock.getDelta();
      alive = true; frame();
    }

    window.addEventListener("resize", size);

    const onVisibility = () => {
      if (document.hidden) { alive = false; }
      else if (!reduceMotion && !alive) { alive = true; clock.getDelta(); frame(); }
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      alive = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", size);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("deviceorientation", onDeviceOrientation);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      if (heroEl) heroEl.removeEventListener("pointerdown", onHeroPointerDown as EventListener);
      metamorphosisTrigger?.kill();
      geo.dispose(); mat.dispose(); coreMat.dispose(); dotTex.dispose(); bfTex.dispose();
      butterflies.forEach((s) => (s.material as THREE.SpriteMaterial).dispose());
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="webgl" className="bg-canvas" aria-hidden="true" />;
}
