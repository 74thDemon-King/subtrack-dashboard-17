import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/subtrack/StatCard";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { inr, monthlyEquivalent } from "@/lib/format";
import { monthlySpendTrend } from "@/data/mockSubscriptions";
import { Wallet, TrendingUp, PiggyBank, Calendar } from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/_shell/analytics")({
  head: () => ({ meta: [{ title: "Analytics — SubTrack" }] }),
  component: AnalyticsPage,
});

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#3B82F6", Music: "#10B981", Productivity: "#8B5CF6", Utilities: "#F59E0B",
  Fitness: "#EF4444", Cloud: "#0EA5E9", Shopping: "#EC4899", Other: "#64748B",
};

function AnalyticsPage() {
  const { subs } = useSubscriptions();
  const active = subs.filter((s) => s.status === "Active");

  const monthly = active.reduce((sum, s) => sum + monthlyEquivalent(s.amount, s.cycle), 0);
  const yearly = monthly * 12;

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of active) {
      map[s.category] = (map[s.category] || 0) + monthlyEquivalent(s.amount, s.cycle);
    }
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value);
  }, [active]);

  const projection = useMemo(() => {
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((m, i) => ({ month: m, projected: Math.round(monthly * (1 + i * 0.02)) }));
  }, [monthly]);

  const highest = byCategory[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Visualise your recurring spend over time.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg. Monthly Spend" value={inr(Math.round(monthly))} icon={Wallet} />
        <StatCard label="Highest Category" value={highest?.name || "—"} hint={highest ? inr(highest.value) + "/mo" : ""} icon={TrendingUp} accent="bg-violet-500/10 text-violet-600" />
        <StatCard label="Potential Savings" value={inr(900)} hint="Est. per month" icon={PiggyBank} accent="bg-emerald-500/10 text-emerald-600" />
        <StatCard label="Yearly Subscription Cost" value={inr(Math.round(yearly))} icon={Calendar} accent="bg-amber-500/10 text-amber-600" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/60 p-5 shadow-sm">
          <p className="text-sm font-medium">Monthly spending trend</p>
          <p className="text-xs text-muted-foreground">Last 6 months</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={monthlySpendTrend}>
                <defs>
                  <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} formatter={(v: number) => inr(v)} />
                <Area type="monotone" dataKey="amount" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#a1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/60 p-5 shadow-sm">
          <p className="text-sm font-medium">Category breakdown</p>
          <p className="text-xs text-muted-foreground">Share of monthly spend</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
                  {byCategory.map((c) => <Cell key={c.name} fill={CATEGORY_COLORS[c.name] || "#64748B"} />)}
                </Pie>
                <Tooltip formatter={(v: number) => inr(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/60 p-5 shadow-sm">
          <p className="text-sm font-medium">Yearly projection</p>
          <p className="text-xs text-muted-foreground">Assuming a 2% MoM increase</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={projection}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} formatter={(v: number) => inr(v)} />
                <Bar dataKey="projected" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/60 p-5 shadow-sm">
          <p className="text-sm font-medium">Top spending categories</p>
          <p className="text-xs text-muted-foreground">Monthly equivalent</p>
          <ul className="mt-4 space-y-4">
            {byCategory.map((c) => {
              const pct = (c.value / monthly) * 100;
              return (
                <li key={c.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[c.name] || "#64748B" }} />
                      <span className="font-medium">{c.name}</span>
                    </span>
                    <span className="text-muted-foreground">{inr(c.value)} <span className="ml-1 text-xs">({pct.toFixed(0)}%)</span></span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full" style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[c.name] || "#64748B" }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </div>
  );
}
