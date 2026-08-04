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
  const onChange = () => listener();
  window.addEventListener("storage", onChange);
  window.addEventListener("subtrack:profile", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("subtrack:profile", onChange);
  };
}

export function useProfileIdentity() {
  return JSON.parse(
    useSyncExternalStore(subscribe, getSnapshot, () => JSON.stringify(fallback)),
  ) as typeof fallback;
}