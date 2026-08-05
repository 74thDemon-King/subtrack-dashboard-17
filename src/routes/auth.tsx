import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Logo } from "@/components/subtrack/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({ next: typeof search.next === "string" ? search.next : "" }),
  head: () => ({ meta: [{ title: "Sign in — SubTrack" }, { name: "description", content: "Sign in or create your SubTrack account." }, { property: "og:title", content: "Sign in — SubTrack" }, { property: "og:description", content: "Access your subscription dashboard securely." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email().max(255);
const passwordSchema = z.string().min(8).max(72);

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ error?: boolean; text: string } | null>(null);
  const next = search.next.startsWith("/") && !search.next.startsWith("//") ? search.next : "/dashboard";

  async function signIn(event: React.FormEvent) {
    event.preventDefault();
    if (!emailSchema.safeParse(email).success || !passwordSchema.safeParse(password).success) { setMessage({ error: true, text: "Enter a valid email and a password of at least 8 characters." }); return; }
    setBusy(true); setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setMessage({ error: true, text: error.message }); else void navigate({ to: next });
  }

  async function signUp(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim() || name.trim().length > 80 || !emailSchema.safeParse(email).success || !passwordSchema.safeParse(password).success) { setMessage({ error: true, text: "Enter your name, a valid email, and a password of at least 8 characters." }); return; }
    setBusy(true); setMessage(null);
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin, data: { display_name: name.trim() } } });
    setBusy(false);
    if (error) setMessage({ error: true, text: error.message }); else if (!data.session) setMessage({ text: "Check your email to confirm your account, then return to sign in." }); else void navigate({ to: next });
  }

  async function googleSignIn() {
    setBusy(true); setMessage(null); window.sessionStorage.setItem("subtrack.auth.next", next);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { setMessage({ error: true, text: result.error.message }); setBusy(false); return; }
    if (!result.redirected) void navigate({ to: next });
  }

  return <main className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_0.95fr]">
    <section className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between"><Logo inverse /><div className="relative z-10 max-w-lg animate-fade-up"><p className="mb-5 text-sm font-semibold uppercase">Your recurring spend, simplified</p><h1 className="text-5xl font-bold leading-tight">Know what renews. Keep what matters.</h1><p className="mt-5 text-lg text-primary-foreground/80">A calm, secure home for every subscription, bill, and membership.</p></div><div className="animate-float-soft rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5 backdrop-blur"><p className="text-sm text-primary-foreground/70">Potential savings this month</p><p className="mt-1 text-3xl font-bold">₹900</p></div></section>
    <section className="flex items-center justify-center px-5 py-12"><div className="w-full max-w-md animate-fade-up"><div className="mb-9 lg:hidden"><Logo /></div><h2 className="text-3xl font-bold">Welcome to SubTrack</h2><p className="mt-2 text-muted-foreground">Sign in to keep your subscriptions synced and secure.</p><Button variant="outline" className="mt-7 h-12 w-full" onClick={googleSignIn} disabled={busy}>Continue with Google</Button><div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />OR CONTINUE WITH EMAIL<span className="h-px flex-1 bg-border" /></div>{message && <Alert variant={message.error ? "destructive" : "default"} className="mb-5"><AlertDescription>{message.text}</AlertDescription></Alert>}<Tabs defaultValue="signin"><TabsList className="grid w-full grid-cols-2"><TabsTrigger value="signin">Sign in</TabsTrigger><TabsTrigger value="signup">Create account</TabsTrigger></TabsList><TabsContent value="signin"><AuthForm mode="signin" {...{ email, setEmail, password, setPassword, showPassword, setShowPassword, busy }} onSubmit={signIn} /></TabsContent><TabsContent value="signup"><AuthForm mode="signup" {...{ name, setName, email, setEmail, password, setPassword, showPassword, setShowPassword, busy }} onSubmit={signUp} /></TabsContent></Tabs></div></section>
  </main>;
}

type AuthFormProps = { mode: "signin" | "signup"; name?: string; setName?: (value: string) => void; email: string; setEmail: (value: string) => void; password: string; setPassword: (value: string) => void; showPassword: boolean; setShowPassword: (value: boolean) => void; busy: boolean; onSubmit: (event: React.FormEvent) => void };
function AuthForm(props: AuthFormProps) {
  return <form onSubmit={props.onSubmit} className="mt-6 space-y-4">{props.mode === "signup" && <div><Label htmlFor="auth-name">Full name</Label><Input id="auth-name" maxLength={80} value={props.name} onChange={(event) => props.setName?.(event.target.value)} className="mt-1.5 h-11" autoComplete="name" /></div>}<div><Label htmlFor={`${props.mode}-email`}>Email</Label><Input id={`${props.mode}-email`} type="email" maxLength={255} required value={props.email} onChange={(event) => props.setEmail(event.target.value)} className="mt-1.5 h-11" autoComplete="email" /></div><div><div className="flex justify-between"><Label htmlFor={`${props.mode}-password`}>Password</Label>{props.mode === "signin" && <Link to="/forgot-password" className="text-xs font-medium text-primary">Forgot password?</Link>}</div><div className="relative mt-1.5"><Input id={`${props.mode}-password`} type={props.showPassword ? "text" : "password"} minLength={8} maxLength={72} required value={props.password} onChange={(event) => props.setPassword(event.target.value)} className="h-11 pr-11" autoComplete={props.mode === "signin" ? "current-password" : "new-password"} /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-9 w-9" onClick={() => props.setShowPassword(!props.showPassword)} aria-label={props.showPassword ? "Hide password" : "Show password"}>{props.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div></div><Button type="submit" className="h-11 w-full" disabled={props.busy}>{props.busy && <Loader2 className="animate-spin" />}{props.mode === "signin" ? "Sign in" : "Create account"}</Button></form>;
}