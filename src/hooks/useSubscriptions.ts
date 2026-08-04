import { useCallback, useSyncExternalStore } from "react";
import type { Subscription } from "@/types/subscription";
import { mockSubscriptions } from "@/data/mockSubscriptions";

const KEY = "subtrack.subscriptions.v1";

function load(): Subscription[] {
  if (typeof window === "undefined") return mockSubscriptions;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return mockSubscriptions;
    return JSON.parse(raw) as Subscription[];
  } catch {
    return mockSubscriptions;
  }
}

let browserSnapshot: Subscription[] | undefined;
let browserRaw: string | null | undefined;
const listeners = new Set<() => void>();

function getSnapshot() {
  const raw = window.localStorage.getItem(KEY);
  if (browserSnapshot === undefined || raw !== browserRaw) {
    browserRaw = raw;
    browserSnapshot = load();
  }
  return browserSnapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: Subscription[]) {
  browserSnapshot = next;
  browserRaw = JSON.stringify(next);
  window.localStorage.setItem(KEY, browserRaw);
  listeners.forEach((listener) => listener());
}

export function useSubscriptions() {
  const subs = useSyncExternalStore(subscribe, getSnapshot, () => mockSubscriptions);

  const persist = useCallback((updateSubs: (current: Subscription[]) => Subscription[]) => {
    try {
      write(updateSubs(getSnapshot()));
    } catch {}
  }, []);

  const add = useCallback(
    (s: Omit<Subscription, "id">) => {
      const next: Subscription = { ...s, id: crypto.randomUUID() };
      persist((current) => [next, ...current]);
    },
    [persist],
  );

  const update = useCallback(
    (id: string, patch: Partial<Subscription>) => {
      persist((current) => current.map((s) => (s.id === id ? { ...s, ...patch } : s)));
    },
    [persist],
  );

  const remove = useCallback(
    (id: string) => persist((current) => current.filter((s) => s.id !== id)),
    [persist],
  );

  const reset = useCallback(() => persist(() => mockSubscriptions), [persist]);

  return { subs, ready: true, add, update, remove, reset };
}
