import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Widely — The link-in-bio your AI can update." },
      { name: "description", content: "Widely is a programmable link-in-bio with a full REST API and official MCP server. Control your profile from Claude, Cursor, GAS, n8n, Zapier, or any HTTP client." },
    ],
  }),
  component: Landing,
});

const PROFILE_CARDS = [
  { handle: "cairoconfessions", name: "Cairo Confessions", bio: "The first community support platform in Egypt", accent: "#2D9FDB", links: ["Join a Support Group", "Upcoming Events", "Confess Anonymously"] },
  { handle: "kroo.creative",    name: "KROO Creative",    bio: "Coworking & creative community · Cairo",       accent: "#7C3AED", links: ["Book a Desk", "See Our Space", "Follow Us"] },
  { handle: "moallam",          name: "Mohamed Allam",    bio: "Builder · Operator · GWS Engineer",            accent: "#059669", links: ["My Projects", "LinkedIn", "Book a Call"] },
  { handle: "designstudio",     name: "The Design Studio", bio: "Brand & motion design for bold brands",       accent: "#DB2777", links: ["Portfolio", "Start a Project", "Instagram"] },
  { handle: "podcastwaves",     name: "Podcast Waves",    bio: "Weekly conversations about tech & culture",    accent: "#D97706", links: ["Latest Episode", "Subscribe", "Suggest a Guest"] },
  { handle: "sanafit",          name: "Sana · Wellness",  bio: "Nutrition coaching & mindful movement",        accent: "#16A34A", links: ["Book a Session", "Free Guide", "Instagram"] },
];

function ProfileCard({ card }: { card: typeof PROFILE_CARDS[0] }) {
  return (
    <div className="w-56 rounded-[1.75rem] border border-border bg-card shadow-md overflow-hidden shrink-0">
      <div className="h-16 w-full" style={{ background: `linear-gradient(135deg, ${card.accent}33, ${card.accent}11)` }} />
      <div className="px-4 pb-4 -mt-7">
        <div className="size-14 rounded-full border-4 border-card mb-2 flex items-center justify-center text-white font-bold text-lg" style={{ background: card.accent }}>
          {card.name[0]}
        </div>
        <p className="font-bold text-sm leading-tight">{card.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5 mb-3 leading-snug">{card.bio}</p>
        <div className="space-y-1.5">
          {card.links.map((l) => (
            <div key={l} className="rounded-xl py-2 px-3 text-center text-xs font-semibold" style={{ background: `${card.accent}18`, color: card.accent }}>{l}</div>
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
      <div className="flex flex-col gap-4" style={{ animation: "scroll-up 28s linear infinite" }}>
        {doubled.map((card, i) => <ProfileCard key={i} card={card} />)}
      </div>
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </div>
  );
}

const INTEGRATIONS = [
  { name: "Claude",    color: "#D97706" },
  { name: "Cursor",   color: "#7C3AED" },
  { name: "Zapier",   color: "#FF4A00" },
  { name: "n8n",      color: "#EA4B71" },
  { name: "GAS",      color: "#059669" },
  { name: "curl",     color: "#2D9FDB" },
  { name: "Windsurf", color: "#0EA5E9" },
  { name: "Make",     color: "#6E3FF3" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <style>{`
        @keyframes scroll-up {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>

      {/* ── Header ── */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="shrink-0">
          <img src="/logo.png" alt="Widely" className="h-10 sm:h-12 w-auto" />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3 text-sm">
          <Link to="/login" className="px-4 py-2 rounded-full hover:bg-secondary transition font-medium">Log in</Link>
          <Link to="/signup" className="rounded-full bg-primary px-4 sm:px-5 py-2 text-primary-foreground font-medium hover:opacity-90 transition">Sign up free</Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center overflow-hidden">
        <div className="min-w-0">
          <span className="inline-block bg-accent/20 text-accent-foreground text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-5 border border-accent/30">
            Built for agents, scripts & humans
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
            The link-in-bio<br />your <span className="italic">AI can update.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 leading-relaxed">
            Widely is a programmable link-in-bio with a <strong className="text-foreground">full REST API</strong> and an <strong className="text-foreground">official MCP server</strong> — so your AI agents, automations, and scripts stay in sync without ever touching a dashboard.
          </p>
          <ul className="space-y-2 mb-8">
            {[
              "Official MCP server — works with Claude, Cursor, Windsurf & more",
              "Full REST API with Bearer key auth — GAS, Zapier, n8n, curl",
              "Beautiful profiles · 8 themes · click tracking · social icons",
            ].map((v) => (
              <li key={v} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="size-4 rounded-full bg-accent/20 flex items-center justify-center text-[10px] shrink-0 mt-0.5">✓</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const u = new FormData(e.currentTarget).get("u")?.toString().trim();
              window.location.href = `/signup${u ? `?u=${encodeURIComponent(u)}` : ""}`;
            }}
            className="flex items-center bg-card border border-border rounded-full p-1.5 w-full max-w-md shadow-sm focus-within:ring-2 focus-within:ring-accent transition"
          >
            <span className="pl-3 pr-1 text-muted-foreground text-sm whitespace-nowrap">widely.app/</span>
            <input name="u" placeholder="yourname" className="flex-1 bg-transparent outline-none text-sm py-2 min-w-0" />
            <button className="rounded-full bg-primary text-primary-foreground px-4 sm:px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition whitespace-nowrap shrink-0">
              <span className="hidden sm:inline">Claim your link</span>
              <span className="sm:hidden">Claim</span>
            </button>
          </form>
        </div>
        <div className="hidden lg:flex justify-end">
          <ScrollingCarousel />
        </div>
      </main>

      {/* ── Integrations bar ── */}
      <div className="border-y border-border py-5 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-5 font-semibold">Works with everything</p>
          <div className="flex flex-wrap justify-center gap-3">
            {INTEGRATIONS.map((i) => (
              <span key={i.name} className="px-4 py-1.5 rounded-full text-sm font-semibold border" style={{ borderColor: `${i.color}40`, color: i.color, background: `${i.color}10` }}>
                {i.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 max-w-xl leading-tight">Not just another link page.</h2>
          <p className="text-primary-foreground/60 mb-12 max-w-lg text-lg">Linktree gives you a dashboard. Widely gives you an API <em>and</em> an MCP server.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { t: "REST API",         d: "Every action — add a link, swap the theme, toggle visibility — is a REST call. Bearer key auth. Works from GAS, n8n, Zapier, or raw curl." },
              { t: "MCP Server",       d: "Install @widely/mcp and let Claude, Cursor, or any AI client manage your profile in plain conversation. No browser. No dashboard." },
              { t: "Beautiful themes", d: "Eight handcrafted themes. Featured links with cover photos, social icons, custom bio — looks premium on any device." },
              { t: "Built to share",   d: "One handle. One URL. Open Graph previews, click tracking, and instant redirect — works everywhere you paste it." },
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

      {/* ── MCP section ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">Model Context Protocol</span>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Talk to your profile.</h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Widely ships an official <strong className="text-foreground">MCP server</strong>. Add it to Claude, Cursor, Windsurf, or any MCP-compatible client — then just ask.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Config snippet */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">1 · Add to your MCP config</p>
            <div className="rounded-2xl bg-primary text-primary-foreground p-5 font-mono text-xs leading-relaxed overflow-x-auto shadow-xl">
              <pre>{`{
  "mcpServers": {
    "widely": {
      "command": "npx",
      "args": ["-y", "@widely/mcp"],
      "env": {
        "WIDELY_API_KEY": "lv_live_..."
      }
    }
  }
}`}</pre>
            </div>
          </div>

          {/* Conversation example */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">2 · Just ask Claude</p>
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
              {[
                { role: "user",      text: "Add a link to my new project launch." },
                { role: "widely",    text: "Done — \"Project Launch\" added and set as featured." },
                { role: "user",      text: "Switch my theme to noir." },
                { role: "widely",    text: "Theme updated to noir. Your profile looks great." },
                { role: "user",      text: "Hide the old event link." },
                { role: "widely",    text: "Hidden. It won't show on your profile until you re-enable it." },
              ].map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-snug ${m.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-secondary text-secondary-foreground rounded-bl-sm"}`}>
                    {m.role === "widely" && <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block mb-0.5">Widely</span>}
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── API section ── */}
      <section className="bg-secondary/40 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-accent text-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">REST API</span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Your profile, on autopilot.</h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">One API key. Full control. Wire it into GAS, n8n, Zapier, cron jobs, or any HTTP client.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Endpoints list */}
            <div className="space-y-2">
              {[
                { method: "GET",    path: "/links",           desc: "List all links" },
                { method: "POST",   path: "/links",           desc: "Create a link" },
                { method: "PATCH",  path: "/links/:id",       desc: "Update title, URL, visibility, image" },
                { method: "DELETE", path: "/links/:id",       desc: "Delete a link" },
                { method: "POST",   path: "/links/reorder",   desc: "Reorder all links" },
                { method: "GET",    path: "/profile",         desc: "Get profile" },
                { method: "PATCH",  path: "/profile",         desc: "Update bio, theme, socials" },
              ].map((e) => (
                <div key={e.path + e.method} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                  <span className={`text-[10px] font-bold w-14 shrink-0 ${e.method === "GET" ? "text-emerald-500" : e.method === "POST" ? "text-blue-500" : e.method === "PATCH" ? "text-amber-500" : "text-red-500"}`}>
                    {e.method}
                  </span>
                  <span className="font-mono text-xs text-foreground">{e.path}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{e.desc}</span>
                </div>
              ))}
            </div>

            {/* curl example */}
            <div className="rounded-2xl bg-primary text-primary-foreground p-5 font-mono text-xs leading-relaxed overflow-x-auto shadow-xl">
              <pre>{`# Create a link
curl -X POST \\
  https://widely.app/api/public/v1/links \\
  -H "Authorization: Bearer lv_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "title":    "New release",
    "url":      "https://example.com",
    "featured": true
  }'

# Update visibility
curl -X PATCH \\
  https://widely.app/api/public/v1/links/:id \\
  -H "Authorization: Bearer lv_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{ "visible": false }'`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="bg-accent rounded-[2rem] p-10 sm:p-16 text-center">
          <h2 className="text-4xl sm:text-6xl font-bold text-primary mb-4 leading-tight">
            Get your link.<br />Let your agent run it.
          </h2>
          <p className="text-primary/70 mb-8 text-lg">Set up in under 2 minutes. API key and MCP server ready on day one.</p>
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
