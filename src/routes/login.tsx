import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
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
  .handler(async ({ data: input }) => {
    const { data: email, error } = await (supabaseAdmin as any).rpc("get_email_by_username", {
      p_username: input.handle.toLowerCase(),
    });
    if (error || !email) return { email: null };
    return { email: email as string };
  });

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Log in — Widely" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    const raw = identifier.trim();
    let email: string;

    if (isEmail(raw)) {
      email = raw;
    } else {
      const handle = raw.replace(/^@/, "").toLowerCase();
      const result = await lookupEmailByHandle({ data: { handle } });
      if (!result.email) {
        setBusy(false);
        return toast.error("Handle not found. Check your @handle and try again.");
      }
      email = result.email;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      if (error.code === "email_not_confirmed") {
        return nav({ to: "/confirm-email", search: { email } });
      }
      return toast.error(error.message);
    }
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
            <input
              type="text" required value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email or @handle"
              autoComplete="username"
              className="w-full bg-background border border-border rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"} required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full bg-background border border-border rounded-full px-5 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <button
              type="submit" disabled={busy}
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
            >
              {busy ? "Logging in…" : "Log in"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground transition">
              Forgot password?
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-foreground font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
