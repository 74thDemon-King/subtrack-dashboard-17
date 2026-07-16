import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  accent = "bg-primary/10 text-primary",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
  accent?: string;
}) {
  return (
    <Card className="p-5 border-border/60 shadow-sm rounded-2xl">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", accent)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {trend && (
        <p className={cn("mt-3 text-xs font-medium", trend.positive ? "text-emerald-600" : "text-rose-600")}>
          {trend.positive ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </Card>
  );
}
