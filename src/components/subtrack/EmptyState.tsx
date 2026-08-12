import { Link } from "@tanstack/react-router";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

/** Shown whenever a signed-in account has no subscriptions yet. */
export function EmptyState({ onSeed }: { onSeed?: () => Promise<void> }) {
  const [busy, setBusy] = useState(false);

  const seed = async () => {
    if (!onSeed) return;
    setBusy(true);
    try {
      await onSeed();
      toast.success("Sample subscriptions added");
    } catch {
      toast.error("Could not add sample data");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="animate-fade-up rounded-2xl border-dashed border-border/70 p-10 text-center shadow-sm">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <Sparkles className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-lg font-semibold">No subscriptions yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Add your first recurring payment to unlock your dashboard, calendar, analytics and insights — or start from a realistic sample set.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild className="rounded-xl shadow-sm">
          <Link to="/subscriptions/add"><Plus className="h-4 w-4" /> Add subscription</Link>
        </Button>
        {onSeed && (
          <Button variant="outline" className="rounded-xl" onClick={() => void seed()} disabled={busy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Load sample data
          </Button>
        )}
      </div>
    </Card>
  );
}
