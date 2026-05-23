import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Widely — Everything you are. In one simple link." },
      { name: "description", content: "The link-in-bio for builders and creators. Beautiful profile, real REST API. One link to share everything." },
    ],
  }),
  component: Landing,
});

const PROFILE_CARDS = [
  {
    handle: "cairoconfessions",
    name: "Cairo Confessions",
    bio: "The first community support platform in Egypt",
    accent: "#2D9FDB",
    links: ["Join a Support Group", "Upcoming Events", "Confess Anonymously"],
  },
  {
    handle: "kroo.creative",
    name: "KROO Creative",
    bio: "Coworking & creative community · Cairo",
    accent: "#7C3AED",
    links: ["Book a Desk", "See Our Space", "Follow Us"],
  },
  {
    handle: "moallam",
    name: "Mohamed Allam",
    bio: "Builder · Operator · GWS Engineer",
    accent: "#059669",
    links: ["My Projects", "LinkedIn", "Book a Call"],
  },
  {
    handle: "designstudio",
    name: "The Design Studio",
    bio: "Brand & motion design for bold brands",
    accent: "#DB2777",
    links: ["Portfolio", "Start a Project", "Instagram"],
  },
  {
    handle: "podcastwaves",
    name: "Podcast Waves",
    bio: "Weekly conversations about tech & culture",
    accent: "#D97706",
    links: ["Latest Episode", "Subscribe", "Suggest a Guest"],
  },
  {
    handle: "sanafit",
    name: "Sana · Wellness",
    bio: "Nutrition coaching & mindful movement",
    accent: "#16A34A",
    links: ["Book a Session", "Free Guide", "Instagram"],
  },
];

function ProfileCard({ card }: { card: typeof PROFILE_CARDS[0] }) {
  return (
    <div className="w-56 rounded-[1.75rem] border border-border bg-card shadow-md overflow-hidden shrink-0">
      <div className="h-16 w-full" style={{ background: `linear-gradient(135deg, ${card.accent}33, ${card.accent}11)` }} />
      <div className="px-4 pb-4 -mt-7">
        <div
          className="size-14 rounded-full border-4 border-card mb-2 flex items-center justify-center text-white font-bold text-lg"
          style={{ background: card.accent }}
        >
          {card.name[0]}
        </div>
        <p className="font-bold text-sm leading-tight">{card.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 mb-3 leading-snug">{card.bio}</p>
        <div className="space-y-1.5">
          {card.links.map((l) => (
            <div
              key={l}
              className="rounded-xl py-2 px-3 text-center text-xs font-semibold"
              style={{ background: `${card.accent}18`, color: card.accent }}
            >
              {l}
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-2.5">widely.app/{card.handle}</p>
      </div>
    </div>
  );
}

function ScrollingCarousel() {
  const doubled = [...PROFILE_CARDS, ...PROFILE_CARDS];
  return (
    <div className="relative h-[520px] overflow-hidden">
      <div
        className="flex flex-col gap-4"
        style={{ animation: "scroll-up 28s linear infinite" }}
      >
        {doubled.map((card, i) => (
          <ProfileCard key={i} card={card} />
        ))}
      </div>
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <style>{`
        @keyframes scroll-up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="shrink-0">
          <img src="/logo.png" alt="Widely" className="h-10 sm:h-12 w-auto" />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3 text-sm">
          <Link to="/login" className="px-4 py-2 rounded-full hover:bg-secondary transition font-medium">
            Log in
          </Link>
          <Link to="/signup" className="rounded-full bg-primary px-4 sm:px-5 py-2 text-primary-foreground font-medium hover:opacity-90 transition">
            Sign up free
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center overflow-hidden">
        <div className="min-w-0">
          <span className="inline-block bg-accent/20 text-accent-foreground text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5 border border-accent/30">
            Built for agents, scripts & humans
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            The link-in-bio<br/>
            your <span className="italic">AI can update.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-4 leading-relaxed">
            Widely is a programmable link-in-bio. Every link, theme, and profile field is controllable via REST API — so your automations, agents, and scripts stay in sync without touching a dashboard.
          </p>

          {/* Value props */}
          <ul className="space-y-2 mb-8">
            {[
              "Full REST API with Bearer key auth — update from anywhere",
              "Works with GAS, Zapier, n8n, Claude, or any HTTP client",
              "Beautiful profiles with 8 themes, click tracking & social icons",
            ].map((v) => (
              <li key={v} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="size-4 rounded-full bg-accent/20 flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>

          {/* Claim form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const u = new FormData(e.currentTarget).get("u")?.toString().trim();
              window.location.href = `/signup${u ? `?u=${encodeURIComponent(u)}` : ""}`;
            }}
            className="flex items-center bg-card border border-border rounded-full p-1.5 w-full max-w-md shadow-sm focus-within:ring-2 focus-within:ring-accent transition"
          >
            <span className="pl-3 pr-1 text-muted-foreground text-sm whitespace-nowrap">widely.app/</span>
            <input
              name="u"
              placeholder="yourname"
              className="flex-1 bg-transparent outline-none text-sm py-2 min-w-0"
            />
            <button className="rounded-full bg-primary text-primary-foreground px-4 sm:px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition whitespace-nowrap shrink-0">
              <span className="hidden sm:inline">Claim your link</span>
              <span className="sm:hidden">Claim</span>
            </button>
          </form>
        </div>

        {/* Carousel */}
        <div className="hidden lg:flex justify-end">
          <ScrollingCarousel />
        </div>
      </main>

      {/* Features */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 max-w-xl leading-tight">
            Not just another link page.
          </h2>
          <p className="text-primary-foreground/60 mb-12 max-w-lg text-lg">Linktree gives you a dashboard. Widely gives you an API.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { t: "API-first, always", d: "Every profile action — add a link, swap the theme, toggle visibility — is a REST call. Wire it into any stack: GAS, n8n, Zapier, Claude, or raw curl." },
              { t: "Beautiful by default", d: "Eight handcrafted themes. Featured links with cover photos, social icons, custom bio — looks premium on any device without touching CSS." },
              { t: "Built to share", d: "One handle. One URL. Open Graph previews, click tracking, and instant redirect — works everywhere you paste it." },
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

      {/* API section */}
      <section id="api" className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-10">
          <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">For builders & agents</span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Your profile, on autopilot.</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">One API key. Full control. Update links from a Google Apps Script, a Claude agent, a cron job, or a Zapier flow — no human required.</p>
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

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-accent rounded-[2rem] p-10 sm:p-16 text-center">
          <h2 className="text-4xl sm:text-6xl font-bold text-primary mb-4 leading-tight">
            Get your link.<br/>Let your agent run it.
          </h2>
          <p className="text-primary/70 mb-8 text-lg">Set up in under 2 minutes. API key ready on day one.</p>
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
