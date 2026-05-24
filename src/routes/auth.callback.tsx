import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({ meta: [{ title: "Confirming… — Widely" }] }),
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const nav = useNavigate();

  useEffect(() => {
    // Supabase JS client auto-exchanges the hash tokens on load.
    // We just wait for the SIGNED_IN event then redirect.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        subscription.unsubscribe();
        nav({ to: "/app/links" });
      }
    });

    // Fallback: if already signed in (token already exchanged), redirect now
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) nav({ to: "/app/links" });
    });

    return () => subscription.unsubscribe();
  }, [nav]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full border-2 border-accent/30 border-t-accent animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Confirming your email…</p>
      </div>
    </div>
  );
}
