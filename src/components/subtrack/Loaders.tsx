import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/subtrack/Logo";

/** Full-screen branded loader used for route transitions. */
export function FullPageLoader({ label = "Loading SubTrack…" }: { label?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6">
      <div className="animate-float-soft">
        <Logo />
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        {label}
      </div>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/3 animate-[float-soft_1.4s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>
    </div>
  );
}

/** Skeleton placeholder for dashboard-style pages while data loads. */
export function PageSkeleton({ cards = 4, chart = true }: { cards?: number; chart?: boolean }) {
  return (
    <div className="mx-auto max-w-7xl animate-fade-up space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56 rounded-lg" />
        <Skeleton className="h-4 w-80 rounded-lg" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: cards }).map((_, index) => (
          <Card key={index} className="rounded-2xl border-border/60 p-5 shadow-sm">
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="mt-3 h-8 w-32 rounded" />
            <Skeleton className="mt-3 h-3 w-20 rounded" />
          </Card>
        ))}
      </div>
      {chart && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="rounded-2xl border-border/60 p-5 shadow-sm lg:col-span-2">
            <Skeleton className="h-64 w-full rounded-xl" />
          </Card>
          <Card className="rounded-2xl border-border/60 p-5 shadow-sm">
            <Skeleton className="h-64 w-full rounded-xl" />
          </Card>
        </div>
      )}
    </div>
  );
}
