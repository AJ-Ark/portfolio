/* Scope the standalone Realm stylesheet under .realm-doc so it can live
   inside the Next app without its global reset (and its own --pad!) leaking
   onto every other page. Uses a real CSS parser, not regex. */
const fs = require("fs");
const path = require("path");
const postcss = require("postcss");

const ROOT = ".realm-doc";
const SRC = path.join(__dirname, "..", "public/realm/css/style.css");
const OUT = path.join(__dirname, "..", "src/app/work/realm/realm.css");

const css = fs.readFileSync(SRC, "utf8");
const root = postcss.parse(css);

/* Cross-document view transitions are meaningless now that this is an SPA
   route — the site owns its own transition. Drop them. */
root.walkAtRules("view-transition", (r) => r.remove());
root.walkRules((r) => {
  if (r.selector.includes("view-transition")) r.remove();
  /* Lenis writes its classes on <html>/<body>, which this shell div is not;
     the main site already owns that wiring. */
  if (/^(body|html)?\.lenis/.test(r.selector.trim())) r.remove();
});

function scopeSelector(sel) {
  const s = sel.trim();
  if (!s) return s;
  if (s === ":root" || s === "html" || s === "body") return ROOT;
  /* The reset must reach the shell itself as well as its descendants. */
  if (s === "*") return `${ROOT}, ${ROOT} *`;
  if (/^html\b/.test(s)) return ROOT + s.slice(4);   // html.x y -> .realm-doc.x y
  if (/^body\b/.test(s)) return ROOT + s.slice(4);
  return `${ROOT} ${s}`;
}

/* `overflow-x:hidden` lived on <body>. On a nested div it creates a clipping
   + containing context that crops the six position:fixed children (nav, bg
   canvas, veil, progress bar…). The app's own body already guards horizontal
   overflow, so drop it here. */
function dropBodyOverflow() {
  root.walkRules((r) => {
    if (r.selector.trim() !== ROOT) return;
    r.walkDecls("overflow-x", (d) => d.remove());
  });
}

let rules = 0;
root.walkRules((rule) => {
  /* keyframe steps (0%,100%,from,to) are not selectors — leave them alone */
  if (rule.parent && rule.parent.type === "atrule" && /keyframes/.test(rule.parent.name)) return;
  rule.selectors = rule.selectors.map(scopeSelector);
  rules++;
});

dropBodyOverflow();

/* Report keyframe + font-face names so we can check them against the site's
   own globals for collisions. */
const keyframes = [];
root.walkAtRules(/keyframes/, (r) => keyframes.push(r.params));

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(
  OUT,
  `/* ══════════════════════════════════════════════════════════════════
   REALM OF ELEMENTALS — ported from the standalone doc.
   GENERATED from public/realm/css/style.css and scoped under ${ROOT}:
   the original shipped a global reset (*, html, body, img) and its own
   --pad, which would otherwise overwrite the rest of the site.
   ══════════════════════════════════════════════════════════════════ */\n\n` +
    root.toString(),
  "utf8"
);

console.log("scoped rules:", rules);
console.log("keyframes:", keyframes.join(", "));
console.log("out:", OUT, fs.statSync(OUT).size, "bytes");
