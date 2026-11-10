// Browser stand-in for @tanstack/react-start (fleet SPA pattern, as in Faro/Brizna):
// TONAL's only "server function" is Studio's generateAiLook. On the static build it
// runs locally, sees no XAI_API_KEY (defined as undefined in vite.spa.config.ts) and
// returns its own graceful { ok: false, error: "AI is not available in this
// environment." } — exactly what Grok's build does when no key is deployed.
// The local color engine (Dress / Studies / Theory / Closet) never touches this.
type Handler = (args: { data: any; context: { userId: string } }) => any;

export const LOCAL_USER_ID = "local-user";

function chain(method: string) {
  let validate: ((d: unknown) => unknown) | null = null;
  const api: any = {
    middleware: () => api,
    validator: (v: (d: unknown) => unknown) => {
      validate = v;
      return api;
    },
    inputValidator: (v: (d: unknown) => unknown) => {
      validate = v;
      return api;
    },
    handler: (fn: Handler) => {
      const call = async (opts?: { data?: unknown }) => {
        const raw = opts?.data;
        const data = validate ? validate(raw) : raw;
        const out = await fn({ data, context: { userId: LOCAL_USER_ID } });
        // Server functions returned JSON; keep the same shapes.
        return out === undefined ? undefined : JSON.parse(JSON.stringify(out));
      };
      return call;
    },
  };
  return api;
}

export function createServerFn(opts?: { method?: string }) {
  return chain(String(opts?.method ?? "GET").toUpperCase());
}
export function createMiddleware(_opts?: unknown) {
  const m: any = { client: () => m, server: () => m, middleware: () => m };
  return m;
}
export function useServerFn<T>(fn: T): T {
  return fn;
}
export function createIsomorphicFn() {
  const f: any = {
    client: (fn: any) => fn,
    server: () => f,
  };
  return f;
}
