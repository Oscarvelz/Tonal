import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let cached: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(ready: boolean) => void>();

function notify() {
  for (const listener of listeners) listener(Boolean(cached));
}

function attach() {
  if (typeof window === "undefined") return;
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    cached = event as BeforeInstallPromptEvent;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    cached = null;
    notify();
  });
}

attach();

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  );
}

export function useInstallPrompt() {
  const [canInstall, setCanInstall] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());
    setCanInstall(Boolean(cached));
    const onReady = (ready: boolean) => setCanInstall(ready);
    listeners.add(onReady);
    return () => {
      listeners.delete(onReady);
    };
  }, []);

  async function install() {
    if (!cached) return false;
    const event = cached;
    await event.prompt();
    const { outcome } = await event.userChoice;
    cached = null;
    notify();
    return outcome === "accepted";
  }

  return { canInstall, installed, install };
}
