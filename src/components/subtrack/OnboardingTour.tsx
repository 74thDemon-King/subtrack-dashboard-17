import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, CalendarClock, Check, CreditCard, Plus, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_PREFIX = "subtrack.onboarding.v1:";

const STEPS = [
  {
    icon: CreditCard,
    title: "Connect your first subscription",
    body: "Add Netflix, Spotify, your cloud bills — anything recurring. Logos are matched automatically, so you only enter the name, amount and billing cycle.",
    cta: "Add a subscription",
    to: "/subscriptions/add" as const,
  },
  {
    icon: CalendarClock,
    title: "Review upcoming renewals",
    body: "Your dashboard and calendar highlight everything charging in the next 30 days, so nothing renews by surprise.",
    cta: "Open calendar",
    to: "/calendar" as const,
  },
  {
    icon: Bell,
    title: "Set currency & notifications",
    body: "Pick your currency and choose which renewal reminders you want. Your preferences are saved to your account.",
    cta: "Open preferences",
    to: "/profile" as const,
  },
];

/** First-run 3-step walkthrough, shown once per account. */
export function OnboardingTour() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!active || !data.user) return;
      const storageKey = `${STORAGE_PREFIX}${data.user.id}`;
      setKey(storageKey);
      try {
        if (!window.localStorage.getItem(storageKey)) setOpen(true);
      } catch {
        /* storage unavailable */
      }
    });
    return () => { active = false; };
  }, []);

  const finish = () => {
    setOpen(false);
    try { if (key) window.localStorage.setItem(key, "done"); } catch { /* ignore */ }
  };

  const current = STEPS[step]!;
  const Icon = current.icon;

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) finish(); }}>
      <DialogContent className="max-w-lg overflow-hidden rounded-2xl border-border/60 p-0">
        <div className="bg-primary/5 px-7 pt-7 pb-6">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Getting started
          </div>
          <div className="mt-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary animate-float-soft">
            <Icon className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-tight">{current.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{current.body}</p>
        </div>

        <div className="px-7 pb-7 pt-5">
          <div className="flex items-center gap-2">
            {STEPS.map((item, index) => (
              <span
                key={item.title}
                className={`h-1.5 flex-1 rounded-full transition-colors ${index <= step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
            <span className="ml-2 shrink-0 text-xs text-muted-foreground">{step + 1} / {STEPS.length}</span>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <Button variant="ghost" className="rounded-xl text-muted-foreground" onClick={finish}>
              Skip tour
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => { finish(); void navigate({ to: current.to }); }}
              >
                {current.to === "/subscriptions/add" ? <Plus className="h-4 w-4" /> : null}
                {current.cta}
              </Button>
              {step < STEPS.length - 1 ? (
                <Button className="rounded-xl" onClick={() => setStep(step + 1)}>Next</Button>
              ) : (
                <Button className="rounded-xl" onClick={finish}><Check className="h-4 w-4" /> Done</Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
