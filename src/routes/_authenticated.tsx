import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  component: AuthGate,
});

function AuthGate() {
  const [state, setState] = useState<"loading" | "ok" | "nope">("loading");

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      if (data.session) setState("ok");
      else {
        setState("nope");
        window.location.href = "/login";
      }
    });
    return () => { mounted = false; };
  }, []);

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading…</div>
      </div>
    );
  }
  if (state === "nope") return null;
  return <Outlet />;
}
