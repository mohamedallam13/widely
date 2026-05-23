import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up free — Widely" }] }),
  component: SignupPage,
});

function SignupPage() {
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const u = username.toLowerCase().trim();
    if (!/^[a-z0-9_]{3,30}$/.test(u)) return toast.error("Username: 3-30 chars, a-z 0-9 _");
    if (password.length < 8) return toast.error("Password must be 8+ characters");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: window.location.origin + "/app/links",
        data: { username: u },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created");
    nav({ to: "/app/links" });
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/app/links",
    });
    if (result.error) { setBusy(false); toast.error("Google sign-in failed"); }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="block text-center mb-8">
          <img src="/logo.png" alt="Widely" className="h-12 w-auto mx-auto" />
        </Link>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-1">Join Widely</h1>
          <p className="text-sm text-muted-foreground mb-6">Claim your handle. Free forever.</p>

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
            <div className="flex items-center bg-background border border-border rounded-full px-5 py-3 text-sm focus-within:ring-2 focus-within:ring-accent">
              <span className="text-muted-foreground">widely.app/</span>
              <input
                required value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())}
                placeholder="yourname" className="flex-1 bg-transparent outline-none ml-0.5 min-w-0"
              />
            </div>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-background border border-border rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"} required value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (8+ chars)"
                className="w-full bg-background border border-border rounded-full px-5 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <button type="submit" disabled={busy}
              className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50">
              {busy ? "Creating…" : "Create my Widely"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-foreground font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
