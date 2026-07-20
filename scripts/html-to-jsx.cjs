/* Converts a fragment of the standalone Realm HTML doc into JSX, using a
   real HTML parser (parse5) rather than hand-transcription — the same
   discipline as scripts/scope-realm-css.cjs. Usage:
     node scripts/html-to-jsx.cjs <start-marker-id> <end-marker-id-exclusive>
   Prints JSX for everything between (and including) the element with
   id=start and up to (excluding) the element with id=end, at the top
   level of <body>. */
const fs = require("fs");
const path = require("path");
const parse5 = require("parse5");

const SRC = path.join(__dirname, "..", "public", "realm", "index.html");
const html = fs.readFileSync(SRC, "utf8");
const doc = parse5.parse(html);

const VOID_TAGS = new Set([
  "area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr",
]);

/* Only attributes actually confirmed present in this doc are mapped —
   deliberately not a giant generic table, so nothing is silently
   mistranslated for an attribute this file doesn't use. */
const ATTR_RENAME = {
  class: "className",
  for: "htmlFor",
  crossorigin: "crossOrigin",
  autoplay: "autoPlay",
  playsinline: "playsInline",
  tabindex: "tabIndex",
  viewbox: "viewBox",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "clip-path": "clipPath",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "text-anchor": "textAnchor",
  "xlink:href": "xlinkHref",
  "xml:space": "xmlSpace",
  srcset: "srcSet",
  "shape-rendering": "shapeRendering",
};

function camelCssProp(prop) {
  if (prop.startsWith("--")) return prop; // CSS custom property, keep literal
  return prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function styleStringToObjectLiteral(styleStr) {
  const decls = styleStr
    .split(";")
    .map((d) => d.trim())
    .filter(Boolean);
  const parts = decls.map((d) => {
    const idx = d.indexOf(":");
    const prop = d.slice(0, idx).trim();
    const val = d.slice(idx + 1).trim();
    const key = /^[a-zA-Z_$][\w$]*$/.test(camelCssProp(prop)) && !prop.startsWith("--")
      ? camelCssProp(prop)
      : JSON.stringify(prop);
    return `${key}: ${JSON.stringify(val)}`;
  });
  return `{ ${parts.join(", ")} }`;
}

function escText(text) {
  // JSX text: curly braces must be escaped as expressions; everything else
  // (including already-decoded entities like non-breaking space) is literal.
  return text.replace(/[{}]/g, (c) => `{"${c}"}`);
}

function attrToJsx(name, value) {
  const lname = name.toLowerCase();
  if (lname === "style") {
    return `style={${styleStringToObjectLiteral(value)}}`;
  }
  const jsxName = ATTR_RENAME[lname] || name;
  return `${jsxName}=${JSON.stringify(value)}`;
}

function serializeAttrs(node) {
  if (!node.attrs || !node.attrs.length) return "";
  return " " + node.attrs.map((a) => attrToJsx(a.name, a.value)).join(" ");
}

/* JSX drops whitespace-only text between tags on different source lines
   entirely (no space); HTML collapses the SAME whitespace to one rendered
   space. That's invisible for block layout (divs/sections don't rely on
   inter-tag whitespace) but breaks word-spacing for inline runs. Verified
   by grep across the whole doc: the only place this pattern occurs is the
   logline's sequence of <span class="word"> tags — so only emit `{" "}`
   there (both neighbours are <span>), and drop it everywhere else exactly
   as before. */
function serializeChildren(children, indent) {
  const elIndices = children
    .map((c, i) => (c.tagName ? i : -1))
    .filter((i) => i !== -1);
  return children
    .map((c, i) => {
      if (c.nodeName === "#text" && !c.value.trim()) {
        const prevEl = elIndices.filter((j) => j < i).pop();
        const nextEl = elIndices.find((j) => j > i);
        const prevIsSpan = prevEl !== undefined && children[prevEl].tagName === "span";
        const nextIsSpan = nextEl !== undefined && children[nextEl].tagName === "span";
        if (prevIsSpan && nextIsSpan) return "  ".repeat(indent) + '{" "}\n';
        return "";
      }
      return serializeNode(c, indent);
    })
    .join("");
}

function serializeNode(node, indent) {
  const pad = "  ".repeat(indent);
  if (node.nodeName === "#text") {
    const raw = node.value;
    if (!raw.trim()) return ""; // drop pure-whitespace text nodes; JSX doesn't need them
    return pad + escText(raw.trim()) + "\n";
  }
  if (node.nodeName === "#comment") {
    return pad + `{/* ${node.data.trim()} */}\n`;
  }
  const tag = node.tagName;
  if (!tag) return "";
  const attrs = serializeAttrs(node);
  if (VOID_TAGS.has(tag)) {
    return `${pad}<${tag}${attrs} />\n`;
  }
  const kids = (node.childNodes || []).filter(
    (c) => !(c.nodeName === "#text" && !c.value.trim())
  );
  if (kids.length === 0) {
    return `${pad}<${tag}${attrs}></${tag}>\n`;
  }
  const inner = serializeChildren(node.childNodes || [], indent + 1);
  return `${pad}<${tag}${attrs}>\n${inner}${pad}</${tag}>\n`;
}

function findById(node, id) {
  if (node.attrs && node.attrs.some((a) => a.name === "id" && a.value === id)) return node;
  for (const c of node.childNodes || []) {
    const found = findById(c, id);
    if (found) return found;
  }
  return null;
}

function getBody(node) {
  if (node.tagName === "body") return node;
  for (const c of node.childNodes || []) {
    const found = getBody(c);
    if (found) return found;
  }
  return null;
}

const body = getBody(doc);
const [startId, endId] = process.argv.slice(2);

let nodes = body.childNodes.filter((n) => n.tagName); // top-level elements only
if (startId) {
  const startIdx = nodes.findIndex(
    (n) => n.attrs && n.attrs.some((a) => a.name === "id" && a.value === startId)
  );
  if (startIdx === -1) {
    console.error(`start id "${startId}" not found at top level of <body>`);
    process.exit(1);
  }
  let endIdx = nodes.length;
  if (endId) {
    endIdx = nodes.findIndex(
      (n) => n.attrs && n.attrs.some((a) => a.name === "id" && a.value === endId)
    );
    if (endIdx === -1) endIdx = nodes.length;
  }
  nodes = nodes.slice(startIdx, endIdx);
}

console.log(serializeChildren(nodes, 0));
