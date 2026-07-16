import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubLogo } from "@/components/subtrack/SubLogo";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { inr, fmtDate } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/subscriptions")({
  head: () => ({ meta: [{ title: "My Subscriptions — SubTrack" }] }),
  component: SubscriptionsPage,
});

const CATEGORIES = ["All", "Entertainment", "Music", "Productivity", "Utilities", "Fitness", "Cloud", "Shopping", "Other"] as const;

function SubscriptionsPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // If on /subscriptions/add, render child outlet only
  if (pathname !== "/subscriptions") return <Outlet />;

  const { subs, remove } = useSubscriptions();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const filtered = useMemo(() => {
    return subs.filter((s) => {
      if (cat !== "All" && s.category !== cat) return false;
      if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [subs, q, cat]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Subscriptions</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} of {subs.length} services shown.</p>
        </div>
        <Button asChild className="rounded-xl shadow-sm">
          <Link to="/subscriptions/add"><Plus className="h-4 w-4" /> Add Subscription</Link>
        </Button>
      </div>

      <Card className="rounded-2xl border-border/60 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search subscriptions" className="h-10 rounded-xl pl-9" />
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Card key={s.id} className="group rounded-2xl border-border/60 p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <SubLogo sub={s} size={44} />
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.category}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toast.info("Edit is a UI-only demo.")}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => { remove(s.id); toast.success(`${s.name} removed`); }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-5 flex items-end justify-between">
              <div>
                <p className="text-2xl font-semibold tracking-tight">{inr(s.amount)}</p>
                <p className="text-xs text-muted-foreground">per {s.cycle.toLowerCase().replace("ly", "")}</p>
              </div>
              <Badge
                variant={s.status === "Active" ? "default" : s.status === "Paused" ? "secondary" : "outline"}
                className="rounded-full"
              >
                {s.status}
              </Badge>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
              <span>Renews {fmtDate(s.renewalDate)}</span>
              <span>{s.paymentSource}</span>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="col-span-full rounded-2xl border-dashed border-border/70 p-10 text-center">
            <p className="text-sm text-muted-foreground">No subscriptions match your filters.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
