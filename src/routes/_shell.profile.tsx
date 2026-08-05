import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_shell/profile")({
  head: () => ({ meta: [{ title: "Profile — SubTrack" }] }),
  component: ProfilePage,
});

type Profile = {
  name: string;
  email: string;
  darkMode: boolean;
  emailAlerts: boolean;
  pushAlerts: boolean;
  currency: "INR" | "USD" | "EUR" | "GBP";
};

const defaults: Profile = {
  name: "Arjun Kumar",
  email: "",
  darkMode: false,
  emailAlerts: true,
  pushAlerts: false,
  currency: "INR",
};

function ProfilePage() {
  const [p, setP] = useState<Profile>(defaults);

  useEffect(() => {
    void supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).maybeSingle();
      const saved = { name: profile?.display_name || data.user.user_metadata?.display_name || "SubTrack User", email: data.user.email ?? "", darkMode: profile?.dark_mode ?? false, emailAlerts: profile?.email_alerts ?? true, pushAlerts: profile?.push_alerts ?? false, currency: (profile?.currency || "INR") as Profile["currency"] };
      setP(saved); document.documentElement.classList.toggle("dark", saved.darkMode);
    });
  }, []);

  const save = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("Sign in required");
      const { error } = await supabase.from("profiles").update({ display_name: p.name.trim(), currency: p.currency, dark_mode: p.darkMode, email_alerts: p.emailAlerts, push_alerts: p.pushAlerts }).eq("id", data.user.id);
      if (error) throw error;
      document.documentElement.classList.toggle("dark", p.darkMode);
      window.dispatchEvent(new CustomEvent("subtrack:profile"));
      toast.success("Preferences saved");
    } catch {
      toast.error("Could not save preferences");
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile & preferences</h1>
        <p className="text-sm text-muted-foreground">Update your details and notification settings.</p>
      </div>

      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/10 text-lg font-semibold text-primary">
              {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{p.name}</p>
            <p className="text-sm text-muted-foreground">{p.email}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} className="mt-1.5 h-11 rounded-xl" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={p.email} disabled className="mt-1.5 h-11 rounded-xl" />
          </div>
          <div>
            <Label>Currency</Label>
            <Select value={p.currency} onValueChange={(v) => setP({ ...p, currency: v as Profile["currency"] })}>
              <SelectTrigger className="mt-1.5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">₹ INR — Indian Rupee</SelectItem>
                <SelectItem value="USD">$ USD — US Dollar</SelectItem>
                <SelectItem value="EUR">€ EUR — Euro</SelectItem>
                <SelectItem value="GBP">£ GBP — Pound Sterling</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="rounded-2xl border-border/60 p-6 shadow-sm">
        <p className="text-sm font-semibold">Notifications & appearance</p>
        <div className="mt-4 space-y-4">
          {[
            { key: "darkMode" as const, title: "Dark mode", desc: "Use a darker palette across the app." },
            { key: "emailAlerts" as const, title: "Email renewal alerts", desc: "Get an email 3 days before a renewal." },
            { key: "pushAlerts" as const, title: "Push notifications", desc: "Real-time nudges on renewals and insights." },
          ].map((row) => (
            <div key={row.key} className="flex items-center justify-between rounded-xl border border-border/60 p-4">
              <div>
                <p className="text-sm font-medium">{row.title}</p>
                <p className="text-xs text-muted-foreground">{row.desc}</p>
              </div>
              <Switch
                checked={p[row.key]}
                onCheckedChange={(v) => {
                  setP({ ...p, [row.key]: v });
                  if (row.key === "darkMode") document.documentElement.classList.toggle("dark", v);
                }}
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => void save()} className="rounded-xl shadow-sm">Save preferences</Button>
      </div>
    </div>
  );
}
