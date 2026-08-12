import { useSyncExternalStore } from "react";

export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

const STORAGE_KEY = "subtrack.currency.v1";
const LOCALES: Record<CurrencyCode, string> = { INR: "en-IN", USD: "en-US", EUR: "de-DE", GBP: "en-GB" };
export const SYMBOLS: Record<CurrencyCode, string> = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };

let current: CurrencyCode = "INR";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export function getCurrency(): CurrencyCode {
  return current;
}

export function setCurrency(code: CurrencyCode) {
  if (code === current) return;
  current = code;
  try {
    window.localStorage.setItem(STORAGE_KEY, code);
  } catch {
    /* storage unavailable */
  }
  emit();
}

export function initCurrency() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (saved && saved in SYMBOLS) setCurrency(saved);
  } catch {
    /* storage unavailable */
  }
}

export function currencySymbol() {
  return SYMBOLS[current];
}

export function formatMoney(value: number) {
  return new Intl.NumberFormat(LOCALES[current], {
    style: "currency",
    currency: current,
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCurrency(): CurrencyCode {
  return useSyncExternalStore(subscribe, getCurrency, () => "INR" as CurrencyCode);
}
