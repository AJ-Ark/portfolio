# Portfolio — unified site

One self-contained static site hosting multiple project portfolios under a single personal landing.

## Structure
```
/                       personal landing (index.html) — routes to each project
/shared/                shared tokens / fonts / assets (optional)
/trmeric/               Trmeric product portfolio (DONE, self-contained)
  index.html            brand-aesthetic home (cream + dark, General Sans)
  case-demand-manager.html  living flagship case study
  /assets/              screenshots + logo
  /sandboxes/           the real prototypes, copied in + paths fixed
/project-two/           (to be added)
/previous-site/         (to be added)
```

## Design language
General Sans (Fontshare) + JetBrains Mono · cream `#FAF7F1` w/ dark `#161009` sections · orange `#FFA426` / `#E8730E`.

## Run locally
Plain static — open `index.html`. For guaranteed cross-folder iframe sandboxes, serve it:
```
python -m http.server 8080      # then http://localhost:8080
```

## Deploy
Static host (Netlify / Vercel / GitHub Pages). No build step. Publish directory = repo root.

## Editing the landing
In root `index.html`, search for `EDIT ME` — replace name, role, bio, and contact/social links.
