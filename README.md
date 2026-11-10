# TONAL

Dress faster through advanced color theory. Male and female outfit studies,
thousands of combinations (the live cut counts 2.2 million), 48 strategies,
69 rules — and a live generator that dresses a new look every few seconds.

**Live:** https://oscarvelz.github.io/Tonal/
**Android:** install `Tonal.apk` from the
[latest release](https://github.com/Oscarvelz/Tonal/releases/latest/download/Tonal.apk)
(release `android-N`). The app opens the live site with its own storage;
web updates arrive on their own, shell updates offer themselves in-app.

## How this repo works (fleet pattern)

- `docs/` — the built web app, served by GitHub Pages from `main`.
  Rebuild with `sh build.sh` (Vite SPA build + service-worker postbuild).
- Everything else at the root is the source. TONAL was created by Grok Build
  as a TanStack Start app; the fleet build is a static SPA over the same
  source — `vite.spa.config.ts`, `spa/` (entry), `spa-public/` (manifest,
  service worker, icons) and `src/spa/` (browser root + the
  `@tanstack/react-start` shim). The original server build
  (`vite.config.ts`) is kept untouched.
- The app is local-first: the color engine runs on the device and the Closet
  (saved looks) lives in `localStorage` (`tonal-v1`). No account, no database
  — auth was OFF in Grok's build and stays off.
- Studio's “Ask Grok” was a server function spending an `XAI_API_KEY`. On the
  static build it answers “AI is not available in this environment.” (the
  same answer Grok's build gives with no key deployed); the **Local engine**
  button beside it dresses looks with the on-device engine, no key needed.
- `android/` — the Android shell (`com.oscarvelz.tonal`, min Android 11):
  a thin WebView around the live site with the fleet behaviour — system-bar
  colours from the page, back handling, and self-update offers from GitHub
  releases `android-N` (asset `Tonal.apk`). Build: `.github/workflows/android.yml`
  on `main` when `android/` changes. The signing key is private and never
  committed: `TONAL_KS_B64` + `TONAL_KS_PASS` live as environment secrets of
  `release`; with them CI signs and publishes, without them CI uploads an
  unsigned artifact that is signed privately. Every update must use the same
  key (certificate SHA-256 `6653084ddcd0fb17989da43727902dc715cbb1fc5748ae7490ac813c89cad9a6`) or Android refuses it.

## Develop

```sh
npm install
npx vite build -c vite.spa.config.ts   # or: sh build.sh (build + postbuild)
```
