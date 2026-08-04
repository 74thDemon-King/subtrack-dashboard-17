import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, WandSparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import type { BillingCycle, Category, SubStatus } from "@/types/subscription";
import { toast } from "sonner";

export const Route = createFileRoute("/_shell/subscriptions/add")({
  head: () => ({ meta: [{ title: "Add Subscription — SubTrack" }] }),
  component: AddSubscription,
});

const CATS: Category[] = ["Entertainment", "Music", "Productivity", "Utilities", "Fitness", "Cloud", "Shopping", "Other"];
const CYCLES: BillingCycle[] = ["Monthly", "Yearly", "Weekly", "Quarterly"];
const STATUSES: SubStatus[] = ["Active", "Paused", "Cancelled"];
const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#0EA5E9", "#64748B"];

function colorFor(name: string) {
  const index = [...name].reduce((total, char) => total + char.charCodeAt(0), 0) % COLORS.length;
  return COLORS[index];
}

function AddSubscription() {
  const { add } = useSubscriptions();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    category: "Entertainment" as Category,
    amount: "",
    cycle: "Monthly" as BillingCycle,
    renewalDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
    paymentSource: "UPI",
    status: "Active" as SubStatus,
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.amount) {
      toast.error("Please fill in the name and amount.");
      return;
    }
    add({
      name: form.name.trim(),
      category: form.category,
      amount: Number(form.amount),
      cycle: form.cycle,
      renewalDate: form.renewalDate,
      paymentSource: form.paymentSource,
      status: form.status,
      color: colorFor(form.name),
      logo: form.name.trim().charAt(0).toUpperCase(),
    });
    toast.success(`${form.name} added`);
    navigate({ to: "/subscriptions" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2 text-muted-foreground">
          <Link to="/subscriptions"><ArrowLeft className="mr-1 h-4 w-4" /> Back to subscriptions</Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Add a subscription</h1>
        <p className="text-sm text-muted-foreground">Details are saved locally in your browser.</p>
      </div>

      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label htmlFor="name">Subscription name</Label>
            <Input id="name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Netflix" className="mt-1.5 h-11 rounded-xl" />
          </div>

          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => set("category", v as Category)}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{CATS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input id="amount" type="number" min="0" step="0.01" required value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0" className="mt-1.5 h-11 rounded-xl" />
          </div>

          <div>
            <Label>Billing cycle</Label>
            <Select value={form.cycle} onValueChange={(v) => set("cycle", v as BillingCycle)}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{CYCLES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="renewal">Renewal date</Label>
            <Input id="renewal" type="date" value={form.renewalDate} onChange={(e) => set("renewalDate", e.target.value)} className="mt-1.5 h-11 rounded-xl" />
          </div>

          <div>
            <Label htmlFor="src">Payment source</Label>
            <Input id="src" value={form.paymentSource} onChange={(e) => set("paymentSource", e.target.value)} placeholder="UPI, Credit Card…" className="mt-1.5 h-11 rounded-xl" />
          </div>

          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => set("status", v as SubStatus)}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground md:col-span-2">
            <WandSparkles className="h-4 w-4 shrink-0 text-foreground" />
            <span>The service logo is added automatically from its name.</span>
          </div>

          <div className="flex justify-end gap-3 md:col-span-2">
            <Button asChild type="button" variant="outline" className="rounded-xl">
              <Link to="/subscriptions">Cancel</Link>
            </Button>
            <Button type="submit" className="rounded-xl shadow-sm">Save Subscription</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
