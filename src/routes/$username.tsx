import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function getAnonClient() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, { auth: { persistSession: false } });
}

const getProfile = createServerFn({ method: "GET" })
  .inputValidator((d: { username: string }) => z.object({ username: z.string().min(1).max(40) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = getAnonClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, display_name, bio, avatar_url, cover_url, theme, socials")
      .ilike("username", data.username)
      .maybeSingle();
    if (!profile) return null;
    const { data: links } = await supabase
      .from("links")
      .select("id, title, url, featured, position, image_url")
      .eq("user_id", profile.id)
      .eq("visible", true)
      .order("featured", { ascending: false })
      .order("position", { ascending: true });
    return { profile, links: links ?? [] };
  });

export const Route = createFileRoute("/$username")({
  loader: async ({ params }) => {
    const result = await getProfile({ data: { username: params.username } });
    if (!result) throw notFound();
    return result;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.profile.display_name || loaderData.profile.username} — Widely` },
      { name: "description", content: loaderData.profile.bio || `Links from @${loaderData.profile.username}` },
      { property: "og:title", content: loaderData.profile.display_name || loaderData.profile.username },
      { property: "og:description", content: loaderData.profile.bio || `Links from @${loaderData.profile.username}` },
      ...(loaderData.profile.avatar_url ? [{ property: "og:image", content: loaderData.profile.avatar_url }] : []),
    ] : [],
    links: loaderData?.profile.avatar_url ? [
      { rel: "icon", href: loaderData.profile.avatar_url, type: "image/png" },
    ] : [
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen bg-background flex items-center justify-center text-center px-4">
      <div>
        <p className="text-5xl font-bold mb-2">404</p>
        <p className="text-sm text-muted-foreground">This handle isn't taken yet.</p>
      </div>
    </div>
  ),
  component: PublicProfile,
});

const SOCIAL_META: Record<string, { label: string; path: string }> = {
  instagram: { label: "Instagram", path: "M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" },
  tiktok:    { label: "TikTok",     path: "M16 3v3.2a5.8 5.8 0 0 0 4 1.6V11a8.7 8.7 0 0 1-4-1V16a5 5 0 1 1-5-5v3.2a1.8 1.8 0 1 0 1.8 1.8V3H16Z" },
  x:         { label: "X",          path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" },
  youtube:   { label: "YouTube",    path: "M21.6 7.2c-.2-1.4-1.3-2.5-2.7-2.7C16.5 4 12 4 12 4s-4.5 0-6.9.5C3.7 4.7 2.6 5.8 2.4 7.2 2 9.6 2 12 2 12s0 2.4.4 4.8c.2 1.4 1.3 2.5 2.7 2.7C7.5 20 12 20 12 20s4.5 0 6.9-.5c1.4-.2 2.5-1.3 2.7-2.7.4-2.4.4-4.8.4-4.8s0-2.4-.4-4.8ZM10 15.5v-7l6 3.5-6 3.5Z" },
  facebook:  { label: "Facebook",   path: "M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" },
  linkedin:  { label: "LinkedIn",   path: "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05c.53-1 1.84-2.05 3.79-2.05 4.05 0 4.8 2.67 4.8 6.13V21H18.5v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21H10V9Z" },
  github:    { label: "GitHub",     path: "M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" },
  whatsapp:  { label: "WhatsApp",   path: "M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.4.1-.6.1-.1.3-.3.5-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3ZM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2Z" },
  email:     { label: "Email",      path: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v.4l8 5 8-5V6H4Zm16 2.6-7.46 4.66a1 1 0 0 1-1.08 0L4 8.6V18h16V8.6Z" },
  website:   { label: "Website",    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm6.93 9h-3.18a16 16 0 0 0-1.45-5.4A8 8 0 0 1 18.93 11ZM12 4c.9 1.4 1.9 3.7 2.18 7H9.82C10.1 7.7 11.1 5.4 12 4ZM5.07 11A8 8 0 0 1 9.7 5.6 16 16 0 0 0 8.25 11H5.07Zm0 2h3.18a16 16 0 0 0 1.45 5.4A8 8 0 0 1 5.07 13ZM12 20c-.9-1.4-1.9-3.7-2.18-7h4.36c-.28 3.3-1.28 5.6-2.18 7Zm2.3-.6A16 16 0 0 0 15.75 14h3.18a8 8 0 0 1-4.63 5.4Z" },
};

type LinkRow = { id: string; title: string; url: string; featured: boolean; position: number; image_url: string | null };

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 shrink-0" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

function PublicProfile() {
  const { profile, links } = Route.useLoaderData();
  const initial = (profile.display_name || profile.username || "?")[0].toUpperCase();
  const socials = (profile.socials as Record<string, string> | null) || {};
  const socialEntries = Object.entries(socials).filter(([k, v]) => SOCIAL_META[k] && typeof v === "string" && v.trim().length > 0);
  const featuredLinks = links.filter((l: LinkRow) => l.featured);
  const regularLinks = links.filter((l: LinkRow) => !l.featured);

  return (
    <div
      data-theme={profile.theme}
      className="min-h-screen flex flex-col relative"
      style={{
        background: "var(--brand-bg)",
        color: "var(--brand-text)",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      {/* Cover photo with gradient fade */}
      {(profile as { cover_url?: string | null }).cover_url && (
        <div className="absolute top-0 left-0 right-0 h-[280px] pointer-events-none">
          <img
            src={(profile as { cover_url?: string | null }).cover_url!}
            alt=""
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to bottom, transparent 30%, var(--brand-bg) 100%)" }}
          />
        </div>
      )}

      <main className="flex-1 w-full max-w-[440px] mx-auto px-5 pt-14 pb-10 flex flex-col relative z-10">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="flex flex-col items-center text-center mb-8">

          {/* Avatar with accent ring */}
          <div className="mb-4 p-[3px] rounded-full" style={{ background: "var(--brand-accent)" }}>
            <div
              className="size-[90px] rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold"
              style={{ background: "var(--brand-surface)", color: "var(--brand-text)" }}
            >
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt={profile.display_name ?? profile.username} className="size-full object-cover" />
                : initial}
            </div>
          </div>

          {/* Name */}
          <h1 className="text-[22px] font-bold leading-tight mb-0.5" style={{ color: "var(--brand-text)" }}>
            {profile.display_name || profile.username}
          </h1>
          {profile.display_name && (
            <p className="text-sm mb-3" style={{ color: "var(--brand-muted)" }}>@{profile.username}</p>
          )}

          {/* Bio */}
          {profile.bio && profile.bio.trim() && (
            <p className="text-sm leading-relaxed max-w-[300px] mb-4 whitespace-pre-line"
              style={{ color: "var(--brand-muted)" }}>
              {profile.bio.trim()}
            </p>
          )}

          {/* Social icons */}
          {socialEntries.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-0.5">
              {socialEntries.map(([key, url]) => {
                const meta = SOCIAL_META[key];
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={meta.label}
                    title={meta.label}
                    className="size-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-50"
                    style={{ color: "var(--brand-text)" }}
                  >
                    <svg viewBox="0 0 24 24" className="size-[17px]" fill="currentColor" aria-hidden="true">
                      <path d={meta.path} />
                    </svg>
                  </a>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Featured links ───────────────────────────────────────── */}
        {featuredLinks.length > 0 && (
          <div className="w-full flex flex-col gap-3 mb-3">
            {featuredLinks.map((l: LinkRow) => (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => fetch(`/r/${l.id}`).catch(() => {})}
                className="w-full rounded-2xl overflow-hidden block transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
                style={{
                  background: "rgba(var(--brand-surface-rgb, 255,255,255), 0.15)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1.5px solid var(--brand-accent)",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.10)",
                }}
              >
                {l.image_url ? (
                  <div className="relative w-full aspect-[2.5/1]">
                    <img src={l.image_url} alt={l.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-0.5" style={{ color: "var(--brand-accent)" }}>Featured</p>
                        <p className="text-[15px] font-semibold truncate text-white">{l.title}</p>
                      </div>
                      <span className="text-white/70 shrink-0"><ArrowIcon /></span>
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-0.5" style={{ color: "var(--brand-accent)" }}>Featured</p>
                      <p className="text-[15px] font-semibold truncate" style={{ color: "var(--brand-text)" }}>{l.title}</p>
                    </div>
                    <span style={{ color: "var(--brand-muted)" }}><ArrowIcon /></span>
                  </div>
                )}
              </a>
            ))}
          </div>
        )}

        {/* ── Regular links — show-style cards ────────────────────── */}
        {regularLinks.length > 0 && (
          <div className="w-full flex flex-col gap-2.5">
            {regularLinks.map((l: LinkRow) => (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => fetch(`/r/${l.id}`).catch(() => {})}
                className="w-full h-[64px] rounded-2xl overflow-hidden flex items-stretch transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                }}
              >
                {/* Left accent strip */}
                <div className="w-[4px] shrink-0" style={{ background: "var(--brand-accent)" }} />

                {/* Thumbnail */}
                {l.image_url && (
                  <div className="w-[56px] shrink-0 self-stretch ml-3 my-2 rounded-xl overflow-hidden">
                    <img src={l.image_url} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Title + arrow */}
                <div className="flex-1 min-w-0 px-4 flex items-center justify-between gap-3">
                  <span className="text-[15px] font-semibold truncate" style={{ color: "var(--brand-text)" }}>
                    {l.title}
                  </span>
                  <span style={{ color: "var(--brand-muted)", opacity: 0.6 }}><ArrowIcon /></span>
                </div>
              </a>
            ))}
          </div>
        )}

        {links.length === 0 && (
          <p className="text-center text-sm mt-8" style={{ color: "var(--brand-muted)" }}>No links yet.</p>
        )}

        {/* ── Footer ───────────────────────────────────────────────── */}
        <footer className="mt-auto pt-16 flex justify-center">
          <a
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-opacity hover:opacity-60"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "var(--brand-muted)",
            }}
          >
            <img src="/favicon.png" alt="" className="size-4 opacity-75" />
            <span className="text-xs font-semibold">Made with Widely</span>
          </a>
        </footer>
      </main>
    </div>
  );
}
