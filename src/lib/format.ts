import { getCurrency, formatMoney, currencySymbol } from "@/lib/currency";

/** Formats a value in the user's selected currency. */
export const inr = (n: number) => formatMoney(n);
export const money = (n: number) => formatMoney(n);
export const axisMoney = (n: number) => `${currencySymbol()}${Math.round(n)}`;
export const activeCurrency = getCurrency;

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

export const daysUntil = (iso: string) => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / 86400000);
};

export const monthlyEquivalent = (amount: number, cycle: string) => {
  switch (cycle) {
    case "Yearly": return amount / 12;
    case "Quarterly": return amount / 3;
    case "Weekly": return amount * 4.33;
    default: return amount;
  }
};
