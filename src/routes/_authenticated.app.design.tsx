import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ImageIcon, Pencil, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyProfile, updateMyProfile } from "@/lib/profile.functions";
import { listLinks } from "@/lib/links.functions";
import { THEMES } from "@/lib/themes";
import { ProfilePreview } from "@/components/ProfilePreview";
import type { PreviewLink } from "@/components/ProfilePreview";

const PRESET_COVERS = [
  { label: "Aurora",       url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&fit=crop&q=80" },
  { label: "Nebula",       url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&fit=crop&q=80" },
  { label: "City Night",   url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&fit=crop&q=80" },
  { label: "Bokeh",        url: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&fit=crop&q=80" },
  { label: "Fog",          url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&fit=crop&q=80" },
  { label: "Ocean",        url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&fit=crop&q=80" },
  { label: "Sand",         url: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&fit=crop&q=80" },
  { label: "Forest",       url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&fit=crop&q=80" },
  { label: "Neon City",    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&fit=crop&q=80" },
  { label: "Dark Minimal", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&fit=crop&q=80" },
];

export const Route = createFileRoute("/_authenticated/app/design")({
  head: () => ({ meta: [{ title: "Design — Widely" }] }),
  component: DesignPage,
});

function DesignPage() {
  const qc = useQueryClient();
  const fetchProfile = useServerFn(getMyProfile);
  const updateP = useServerFn(updateMyProfile);
  const listFn = useServerFn(listLinks);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => fetchProfile(),
  });

  const { data: links = [] } = useQuery({
    queryKey: ["my-links"],
    queryFn: () => listFn() as Promise<PreviewLink[]>,
  });

  const [theme, setTheme] = useState<string>("noir");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  // Title & Bio modal
  const [titleBioOpen, setTitleBioOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBio, setDraftBio] = useState("");
  const [savingTitleBio, setSavingTitleBio] = useState(false);

  function openTitleBio() {
    setDraftTitle(profile?.display_name ?? "");
    setDraftBio((profile as { bio?: string })?.bio ?? "");
    setTitleBioOpen(true);
  }

  async function saveTitleBio() {
    setSavingTitleBio(true);
    try {
      await updateP({ data: { display_name: draftTitle.trim() || null, bio: draftBio.trim() || null } as never });
      qc.invalidateQueries({ queryKey: ["my-profile"] });
      setTitleBioOpen(false);
      toast.success("Saved");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSavingTitleBio(false);
    }
  }

  useEffect(() => {
    if (profile) {
      setTheme(profile.theme || "noir");
      setCoverUrl((profile as { cover_url?: string | null }).cover_url ?? null);
    }
  }, [profile]);

  async function uploadCover(file: File) {
    setCoverUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const ext = file.name.split(".").pop();
      const path = `${user.id}/cover.${ext}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      setCoverUrl(publicUrl);
      await updateP({ data: { cover_url: publicUrl } });
      qc.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Cover photo saved");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setCoverUploading(false);
    }
  }

  async function removeCover() {
    setCoverUrl(null);
    await updateP({ data: { cover_url: null } });
    qc.invalidateQueries({ queryKey: ["my-profile"] });
    toast.success("Cover photo removed");
  }

  async function saveTheme(value: string) {
    setTheme(value);
    try {
      await updateP({ data: { theme: value as "noir" | "neon" | "midnight" | "bone" | "indigo_mist" | "sunset" | "forest" | "mono" } });
      qc.invalidateQueries({ queryKey: ["my-profile"] });
      toast.success("Theme saved");
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to save theme");
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="grid md:grid-cols-[minmax(0,1fr)_340px] gap-8">
      <div>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Design</h1>
          <p className="text-sm text-muted-foreground">Choose a theme for your public page.</p>
        </div>

        <div className="space-y-8">

          {/* Title & Bio */}
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4 font-semibold">
              Title &amp; Bio
            </label>
            <button
              type="button"
              onClick={openTitleBio}
              className="w-full flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-left hover:bg-secondary transition"
            >
              <div className="min-w-0">
                <p className="font-semibold truncate">
                  {profile?.display_name || `@${profile?.username}`}
                </p>
                <p className="text-sm text-muted-foreground truncate mt-0.5">
                  {(profile as { bio?: string })?.bio || "Add a bio…"}
                </p>
              </div>
              <Pencil className="size-4 text-muted-foreground ml-4 shrink-0" />
            </button>
          </div>

          {/* Cover photo */}
          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4 font-semibold">
              Cover Photo
            </label>
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); e.target.value = ""; }}
            />

            {/* Preview strip */}
            {coverUrl && (
              <div className="relative rounded-2xl overflow-hidden aspect-[3/1] w-full mb-4">
                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            {/* Picker grid */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">

              {/* None */}
              <button type="button" onClick={removeCover}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition text-xs font-medium
                  ${!coverUrl ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-muted-foreground/40"}`}>
                <X className="size-4" />
                None
              </button>

              {/* Upload */}
              <button type="button" onClick={() => coverInputRef.current?.click()} disabled={coverUploading}
                className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition text-xs font-medium border-dashed
                  ${coverUrl && PRESET_COVERS.every(p => p.url !== coverUrl) ? "border-primary text-primary" : "border-border text-muted-foreground hover:border-muted-foreground/40"} disabled:opacity-50`}>
                <ImageIcon className="size-4" />
                {coverUploading ? "…" : "Upload"}
              </button>

              {/* Presets */}
              {PRESET_COVERS.map((preset) => (
                <button
                  key={preset.url}
                  type="button"
                  onClick={async () => {
                    setCoverUrl(preset.url);
                    await updateP({ data: { cover_url: preset.url } });
                    qc.invalidateQueries({ queryKey: ["my-profile"] });
                  }}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition relative
                    ${coverUrl === preset.url ? "border-primary" : "border-transparent hover:border-muted-foreground/40"}`}
                  title={preset.label}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  {coverUrl === preset.url && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="size-5 rounded-full bg-primary flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Fades into your theme background on the public page.</p>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-4 font-semibold">
              Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => saveTheme(t.value)}
                  className={`relative rounded-2xl p-4 border-2 text-left transition ${
                    theme === t.value ? "border-primary" : "border-border hover:border-muted-foreground/40"
                  }`}
                >
                  <div className="flex gap-1.5 mb-2">
                    <span className="size-5 rounded-full border border-border" style={{ background: t.swatch[0] }} />
                    <span className="size-5 rounded-full border border-border" style={{ background: t.swatch[1] }} />
                  </div>
                  <span className="text-sm font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {profile?.username && (
        <ProfilePreview
          username={profile.username}
          links={links}
          profile={profile}
          themeOverride={theme}
        />
      )}

      {/* Title & Bio modal */}
      {titleBioOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setTitleBioOpen(false)}>
          <div className="w-full max-w-md bg-card rounded-3xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">Title and bio</h2>
              <button type="button" onClick={() => setTitleBioOpen(false)} className="text-muted-foreground hover:text-foreground transition">
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-border bg-background px-4 pt-3 pb-3">
                <label className="block text-xs text-muted-foreground mb-1">Title</label>
                <input
                  type="text"
                  maxLength={30}
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder={`@${profile?.username}`}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
                <p className="text-xs text-muted-foreground text-right mt-1">{draftTitle.length} / 30</p>
              </div>

              <div className="rounded-2xl border border-border bg-background px-4 pt-3 pb-3">
                <label className="block text-xs text-muted-foreground mb-1">Bio</label>
                <textarea
                  maxLength={160}
                  rows={3}
                  value={draftBio}
                  onChange={(e) => setDraftBio(e.target.value)}
                  placeholder="Tell people about yourself…"
                  className="w-full bg-transparent text-sm focus:outline-none resize-none"
                />
                <p className="text-xs text-muted-foreground text-right">{draftBio.length} / 160</p>
              </div>

              <button
                type="button"
                onClick={saveTitleBio}
                disabled={savingTitleBio}
                className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-50"
              >
                {savingTitleBio ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
