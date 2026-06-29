(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/3d/ParticleField.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ParticleField
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-b389eeca.esm.js [app-client] (ecmascript) <export D as useFrame>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/events-b389eeca.esm.js [app-client] (ecmascript) <export C as useThree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/three/build/three.core.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const PARTICLE_COUNT = 5000;
// ─── Per-particle seed (stable across renders) ───
function makeSeeds(count) {
    const s = new Float32Array(count * 3);
    for(let i = 0; i < count; i++){
        s[i * 3] = Math.random();
        s[i * 3 + 1] = Math.random();
        s[i * 3 + 2] = Math.random();
    }
    return s;
}
// ─── Target position calculators ───
function rippleTarget(i, seed, t) {
    const rings = 14;
    const ring = Math.floor(i / (PARTICLE_COUNT / rings));
    const angle = i / (PARTICLE_COUNT / rings) * Math.PI * 2 + t * 0.08;
    const radius = (ring + 1) * 0.55 + Math.sin(t * 0.4 + ring * 0.5) * 0.25;
    const scatter = (seed[i * 3] - 0.5) * 0.5;
    return [
        Math.cos(angle) * radius + scatter,
        (seed[i * 3 + 1] - 0.5) * 0.6 + Math.sin(t * 0.3 + i * 0.001) * 0.1,
        Math.sin(angle) * radius + scatter * 0.5
    ];
}
function organicTarget(i, seed, t) {
    const angle = i / PARTICLE_COUNT * Math.PI * 4;
    const t2 = i / PARTICLE_COUNT;
    // Butterfly wing silhouette (parametric)
    const r = Math.pow(Math.abs(Math.cos(angle * 2)), 0.4) * 3.2;
    const drift = Math.sin(t * 0.25 + seed[i * 3] * 6) * 0.6;
    const breathe = Math.sin(t * 0.5 + seed[i * 3 + 1] * 4) * 0.2;
    return [
        Math.cos(angle) * r + drift,
        Math.sin(angle) * r * 0.55 + breathe + (seed[i * 3 + 2] - 0.5) * 0.4,
        (seed[i * 3] - 0.5) * 2.5 + Math.sin(t * 0.2 + t2 * 6) * 0.3
    ];
}
function latticeTarget(i, seed, t) {
    const gridSize = Math.ceil(Math.cbrt(PARTICLE_COUNT));
    const gx = i % gridSize - gridSize * 0.5;
    const gy = Math.floor(i / gridSize) % gridSize - gridSize * 0.5;
    const gz = Math.floor(i / (gridSize * gridSize)) - gridSize * 0.5;
    // Data-flow pulse along X axis
    const flow = Math.sin(t * 0.7 + gx * 0.4 + gy * 0.2) * 0.12;
    return [
        gx * 0.55 + flow,
        gy * 0.55 + flow * 0.5,
        gz * 0.5
    ];
}
function idleTarget(i, seed, t) {
    // Fibonacci sphere — slow drift
    const phi = Math.acos(1 - 2 * (i + 0.5) / PARTICLE_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 3.8 + Math.sin(t * 0.15 + seed[i * 3] * 4) * 0.4;
    return [
        r * Math.sin(phi) * Math.cos(theta + t * 0.04),
        r * Math.cos(phi) * 0.55,
        r * Math.sin(phi) * Math.sin(theta + t * 0.04)
    ];
}
function getTargetPosition(domain, i, seed, t) {
    if (domain === "rippl") return rippleTarget(i, seed, t);
    if (domain === "realm") return organicTarget(i, seed, t);
    if (domain === "trmeric") return latticeTarget(i, seed, t);
    return idleTarget(i, seed, t);
}
const DOMAIN_COLORS = {
    rippl: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]("#78B9C5"),
    realm: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]("#4A9E8E"),
    trmeric: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]("#FFA426"),
    idle: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$three$2f$build$2f$three$2e$core$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Color"]("#4A453E")
};
function getDomainColor(domain) {
    var _DOMAIN_COLORS_;
    return (_DOMAIN_COLORS_ = DOMAIN_COLORS[domain !== null && domain !== void 0 ? domain : "idle"]) !== null && _DOMAIN_COLORS_ !== void 0 ? _DOMAIN_COLORS_ : DOMAIN_COLORS.idle;
}
function ParticleField(param) {
    let { domain = null } = param;
    _s();
    const points = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const posAttr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const timeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const prevDomain = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(domain);
    const morphRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(1); // 0 = prev, 1 = current
    const { size } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"])();
    const seeds = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ParticleField.useMemo[seeds]": ()=>makeSeeds(PARTICLE_COUNT)
    }["ParticleField.useMemo[seeds]"], []);
    const initialPositions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "ParticleField.useMemo[initialPositions]": ()=>{
            const pos = new Float32Array(PARTICLE_COUNT * 3);
            for(let i = 0; i < PARTICLE_COUNT; i++){
                const [x, y, z] = idleTarget(i, seeds, 0);
                pos[i * 3] = x;
                pos[i * 3 + 1] = y;
                pos[i * 3 + 2] = z;
            }
            return pos;
        }
    }["ParticleField.useMemo[initialPositions]"], [
        seeds
    ]);
    // Kick off morph when domain changes
    const domainRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(domain);
    if (domain !== domainRef.current) {
        prevDomain.current = domainRef.current;
        domainRef.current = domain;
        morphRef.current = 0; // reset morph progress
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"])({
        "ParticleField.useFrame": (_, delta)=>{
            var _points_current;
            timeRef.current += delta;
            const t = timeRef.current;
            if (!posAttr.current) return;
            const pos = posAttr.current.array;
            // Advance morph (0→1 over ~1.2s with ease)
            if (morphRef.current < 1) {
                morphRef.current = Math.min(1, morphRef.current + delta / 1.2);
            }
            const morphEased = morphRef.current < 1 ? 1 - Math.pow(1 - morphRef.current, 3) // cubic ease-out
             : 1;
            // Per-particle: lerp between prev and current target
            for(let i = 0; i < PARTICLE_COUNT; i++){
                const [tx, ty, tz] = getTargetPosition(domainRef.current, i, seeds, t);
                const [px, py, pz] = getTargetPosition(prevDomain.current, i, seeds, t);
                const cx = pos[i * 3];
                const cy = pos[i * 3 + 1];
                const cz = pos[i * 3 + 2];
                // Interpolated target (cross-fade between two behaviours)
                const itx = px + (tx - px) * morphEased;
                const ity = py + (ty - py) * morphEased;
                const itz = pz + (tz - pz) * morphEased;
                // Smooth approach to interpolated target
                const lerpSpeed = 0.05;
                pos[i * 3] = cx + (itx - cx) * lerpSpeed;
                pos[i * 3 + 1] = cy + (ity - cy) * lerpSpeed;
                pos[i * 3 + 2] = cz + (itz - cz) * lerpSpeed;
            }
            posAttr.current.needsUpdate = true;
            // Slow rotation — axis changes per domain
            if (points.current) {
                points.current.rotation.y += delta * (domainRef.current === "trmeric" ? 0.06 : 0.03);
                points.current.rotation.x = Math.sin(t * 0.08) * 0.06;
            }
            // Color lerp
            const mat = (_points_current = points.current) === null || _points_current === void 0 ? void 0 : _points_current.material;
            if (mat) {
                const target = getDomainColor(domainRef.current);
                mat.color.lerp(target, 0.025);
                mat.opacity = 0.55 + Math.sin(t * 0.4) * 0.08;
            }
        }
    }["ParticleField.useFrame"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("points", {
        ref: points,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferGeometry", {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("bufferAttribute", {
                    ref: posAttr,
                    attach: "attributes-position",
                    args: [
                        initialPositions,
                        3
                    ],
                    count: PARTICLE_COUNT
                }, void 0, false, {
                    fileName: "[project]/src/components/3d/ParticleField.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/3d/ParticleField.tsx",
                lineNumber: 183,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("pointsMaterial", {
                size: size.width < 768 ? 0.022 : 0.013,
                color: getDomainColor(domain),
                transparent: true,
                opacity: 0.55,
                sizeAttenuation: true,
                depthWrite: false
            }, void 0, false, {
                fileName: "[project]/src/components/3d/ParticleField.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/3d/ParticleField.tsx",
        lineNumber: 182,
        columnNumber: 5
    }, this);
}
_s(ParticleField, "KG14Ru8KZmvp4ShUNiPdbnpdEho=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__useThree$3e$__["useThree"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$events$2d$b389eeca$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__useFrame$3e$__["useFrame"]
    ];
});
_c = ParticleField;
var _c;
__turbopack_context__.k.register(_c, "ParticleField");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/3d/GlobalCanvas.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GlobalCanvas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@react-three/fiber/dist/react-three-fiber.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$3d$2f$ParticleField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/3d/ParticleField.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$particleContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/particleContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
function GlobalCanvas() {
    _s();
    const { activeDomain } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$particleContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParticle"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "aria-hidden": "true",
        style: {
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$react$2d$three$2f$fiber$2f$dist$2f$react$2d$three$2d$fiber$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Canvas"], {
            camera: {
                position: [
                    0,
                    0,
                    10
                ],
                fov: 60
            },
            gl: {
                antialias: false,
                alpha: true,
                powerPreference: "high-performance"
            },
            dpr: [
                1,
                1.5
            ],
            style: {
                width: "100%",
                height: "100%"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Suspense"], {
                fallback: null,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$3d$2f$ParticleField$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    domain: activeDomain
                }, void 0, false, {
                    fileName: "[project]/src/components/3d/GlobalCanvas.tsx",
                    lineNumber: 32,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/3d/GlobalCanvas.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/3d/GlobalCanvas.tsx",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/3d/GlobalCanvas.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_s(GlobalCanvas, "Ri/KYbfvghu+kXfaZpVOp39paqU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$particleContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParticle"]
    ];
});
_c = GlobalCanvas;
var _c;
__turbopack_context__.k.register(_c, "GlobalCanvas");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/3d/GlobalCanvas.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/3d/GlobalCanvas.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_3d_12e9c0d0._.js.map