import { useSyncExternalStore } from "react";

const KEY = "subtrack.profile.v1";
const fallback = { name: "Arjun Kumar", email: "arjun@example.com" };

function getSnapshot() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(KEY) || "{}");
    return JSON.stringify({
      name: typeof saved.name === "string" ? saved.name : fallback.name,
      email: typeof saved.email === "string" ? saved.email : fallback.email,
    });
  } catch {
    return JSON.stringify(fallback);
  }
}

function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === KEY) listener();
  };
  const onProfile = () => listener();
  window.addEventListener("storage", onStorage);
  window.addEventListener("subtrack:profile", onProfile);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("subtrack:profile", onProfile);
  };
}

export function useProfileIdentity() {
  return JSON.parse(
    useSyncExternalStore(subscribe, getSnapshot, () => JSON.stringify(fallback)),
  ) as typeof fallback;
}