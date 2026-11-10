// SPA root for the static fleet build — replaces the TanStack Start document
// shell in src/routes/__root.tsx (which renders <html>/<Scripts> for SSR).
// Same app chrome, no document shell: AuthProvider (a passthrough in TONAL,
// auth is off), the Shell with its nav, and the Toaster, exactly as shipped.
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { Shell } from "@/components/shell";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: () => (
    <AuthProvider>
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
    </AuthProvider>
  ),
});
