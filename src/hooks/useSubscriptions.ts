import { useCallback, useEffect, useState } from "react";
import type { Subscription } from "@/types/subscription";
import { supabase } from "@/integrations/supabase/client";
import { mockSubscriptions } from "@/data/mockSubscriptions";

type SubscriptionRow = { id: string; name: string; category: string; amount: number; cycle: string; renewal_date: string; status: string; payment_source: string; color: string; logo: string | null; last_used_days_ago: number | null };

function fromRow(row: SubscriptionRow): Subscription {
  return { id: row.id, name: row.name, category: row.category as Subscription["category"], amount: Number(row.amount), cycle: row.cycle as Subscription["cycle"], renewalDate: row.renewal_date, status: row.status as Subscription["status"], paymentSource: row.payment_source, color: row.color, logo: row.logo ?? undefined, lastUsedDaysAgo: row.last_used_days_ago ?? undefined };
}

function toRow(subscription: Omit<Subscription, "id"> | Partial<Subscription>) {
  return { ...(subscription.name !== undefined && { name: subscription.name }), ...(subscription.category !== undefined && { category: subscription.category }), ...(subscription.amount !== undefined && { amount: subscription.amount }), ...(subscription.cycle !== undefined && { cycle: subscription.cycle }), ...(subscription.renewalDate !== undefined && { renewal_date: subscription.renewalDate }), ...(subscription.status !== undefined && { status: subscription.status }), ...(subscription.paymentSource !== undefined && { payment_source: subscription.paymentSource }), ...(subscription.color !== undefined && { color: subscription.color }), ...(subscription.logo !== undefined && { logo: subscription.logo }), ...(subscription.lastUsedDaysAgo !== undefined && { last_used_days_ago: subscription.lastUsedDaysAgo }) };
}

export function useSubscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data, error: queryError } = await supabase.from("subscriptions").select("*").order("renewal_date");
    if (queryError) setError(queryError.message);
    else {
      setError(null);
      setSubs((data ?? []).map(fromRow));
    }
    setReady(true);
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const add = useCallback(async (subscription: Omit<Subscription, "id">) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Sign in required");
    const { data, error: insertError } = await supabase.from("subscriptions").insert({ ...toRow(subscription), name: subscription.name, category: subscription.category, amount: subscription.amount, cycle: subscription.cycle, renewal_date: subscription.renewalDate, user_id: userData.user.id }).select().single();
    if (insertError) throw insertError;
    const added = fromRow(data);
    setSubs((current) => [added, ...current]);
    return added;
  }, []);

  const update = useCallback(async (id: string, patch: Partial<Subscription>) => {
    const { data, error: updateError } = await supabase.from("subscriptions").update(toRow(patch)).eq("id", id).select().single();
    if (updateError) throw updateError;
    setSubs((current) => current.map((sub) => (sub.id === id ? fromRow(data) : sub)));
  }, []);

  const remove = useCallback(async (id: string) => {
    const { error: deleteError } = await supabase.from("subscriptions").delete().eq("id", id);
    if (deleteError) throw deleteError;
    setSubs((current) => current.filter((sub) => sub.id !== id));
  }, []);

  const reset = useCallback(async () => {
    const { error: deleteError } = await supabase.from("subscriptions").delete().not("id", "is", null);
    if (deleteError) throw deleteError;
    setSubs([]);
  }, []);

  /** One-click starter data so a fresh account isn't an empty shell. */
  const seedSamples = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Sign in required");
    const rows = mockSubscriptions.map(({ id: _id, ...sub }) => ({ ...toRow(sub), name: sub.name, category: sub.category, amount: sub.amount, cycle: sub.cycle, renewal_date: sub.renewalDate, user_id: userData.user!.id }));
    const { error: insertError } = await supabase.from("subscriptions").insert(rows);
    if (insertError) throw insertError;
    await refresh();
  }, [refresh]);

  return { subs, ready, error, add, update, remove, reset, refresh, seedSamples };
}
