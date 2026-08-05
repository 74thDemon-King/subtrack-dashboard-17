import { Layers } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Layers className="h-4 w-4" strokeWidth={2.5} />
      </div>
      {!compact && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          SubTrack
        </span>
      )}
    </div>
  );
}
