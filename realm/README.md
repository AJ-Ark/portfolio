# Realm of Elementals — Portfolio

An immersive, scroll-driven case-study site for **Realm of Elementals** by Aravind J: a WebAR butterfly-guardianship experience and physical installation.

## Stack
- Static HTML / CSS / vanilla JS (no build step)
- [Three.js](https://threejs.org) — golden pollen + butterfly hero scene (WebGL, via CDN importmap)
- [GSAP + ScrollTrigger](https://gsap.com) — scroll-scrubbed hero parallax + word-by-word logline
- [Lenis](https://github.com/darkroomengineering/lenis) — smooth scrolling
- Google Fonts: Fraunces (display) + Inter (body)
- Fully responsive, `prefers-reduced-motion` aware

## Run locally
```bash
npx serve .
# then open the printed localhost URL
```

## Deploy (Vercel)
```bash
npx vercel        # preview deploy
```
No framework preset needed — it deploys as a static site. `vercel.json` sets clean URLs and long-cache headers on `/assets`.

## Structure
```
index.html        all sections (hero → problem → pivot → app → lifecycle → plates → installation → reflection → about)
css/style.css     design system + section styles
js/main.js        Three.js hero, smooth scroll, reveals, count-ups, drag gallery
assets/           curated imagery (app screens, storyboard sketches, installation photos)
```

## Notes
- Asset images are lazy-loaded. Some source PNGs are large (2–3 MB); converting them to WebP/AVIF would further improve load time.
