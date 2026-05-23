import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Widely — Everything you are. In one simple link." },
      { name: "description", content: "The link-in-bio for builders. Beautiful profile, real REST API. Update your links from a script, cron job, or your own app." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="shrink-0"><img src="/logo.png" alt="Widely" className="h-10 sm:h-12 w-auto" /></Link>
        <nav className="flex items-center gap-2 sm:gap-3 text-sm">
          <Link to="/login" className="px-4 py-2 rounded-full hover:bg-secondary transition font-medium">
            Log in
          </Link>
          <Link to="/signup" className="rounded-full bg-primary px-4 sm:px-5 py-2 text-primary-foreground font-medium hover:opacity-90 transition">
            Sign up free
          </Link>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-10 sm:pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight mb-6">
            Everything you are.<br/>
            <span className="italic">In one</span> simple link.
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
            Join builders, creators & brands using Widely as the single link to share everything they create — with a real API under the hood.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const u = new FormData(e.currentTarget).get("u")?.toString().trim();
              if (u) window.location.href = `/signup?u=${encodeURIComponent(u)}`;
            }}
            className="flex items-center bg-card border border-border rounded-full p-1.5 max-w-md shadow-sm focus-within:ring-2 focus-within:ring-accent transition"
          >
            <span className="pl-4 pr-1 text-muted-foreground text-sm">widely.app/</span>
            <input
              name="u"
              placeholder="yourname"
              className="flex-1 bg-transparent outline-none text-sm py-2 min-w-0"
            />
            <button className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition whitespace-nowrap">
              Claim
            </button>
          </form>
          <p className="text-xs text-muted-foreground mt-3 ml-2">Free forever · No credit card</p>
        </div>

        {/* Phone mockup */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute inset-0 -z-10 bg-accent/40 blur-3xl rounded-full scale-90" />
          <div className="w-[280px] sm:w-[320px] rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="bg-accent rounded-[2.5rem] p-6 shadow-2xl border-8 border-primary">
              <div className="text-center mb-5">
                <div className="size-20 mx-auto rounded-full bg-primary mb-3 flex items-center justify-center text-primary-foreground font-display font-bold text-2xl">
                  W
                </div>
                <p className="font-bold text-primary">@yourname</p>
                <p className="text-xs text-primary/70 mt-1">builder · designer · ☕</p>
              </div>
              <div className="space-y-2.5">
                {["My latest project", "Newsletter", "Read my blog", "Book a call"].map((t, i) => (
                  <div key={i} className="bg-white rounded-2xl py-3 text-center text-sm font-semibold text-primary shadow-sm">
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 max-w-xl leading-tight">
            Not just another link page.
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "Beautiful by default", d: "Six handcrafted themes. Featured links, social icons, custom bio — rendered fast and clean." },
              { t: "Programmable", d: "A proper REST API. Update links from a cron job, a script, or your own app. No clunky dashboard required." },
              { t: "Built to share", d: "One handle. Open Graph previews. Click counts. Works everywhere you paste it." },
            ].map((f) => (
              <div key={f.t} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6">
                <div className="size-10 rounded-full bg-accent mb-4 flex items-center justify-center text-primary font-bold">✦</div>
                <h3 className="text-xl font-semibold mb-2">{f.t}</h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="api" className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-10">
          <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">For developers</span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Update from anywhere.</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">A REST API so you can wire Widely into your own stack.</p>
        </div>
        <div className="rounded-3xl bg-primary text-primary-foreground p-6 sm:p-8 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto shadow-xl">
          <pre>{`curl -X POST https://widely.app/api/public/v1/links \\
  -H "Authorization: Bearer wd_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "New release",
    "url": "https://example.com",
    "featured": true
  }'`}</pre>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-accent rounded-[2rem] p-10 sm:p-16 text-center">
          <h2 className="text-4xl sm:text-6xl font-bold text-primary mb-6 leading-tight">
            Get your link.<br/>Share everywhere.
          </h2>
          <Link to="/signup" className="inline-flex rounded-full bg-primary px-8 py-4 text-primary-foreground font-semibold text-base hover:opacity-90 transition">
            Get started — it's free
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        Widely © 2026
      </footer>
    </div>
  );
}
