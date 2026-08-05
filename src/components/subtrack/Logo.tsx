import { Layers } from "lucide-react";

export function Logo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={inverse ? "grid h-8 w-8 place-items-center rounded-lg bg-primary-foreground/15 text-primary-foreground shadow-sm" : "grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm"}>
        <Layers className="h-4 w-4" strokeWidth={2.5} />
      </div>
      {!compact && (
        <span className={inverse ? "text-lg font-semibold tracking-tight text-primary-foreground" : "text-lg font-semibold tracking-tight text-foreground"}>
          SubTrack
        </span>
      )}
    </div>
  );
}
