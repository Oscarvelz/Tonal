// SPA root for the static fleet build — the app's only root since the 2.0
// remake retired the TanStack Start server build (and its auth/db cluster:
// auth was never on). The Shell with its nav, and the Toaster.
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Shell } from "@/components/shell";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: () => (
    <>
      <Shell>
        <Outlet />
      </Shell>
      <Toaster
        theme="dark"
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--color-surface)",
            color: "var(--color-fg)",
            border: "1px solid var(--color-border)",
          },
        }}
      />
    </>
  ),
});
