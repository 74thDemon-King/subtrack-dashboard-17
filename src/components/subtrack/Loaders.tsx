import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Full-page skeleton that mirrors the app shell (sidebar + top bar + content) while the layout loads. */
export function ShellSkeleton() {
  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      {/* Sidebar skeleton */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-background md:flex">
        <div className="border-b border-border/60 px-4 py-4">
          <Skeleton className="h-7 w-32 rounded-lg" />
        </div>
        <div className="flex flex-1 flex-col gap-1.5 px-3 py-4">
          <Skeleton className="mb-2 h-3 w-16 rounded" />
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-full rounded-lg" />
          ))}
        </div>
        <div className="border-t border-border/60 p-3">
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top navigation skeleton */}
        <header className="flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 md:px-6">
          <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
          <Skeleton className="hidden h-10 max-w-md flex-1 rounded-xl md:block" />
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-xl" />
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <PageSkeleton />
        </main>
      </div>
    </div>
  );
}

/** Skeleton placeholder for dashboard-style pages while data loads. */
export function PageSkeleton({
  cards = 4,
  chart = true,
  className = "max-w-7xl",
}: {
  cards?: number;
  chart?: boolean;
  className?: string;
}) {
  return (
    <div className={`mx-auto animate-fade-up space-y-6 ${className}`}>
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

/** Skeleton placeholder for the profile page (single form card, narrow column). */
export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-3xl animate-fade-up space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>
      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-36 rounded" />
            <Skeleton className="h-4 w-48 rounded" />
          </div>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
