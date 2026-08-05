import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, Bell, CalendarClock, CreditCard, Layers, Lightbulb, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/subtrack/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SubTrack — Manage Every Subscription in One Place" },
      { name: "description", content: "Track OTT subscriptions, utility bills, SaaS tools and recurring expenses from a single, beautiful dashboard." },
      { property: "og:title", content: "SubTrack — Manage Every Subscription in One Place" },
      { property: "og:description", content: "One dashboard for every recurring payment. Renewals, spending, and savings — all in one place." },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: CreditCard, title: "Unified subscription hub", desc: "Every OTT, utility, SaaS tool and membership organised in one clean workspace." },
  { icon: CalendarClock, title: "Renewal calendar", desc: "See what's charging next, before it hits your card. Never miss a renewal." },
  { icon: BarChart3, title: "Smart analytics", desc: "Beautiful charts break down monthly spend, categories and yearly projections." },
  { icon: Lightbulb, title: "Actionable insights", desc: "Discover duplicates, unused services and easy wins to save every month." },
  { icon: Bell, title: "Gentle reminders", desc: "Timely nudges before renewals so you always stay in control." },
  { icon: ShieldCheck, title: "Private by design", desc: "Your data stays on your device. No accounts required to explore." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-background/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#preview" className="hover:text-foreground">Preview</a>
            <a href="#why" className="hover:text-foreground">Why SubTrack</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link to="/auth" search={{ next: "/dashboard" }}>Sign in</Link>
            </Button>
            <Button asChild className="rounded-xl shadow-sm">
              <Link to="/auth" search={{ next: "/dashboard" }}>Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--color-primary)_18%,transparent),transparent)]" />
        <div className="mx-auto max-w-5xl px-4 pb-20 pt-20 text-center md:pt-28">
          <Badge variant="secondary" className="mb-6 rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium">
            <Sparkles className="mr-1 h-3 w-3 text-primary" /> New — Renewal calendar & smart insights
          </Badge>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
            Manage Every Subscription in One Place.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground">
            Track OTT subscriptions, utility bills, SaaS tools, memberships, and recurring expenses effortlessly.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-xl px-6 shadow-sm">
              <Link to="/auth" search={{ next: "/dashboard" }}>Get Started <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-border/70 px-6">
              <Link to="/dashboard">View Demo</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Free to start. Your data stays private to your account.</p>
        </div>

        {/* Hero preview mock */}
        <div id="preview" className="mx-auto max-w-6xl px-4 pb-24">
          <div className="rounded-3xl border border-border/60 bg-card p-2 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)]">
            <div className="grid gap-3 rounded-2xl bg-muted/40 p-4 md:grid-cols-3">
              {[
                { label: "Monthly Spending", value: "₹4,215", accent: "text-primary" },
                { label: "Active Subscriptions", value: "14", accent: "text-emerald-600" },
                { label: "Potential Savings", value: "₹900", accent: "text-amber-600" },
              ].map((s) => (
                <Card key={s.label} className="rounded-2xl border-border/60 p-5 shadow-sm">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className={`mt-2 text-2xl font-semibold ${s.accent}`}>{s.value}</p>
                  <div className="mt-4 h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary/70" style={{ width: "62%" }} />
                  </div>
                </Card>
              ))}
              <Card className="col-span-full rounded-2xl border-border/60 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium">Upcoming renewals</p>
                  <span className="text-xs text-muted-foreground">Next 30 days</span>
                </div>
                <ul className="divide-y divide-border/60">
                  {[
                    { n: "Netflix", d: "25 Jun", a: "₹649", c: "#E50914" },
                    { n: "Spotify", d: "28 Jun", a: "₹119", c: "#1DB954" },
                    { n: "Electricity Bill", d: "30 Jun", a: "₹1,250", c: "#F59E0B" },
                  ].map((r) => (
                    <li key={r.n} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: r.c }}>{r.n[0]}</div>
                        <div>
                          <p className="text-sm font-medium">{r.n}</p>
                          <p className="text-xs text-muted-foreground">{r.d}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">{r.a}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 bg-muted/30 py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-primary">Features</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Everything you need. Nothing you don't.</h2>
            <p className="mt-3 text-muted-foreground">Built for people who want a calm, complete view of every recurring expense — without spreadsheets.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="rounded-2xl border-border/60 p-6 shadow-sm transition hover:shadow-md">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-medium text-primary">Why SubTrack</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Stop leaking money to forgotten subscriptions.</h2>
            <p className="mt-4 text-muted-foreground">The average household loses thousands every year to auto-renewing services they no longer use. SubTrack surfaces the ones that matter and quietly helps you cancel the rest.</p>
            <ul className="mt-6 space-y-3">
              {[
                "One dashboard for OTT, utilities, SaaS & memberships",
                "Renewal alerts so nothing charges you by surprise",
                "Category and yearly-cost breakdowns at a glance",
                "Insights that suggest concrete monthly savings",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <div className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">✓</div>
                  <span className="text-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="rounded-2xl border-border/60 p-6">
              <Wallet className="h-6 w-6 text-primary" />
              <p className="mt-3 text-3xl font-semibold">₹900</p>
              <p className="text-sm text-muted-foreground">Avg. monthly savings</p>
            </Card>
            <Card className="rounded-2xl border-border/60 p-6">
              <Layers className="h-6 w-6 text-primary" />
              <p className="mt-3 text-3xl font-semibold">14</p>
              <p className="text-sm text-muted-foreground">Services tracked</p>
            </Card>
            <Card className="col-span-2 rounded-2xl border-border/60 p-6">
              <p className="text-sm font-medium">Health Score</p>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-4xl font-semibold text-foreground">78</span>
                <span className="pb-2 text-sm text-muted-foreground">/ 100</span>
              </div>
              <div className="mt-3 h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-gradient-to-r from-primary to-emerald-500" style={{ width: "78%" }} />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/60 bg-muted/30 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Ready to take control of your recurring spend?</h2>
            <p className="mt-3 text-muted-foreground">Create your account and bring every recurring payment into one calm view.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild size="lg" className="h-12 rounded-xl px-6 shadow-sm">
              <Link to="/auth" search={{ next: "/dashboard" }}>Start tracking <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <Logo />
          </div>
          <p>© {new Date().getFullYear()} SubTrack. Built for a calmer financial life.</p>
        </div>
      </footer>
    </div>
  );
}
