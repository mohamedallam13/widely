import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

const lookupEmailByHandle = createServerFn({ method: "GET" })
  .inputValidator((d: { handle: string }) =>
    z.object({ handle: z.string().min(1).max(40) }).parse(d)
  )
  .handler(async ({ data }) => {
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .ilike("username", data.handle)
      .maybeSingle();

    if (error || !profile) return { email: null };

    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(profile.id);
    if (userError || !user?.user?.email) return { email: null };

    return { email: user.user.email };
  });

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Widely" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [handle, setHandle] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    const clean = handle.replace(/^@/, "").trim().toLowerCase();
    const { email } = await lookupEmailByHandle({ data: { handle: clean } });

    if (!email) {
      setBusy(false);
      return toast.error("Handle not found. Check your @handle and try again.");
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    nav({ to: "/app/links" });
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/app/links",
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed");
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center mb-8">
          <img src="/logo.png" alt="Widely" className="h-12 w-auto mx-auto" />
        </Link>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-6">Log in to your Widely</p>

          <button
            onClick={handleGoogle} disabled={busy}
            className="w-full rounded-full border border-border bg-card py-3 text-sm font-medium hover:bg-secondary transition disabled:opacity-50 mb-4"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-5 text-xs text-muted-foreground">
            <div className="h-px bg-border flex-1" /> OR <div className="h-px bg-border flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground select-none">@</span>
              <input
                type="text" required value={handle}
                onChange={(e) => setHandle(e.target.value.replace(/^@/, ""))}
                placeholder="yourhandle"
                className="w-full bg-background border border-border rounded-full pl-9 pr-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-background border border-border rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit" disabled={busy}
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
            >
              {busy ? "Logging in…" : "Log in"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-foreground font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
