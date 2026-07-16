import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Info, CheckCircle2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { staticInsights } from "@/data/mockSubscriptions";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/insights")({
  head: () => ({ meta: [{ title: "Insights — SubTrack" }] }),
  component: InsightsPage,
});

const iconMap = {
  warning: { icon: AlertTriangle, bg: "bg-amber-500/10", fg: "text-amber-600", label: "Attention" },
  info: { icon: Info, bg: "bg-primary/10", fg: "text-primary", label: "Info" },
  success: { icon: CheckCircle2, bg: "bg-emerald-500/10", fg: "text-emerald-600", label: "Opportunity" },
};

function InsightsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <Sparkles className="h-5 w-5 text-primary" /> Insights
        </h1>
        <p className="text-sm text-muted-foreground">Curated recommendations based on your usage patterns.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {staticInsights.map((i) => {
          const cfg = iconMap[i.severity];
          const Icon = cfg.icon;
          return (
            <Card key={i.id} className="rounded-2xl border-border/60 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${cfg.bg} ${cfg.fg}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="rounded-full text-[10px]">{cfg.label}</Badge>
                  </div>
                  <h3 className="mt-2 text-base font-semibold leading-snug">{i.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{i.detail}</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="rounded-lg" onClick={() => toast.success(`${i.action} — noted!`)}>{i.action}</Button>
                    <Button size="sm" variant="ghost" className="rounded-lg text-muted-foreground" onClick={() => toast("Dismissed")}>Dismiss</Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
