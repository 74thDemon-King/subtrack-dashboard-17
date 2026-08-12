import type { Subscription } from "@/types/subscription";
import { monthlyEquivalent, inr } from "@/lib/format";

export type DerivedInsight = {
  id: string;
  severity: "warning" | "info" | "success";
  title: string;
  detail: string;
  action: string;
  target: { kind: "cancel"; subId: string } | { kind: "route"; to: "/subscriptions" | "/calendar" | "/analytics" };
};

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Amount actually charged for a subscription within a given calendar month. */
export function chargeInMonth(sub: Subscription, year: number, month: number) {
  const renewal = new Date(sub.renewalDate);
  const diff = (year - renewal.getFullYear()) * 12 + (month - renewal.getMonth());
  switch (sub.cycle) {
    case "Monthly":
      return sub.amount;
    case "Weekly":
      return Math.round(sub.amount * 4.33);
    case "Quarterly":
      return diff % 3 === 0 ? sub.amount : 0;
    case "Yearly":
      return diff % 12 === 0 ? sub.amount : 0;
    default:
      return sub.amount;
  }
}

export function spendTrend(subs: Subscription[], months = 6) {
  const active = subs.filter((sub) => sub.status !== "Cancelled");
  const now = new Date();
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (months - 1 - index), 1);
    const amount = active.reduce((sum, sub) => sum + chargeInMonth(sub, date.getFullYear(), date.getMonth()), 0);
    return { month: MONTH_LABELS[date.getMonth()], amount: Math.round(amount) };
  });
}

export function projection(subs: Subscription[], months = 6) {
  const active = subs.filter((sub) => sub.status === "Active");
  const now = new Date();
  return Array.from({ length: months }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() + index + 1, 1);
    const projected = active.reduce((sum, sub) => sum + chargeInMonth(sub, date.getFullYear(), date.getMonth()), 0);
    return { month: MONTH_LABELS[date.getMonth()], projected: Math.round(projected) };
  });
}

export function monthlyTotal(subs: Subscription[]) {
  return subs
    .filter((sub) => sub.status === "Active")
    .reduce((sum, sub) => sum + monthlyEquivalent(sub.amount, sub.cycle), 0);
}

/** Monthly value tied up in unused or paused services. */
export function potentialSavings(subs: Subscription[]) {
  return Math.round(
    subs.reduce((sum, sub) => {
      if (sub.status === "Cancelled") return sum;
      const unused = (sub.lastUsedDaysAgo ?? 0) >= 30;
      if (sub.status === "Paused" || unused) return sum + monthlyEquivalent(sub.amount, sub.cycle);
      return sum;
    }, 0),
  );
}

export function duplicateCategories(subs: Subscription[]) {
  const map = new Map<string, Subscription[]>();
  for (const sub of subs.filter((item) => item.status === "Active")) {
    map.set(sub.category, [...(map.get(sub.category) ?? []), sub]);
  }
  return [...map.entries()].filter(([, items]) => items.length > 1);
}

export function healthScore(subs: Subscription[]) {
  const active = subs.filter((sub) => sub.status === "Active");
  if (active.length === 0) return 100;
  let score = 100;
  const monthly = monthlyTotal(subs);
  const savings = potentialSavings(subs);
  if (monthly > 0) score -= Math.min(40, Math.round((savings / monthly) * 100));
  score -= Math.min(20, duplicateCategories(subs).length * 7);
  score -= Math.min(15, Math.max(0, active.length - 12) * 3);
  return Math.max(5, Math.min(100, score));
}

export function buildInsights(subs: Subscription[]): DerivedInsight[] {
  const insights: DerivedInsight[] = [];
  const active = subs.filter((sub) => sub.status === "Active");
  const monthly = monthlyTotal(subs);

  for (const sub of active.filter((item) => (item.lastUsedDaysAgo ?? 0) >= 30).slice(0, 3)) {
    insights.push({
      id: `unused-${sub.id}`,
      severity: "warning",
      title: `${sub.name} hasn't been used for ${sub.lastUsedDaysAgo} days.`,
      detail: `You're paying ${inr(monthlyEquivalent(sub.amount, sub.cycle))} a month for a service you rarely open.`,
      action: `Cancel ${sub.name}`,
      target: { kind: "cancel", subId: sub.id },
    });
  }

  for (const [category, items] of duplicateCategories(subs).slice(0, 2)) {
    insights.push({
      id: `dupe-${category}`,
      severity: "info",
      title: `You have ${items.length} ${category.toLowerCase()} subscriptions.`,
      detail: `${items.map((item) => item.name).join(", ")} overlap. Keeping one could simplify your spend.`,
      action: "Review them",
      target: { kind: "route", to: "/subscriptions" },
    });
  }

  if (monthly > 0) {
    const byCategory = new Map<string, number>();
    for (const sub of active) {
      byCategory.set(sub.category, (byCategory.get(sub.category) ?? 0) + monthlyEquivalent(sub.amount, sub.cycle));
    }
    const [topCategory, topValue] = [...byCategory.entries()].sort((a, b) => b[1] - a[1])[0] ?? ["", 0];
    const share = Math.round((topValue / monthly) * 100);
    if (topCategory && share >= 30) {
      insights.push({
        id: `top-${topCategory}`,
        severity: "info",
        title: `${topCategory} accounts for ${share}% of your spending.`,
        detail: "One category dominating your budget is usually the fastest place to trim.",
        action: "Open analytics",
        target: { kind: "route", to: "/analytics" },
      });
    }
  }

  const soon = active.filter((sub) => {
    const days = Math.round((new Date(sub.renewalDate).getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 7;
  });
  if (soon.length > 0) {
    insights.push({
      id: "renew-soon",
      severity: "warning",
      title: `${soon.length} renewal${soon.length > 1 ? "s" : ""} in the next 7 days.`,
      detail: `${soon.map((sub) => sub.name).join(", ")} will charge you shortly. Cancel now if you no longer need them.`,
      action: "Open calendar",
      target: { kind: "route", to: "/calendar" },
    });
  }

  const savings = potentialSavings(subs);
  if (savings > 0) {
    insights.push({
      id: "savings",
      severity: "success",
      title: `You could save around ${Math.round(savings)} a month.`,
      detail: "That's the combined monthly value of paused and rarely used services.",
      action: "See breakdown",
      target: { kind: "route", to: "/analytics" },
    });
  }

  const yearly = active.filter((sub) => sub.cycle === "Yearly");
  if (yearly.length > 0) {
    insights.push({
      id: "yearly",
      severity: "info",
      title: `${yearly.length} yearly plan${yearly.length > 1 ? "s" : ""} to budget for.`,
      detail: `${yearly.map((sub) => sub.name).join(", ")} bill in one lump sum — set the money aside early.`,
      action: "Open calendar",
      target: { kind: "route", to: "/calendar" },
    });
  }

  return insights;
}
