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
  as a TanStack Start app; the fleet build is a static SPA over that source —
  `vite.spa.config.ts`, `spa/` (entry), `spa-public/` (manifest, service
  worker, icons, self-hosted fonts) and `src/spa/` (browser root + the
  `@tanstack/react-start` shim). **2.0 retired the server build entirely**:
  the auth/database/preview cluster and Grok's AI server function are deleted;
  the color engine (`src/lib/color/*`), the brief interpreter and the store
  are the whole machine.
- 2.0's face: **a color instrument with an editorial voice**. Three tabs —
  Today (two questions, the 60/30/10 chord on a neutral mat, the reason in
  one line, an Ask sheet), Saved (lookbook plates; also the closet the
  generator dresses from), You (your colors, wardrobe, stage, install,
  version) — plus Learn, the reference. The law: chrome chroma is 0 in both
  stages (Daylight/Evening, `src/lib/theme.ts` + the stage tokens in
  `src/styles.css`); all hue on screen belongs to the clothes. Research
  briefs and audits live in `~/workspace/tonal-work/redesign/` (local).
- The color foundation is documented in `COLOR-FOUNDATION.md`. Since 1.3
  it is FREE color science: the 1943 Munsell renotation (RIT data) in
  `src/lib/color/munsell.ts`, the twelve seasons as Tonal's own regions in
  Munsell space ("Tonal regions, after Munsell"), Flusser's two laws and
  Itten's contrasts as method. The fan purchase is OFF permanently — no
  SciART/TCI/NDU data exists in this app, and nothing will be bought.
- The app is local-first: the color engine runs on the device and the saved
  looks live in `localStorage` (`tonal-v1`; the store's persisted slice is
  frozen — the face changes, the data doesn't). No account, no database.
- Ask Tonal needs no AI: since 1.1 the app reads the brief itself
  (`src/lib/ai/local-look.ts`) — a deterministic interpreter over the app's
  own vocabulary (occasions, seasons, colors and fabrics by name, styles)
  wired to the color engine, reporting honestly what it used, what it did
  not know, and what it could not fully honor.
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
