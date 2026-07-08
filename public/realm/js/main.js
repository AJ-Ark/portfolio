import * as THREE from "three";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

/* ============================================================
   PRELOADER
   ============================================================ */
let preloaderHidden = false;
function hidePreloader(){
  if(preloaderHidden) return;
  preloaderHidden = true;
  const pre = document.getElementById("preloader");
  if(pre){ pre.classList.add("done"); setTimeout(()=>pre.remove(), 900); }
  if(window.__beginWarp) window.__beginWarp();   // launch the portal as the cover fades
}
/* Fade the cover on the first frame the particle field can actually render:
   __beginWarp is defined synchronously once the scene below is built, so the
   first rAF tick after this module evaluates sees it — the warp fly-in is
   already moving as the cover fades, continuous with the portfolio's
   dive-in transition. No fixed timer, nothing to "wait" for. */
(function armPreloader(){
  if(window.__beginWarp){ hidePreloader(); return; }
  if(!preloaderHidden) requestAnimationFrame(armPreloader);
})();
// safety net — never trap a visitor behind the cover if the scene fails
setTimeout(hidePreloader, 4000);

/* ============================================================
   ANCHOR LINKS — native smooth scroll
   (This page never loaded Lenis — no script tag anywhere defines
   window.Lenis — so the old "if(!reduceMotion && window.Lenis)" guard
   was dead code that could never run, and its else-branch below is the
   only path that ever executed. Removed the dead branch rather than
   wiring up a real Lenis instance: this page has no scroll-jacking left
   once the metamorphosis pin and the gallery's horizontal scrub (both
   below) replace the old wheel-hijacking, so native scroll + ScrollTrigger
   is all it needs — one less rAF loop, one less self-hosted dependency.)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click", e=>{
    const id = a.getAttribute("href");
    if(id.length<2) return;
    const el = document.querySelector(id);
    if(!el) return;
    e.preventDefault();
    el.scrollIntoView({behavior:"smooth"});
  });
});

/* ============================================================
   NAV + SCROLL PROGRESS
   ============================================================ */
const nav = document.getElementById("nav");
const progress = document.getElementById("scrollProgress");
let scrollProgress = 0;   // 0 at top → 1 at bottom; drives the background dolly-back
function onScroll(){
  const y = window.scrollY || document.documentElement.scrollTop;
  nav.classList.toggle("scrolled", y>60);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = h>0 ? Math.min(1, Math.max(0, y/h)) : 0;
  progress.style.width = (scrollProgress*100) + "%";
}
window.addEventListener("scroll", onScroll, {passive:true});
onScroll();

/* ============================================================
   REVEAL ON SCROLL
   ============================================================ */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
  });
}, { threshold:0.12, rootMargin:"0px 0px -8% 0px" });
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

/* ============================================================
   LOGLINE — word by word lighting
   ============================================================ */
const words = [...document.querySelectorAll(".logline__lead .word")];
if(words.length && gsap && ScrollTrigger && !reduceMotion){
  ScrollTrigger.create({
    trigger:".logline__lead",
    start:"top 80%",
    end:"bottom 60%",
    onUpdate:(self)=>{
      const n = Math.round(self.progress * words.length);
      words.forEach((w,i)=> w.classList.toggle("lit", i<n));
    }
  });
} else { words.forEach(w=>w.classList.add("lit")); }

/* ============================================================
   COUNT-UP STATS
   ============================================================ */
document.querySelectorAll("[data-count]").forEach(el=>{
  const target = +el.dataset.count;
  const ob = new IntersectionObserver((ents)=>{
    ents.forEach(e=>{
      if(!e.isIntersecting) return;
      ob.disconnect();
      if(reduceMotion){ el.textContent = target; return; }
      const t0 = performance.now(), dur=1500;
      const tick=(t)=>{
        const p = Math.min((t-t0)/dur,1);
        el.textContent = Math.round((1-Math.pow(1-p,3))*target);
        if(p<1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, {threshold:0.6});
  ob.observe(el);
});

/* ============================================================
   HERO PARALLAX TEXT
   ============================================================ */
if(gsap && ScrollTrigger && !reduceMotion){
  gsap.to(".hero__inner", {
    yPercent:30, opacity:0, ease:"none",
    scrollTrigger:{ trigger:".hero", start:"top top", end:"bottom top", scrub:true }
  });
  gsap.to(".hero__canvas", {
    yPercent:12, ease:"none",
    scrollTrigger:{ trigger:".hero", start:"top top", end:"bottom top", scrub:true }
  });
}

/* ============================================================
   SCREENS GALLERY
   Motion-OK: pinned horizontal scrub — the section pins in place and the
   track slides sideways as the reader scrolls the page's single vertical
   axis, so the gallery rides the same gesture as everything else instead
   of hijacking the wheel.
   Reduced motion / no GSAP: the old calm fallback — native overflow-x:auto
   scrolling (no pin, no scrub), with click-and-drag and a vertical-wheel
   remap as conveniences.
   ============================================================ */
(function screensGallery(){
  const view = document.getElementById("screens");
  const track = document.getElementById("screensTrack");
  if(!view || !track) return;

  if(gsap && ScrollTrigger && !reduceMotion){
    view.classList.add("screens--pinned");
    // function-based x/end + invalidateOnRefresh: a plain window resize (or
    // an orientation change) re-invokes these on ScrollTrigger.refresh(),
    // so the scrub distance never goes stale the way a one-off computed
    // number would.
    gsap.to(track, {
      x: () => -Math.max(0, track.scrollWidth - view.clientWidth),
      ease: "none",
      scrollTrigger: {
        trigger: view,
        start: "top top",
        end: () => "+=" + Math.max(0, track.scrollWidth - view.clientWidth),
        pin: true,
        scrub: 0.4,
        invalidateOnRefresh: true
      }
    });
    window.addEventListener("resize", ()=> ScrollTrigger.refresh());
    return;
  }

  // ---- fallback: native horizontal scroll, drag-to-scroll, wheel remap ----
  let down=false, startX=0, startLeft=0, moved=false;

  view.addEventListener("pointerdown",(e)=>{
    if(e.pointerType === "touch") return;   // don't fight native touch scroll
    down=true; moved=false; startX=e.clientX; startLeft=view.scrollLeft;
    view.classList.add("drag");
    view.setPointerCapture && view.setPointerCapture(e.pointerId);
  });
  view.addEventListener("pointermove",(e)=>{
    if(!down) return;
    const dx = e.clientX - startX;
    if(Math.abs(dx) > 3) moved=true;
    view.scrollLeft = startLeft - dx;
  });
  const release = ()=>{ down=false; view.classList.remove("drag"); };
  view.addEventListener("pointerup", release);
  view.addEventListener("pointercancel", release);
  // swallow the click that follows a drag, so images don't feel "grabbed by accident"
  view.addEventListener("click",(e)=>{ if(moved){ e.preventDefault(); e.stopPropagation(); } }, true);

  // wheel: vertical intent -> horizontal scroll (desktop only; touchpads send deltaX already)
  view.addEventListener("wheel",(e)=>{
    if(Math.abs(e.deltaY) > Math.abs(e.deltaX)){
      const before = view.scrollLeft;
      view.scrollLeft += e.deltaY;
      if(view.scrollLeft !== before) e.preventDefault();
    }
  }, {passive:false});
})();

/* ============================================================
   RESEARCH BENTO — hover/tap to expand, neighbours reflow
   ============================================================ */
(function researchBento(){
  const grid = document.getElementById("bento");
  if(!grid) return;
  const tiles = [...grid.querySelectorAll(".btile")];
  const hoverMode = window.matchMedia("(min-width:821px) and (hover:hover)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIdx = -1;

  // Scroll scrubs every glyph: --p (0→1) drives each paused animation's frame,
  // so the illustrations play as you scroll down and reverse as you scroll up.
  if(gsap && ScrollTrigger && !reduce.matches){
    if(gsap.registerPlugin) gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(grid, { "--p": 0 }, {
      "--p": 1, ease: "none",
      scrollTrigger: { trigger: "#research", start: "top bottom", end: "bottom top", scrub: 0.5 }
    });
  }

  // FLIP: morph every tile from its old rect to its new one so the whole
  // bento rebalances fluidly (position + size) instead of snapping.
  function apply(i){
    if(i === activeIdx) return;
    const flip = hoverMode.matches && !reduce.matches;
    let first;
    if(flip){
      tiles.forEach(t=> t.getAnimations().forEach(a=>a.finish()));   // settle any in-flight morph
      first = tiles.map(t=>t.getBoundingClientRect());
    }
    tiles.forEach((t,j)=>t.classList.toggle("is-active", j===i));
    grid.classList.toggle("has-active", i>=0);
    activeIdx = i;
    if(!flip) return;
    const last = tiles.map(t=>t.getBoundingClientRect());
    tiles.forEach((t,j)=>{
      const f=first[j], l=last[j];
      if(!f.width || !l.width) return;
      const dx=f.left-l.left, dy=f.top-l.top, sx=f.width/l.width, sy=f.height/l.height;
      if(Math.abs(dx)<0.5 && Math.abs(dy)<0.5 && Math.abs(sx-1)<0.02 && Math.abs(sy-1)<0.02) return;
      t.animate(
        [{ transform:`translate(${dx}px,${dy}px) scale(${sx},${sy})` },
         { transform:"none" }],
        { duration:700, easing:"cubic-bezier(0.22,1,0.36,1)" }
      );
    });
  }

  // Hover INTENT: open a tile only once the cursor settles on it. Sweeping
  // across does nothing (the timer keeps resetting), so the bento never
  // reshuffles mid-motion. A layout shift under a still cursor fires no
  // pointermove, so it can't hijack the selection either.
  let hoverTimer = null, pendingIdx = -1;
  const DWELL = 140;
  grid.addEventListener("pointermove",(e)=>{
    if(!hoverMode.matches) return;
    const tile = e.target.closest(".btile");
    const idx = tile ? tiles.indexOf(tile) : -1;
    if(idx === activeIdx){ clearTimeout(hoverTimer); pendingIdx = -1; return; }  // already open
    if(idx === pendingIdx) return;                                               // still aiming at it
    pendingIdx = idx;
    clearTimeout(hoverTimer);
    if(idx < 0) return;                                                          // over a gap
    hoverTimer = setTimeout(()=>{ apply(idx); pendingIdx = -1; }, DWELL);
  });
  grid.addEventListener("pointerleave",()=>{
    clearTimeout(hoverTimer); pendingIdx = -1;
    if(hoverMode.matches) apply(-1);
  });

  tiles.forEach((t,i)=>{
    t.addEventListener("focus", ()=>{ if(hoverMode.matches) apply(i); });
    t.addEventListener("click",()=>{
      if(hoverMode.matches) return;                       // desktop is hover-driven
      apply(t.classList.contains("is-active") ? -1 : i);  // touch: tap toggles
    });
  });
  grid.addEventListener("focusout",(e)=>{ if(hoverMode.matches && !grid.contains(e.relatedTarget)) apply(-1); });
  hoverMode.addEventListener("change", ()=>apply(-1));
})();

/* ============================================================
   EPILOGUE — "Next project: Rippl" hands the tour back to the
   portfolio. Same no-hard-cuts grammar: the field scatters, a dark
   veil settles (CSS in index.html), then the document swaps.
   ============================================================ */
(function epilogueDeparture(){
  const link = document.getElementById("nextProject");
  if(!link) return;
  link.addEventListener("click",(e)=>{
    // new-tab / modified clicks belong to the browser; reduced motion
    // navigates instantly with no ceremony.
    if(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if(reduceMotion) return;
    e.preventDefault();
    if(document.body.classList.contains("leaving")) return; // double-click guard
    const r = link.getBoundingClientRect();
    if(window.__scatterAt) window.__scatterAt(r.left + r.width/2, r.top + r.height/2);
    document.body.classList.add("leaving");
    setTimeout(()=>{ window.location.href = link.href; }, 520);
  });
  // bfcache: never resurrect the page behind the departure veil
  window.addEventListener("pageshow",(e)=>{
    if(e.persisted) document.body.classList.remove("leaving");
  });
})();

/* ============================================================
   THREE.JS HERO — golden pollen field + butterflies
   ============================================================ */
(function heroScene(){
  const canvas = document.getElementById("webgl");
  if(!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, powerPreference:"high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x070b07, 0.055);

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  function size(){
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }

  /* ---- soft round sprite texture ---- */
  function dotTexture(){
    const c = document.createElement("canvas"); c.width=c.height=64;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(32,32,0,32,32,32);
    grd.addColorStop(0,"rgba(255,240,200,1)");
    grd.addColorStop(0.25,"rgba(241,216,163,0.8)");
    grd.addColorStop(1,"rgba(217,180,106,0)");
    g.fillStyle=grd; g.fillRect(0,0,64,64);
    const t = new THREE.CanvasTexture(c); return t;
  }
  /* ---- butterfly silhouette texture ---- */
  function butterflyTexture(){
    const c = document.createElement("canvas"); c.width=c.height=128;
    const g = c.getContext("2d");
    g.translate(64,64);
    g.fillStyle="rgba(241,216,163,0.92)";
    g.shadowColor="rgba(241,216,163,0.9)"; g.shadowBlur=14;
    const wing=(sx)=>{
      g.beginPath();
      g.moveTo(0,0);
      g.bezierCurveTo(sx*10,-44, sx*58,-46, sx*52,-8);
      g.bezierCurveTo(sx*50,18, sx*22,16, 0,4);
      g.closePath(); g.fill();
      g.beginPath();
      g.moveTo(0,2);
      g.bezierCurveTo(sx*16,14, sx*44,22, sx*40,42);
      g.bezierCurveTo(sx*34,56, sx*12,34, 0,16);
      g.closePath(); g.fill();
    };
    wing(1); wing(-1);
    g.fillRect(-1.6,-14,3.2,42);
    const t = new THREE.CanvasTexture(c); return t;
  }

  const dotTex = dotTexture();

  /* ---- pollen / bokeh points ---- */
  const COUNT = window.innerWidth < 760 ? 1100 : 2400;
  const positions = new Float32Array(COUNT*3);
  const vel = new Float32Array(COUNT*3);   // scatter velocity (decays back to calm)
  const target = new Float32Array(COUNT*3);// resting field the warp glides into (no teleport)
  const speeds = new Float32Array(COUNT);
  const sizes = new Float32Array(COUNT);
  function placeIdle(i){
    positions[i*3]   = (Math.random()-0.5)*36;
    positions[i*3+1] = (Math.random()-0.5)*26;
    positions[i*3+2] = (Math.random()-0.5)*22 - 4;
  }
  function placeWarpFar(i){                 // deep in the tunnel, ahead of the viewer
    const a = Math.random()*Math.PI*2, r = Math.random()*15;
    positions[i*3]   = Math.cos(a)*r;
    positions[i*3+1] = Math.sin(a)*r;
    positions[i*3+2] = -22 - Math.random()*150;
  }
  for(let i=0;i<COUNT;i++){
    placeWarpFar(i);                        // start deep for the light-speed fly-in
    speeds[i] = 0.2 + Math.random()*0.7;
    sizes[i] = 0.06 + Math.random()*0.28;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions,3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(sizes,1));

  const mat = new THREE.PointsMaterial({
    size:0.5, map:dotTex, transparent:true, depthWrite:false,
    blending:THREE.AdditiveBlending, color:0xf1d8a3, sizeAttenuation:true, opacity:0.9
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  /* a denser warm core glow */
  const coreMat = new THREE.SpriteMaterial({ map:dotTex, color:0xd9b46a, transparent:true,
    blending:THREE.AdditiveBlending, opacity:0.5, depthWrite:false });
  const core = new THREE.Sprite(coreMat);
  core.scale.set(26,26,1); core.position.set(0,0,-6);
  scene.add(core);

  /* ---- butterflies ---- */
  const bfTex = butterflyTexture();
  const butterflies = [];
  const BF = window.innerWidth < 760 ? 4 : 7;
  for(let i=0;i<BF;i++){
    const m = new THREE.SpriteMaterial({ map:bfTex, transparent:true, depthWrite:false, opacity:0.92 });
    const s = new THREE.Sprite(m);
    const sc = 1.1 + Math.random()*1.6;
    s.scale.set(sc,sc,1);
    s.position.set((Math.random()-0.5)*22, (Math.random()-0.5)*14, (Math.random()-0.5)*10);
    s.userData = {
      sc,
      phase: Math.random()*Math.PI*2,
      flap: 2 + Math.random()*2.5,
      driftX: (Math.random()-0.5)*0.5,
      driftY: 0.1 + Math.random()*0.25,
      sx: 0.6 + Math.random()*0.8,
      svx: 0, svy: 0,  // startle velocity when something taps nearby
      emT: 0, emDelay: 0.4 + i*0.32   // emergence clock + staggered start
    };
    scene.add(s); butterflies.push(s);
  }

  /* ============================================================
     METAMORPHOSIS — pinned scroll-scrub through egg → caterpillar →
     chrysalis → butterfly. Reuses this scene's own particle vocabulary
     (the pollen dot sprite) rather than new geometry/materials: every
     stage is just another target array for the same kind of points this
     scene already draws. Position is always a pure function of scroll
     progress, so scrubbing back up simply re-evaluates the same
     interpolation the other way — no separate "reverse" path needed.
     Gated on !reduceMotion: the pinned/scrubbed effect has a fully static
     calm path (CSS un-pins #cyclePin into a plain readable grid; see
     style.css), so skipping this block entirely is the correct reduced-
     motion behavior, not a degraded one.
     ============================================================ */
  let lifecycleMat = null;   // read by ambient() below to dim the ambient field while this plays
  if(!reduceMotion){
    (function metamorphosis(){
      const pin = document.getElementById("cyclePin");
      if(!pin || !gsap || !ScrollTrigger) return;

      // Opt into the pinned/scrubbed layout only now that GSAP+ScrollTrigger
      // are confirmed live. Without this class the stages render as a static,
      // fully-readable grid (see .cycle-pin base rules in style.css), so a
      // no-JS / failed-GSAP visitor never gets blank stages.
      pin.classList.add("is-scrub");

      // Dense enough that the egg/caterpillar/chrysalis/butterfly read as
      // legible silhouettes, not a faint scatter (was 380/680 — too sparse).
      const N = window.innerWidth < 760 ? 1100 : 2400;
      const hash = (i, s) => { const x = Math.sin(i*127.1 + s*311.7)*43758.5453; return x - Math.floor(x); };

      function buildShape(kind){
        const arr = new Float32Array(N*3);
        for(let i=0;i<N;i++){
          const u = i/N;
          const r1 = hash(i,1.7), r2 = hash(i,5.3), r3 = hash(i,9.1);
          let x=0,y=0,z=0;
          if(kind === "egg"){
            // volume-filled ellipsoid, tapered narrower at both poles (egg profile)
            const phi = r1*Math.PI*2, ct = r2*2-1, th = Math.acos(ct), rad = Math.cbrt(r3);
            const sx = rad*Math.sin(th)*Math.cos(phi), sy = rad*ct, sz = rad*Math.sin(th)*Math.sin(phi);
            const taper = 1 - 0.28*Math.max(0,sy) - 0.12*Math.max(0,-sy);
            x = sx*1.05*taper; y = sy*1.55; z = sz*1.05*taper;
          } else if(kind === "caterpillar"){
            // lumpy horizontal tube, tapering to a point at both ends
            const L = 6.2, env = Math.sin(Math.PI*Math.min(1,Math.max(0,u)));
            const seg = 0.78 + 0.22*Math.sin(u*Math.PI*6.5);
            const radius = 0.82*env*seg;
            const ang = r1*Math.PI*2, rr = Math.sqrt(r2)*radius;
            x = (u-0.5)*L + (r3-0.5)*0.12;
            y = Math.cos(ang)*rr; z = Math.sin(ang)*rr*0.9;
          } else if(kind === "chrysalis"){
            // hanging pod: pinched at the top attachment, tapering to a point at the bottom
            const envelope = Math.max(0, Math.sin(Math.PI*u)*(1-0.5*u));
            const radius = 0.95*envelope;
            const ang = r1*Math.PI*2, rr = Math.sqrt(r2)*radius;
            y = 1.6 - u*3.6; x = Math.cos(ang)*rr; z = Math.sin(ang)*rr*0.85;
          } else {
            // butterfly: Fay's butterfly curve (a well-known closed-form curve
            // shaped like a butterfly), sampled once per particle with a
            // touch of radial jitter so the outline reads as dust, not a line
            const th = u*12*Math.PI;
            let rC = Math.exp(Math.cos(th)) - 2*Math.cos(4*th) + Math.pow(Math.sin(th/12),5);
            rC *= (1 + (r2-0.5)*0.22);
            x = Math.sin(th)*rC*0.62; y = Math.cos(th)*rC*0.62; z = (r3-0.5)*0.6;
          }
          arr[i*3]=x; arr[i*3+1]=y; arr[i*3+2]=z;
        }
        return arr;
      }

      const shapes = ["egg","caterpillar","chrysalis","butterfly"].map(buildShape);
      const positions = new Float32Array(N*3);
      positions.set(shapes[0]);

      const mGeo = new THREE.BufferGeometry();
      mGeo.setAttribute("position", new THREE.BufferAttribute(positions,3));
      const mMat = new THREE.PointsMaterial({
        size:0.55, map:dotTex, transparent:true, depthWrite:false,
        blending:THREE.AdditiveBlending, color:0xf1d8a3, sizeAttenuation:true, opacity:0
      });
      const morphPoints = new THREE.Points(mGeo, mMat);
      // Scale the figure up a touch so the silhouette extends beyond the
      // centered heading and reads as a distinct shape rather than a blur
      // hidden behind the text.
      morphPoints.scale.setScalar(1.25);
      // Lift the figure above screen-centre so it reads as an illustration
      // ABOVE the stage text (which the CSS pins to the lower viewport),
      // not a backdrop the heading overlaps.
      morphPoints.position.y = 2.2;
      scene.add(morphPoints);
      lifecycleMat = mMat;

      const stages = [...pin.querySelectorAll(".cycle-pin__stage")];
      const dots = [...pin.querySelectorAll(".cycle-pin__dot")];
      const fill = document.getElementById("cyclePinFill");
      let lastStage = 0;

      function setProgress(p){
        const segF = Math.min(0.999999, Math.max(0, p)) * 3;
        const idx = Math.floor(segF);
        const t = segF - idx;
        const a = shapes[idx], b = shapes[Math.min(3, idx+1)];
        const pos = mGeo.attributes.position.array;
        for(let i=0;i<N;i++){
          pos[i*3]   = a[i*3]   + (b[i*3]   - a[i*3])  *t;
          pos[i*3+1] = a[i*3+1] + (b[i*3+1] - a[i*3+1])*t;
          pos[i*3+2] = a[i*3+2] + (b[i*3+2] - a[i*3+2])*t;
        }
        mGeo.attributes.position.needsUpdate = true;

        const nearest = Math.round(segF);
        if(nearest !== lastStage){
          lastStage = nearest;
          stages.forEach((el,i)=> el.classList.toggle("is-active", i===nearest));
          dots.forEach((el,i)=> el.classList.toggle("is-active", i<=nearest));
        }
        if(fill) fill.style.width = (p*100) + "%";
      }

      ScrollTrigger.create({
        trigger: pin,
        start: "top top",
        end: "+=250%",
        pin: true,
        scrub: 0.5,
        onUpdate(self){ setProgress(self.progress); },
        onEnter(){ gsap.to(mMat, {opacity:0.95, duration:.6, overwrite:true}); },
        onEnterBack(){ gsap.to(mMat, {opacity:0.95, duration:.6, overwrite:true}); },
        onLeave(){ gsap.to(mMat, {opacity:0, duration:.6, overwrite:true}); },
        onLeaveBack(){ gsap.to(mMat, {opacity:0, duration:.6, overwrite:true}); }
      });
    })();
  }

  /* ---- input parallax: mouse, touch, and device tilt ---- */
  const mouse = {x:0,y:0,tx:0,ty:0};
  const setTarget = (cx,cy)=>{
    mouse.tx = (cx/window.innerWidth - 0.5);
    mouse.ty = (cy/window.innerHeight - 0.5);
  };
  window.addEventListener("pointermove",(e)=> setTarget(e.clientX, e.clientY));
  window.addEventListener("touchmove",(e)=>{
    const t0 = e.touches && e.touches[0];
    if(t0) setTarget(t0.clientX, t0.clientY);
  }, {passive:true});
  // gyroscope tilt — Android fires freely; iOS 13+ needs a permission gesture (gracefully skipped)
  window.addEventListener("deviceorientation",(e)=>{
    if(e.gamma == null && e.beta == null) return;
    const g = Math.max(-45, Math.min(45, e.gamma || 0));     // left/right tilt
    const b = Math.max(-45, Math.min(45, (e.beta || 0) - 40)); // front/back tilt
    // a touch more sensitive than before, clamped so it never gets jittery
    mouse.tx = Math.max(-0.75, Math.min(0.75, g/52));
    mouse.ty = Math.max(-0.75, Math.min(0.75, b/52));
  });

  const clock = new THREE.Clock();
  let alive = true;

  // ---- portal warp intro state ----
  const WARP_DUR = 2.4;
  const SETTLE_DUR = 1.6;   // warp dissolves into the calm field over this long
  let warpElapsed = 0, settleT = 0, mode = reduceMotion ? "idle" : "warp", smoothP = 0, begun = false;
  window.__beginWarp = ()=>{ if(begun) return; begun = true; clock.getDelta(); };
  const revealHero = ()=>{ if(!document.body.classList.contains("entered")) document.body.classList.add("entered"); };

  /* ---- tap scatter: particles flee a "foreign presence", butterflies startle ---- */
  const tmpV = new THREE.Vector3();
  function screenToWorld(cx,cy){
    tmpV.set((cx/canvas.clientWidth)*2-1, -(cy/canvas.clientHeight)*2+1, 0.5);
    tmpV.unproject(camera);
    tmpV.sub(camera.position).normalize();
    const dist = -camera.position.z / tmpV.z;     // intersect the z = 0 plane
    return new THREE.Vector3().copy(camera.position).add(tmpV.multiplyScalar(dist));
  }
  function scatter(cx,cy){
    const p = screenToWorld(cx,cy);
    const R = 6.5, R2 = R*R, strength = 30;
    const pos = geo.attributes.position.array;
    for(let i=0;i<COUNT;i++){
      const dx = pos[i*3]-p.x, dy = pos[i*3+1]-p.y;
      const d2 = dx*dx + dy*dy;
      if(d2 < R2){
        const d = Math.sqrt(d2) || 0.001;
        const f = (1 - d/R) * strength;
        vel[i*3]   += (dx/d)*f + (Math.random()-0.5)*3;
        vel[i*3+1] += (dy/d)*f + (Math.random()-0.5)*3;
        vel[i*3+2] += (Math.random()-0.5)*f*0.5;
      }
    }
    butterflies.forEach(s=>{
      const dx = s.position.x-p.x, dy = s.position.y-p.y;
      const d = Math.hypot(dx,dy) || 0.001;
      const SR = R*1.7;
      if(d < SR){ const f = (1 - d/SR)*9; s.userData.svx += (dx/d)*f; s.userData.svy += (dy/d)*f + 2; }
    });
  }
  const heroEl = document.querySelector(".hero");
  if(heroEl && !reduceMotion){
    heroEl.addEventListener("pointerdown",(e)=>{
      if(e.clientX==null) return;
      scatter(e.clientX, e.clientY);
    });
  }
  // the footer epilogue borrows the scatter impulse for its departure moment
  window.__scatterAt = scatter;

  // shared ambient pass: butterflies emerging, core breathing, camera drift.
  // driftEase (0→1) lets the camera ease into its drift after the warp rather
  // than snapping on.
  function ambient(t, dt, damp, driftEase){
    // while the metamorphosis pin is scrubbing, ease the ambient field back
    // so its own particles read clearly — same material, one shared spotlight
    const dim = lifecycleMat ? lifecycleMat.opacity/0.95 : 0;   // 0..1 (0.95 = metamorphosis peak opacity)

    butterflies.forEach(s=>{
      const u = s.userData;
      // emergence: each one grows, brightens and eases its wings open out of
      // nothing — staggered, so none of them simply snap into being.
      u.emT += dt;
      const e = Math.max(0, Math.min(1, (u.emT - u.emDelay)/2.2));
      const em = e*e*(3-2*e);                                  // smoothstep 0→1
      const startled = Math.hypot(u.svx, u.svy);
      s.position.x += Math.sin(t*0.5 + u.phase)*0.006 + u.driftX*dt + u.svx*dt;
      s.position.y += u.driftY*dt + u.svy*dt;
      u.svx *= damp; u.svy *= damp;
      if(s.position.y > 9){ s.position.y = -9; s.position.x = (Math.random()-0.5)*22; }
      if(s.position.x > 13) s.position.x = -13;
      if(s.position.x < -13) s.position.x = 13;
      s.material.opacity = 0.92 * em * (1 - dim*0.7);          // fade up on the curve, dimmed during the morph
      const grow = 0.28 + 0.72*em;                             // swell from a sliver to full
      const flapAmp = 0.85 * em;                               // wings ease open as it arrives
      const flap = (Math.sin(t*(u.flap + startled*0.6) + u.phase)*0.5+0.5);
      s.scale.x = u.sc * grow * (0.25 + flap*flapAmp) * u.sx;
      s.scale.y = u.sc * grow;
    });

    core.material.opacity = (0.42 + Math.sin(t*0.6)*0.08) * (1 - dim*0.55);
    core.scale.setScalar(26);
    mat.opacity = 0.9 * (1 - dim*0.7);                         // the pollen field itself steps back too

    // camera: gentle drift + input parallax + scroll dolly-back (the zoom-out)
    smoothP += (scrollProgress - smoothP)*0.06;
    mouse.x += (mouse.tx - mouse.x)*0.05;
    mouse.y += (mouse.ty - mouse.y)*0.05;
    const driftX = Math.sin(t*0.13)*1.1;
    const driftY = Math.cos(t*0.17)*0.7;
    camera.position.x = (driftX + mouse.x*3.6) * driftEase;
    camera.position.y = (driftY - mouse.y*2.6) * driftEase;
    camera.position.z = 14 + smoothP*20;        // pull back as the page scrolls
    camera.lookAt(0,0,0);
  }

  function frame(){
    if(!alive) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;   // getDelta() already advanced the clock
    const damp = Math.pow(0.9, dt*60);
    const pos = geo.attributes.position.array;

    /* ===== PORTAL WARP: a gentle drift-in, then settle ===== */
    if(mode === "warp"){
      const lin = WARP_DUR>0 ? Math.min(1, warpElapsed/WARP_DUR) : 1;
      const ease = 1 - Math.pow(1 - lin, 3);     // smooth deceleration
      const w = 1 - ease;                         // 1 → 0, eased
      if(begun){
        warpElapsed += dt;
        const speed = 5 + (w*w)*46;              // calm approach, easing to a crawl
        for(let i=0;i<COUNT;i++){
          pos[i*3+2] += speed*dt;
          if(pos[i*3+2] > camera.position.z + 4) placeWarpFar(i);
        }
        geo.attributes.position.needsUpdate = true;
      }
      mat.size = 0.5 + w*0.6;                     // a touch of streak, never harsh
      camera.fov = 60 + w*10; camera.updateProjectionMatrix();
      core.material.opacity = 0.3 + w*0.22;       // soft glow, no flash
      core.scale.setScalar(22 + w*12);
      camera.position.set(0,0,14); camera.lookAt(0,0,0);
      for(const s of butterflies){ s.material.opacity += (0 - s.material.opacity)*0.18; }

      // seamless entry: begin the hero's progressive disclosure while the field
      // is still settling, so the copy feels continuous with the motion.
      if(begun && lin >= 0.3) revealHero();

      if(lin >= 1){                              // arrival: glide (don't teleport) into the calm field
        for(let i=0;i<COUNT;i++){
          target[i*3]   = (Math.random()-0.5)*36;
          target[i*3+1] = (Math.random()-0.5)*26;
          target[i*3+2] = (Math.random()-0.5)*22 - 4;
          vel[i*3]=vel[i*3+1]=vel[i*3+2]=0;
        }
        mat.size = 0.5; camera.fov = 60; camera.updateProjectionMatrix();
        settleT = 0; mode = "settle";
        revealHero();
      }
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
      return;
    }

    /* ===== SETTLE: particles glide from the warp into the calm field ===== */
    if(mode === "settle"){
      settleT += dt;
      const k = 1 - Math.pow(0.9, dt*60);        // smooth exponential glide
      for(let i=0;i<COUNT;i++){
        pos[i*3]   += (target[i*3]   - pos[i*3])   * k;
        pos[i*3+1] += (target[i*3+1] - pos[i*3+1]) * k;
        pos[i*3+2] += (target[i*3+2] - pos[i*3+2]) * k;
      }
      geo.attributes.position.needsUpdate = true;
      points.rotation.z = Math.sin(t*0.05)*0.06;
      ambient(t, dt, damp, Math.min(1, settleT/SETTLE_DUR));   // camera drift eases in
      if(settleT >= SETTLE_DUR) mode = "idle";
      renderer.render(scene, camera);
      requestAnimationFrame(frame);
      return;
    }

    /* ===== IDLE: calm drift + tap scatter + scroll-driven zoom-out ===== */
    for(let i=0;i<COUNT;i++){
      pos[i*3]   += vel[i*3]*dt + Math.sin(t*0.3 + i)*0.0016;
      pos[i*3+1] += vel[i*3+1]*dt + speeds[i]*dt*0.7;
      pos[i*3+2] += vel[i*3+2]*dt;
      vel[i*3]*=damp; vel[i*3+1]*=damp; vel[i*3+2]*=damp;
      if(pos[i*3+1] > 14){ pos[i*3+1] = -14; pos[i*3] = (Math.random()-0.5)*36; vel[i*3]=vel[i*3+1]=vel[i*3+2]=0; }
      if(pos[i*3+2] > 9) pos[i*3+2] = 9; else if(pos[i*3+2] < -20) pos[i*3+2] = -20;
    }
    geo.attributes.position.needsUpdate = true;
    points.rotation.z = Math.sin(t*0.05)*0.06;

    ambient(t, dt, damp, 1);

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  function start(){
    size();
    if(reduceMotion){
      for(let i=0;i<COUNT;i++) placeIdle(i);
      geo.attributes.position.needsUpdate = true;
      document.body.classList.add("entered");
      renderer.render(scene, camera);
      return;
    }
    alive = true; frame();
  }
  window.addEventListener("resize", size);

  // the canvas is a full-page background: only pause when the tab is hidden
  document.addEventListener("visibilitychange", ()=>{
    if(document.hidden){ alive = false; }
    else if(!reduceMotion && !alive){ alive = true; clock.getDelta(); frame(); }
  });

  start();
})();
