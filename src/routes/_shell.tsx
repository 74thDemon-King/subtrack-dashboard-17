import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/subtrack/AppSidebar";
import { TopNav } from "@/components/subtrack/TopNav";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { FullPageLoader } from "@/components/subtrack/Loaders";
import { OnboardingTour } from "@/components/subtrack/OnboardingTour";
import { ChatWidget } from "@/components/subtrack/ChatWidget";
import { initCurrency, useCurrency } from "@/lib/currency";
import { useEffect } from "react";

export const Route = createFileRoute("/_shell")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth", search: { next: location.href } });
    return { user: data.user };
  },

  component: ShellLayout,
  pendingComponent: () => <FullPageLoader />,
  pendingMs: 150,
});

function ShellLayout() {
  const currency = useCurrency();
  useEffect(() => { initCurrency(); }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col">
          <TopNav />
          <main key={currency} className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
      <Toaster />
      <OnboardingTour />
      <ChatWidget />
    </SidebarProvider>
  );
}
