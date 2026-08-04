import { useEffect, useState, useCallback } from "react";
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

export function useSubscriptions() {
  const [subs, setSubs] = useState<Subscription[]>(mockSubscriptions);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSubs(load());
    setReady(true);
  }, []);

  const persist = useCallback((updateSubs: (current: Subscription[]) => Subscription[]) => {
    setSubs((current) => {
      const next = updateSubs(current);
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
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

  return { subs, ready, add, update, remove, reset };
}
