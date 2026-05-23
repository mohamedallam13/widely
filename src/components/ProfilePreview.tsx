export type PreviewLink = {
  id: string;
  title: string;
  url: string;
  featured: boolean;
  visible: boolean;
  image_url: string | null;
};

export type PreviewProfile = {
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string | null;
  cover_url?: string | null;
  theme?: string;
  socials?: unknown;
};

const THEME: Record<string, { bg: string; surface: string; text: string; muted: string; accent: string }> = {
  noir:        { bg: "#0A0A0A", surface: "#1A1A1A", text: "#F5F5F5", muted: "#888888", accent: "#DFF27E" },
  neon:        { bg: "#050505", surface: "#111111", text: "#F0F0F0", muted: "#777777", accent: "#C8FF00" },
  midnight:    { bg: "#07090F", surface: "#0F1420", text: "#EDE8E0", muted: "#6B7A8D", accent: "#2D9FDB" },
  bone:        { bg: "#F5F1EA", surface: "#FFFFFF",  text: "#1A1814", muted: "#6B6258", accent: "#B8472A" },
  indigo_mist: { bg: "#C7D2FE", surface: "#FFFFFF",  text: "#1E1B4B", muted: "#4F46E5", accent: "#1E1B4B" },
  sunset:      { bg: "#FFB199", surface: "#FFFFFF",  text: "#3D1810", muted: "#8B4513", accent: "#3D1810" },
  forest:      { bg: "#BBF7D0", surface: "#FFFFFF",  text: "#14532D", muted: "#15803D", accent: "#14532D" },
  mono:        { bg: "#FFFFFF", surface: "#F0F0F0",  text: "#0A0A0A", muted: "#737373", accent: "#0A0A0A" },
};

/* Tiny SVG paths for social icons */
const SOCIAL_PATHS: Record<string, string> = {
  instagram: "M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z",
  tiktok:    "M16 3v3.2a5.8 5.8 0 0 0 4 1.6V11a8.7 8.7 0 0 1-4-1V16a5 5 0 1 1-5-5v3.2a1.8 1.8 0 1 0 1.8 1.8V3H16Z",
  x:         "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z",
  youtube:   "M21.6 7.2c-.2-1.4-1.3-2.5-2.7-2.7C16.5 4 12 4 12 4s-4.5 0-6.9.5C3.7 4.7 2.6 5.8 2.4 7.2 2 9.6 2 12 2 12s0 2.4.4 4.8c.2 1.4 1.3 2.5 2.7 2.7C7.5 20 12 20 12 20s4.5 0 6.9-.5c1.4-.2 2.5-1.3 2.7-2.7.4-2.4.4-4.8.4-4.8s0-2.4-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z",
  facebook:  "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z",
  linkedin:  "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.13V21H18.5v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21H10V9Z",
  github:    "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z",
  whatsapp:  "M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6.1-.1.3-.3.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3ZM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2Z",
  email:     "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v.4l8 5 8-5V6H4Zm16 2.6-7.46 4.66a1 1 0 0 1-1.08 0L4 8.6V18h16V8.6Z",
  website:   "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 9h-3.18a16 16 0 0 0-1.45-5.4A8 8 0 0 1 18.93 11ZM12 4c.9 1.4 1.9 3.7 2.18 7H9.82C10.1 7.7 11.1 5.4 12 4ZM5.07 11A8 8 0 0 1 9.7 5.6 16 16 0 0 0 8.25 11H5.07Zm0 2h3.18a16 16 0 0 0 1.45 5.4A8 8 0 0 1 5.07 13ZM12 20c-.9-1.4-1.9-3.7-2.18-7h4.36c-.28 3.3-1.28 5.6-2.18 7Zm2.3-.6A16 16 0 0 0 15.75 14h3.18a8 8 0 0 1-4.63 5.4Z",
};

function ArrowIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

export function ProfilePreview({
  username,
  links,
  profile,
  themeOverride,
}: {
  username: string;
  links: PreviewLink[];
  profile: PreviewProfile | null | undefined;
  themeOverride?: string;
}) {
  const themeKey = themeOverride ?? profile?.theme ?? "noir";
  const t = THEME[themeKey] ?? THEME.noir;

  const visibleLinks = links.filter(l => l.visible !== false);
  const featuredLinks = visibleLinks.filter(l => l.featured);
  const regularLinks = visibleLinks.filter(l => !l.featured);

  const initial = ((profile?.display_name || username || "?")[0]).toUpperCase();
  const bio = profile?.bio?.trim();
  const socials = (profile?.socials as Record<string, string> | null) ?? {};
  const socialEntries = Object.entries(socials).filter(([k, v]) => SOCIAL_PATHS[k] && v?.trim());

  /* semi-transparent white/black for glassmorphism card surface */
  const isDark = t.bg.startsWith("#0") || t.bg.startsWith("#1");
  const cardBg = isDark
    ? "rgba(255,255,255,0.07)"
    : "rgba(255,255,255,0.72)";
  const cardBorder = isDark
    ? "rgba(255,255,255,0.10)"
    : "rgba(0,0,0,0.06)";

  return (
    <aside className="hidden md:block">
      <div className="sticky top-28">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Live preview</span>
          <a href={`/${username}`} target="_blank" rel="noreferrer"
            className="text-xs font-semibold text-accent hover:underline">
            Open ↗
          </a>
        </div>

        {/* Phone shell */}
        <div className="relative mx-auto w-[300px] h-[620px] rounded-[2.5rem] border-[10px] border-foreground bg-foreground shadow-2xl overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-foreground rounded-b-2xl z-10" />

          {/* Screen */}
          <div
            className="w-full h-full overflow-y-auto scrollbar-hide flex flex-col relative"
            style={{ background: t.bg, fontFamily: "Inter, system-ui, sans-serif" }}
          >
            {/* Cover photo */}
            {profile?.cover_url && (
              <div className="absolute top-0 left-0 right-0 h-[140px] pointer-events-none z-0">
                <img src={profile.cover_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 30%, ${t.bg} 100%)` }} />
              </div>
            )}

            <div className="flex flex-col items-center px-4 pt-10 pb-5 flex-1 relative z-10">

              {/* Avatar with accent ring */}
              <div className="mb-2.5 rounded-full p-[2.5px]" style={{ background: t.accent }}>
                <div
                  className="size-[58px] rounded-full overflow-hidden flex items-center justify-center text-lg font-bold"
                  style={{ background: t.surface, color: t.text }}
                >
                  {profile?.avatar_url
                    ? <img src={profile.avatar_url} alt="" className="size-full object-cover" />
                    : initial}
                </div>
              </div>

              {/* Name + handle */}
              <p className="font-bold text-[12.5px] leading-snug text-center" style={{ color: t.text }}>
                {profile?.display_name || `@${username}`}
              </p>
              {profile?.display_name && (
                <p className="text-[10px] mt-0.5 mb-1" style={{ color: t.muted }}>@{username}</p>
              )}

              {/* Bio */}
              {bio && (
                <p className="text-[9.5px] text-center leading-relaxed max-w-[210px] mt-1 mb-2"
                  style={{ color: t.muted }}>
                  {bio}
                </p>
              )}

              {/* Social icons */}
              {socialEntries.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap justify-center mb-3">
                  {socialEntries.map(([key]) => (
                    <div
                      key={key}
                      className="size-5 rounded-full flex items-center justify-center"
                      style={{ color: t.text, opacity: 0.7 }}
                    >
                      <svg viewBox="0 0 24 24" width="10" height="10" fill="currentColor">
                        <path d={SOCIAL_PATHS[key]} />
                      </svg>
                    </div>
                  ))}
                </div>
              )}

              {/* Links */}
              <div className="w-full flex flex-col gap-2 mt-1">

                {visibleLinks.length === 0 && (
                  <p className="text-[9.5px] text-center mt-6" style={{ color: t.muted }}>
                    No visible links
                  </p>
                )}

                {/* Featured links */}
                {featuredLinks.map((l) => (
                  <div
                    key={l.id}
                    className="w-full rounded-2xl overflow-hidden"
                    style={{ border: `1px solid ${t.accent}`, backdropFilter: "blur(8px)" }}
                  >
                    {l.image_url ? (
                      <div className="relative w-full" style={{ aspectRatio: "2.2/1" }}>
                        <img src={l.image_url} alt={l.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }} />
                        <div className="absolute bottom-0 left-0 right-0 px-3 py-2 flex items-end justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-[7px] uppercase tracking-widest font-bold mb-0.5" style={{ color: t.accent }}>Featured</p>
                            <p className="text-[11px] font-semibold truncate text-white">{l.title}</p>
                          </div>
                          <ArrowIcon color="rgba(255,255,255,0.7)" />
                        </div>
                      </div>
                    ) : (
                      <div className="px-3 py-2.5 flex items-center gap-2" style={{ background: cardBg }}>
                        <div className="flex-1 min-w-0">
                          <p className="text-[7.5px] uppercase tracking-widest font-bold mb-0.5" style={{ color: t.accent }}>Featured</p>
                          <p className="text-[11px] font-semibold truncate" style={{ color: t.text }}>{l.title}</p>
                        </div>
                        <ArrowIcon color={t.muted} />
                      </div>
                    )}
                  </div>
                ))}

                {/* Regular links — uniform height */}
                {regularLinks.map((l) => (
                  <div
                    key={l.id}
                    className="w-full rounded-2xl overflow-hidden flex items-stretch"
                    style={{
                      height: "40px",
                      background: cardBg,
                      border: `1px solid ${cardBorder}`,
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {/* Accent left strip */}
                    <div className="w-[3px] shrink-0 rounded-l-2xl" style={{ background: t.accent }} />

                    {l.image_url && (
                      <div className="w-[32px] shrink-0 self-stretch my-1 ml-1.5 rounded-lg overflow-hidden">
                        <img src={l.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 px-3 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold truncate" style={{ color: t.text }}>
                        {l.title}
                      </span>
                      <ArrowIcon color={t.muted} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Push footer to bottom */}
              <div className="flex-1 min-h-[20px]" />

              {/* Footer chip */}
              <div className="flex justify-center pt-3">
                <div
                  className="px-3 py-1.5 rounded-full flex items-center gap-1.5"
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <img src="/favicon.png" alt="" className="size-3 opacity-70" />
                  <span className="text-[8.5px] font-semibold" style={{ color: t.muted }}>
                    Made with Widely
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
