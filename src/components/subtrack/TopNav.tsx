import { Bell, Search } from "lucide-react";
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

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="text-muted-foreground" />
      <div className="relative hidden max-w-md flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search subscriptions, bills..."
          className="h-10 rounded-xl border-border/60 bg-muted/40 pl-9 focus-visible:bg-background"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex-col items-start gap-1">
              <div className="flex w-full items-center justify-between">
                <span className="text-sm font-medium">Netflix renews in 4 days</span>
                <Badge variant="secondary">₹649</Badge>
              </div>
              <span className="text-xs text-muted-foreground">Renewal on the 25th</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-1">
              <span className="text-sm font-medium">You may save ₹900/month</span>
              <span className="text-xs text-muted-foreground">Review 2 unused subscriptions</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-1">
              <span className="text-sm font-medium">Electricity bill due</span>
              <span className="text-xs text-muted-foreground">₹1,250 in 6 days</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Avatar className="h-9 w-9 border border-border/60">
          <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">AK</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
