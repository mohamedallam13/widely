import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile } from "@/lib/profile.functions";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/app")({
  component: AppShell,
});

const NAV = [
  { to: "/app/links", label: "Links" },
  { to: "/app/design", label: "Design" },
  { to: "/app/api-keys", label: "API keys" },
] as const;

function AppShell() {
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const fetchProfile = useServerFn(getMyProfile);
  const { data: profile } = useQuery({ queryKey: ["my-profile"], queryFn: () => fetchProfile() });

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    nav({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link to="/" className="shrink-0">
            <img src="/logo.png" alt="Widely" className="h-7 sm:h-8 w-auto" />
          </Link>
          <div className="flex-1" />
          {profile?.username && (
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-accent text-accent-foreground font-semibold hover:opacity-90 transition shrink-0"
              title="Open your public page"
            >
              <span className="hidden md:inline">widely.app/{profile.username}</span>
              <span className="md:hidden">Preview</span>
              <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
            </a>
          )}
          <button
            onClick={signOut}
            className="text-xs px-3 py-1.5 rounded-full hover:bg-secondary text-muted-foreground shrink-0"
          >
            Sign out
          </button>
        </div>
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 pb-2 flex items-center gap-1 text-sm overflow-x-auto">
          {NAV.map((n) => {
            const active = path === n.to || path.startsWith(n.to + "/");
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <Outlet />
      </main>
    </div>
  );
}
