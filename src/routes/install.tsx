import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check,
  Download,
  MoreVertical,
  Share2,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/lib/install";

export const Route = createFileRoute("/install")({ component: InstallPage });

function InstallPage() {
  const { canInstall, installed, install } = useInstallPrompt();

  return (
    <div className="flex flex-col gap-10">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-subtle">
          Galaxy install
        </p>
        <h1 className="mt-1 font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Add TONAL to the phone
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          TONAL is an installable app for the Galaxy S24 Ultra and Galaxy Tab S10 Ultra.
          It opens full-screen from the home screen and app drawer — no browser chrome.
          On the phone it also ships as a real Android app (Tonal.apk, from the Tonal
          GitHub releases) that opens this same TONAL, live.
        </p>
      </header>

      {installed ? (
        <div className="flex items-start gap-3 rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
          <Check className="mt-0.5 size-5 text-fg" />
          <div>
            <p className="font-medium text-fg">Already on the home screen</p>
            <p className="mt-1 text-sm text-muted">
              You are running TONAL as a standalone app. Looks still save on this device.
            </p>
          </div>
        </div>
      ) : canInstall ? (
        <div className="rounded-xl bg-surface px-4 py-5 shadow-[var(--shadow-border)]">
          <p className="font-display text-2xl font-medium">Install in one tap</p>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Chrome on this Galaxy can pin TONAL now. It will sit next to your other apps.
          </p>
          <Button className="mt-4" onClick={() => void install()}>
            <Download className="size-4" />
            Install TONAL
          </Button>
        </div>
      ) : (
        <div className="rounded-xl bg-surface px-4 py-5 shadow-[var(--shadow-border)]">
          <p className="font-display text-2xl font-medium">Use the browser menu</p>
          <p className="mt-2 max-w-lg text-sm text-muted">
            If the one-tap prompt is not offered, add TONAL from Chrome or Samsung Internet.
            Same result: a home-screen app, not a tab.
          </p>
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
          <Smartphone className="size-5 text-muted" />
          <h2 className="mt-3 font-display text-2xl font-medium">Galaxy S24 Ultra · Chrome</h2>
          <ol className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
            <li className="flex gap-3">
              <MoreVertical className="mt-0.5 size-4 shrink-0 text-fg" />
              Open the three-dot menu at the top right.
            </li>
            <li>Tap Install app, or Add to Home screen if that is what you see.</li>
            <li>Confirm Install. TONAL appears on the home screen and in the app drawer.</li>
            <li>Open it from there. It runs full screen, like any other app.</li>
          </ol>
        </article>
        <article className="rounded-xl bg-surface px-4 py-4 shadow-[var(--shadow-border)]">
          <Tablet className="size-5 text-muted" />
          <h2 className="mt-3 font-display text-2xl font-medium">Tab S10 Ultra · Samsung Internet</h2>
          <ol className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
            <li className="flex gap-3">
              <Share2 className="mt-0.5 size-4 shrink-0 text-fg" />
              Open the menu, then Add page to → Home screen.
            </li>
            <li>Name it TONAL if asked. Confirm.</li>
            <li>On the tablet it also appears as its own window in DeX.</li>
            <li>Chrome on the Tab uses the same Install app path as the phone.</li>
          </ol>
        </article>
      </section>

      <section>
        <h2 className="font-display text-3xl font-medium">What you get</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
          <li>Live runway of looks, held when one is right.</li>
          <li>Thousands of combinations from cloth, harmony, strategy, and wardrobe.</li>
          <li>Looks you save stay on this Galaxy — no account.</li>
          <li>Works on phone and tablet. Same closet on each device if you save there.</li>
        </ul>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Prefer a real app icon and its own storage on the phone? Install Tonal.apk from
          the Tonal GitHub releases — the Android app opens this same TONAL and updates
          itself when a newer shell is published. Home-screen install above works too.
        </p>
        <Button asChild variant="secondary" className="mt-5">
          <Link to="/">Back to the runway</Link>
        </Button>
      </section>
    </div>
  );
}
