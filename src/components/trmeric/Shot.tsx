"use client";

import Image from "next/image";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* useLayoutEffect on the client (so the FLIP invert commits before the
   browser paints — no one-frame flash at the wrong position), useEffect
   on the server (useLayoutEffect is a no-op there and React warns on
   every SSR pass of every page that renders a <Shot>). */
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* True-aspect-ratio screenshot with a click-to-open FLIP lightbox.

   FLIP shared-element transition: on open, the thumbnail's rect (First) is
   captured, the full-viewport stage is rendered at that exact rect, then
   inverted-and-played back to its natural centred size (Last) — the image
   visibly grows out of its inline slot instead of hard-cutting to a modal.
   The overlay renders through a portal — PlotInLines leaves a transform on
   its wrapper, which would otherwise trap position:fixed children.

   Backward compatible: every prop below except `gallery`/`index` existed
   before this rewrite and behaves identically for existing call sites. */

export interface ShotGalleryItem {
  src: string;
  alt: string;
  caption?: string;
}

interface ShotProps {
  src: string;
  alt: string;
  ratio?: string;
  radius?: number;
  border?: string;
  shadow?: string;
  caption?: string;
  actions?: React.ReactNode;
  priority?: boolean;
  sizes?: string;
  accent?: string;
  /** Optional set of sibling shots this one belongs to (e.g. a walkthrough
   *  sequence). When length > 1, the lightbox gains prev/next affordances
   *  and ArrowLeft/ArrowRight navigation. Purely additive — omit for the
   *  previous single-image behaviour. */
  gallery?: ShotGalleryItem[];
  /** This shot's position within `gallery`. Defaults to 0. */
  index?: number;
}

const FLIP_MS = 480;
const CLOSE_MS = 340;
const EASE_OPEN = "cubic-bezier(.16,1,.3,1)";
const EASE_CLOSE = "cubic-bezier(.4,0,.2,1)";
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;

export default function Shot({
  src,
  alt,
  ratio = "16/10",
  radius = 14,
  border,
  shadow,
  caption,
  actions,
  priority = false,
  sizes = "(max-width: 900px) 100vw, 1100px",
  accent = "#FFA426",
  gallery,
  index = 0,
}: ShotProps) {
  const reducedMotion = usePrefersReducedMotion();
  const items: ShotGalleryItem[] = useMemo(
    () => (gallery && gallery.length > 1 ? gallery : [{ src, alt, caption }]),
    [gallery, src, alt, caption]
  );
  const startAt = gallery && gallery.length > 1 ? Math.min(Math.max(index, 0), items.length - 1) : 0;

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(startAt);
  const [closing, setClosing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const originRectRef = useRef<DOMRect | null>(null);
  const dragRef = useRef<{ x: number; y: number; panX: number; panY: number; dragging: boolean }>({
    x: 0,
    y: 0,
    panX: 0,
    panY: 0,
    dragging: false,
  });
  const closeTimerRef = useRef<number | undefined>(undefined);

  useEffect(() => setMounted(true), []);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const openLightbox = useCallback(() => {
    if (triggerRef.current) originRectRef.current = triggerRef.current.getBoundingClientRect();
    setActive(startAt);
    resetView();
    setClosing(false);
    setOpen(true);
  }, [startAt]);

  const finalizeClose = useCallback(() => {
    setOpen(false);
    setClosing(false);
    triggerRef.current?.focus();
  }, []);

  const close = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    const stage = stageRef.current;
    const origin = originRectRef.current;
    if (reducedMotion || !stage || !origin) {
      finalizeClose();
      return;
    }
    const last = stage.getBoundingClientRect();
    const dx = origin.left - last.left;
    const dy = origin.top - last.top;
    const sx = origin.width / last.width;
    const sy = origin.height / last.height;
    setClosing(true);
    stage.style.transition = `transform ${CLOSE_MS}ms ${EASE_CLOSE}, opacity ${CLOSE_MS}ms ${EASE_CLOSE}`;
    stage.style.transformOrigin = "top left";
    stage.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    closeTimerRef.current = window.setTimeout(finalizeClose, CLOSE_MS);
  }, [reducedMotion, finalizeClose]);

  /* Play the FLIP invert the instant the stage mounts at its natural
     (Last) position/size — before the browser paints, so nothing flashes
     at the wrong place. */
  useIsoLayoutEffect(() => {
    if (!open || closing) return;
    const stage = stageRef.current;
    const origin = originRectRef.current;
    if (reducedMotion || !stage || !origin) return;

    const last = stage.getBoundingClientRect();
    const dx = origin.left - last.left;
    const dy = origin.top - last.top;
    const sx = origin.width / last.width;
    const sy = origin.height / last.height;

    stage.style.transition = "none";
    stage.style.transformOrigin = "top left";
    stage.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    /* Force layout so the invert above is committed before we animate away
       from it. */
    void stage.getBoundingClientRect();

    const raf = requestAnimationFrame(() => {
      stage.style.transition = `transform ${FLIP_MS}ms ${EASE_OPEN}`;
      stage.style.transform = "translate(0, 0) scale(1, 1)";
    });
    return () => cancelAnimationFrame(raf);
  }, [open, reducedMotion]);

  /* Escape, body scroll lock, canvas occlusion hint. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight" && items.length > 1) {
        setActive((a) => (a + 1) % items.length);
        resetView();
      } else if (e.key === "ArrowLeft" && items.length > 1) {
        setActive((a) => (a - 1 + items.length) % items.length);
        resetView();
      } else if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])')
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const lastEl = focusables[focusables.length - 1];
        // idx === -1 when focus is on the dialog container itself (tabIndex -1,
        // where it lands on open) — treat that as "before first" so Shift+Tab
        // wraps to the last control instead of escaping the modal.
        const idx = focusables.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && idx <= 0) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && idx === focusables.length - 1) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.setAttribute("data-canvas-occluded", "1");
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      document.documentElement.removeAttribute("data-canvas-occluded");
    };
  }, [open, close, items.length]);

  useEffect(() => () => window.clearTimeout(closeTimerRef.current), []);

  const goTo = (next: number) => {
    setActive(((next % items.length) + items.length) % items.length);
    resetView();
  };

  /* ── Pan / zoom (works identically with or without reduced motion — it's
     direct manipulation, not an automatic animation). ── */
  const clampPan = (x: number, y: number, z: number) => {
    const el = stageRef.current;
    const maxX = el ? (el.clientWidth * (z - 1)) / 2 : 0;
    const maxY = el ? (el.clientHeight * (z - 1)) / 2 : 0;
    return { x: Math.min(maxX, Math.max(-maxX, x)), y: Math.min(maxY, Math.max(-maxY, y)) };
  };

  const applyZoom = (next: number) => {
    const z = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, next));
    setZoom(z);
    setPan((p) => (z === ZOOM_MIN ? { x: 0, y: 0 } : clampPan(p.x, p.y, z)));
  };

  const onWheel = (e: React.WheelEvent) => {
    if (items.length && !e.ctrlKey) {
      e.preventDefault();
      applyZoom(zoom - e.deltaY * 0.0025);
    }
  };

  const onDoubleClick = () => applyZoom(zoom > ZOOM_MIN ? 1 : 2.5);

  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= ZOOM_MIN) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragRef.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y, dragging: true };
    setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.x;
    const dy = e.clientY - dragRef.current.y;
    setPan(clampPan(dragRef.current.panX + dx, dragRef.current.panY + dy, zoom));
  };
  const endDrag = () => {
    if (!dragRef.current.dragging) return;
    dragRef.current.dragging = false;
    setDragging(false);
  };

  const current = items[active] ?? items[0];
  const showGallery = items.length > 1;
  const dur = reducedMotion ? 0 : 0.22;

  return (
    <>
      <figure style={{ margin: 0 }}>
        <button
          ref={triggerRef}
          onClick={openLightbox}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label={`View full screenshot: ${alt}`}
          aria-haspopup="dialog"
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            aspectRatio: ratio,
            borderRadius: radius,
            overflow: "hidden",
            border: border ?? "1px solid var(--line, rgba(23,21,15,.12))",
            boxShadow: shadow,
            cursor: "zoom-in",
            padding: 0,
            background: "transparent",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            style={{
              objectFit: "cover",
              transform: hover ? "scale(1.015)" : "scale(1)",
              transition: "transform .8s cubic-bezier(.16,1,.3,1)",
            }}
          />
          {/* zoom affordance */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: 12,
              bottom: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: ".4rem .7rem",
              borderRadius: 999,
              background: "rgba(15,13,9,.72)",
              backdropFilter: "blur(6px)",
              color: "#F2E8D0",
              fontFamily: "var(--font-mono)",
              fontSize: ".55rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              opacity: hover ? 1 : 0,
              transform: hover ? "translateY(0)" : "translateY(4px)",
              transition: "opacity .3s ease, transform .3s ease",
              pointerEvents: "none",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={accent} strokeWidth="1.4" strokeLinecap="round">
              <path d="M1 5V1h4M11 7v4H7M1 1l4 4M11 11L7 7" />
            </svg>
            View full
          </span>
        </button>
        {caption && (
          <figcaption
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".55rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              opacity: 0.55,
              marginTop: ".7rem",
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>

      {mounted && open &&
        createPortal(
          <div
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            ref={dialogRef}
            tabIndex={-1}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(1rem, 4vw, 3rem)",
              background: "rgba(10,8,5,.92)",
              backdropFilter: "blur(12px)",
              animation: reducedMotion ? undefined : `trmShotFade ${dur || 0.25}s ease both`,
              cursor: "zoom-out",
              outline: "none",
            }}
          >
            <style>{`
              @keyframes trmShotFade { from { opacity: 0 } to { opacity: 1 } }
              .trm-shot-stage-img { transition: opacity .18s ease; }
            `}</style>

            <div
              ref={stageRef}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "min(1400px, 94vw)",
                flex: "0 1 auto",
                aspectRatio: ratio,
                maxHeight: "82vh",
                cursor: zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
                touchAction: "none",
                overflow: "hidden",
                borderRadius: 4,
              }}
              onWheel={onWheel}
              onDoubleClick={onDoubleClick}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              <div
                className="trm-shot-stage-img"
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transition: dragging ? "none" : "transform .28s cubic-bezier(.16,1,.3,1)",
                }}
              >
                <Image key={current.src} src={current.src} alt={current.alt} fill sizes="94vw" style={{ objectFit: "contain" }} draggable={false} />
              </div>
            </div>

            {showGallery && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(active - 1);
                  }}
                  aria-label="Previous screenshot"
                  style={navBtnStyle("left")}
                >
                  ←
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(active + 1);
                  }}
                  aria-label="Next screenshot"
                  style={navBtnStyle("right")}
                >
                  →
                </button>
              </>
            )}

            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginTop: "1.2rem",
                flexWrap: "wrap",
                justifyContent: "center",
                cursor: "default",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: ".6rem",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "rgba(242,232,208,.6)",
                }}
              >
                {current.caption ?? current.alt}
                {showGallery ? ` · ${active + 1}/${items.length}` : ""}
              </span>

              <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem" }}>
                <button onClick={() => applyZoom(zoom - 0.5)} aria-label="Zoom out" style={ctlBtnStyle} disabled={zoom <= ZOOM_MIN}>
                  −
                </button>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", color: "rgba(242,232,208,.7)", minWidth: "2.4em", textAlign: "center" }}>
                  {Math.round(zoom * 100)}%
                </span>
                <button onClick={() => applyZoom(zoom + 0.5)} aria-label="Zoom in" style={ctlBtnStyle} disabled={zoom >= ZOOM_MAX}>
                  +
                </button>
                {zoom !== 1 && (
                  <button onClick={() => applyZoom(1)} aria-label="Reset zoom" style={ctlBtnStyle}>
                    Reset
                  </button>
                )}
              </span>

              {actions}
              <button
                onClick={close}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: ".58rem",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#F2E8D0",
                  background: "transparent",
                  border: "1px solid rgba(242,232,208,.25)",
                  borderRadius: 999,
                  padding: ".45rem 1rem",
                  cursor: "pointer",
                }}
              >
                ✕ Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

const ctlBtnStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: ".7rem",
  color: "#F2E8D0",
  background: "rgba(242,232,208,.08)",
  border: "1px solid rgba(242,232,208,.25)",
  borderRadius: 999,
  width: "1.8em",
  height: "1.8em",
  lineHeight: 1,
  cursor: "pointer",
};

function navBtnStyle(side: "left" | "right"): React.CSSProperties {
  return {
    position: "fixed",
    top: "50%",
    [side]: "clamp(.5rem, 2vw, 2rem)",
    transform: "translateY(-50%)",
    width: "2.6rem",
    height: "2.6rem",
    borderRadius: "50%",
    background: "rgba(15,13,9,.6)",
    border: "1px solid rgba(242,232,208,.25)",
    color: "#F2E8D0",
    fontSize: "1.1rem",
    cursor: "pointer",
    backdropFilter: "blur(6px)",
  };
}
