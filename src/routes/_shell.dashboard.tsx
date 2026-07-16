import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { CreditCard, TrendingUp, CalendarClock, PiggyBank, HeartPulse, ArrowRight, Sparkles, AlertTriangle, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/subtrack/StatCard";
import { SubLogo } from "@/components/subtrack/SubLogo";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { inr, daysUntil, monthlyEquivalent } from "@/lib/format";
import { monthlySpendTrend, staticInsights } from "@/data/mockSubscriptions";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, CartesianGrid } from "recharts";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — SubTrack" }] }),
  component: Dashboard,
});

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#3B82F6",
  Music: "#10B981",
  Productivity: "#8B5CF6",
  Utilities: "#F59E0B",
  Fitness: "#EF4444",
  Cloud: "#0EA5E9",
  Shopping: "#EC4899",
  Other: "#64748B",
};

function Dashboard() {
  const { subs } = useSubscriptions();
  const active = subs.filter((s) => s.status === "Active");

  const monthlySpend = useMemo(
    () => active.reduce((sum, s) => sum + monthlyEquivalent(s.amount, s.cycle), 0),
    [active],
  );

  const upcoming = useMemo(
    () => active.filter((s) => { const d = daysUntil(s.renewalDate); return d >= 0 && d <= 30; })
      .sort((a, b) => daysUntil(a.renewalDate) - daysUntil(b.renewalDate)),
    [active],
  );

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of active) {
      map[s.category] = (map[s.category] || 0) + monthlyEquivalent(s.amount, s.cycle);
    }
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) }));
  }, [active]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back, Arjun</h1>
          <p className="text-sm text-muted-foreground">Here's what's happening with your subscriptions this month.</p>
        </div>
        <Button asChild className="rounded-xl shadow-sm">
          <Link to="/subscriptions/add">+ Add Subscription</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Monthly Spending" value={inr(Math.round(monthlySpend))} icon={CreditCard} trend={{ value: "3.2% vs last month", positive: false }} />
        <StatCard label="Active Subscriptions" value={String(active.length)} icon={TrendingUp} hint={`${subs.length - active.length} inactive`} accent="bg-emerald-500/10 text-emerald-600" />
        <StatCard label="Upcoming Renewals" value={String(upcoming.length)} icon={CalendarClock} hint="Next 30 days" accent="bg-amber-500/10 text-amber-600" />
        <StatCard label="Potential Savings" value={inr(900)} icon={PiggyBank} hint="Based on 2 unused" accent="bg-violet-500/10 text-violet-600" />
        <StatCard label="Health Score" value="78/100" icon={HeartPulse} hint="Good — room to trim" accent="bg-rose-500/10 text-rose-600" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Monthly Spending</p>
              <p className="text-xs text-muted-foreground">Trend over the last 6 months</p>
            </div>
            <Badge variant="secondary" className="rounded-full">{inr(Math.round(monthlySpend))}</Badge>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer>
              <LineChart data={monthlySpendTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="ln" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--color-primary)" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} fontSize={12} tickFormatter={(v) => `₹${v}`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} formatter={(v: number) => inr(v)} />
                <Line type="monotone" dataKey="amount" stroke="url(#ln)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-primary)" }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="rounded-2xl border-border/60 p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-sm font-medium">Spending by Category</p>
            <p className="text-xs text-muted-foreground">Monthly breakdown</p>
          </div>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byCategory} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={2}>
                  {byCategory.map((c) => (
                    <Cell key={c.name} fill={CATEGORY_COLORS[c.name] || "#64748B"} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => inr(v)} contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5">
            {byCategory.slice(0, 5).map((c) => (
              <li key={c.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[c.name] || "#64748B" }} />
                  {c.name}
                </span>
                <span className="font-medium text-foreground">{inr(c.value)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Upcoming Renewals</p>
              <p className="text-xs text-muted-foreground">Sorted by nearest due date</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary">
              <Link to="/calendar">View calendar <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
          <ul className="divide-y divide-border/60">
            {upcoming.slice(0, 6).map((s) => {
              const d = daysUntil(s.renewalDate);
              return (
                <li key={s.id} className="flex items-center justify-between py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <SubLogo sub={s} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.category} • {new Date(s.renewalDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{inr(s.amount)}</p>
                    <Badge variant={d <= 3 ? "destructive" : "secondary"} className="mt-1 rounded-full text-[10px]">
                      {d === 0 ? "Today" : d === 1 ? "Tomorrow" : `in ${d} days`}
                    </Badge>
                  </div>
                </li>
              );
            })}
            {upcoming.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No renewals in the next 30 days.</p>}
          </ul>
        </Card>

        <Card className="rounded-2xl border-border/60 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Recent Insights</p>
          </div>
          <div className="space-y-3">
            {staticInsights.slice(0, 3).map((i) => (
              <div key={i.id} className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="flex items-start gap-2">
                  {i.severity === "warning" ? <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-600" /> : <Info className="mt-0.5 h-4 w-4 text-primary" />}
                  <div>
                    <p className="text-sm font-medium leading-snug">{i.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{i.detail}</p>
                  </div>
                </div>
              </div>
            ))}
            <Button asChild variant="ghost" size="sm" className="w-full text-primary">
              <Link to="/insights">See all insights <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
