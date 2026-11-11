/**
 * The app's version, stamped from package.json at build time (vite define in
 * vite.spa.config.ts) — one source, per the fleet rule: the version at the
 * bottom of You is the version that shipped.
 */
declare const __TONAL_VERSION__: string;

export const TONAL_VERSION = __TONAL_VERSION__;
