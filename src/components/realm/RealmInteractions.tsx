"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════════════════
   REALM INTERACTIONS — the standalone doc's smaller behaviours, ported
   near-verbatim into one effect scoped to the page root: reveal-on-
   scroll, the logline's word-by-word lighting, count-up stats, the
   hero's parallax-out, the pinned horizontal screens gallery, in-page
   anchor jumps, and the research bento's click-to-open (already
   rewritten from hover to click — see RealmSectionRail's sibling
   commit). Kept as one big imperative effect rather than split into
   idiomatic per-element hooks, deliberately: the standalone doc's own
   architecture is a handful of independent DOM-query passes over one
   document, and re-deriving each into React state risks changing
   behaviour the user explicitly asked to leave untouched. Queries are
   scoped to `root` (not `document`) so nothing here can ever match
   something outside this page.

   Not ported here: the three.js hero/metamorphosis scene (its own
   component, RealmHeroScene — too large and too load-bearing to share
   a cleanup path with everything else) and the "NAV + SCROLL PROGRESS"
   / "PRELOADER" / "EPILOGUE" modules, which the site's own Navigation,
   the warp-arrival dust field, and <NextProject/> now cover.
   ══════════════════════════════════════════════════════════════════ */

export default function RealmInteractions({ rootRef }: { rootRef: RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduceMotion = prefersReducedMotionNow();
    const cleanups: Array<() => void> = [];

    /* ---- Lenis <-> ScrollTrigger ----
       SmoothScroll owns the site's one rAF clock and calls lenis.raf()
       itself — ScrollTrigger must NOT get its own driver (that would be a
       second clock), it only needs to recompute in lockstep with each
       Lenis tick instead of lagging a frame behind its own polling. */
    if (window.__lenis) cleanups.push(window.__lenis.on("scroll", ScrollTrigger.update));

    /* ---- REVEAL ON SCROLL ---- */
    const revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add("in"); revealIo.unobserve(en.target); }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    root.querySelectorAll(".reveal").forEach((el) => revealIo.observe(el));
    cleanups.push(() => revealIo.disconnect());

    /* ---- LOGLINE — word by word lighting ---- */
    const words = [...root.querySelectorAll(".logline__lead .word")];
    let loglineTrigger: ScrollTrigger | null = null;
    if (words.length && !reduceMotion) {
      loglineTrigger = ScrollTrigger.create({
        trigger: root.querySelector(".logline__lead") ?? undefined,
        start: "top 80%",
        end: "bottom 60%",
        onUpdate: (self) => {
          const n = Math.round(self.progress * words.length);
          words.forEach((w, i) => w.classList.toggle("lit", i < n));
        },
      });
    } else {
      words.forEach((w) => w.classList.add("lit"));
    }
    cleanups.push(() => loglineTrigger?.kill());

    /* ---- COUNT-UP STATS ---- */
    const countObservers: IntersectionObserver[] = [];
    root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count);
      const ob = new IntersectionObserver(
        (ents) => {
          ents.forEach((e) => {
            if (!e.isIntersecting) return;
            ob.disconnect();
            if (reduceMotion) { el.textContent = String(target); return; }
            const t0 = performance.now(), dur = 1500;
            const tick = (t: number) => {
              const p = Math.min((t - t0) / dur, 1);
              el.textContent = String(Math.round((1 - Math.pow(1 - p, 3)) * target));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          });
        },
        { threshold: 0.6 }
      );
      ob.observe(el);
      countObservers.push(ob);
    });
    cleanups.push(() => countObservers.forEach((ob) => ob.disconnect()));

    /* ---- HERO PARALLAX TEXT ----
       The original also tweened a ".hero__canvas" selector that matches
       no element anywhere in the doc (checked — dead code from an
       earlier draft; GSAP silently no-ops on an empty target list), so
       only the real tween is ported. */
    let heroParallax: ScrollTrigger | null = null;
    if (!reduceMotion) {
      const tween = gsap.to(root.querySelector(".hero__inner"), {
        yPercent: 30, opacity: 0, ease: "none",
        scrollTrigger: { trigger: root.querySelector(".hero"), start: "top top", end: "bottom top", scrub: true },
      });
      heroParallax = tween.scrollTrigger ?? null;
    }
    cleanups.push(() => heroParallax?.kill());

    /* ---- SCREENS GALLERY — pinned horizontal scrub ---- */
    (function screensGallery() {
      const view = root!.querySelector<HTMLElement>("#screens");
      const track = root!.querySelector<HTMLElement>("#screensTrack");
      if (!view || !track) return;

      if (!reduceMotion) {
        view.classList.add("screens--pinned");
        const tween = gsap.to(track, {
          x: () => -Math.max(0, track.scrollWidth - view.clientWidth),
          ease: "none",
          scrollTrigger: {
            trigger: view,
            start: "top top",
            end: () => "+=" + Math.max(0, track.scrollWidth - view.clientWidth),
            pin: true,
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        });
        const onResize = () => ScrollTrigger.refresh();
        window.addEventListener("resize", onResize);
        cleanups.push(() => { tween.scrollTrigger?.kill(); window.removeEventListener("resize", onResize); });
        return;
      }

      // ---- fallback: native horizontal scroll, drag-to-scroll, wheel remap ----
      let down = false, startX = 0, startLeft = 0, moved = false;
      const onDown = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        down = true; moved = false; startX = e.clientX; startLeft = view.scrollLeft;
        view.classList.add("drag");
        view.setPointerCapture?.(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 3) moved = true;
        view.scrollLeft = startLeft - dx;
      };
      const release = () => { down = false; view.classList.remove("drag"); };
      const onClickCapture = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); } };
      const onWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          const before = view.scrollLeft;
          view.scrollLeft += e.deltaY;
          if (view.scrollLeft !== before) e.preventDefault();
        }
      };
      view.addEventListener("pointerdown", onDown);
      view.addEventListener("pointermove", onMove);
      view.addEventListener("pointerup", release);
      view.addEventListener("pointercancel", release);
      view.addEventListener("click", onClickCapture, true);
      view.addEventListener("wheel", onWheel, { passive: false });
      cleanups.push(() => {
        view.removeEventListener("pointerdown", onDown);
        view.removeEventListener("pointermove", onMove);
        view.removeEventListener("pointerup", release);
        view.removeEventListener("pointercancel", release);
        view.removeEventListener("click", onClickCapture, true);
        view.removeEventListener("wheel", onWheel);
      });
    })();

    /* ---- IN-PAGE ANCHOR LINKS — smooth scroll ---- */
    const anchorHandlers: Array<[Element, EventListener]> = [];
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const handler = (e: Event) => {
        const id = a.getAttribute("href");
        if (!id || id.length < 2) return;
        const el = root!.querySelector(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
      };
      a.addEventListener("click", handler);
      anchorHandlers.push([a, handler]);
    });
    cleanups.push(() => anchorHandlers.forEach(([a, h]) => a.removeEventListener("click", h)));

    /* ---- RESEARCH BENTO — click to open, FLIP morph on reflow ---- */
    (function researchBento() {
      const grid = root!.querySelector<HTMLElement>("#bento");
      if (!grid) return;
      const tiles = [...grid.querySelectorAll<HTMLElement>(".btile")];
      const desktop = window.matchMedia("(min-width:821px)");
      let activeIdx = -1;

      let bentoScrub: ScrollTrigger | null = null;
      if (!reduceMotion) {
        const tween = gsap.fromTo(grid, { "--p": 0 }, {
          "--p": 1, ease: "none",
          scrollTrigger: { trigger: root!.querySelector("#research"), start: "top bottom", end: "bottom top", scrub: 0.5 },
        });
        bentoScrub = tween.scrollTrigger ?? null;
      }

      function apply(i: number) {
        if (i === activeIdx) return;
        const flip = desktop.matches && !reduceMotion;
        let first: DOMRect[] = [];
        if (flip) {
          tiles.forEach((t) => t.getAnimations().forEach((a) => a.finish()));
          first = tiles.map((t) => t.getBoundingClientRect());
        }
        tiles.forEach((t, j) => {
          const on = j === i;
          t.classList.toggle("is-active", on);
          t.setAttribute("aria-expanded", on ? "true" : "false");
        });
        grid!.classList.toggle("has-active", i >= 0);
        activeIdx = i;
        if (!flip) return;
        const last = tiles.map((t) => t.getBoundingClientRect());
        tiles.forEach((t, j) => {
          const f = first[j], l = last[j];
          if (!f.width || !l.width) return;
          const dx = f.left - l.left, dy = f.top - l.top, sx = f.width / l.width, sy = f.height / l.height;
          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5 && Math.abs(sx - 1) < 0.02 && Math.abs(sy - 1) < 0.02) return;
          t.animate(
            [{ transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})` }, { transform: "none" }],
            { duration: 700, easing: "cubic-bezier(0.22,1,0.36,1)" }
          );
        });
      }

      const clickHandlers: Array<[HTMLElement, EventListener]> = [];
      tiles.forEach((t, i) => {
        const h = () => apply(t.classList.contains("is-active") ? -1 : i);
        t.addEventListener("click", h);
        clickHandlers.push([t, h]);
      });

      const onKeydown = (e: KeyboardEvent) => {
        if (e.key !== "Escape" || activeIdx < 0) return;
        const open = tiles[activeIdx];
        apply(-1);
        open.focus();
      };
      const onPointerdown = (e: PointerEvent) => {
        if (activeIdx >= 0 && !grid!.contains(e.target as Node)) apply(-1);
      };
      document.addEventListener("keydown", onKeydown);
      document.addEventListener("pointerdown", onPointerdown);
      const onDesktopChange = () => apply(-1);
      desktop.addEventListener("change", onDesktopChange);

      cleanups.push(() => {
        bentoScrub?.kill();
        clickHandlers.forEach(([t, h]) => t.removeEventListener("click", h));
        document.removeEventListener("keydown", onKeydown);
        document.removeEventListener("pointerdown", onPointerdown);
        desktop.removeEventListener("change", onDesktopChange);
      });
    })();

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
