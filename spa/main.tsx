import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import "@/styles.css";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "@/routeTree.gen";

// Hash history, as in Brizna: every route lives under /Tonal/#/... so GitHub
// Pages never 404s a deep link and the Android shell only ever loads the root.
const history = createHashHistory();
const router = createRouter({ routeTree, history, defaultErrorComponent: AppErrorComponent });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
