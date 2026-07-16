import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SubLogo } from "@/components/subtrack/SubLogo";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { inr, fmtDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_shell/calendar")({
  head: () => ({ meta: [{ title: "Calendar — SubTrack" }] }),
  component: CalendarPage,
});

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function CalendarPage() {
  const { subs } = useSubscriptions();
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selected, setSelected] = useState<string | null>(null);

  const monthLabel = cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byDay: Record<string, typeof subs> = useMemo(() => {
    const map: Record<string, typeof subs> = {};
    for (const s of subs) {
      const d = new Date(s.renewalDate);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const key = d.toISOString().slice(0, 10);
        (map[key] ||= []).push(s);
      }
    }
    return map;
  }, [subs, month, year]);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const iso = (d: number) => new Date(year, month, d).toISOString().slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);

  const selectedSubs = selected ? (byDay[selected] || []) : [];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Renewal calendar</h1>
          <p className="text-sm text-muted-foreground">Click any highlighted date to see what's due.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCursor(new Date(year, month - 1, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="w-40 text-center text-sm font-medium">{monthLabel}</div>
          <Button variant="outline" size="icon" className="rounded-xl" onClick={() => setCursor(new Date(year, month + 1, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border-border/60 p-4 shadow-sm md:p-6">
        <div className="grid grid-cols-7 gap-1 pb-2 text-center text-xs font-medium text-muted-foreground">
          {DAYS.map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (d === null) return <div key={i} className="h-24 rounded-xl" />;
            const key = iso(d);
            const items = byDay[key] || [];
            const isToday = key === today;
            return (
              <button
                key={i}
                onClick={() => items.length && setSelected(key)}
                className={`relative h-24 rounded-xl border p-2 text-left transition ${
                  items.length
                    ? "border-primary/30 bg-primary/5 hover:bg-primary/10"
                    : "border-border/50 bg-background hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isToday ? "grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground" : "text-foreground"}`}>{d}</span>
                  {items.length > 0 && (
                    <Badge variant="secondary" className="rounded-full text-[10px]">{items.length}</Badge>
                  )}
                </div>
                <div className="mt-1 flex -space-x-1.5 overflow-hidden">
                  {items.slice(0, 3).map((s) => (
                    <div key={s.id} className="grid h-5 w-5 place-items-center rounded-full border-2 border-background text-[9px] font-bold text-white" style={{ backgroundColor: s.color }}>
                      {(s.logo || s.name[0]).charAt(0)}
                    </div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{selected && fmtDate(selected)}</DialogTitle>
          </DialogHeader>
          <ul className="divide-y divide-border/60">
            {selectedSubs.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <SubLogo sub={s} />
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.category} • {s.cycle}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">{inr(s.amount)}</p>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
