import { Bell, Search } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { useProfileIdentity } from "@/hooks/useProfileIdentity";
import { daysUntil, fmtDate, inr } from "@/lib/format";

export function TopNav() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { subs } = useSubscriptions();
  const profile = useProfileIdentity();
  const renewals = subs
    .filter((sub) => sub.status === "Active" && daysUntil(sub.renewalDate) >= 0 && daysUntil(sub.renewalDate) <= 7)
    .sort((a, b) => daysUntil(a.renewalDate) - daysUntil(b.renewalDate))
    .slice(0, 4);
  const initials = profile.name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || "U";

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    void navigate({ to: "/subscriptions", search: { q: query.trim() } });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="text-muted-foreground" />
      <form onSubmit={submitSearch} className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search subscriptions, bills..."
          aria-label="Search subscriptions"
          className="h-10 rounded-xl border-border/60 bg-muted/40 pl-9 focus-visible:bg-background"
        />
      </form>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="h-4 w-4" />
              {renewals.length > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {renewals.map((sub) => (
              <DropdownMenuItem key={sub.id} className="flex-col items-start gap-1" onClick={() => void navigate({ to: "/calendar" })}>
                <div className="flex w-full items-center justify-between gap-3">
                  <span className="text-sm font-medium">{sub.name} renews {daysUntil(sub.renewalDate) === 0 ? "today" : `in ${daysUntil(sub.renewalDate)} days`}</span>
                  <Badge variant="secondary">{inr(sub.amount)}</Badge>
                </div>
                <span className="text-xs text-muted-foreground">Renewal on {fmtDate(sub.renewalDate)}</span>
              </DropdownMenuItem>
            ))}
            {renewals.length === 0 && <DropdownMenuItem disabled>No renewals in the next 7 days</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
        <Link to="/profile" aria-label="Open profile">
          <Avatar className="h-9 w-9 border border-border/60">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
