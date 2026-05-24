import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/confirm-email")({
  head: () => ({ meta: [{ title: "Confirm your email — Widely" }] }),
  validateSearch: z.object({ email: z.string().optional() }),
  component: ConfirmEmailPage,
});

function ConfirmEmailPage() {
  const { email } = useSearch({ from: "/confirm-email" });
  const [resending, setResending] = useState(false);

  async function resend() {
    if (!email) return;
    setResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin + "/auth/callback" },
    });
    setResending(false);
    if (error) toast.error(error.message);
    else toast.success("Confirmation email resent!");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center mb-8">
          <img src="/logo.png" alt="Widely" className="h-12 w-auto mx-auto" />
        </Link>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-5">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-foreground">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <path d="m2 7 10 7 10-7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
          <p className="text-sm text-muted-foreground mb-6">
            We sent a confirmation link to{" "}
            {email ? <strong>{email}</strong> : "your email"}.
            Click it to activate your account.
          </p>

          {email && (
            <button
              onClick={resend}
              disabled={resending}
              className="w-full rounded-full border border-border py-3 text-sm font-medium hover:bg-secondary transition disabled:opacity-50 mb-3"
            >
              {resending ? "Sending…" : "Resend confirmation email"}
            </button>
          )}

          <Link
            to="/login"
            className="block text-xs text-muted-foreground hover:text-foreground transition"
          >
            Already confirmed? Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
