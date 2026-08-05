import { createFileRoute, Link } from "@tanstack/react-router";
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { BillingCycle, Category, SubStatus, Subscription } from "@/types/subscription";

export const Route = createFileRoute("/_shell/subscriptions/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  head: () => ({ meta: [{ title: "My Subscriptions — SubTrack" }] }),
  component: SubscriptionsPage,
});

const CATEGORIES = ["All", "Entertainment", "Music", "Productivity", "Utilities", "Fitness", "Cloud", "Shopping", "Other"] as const;

function SubscriptionsPage() {
  const search = Route.useSearch();
  const { subs, add, update, remove } = useSubscriptions();
  const [q, setQ] = useState(search.q);
  const [cat, setCat] = useState<string>("All");
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [deleting, setDeleting] = useState<Subscription | null>(null);

  const filtered = useMemo(() => {
    return subs.filter((s) => {
      if (cat !== "All" && s.category !== cat) return false;
      if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [subs, q, cat]);

  const confirmDelete = async () => {
    if (!deleting) return;
    const removed = deleting;
    try {
      await remove(removed.id);
      setDeleting(null);
      toast.success(`${removed.name} removed`, {
      action: {
        label: "Undo",
        onClick: () => {
          const { id: _id, ...subscription } = removed;
          void add(subscription);
        },
      },
      });
    } catch { toast.error("Could not remove this subscription."); }
  };

  const saveEdit = async () => {
    if (!editing || !editing.name.trim() || editing.amount < 0) return;
    try { await update(editing.id, { ...editing, name: editing.name.trim() }); toast.success(`${editing.name} updated`); setEditing(null); } catch { toast.error("Could not update this subscription."); }
  };

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
              <Button
                key={c}
                type="button"
                variant={cat === c ? "default" : "outline"}
                size="sm"
                onClick={() => setCat(c)}
                className="h-7 rounded-full px-3 text-xs"
              >
                {c}
              </Button>
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" aria-label={`Actions for ${s.name}`}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setEditing({ ...s })}>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setDeleting(s)}
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

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit subscription</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-4 py-2 md:grid-cols-2">
              <div className="md:col-span-2"><Label htmlFor="edit-name">Name</Label><Input id="edit-name" className="mt-1.5" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label htmlFor="edit-amount">Amount</Label><Input id="edit-amount" className="mt-1.5" type="number" min="0" step="0.01" value={editing.amount} onChange={(e) => setEditing({ ...editing, amount: Number(e.target.value) })} /></div>
              <div><Label htmlFor="edit-date">Renewal date</Label><Input id="edit-date" className="mt-1.5" type="date" value={editing.renewalDate} onChange={(e) => setEditing({ ...editing, renewalDate: e.target.value })} /></div>
              <div><Label>Category</Label><Select value={editing.category} onValueChange={(value) => setEditing({ ...editing, category: value as Category })}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.slice(1).map((category) => <SelectItem key={category} value={category}>{category}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Billing cycle</Label><Select value={editing.cycle} onValueChange={(value) => setEditing({ ...editing, cycle: value as BillingCycle })}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent>{["Weekly", "Monthly", "Quarterly", "Yearly"].map((cycle) => <SelectItem key={cycle} value={cycle}>{cycle}</SelectItem>)}</SelectContent></Select></div>
              <div><Label>Status</Label><Select value={editing.status} onValueChange={(value) => setEditing({ ...editing, status: value as SubStatus })}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent>{["Active", "Paused", "Cancelled"].map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent></Select></div>
              <div><Label htmlFor="edit-source">Payment source</Label><Input id="edit-source" className="mt-1.5" value={editing.paymentSource} onChange={(e) => setEditing({ ...editing, paymentSource: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={() => void saveEdit()}>Save changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remove {deleting?.name}?</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">This removes the subscription from your dashboard and analytics. You can undo it from the confirmation message.</p>
          <DialogFooter><Button variant="outline" onClick={() => setDeleting(null)}>Keep it</Button><Button variant="destructive" onClick={() => void confirmDelete()}>Remove</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
