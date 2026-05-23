import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { listLinks, createLink, updateLink, deleteLink, reorderLinks } from "@/lib/links.functions";
import { getMyProfile, updateMyProfile } from "@/lib/profile.functions";
import { ProfilePreview } from "@/components/ProfilePreview";
import { supabase } from "@/integrations/supabase/client";
import {
  Star, Trash2, Plus, ExternalLink, GripVertical, Check, Pencil,
  Image as ImageIcon, Loader2, X, BarChart2, Camera, Globe, Mail,
} from "lucide-react";
import {
  SiInstagram, SiTiktok, SiX, SiFacebook, SiYoutube,
  SiGithub, SiWhatsapp,
} from "react-icons/si";

function SiLinkedin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const Route = createFileRoute("/_authenticated/app/links")({
  head: () => ({ meta: [{ title: "Links — Widely" }] }),
  component: LinksPage,
});

type Link = {
  id: string;
  title: string;
  url: string;
  featured: boolean;
  visible: boolean;
  position: number;
  click_count: number;
  image_url: string | null;
  created_at: string;
};

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/you", Icon: SiInstagram },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@you", Icon: SiTiktok },
  { key: "x", label: "X / Twitter", placeholder: "https://x.com/you", Icon: SiX },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/you", Icon: SiFacebook },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@you", Icon: SiYoutube },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/you", Icon: SiLinkedin },
  { key: "github", label: "GitHub", placeholder: "https://github.com/you", Icon: SiGithub },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/123456789", Icon: SiWhatsapp },
  { key: "email", label: "Email", placeholder: "mailto:you@example.com", Icon: Mail },
  { key: "website", label: "Website", placeholder: "https://yoursite.com", Icon: Globe },
] as const;

function LinksPage() {
  const qc = useQueryClient();
  const listFn = useServerFn(listLinks);
  const createFn = useServerFn(createLink);
  const updateFn = useServerFn(updateLink);
  const removeFn = useServerFn(deleteLink);
  const reorderFn = useServerFn(reorderLinks);
  const fetchProfile = useServerFn(getMyProfile);
  const updateProfileFn = useServerFn(updateMyProfile);

  const { data: links = [], isLoading } = useQuery({
    queryKey: ["my-links"],
    queryFn: () => listFn() as Promise<Link[]>,
  });

  const { data: profile } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => fetchProfile(),
  });

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>({});

  // Modals
  const [bioModalOpen, setBioModalOpen] = useState(false);
  const [socialsModalOpen, setSocialsModalOpen] = useState(false);

  const invalidateLinks = () => qc.invalidateQueries({ queryKey: ["my-links"] });
  const invalidateProfile = () => qc.invalidateQueries({ queryKey: ["my-profile"] });

  const addM = useMutation({
    mutationFn: (v: { title: string; url: string }) => createFn({ data: v }),
    onSuccess: () => { setTitle(""); setUrl(""); invalidateLinks(); toast.success("Link added"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updM = useMutation({
    mutationFn: (v: { id: string; title?: string; url?: string; featured?: boolean; visible?: boolean; position?: number; image_url?: string | null }) =>
      updateFn({ data: v }),
    onSuccess: (_, vars) => {
      // skip refetch for visible-only toggles — local state handles UI
      const keys = Object.keys(vars).filter(k => k !== "id");
      if (!(keys.length === 1 && keys[0] === "visible")) invalidateLinks();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delM = useMutation({
    mutationFn: (id: string) => removeFn({ data: { id } }),
    onSuccess: () => { invalidateLinks(); toast.success("Deleted"); },
  });

  const reorderM = useMutation({
    mutationFn: (ids: string[]) => reorderFn({ data: { ids } }),
    onSuccess: invalidateLinks,
  });

  type ProfilePatch = {
    display_name?: string; bio?: string; avatar_url?: string | null;
    theme?: "noir"; socials?: Record<string, string>;
  };
  const profileM = useMutation({
    mutationFn: (data: ProfilePatch) => updateProfileFn({ data } as never),
    onSuccess: () => { invalidateProfile(); toast.success("Saved"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIdx = links.findIndex((l) => l.id === active.id);
    const newIdx = links.findIndex((l) => l.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    const next = arrayMove(links, oldIdx, newIdx);
    qc.setQueryData(["my-links"], next);
    reorderM.mutate(next.map((l) => l.id));
  }

  const username = profile?.username;
  const socials = (profile?.socials as Record<string, string>) ?? {};
  const filledSocials = SOCIAL_PLATFORMS.filter((p) => socials[p.key]);

  return (
    <>
      <div className="grid md:grid-cols-[minmax(0,1fr)_340px] gap-8">
        <div>
          {/* Profile header */}
          <ProfileHeader
            profile={profile}
            onAvatarUpdate={(url) => profileM.mutate({ avatar_url: url })}
            onOpenBio={() => setBioModalOpen(true)}
            onOpenSocials={() => setSocialsModalOpen(true)}
            filledSocials={filledSocials}
            socials={socials}
          />

          <div className="mt-6 mb-4">
            <h2 className="text-xl font-bold mb-1">Links</h2>
            <p className="text-sm text-muted-foreground">Drag to reorder · click to edit</p>
          </div>

          {!showAdd ? (
            <button
              onClick={() => setShowAdd(true)}
              className="w-full rounded-full bg-primary text-primary-foreground px-6 py-4 text-base font-semibold hover:opacity-90 transition inline-flex items-center justify-center gap-2 mb-6 shadow-sm"
            >
              <Plus className="size-5" /> Add link
            </button>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (title && url) addM.mutate({ title, url }, { onSuccess: () => setShowAdd(false) });
              }}
              className="bg-card border border-border rounded-2xl p-4 mb-6 space-y-3"
            >
              <input
                value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (My newsletter)"
                autoFocus
                className="w-full bg-background border border-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                required maxLength={120}
              />
              <input
                value={url} onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-background border border-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAdd(false); setTitle(""); setUrl(""); }}
                  className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary transition"
                >
                  Cancel
                </button>
                <button
                  disabled={addM.isPending}
                  className="flex-1 rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center justify-center gap-1.5"
                >
                  <Plus className="size-4" /> Add link
                </button>
              </div>
            </form>
          )}

          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-12">Loading…</p>
          ) : links.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl">
              <p className="text-muted-foreground text-sm">No links yet. Add your first above.</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={links.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                <ul className="space-y-3">
                  {links.map((l) => (
                    <SortableRow
                      key={l.id}
                      link={l}
                      onUpdate={(patch) => {
                        if ("visible" in patch) setVisibilityMap(m => ({ ...m, [l.id]: patch.visible! }));
                        updM.mutate({ id: l.id, ...patch });
                      }}
                      onDelete={() => confirm("Delete this link?") && delM.mutate(l.id)}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {username && (
          <ProfilePreview
            username={username}
            links={links.map(l => ({
              ...l,
              visible: l.id in visibilityMap ? visibilityMap[l.id] : l.visible !== false,
            }))}
            profile={profile}
          />
        )}
      </div>

      {/* Bio modal */}
      {bioModalOpen && (
        <BioModal
          initialBio={profile?.bio ?? ""}
          onSave={(bio) => { profileM.mutate({ bio }); setBioModalOpen(false); }}
          onClose={() => setBioModalOpen(false)}
        />
      )}

      {/* Socials modal */}
      {socialsModalOpen && (
        <SocialsModal
          initialSocials={socials}
          onSave={(s) => { profileM.mutate({ socials: s }); setSocialsModalOpen(false); }}
          onClose={() => setSocialsModalOpen(false)}
        />
      )}
    </>
  );
}

/* ─── Profile Header ─────────────────────────────────────────────────────── */

type ProfileData = {
  username?: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string | null;
  socials?: unknown;
} | null | undefined;

function ProfileHeader({
  profile,
  onAvatarUpdate,
  onOpenBio,
  onOpenSocials,
  filledSocials,
  socials,
}: {
  profile: ProfileData;
  onAvatarUpdate: (url: string) => void;
  onOpenBio: () => void;
  onOpenSocials: () => void;
  filledSocials: (typeof SOCIAL_PLATFORMS)[number][];
  socials: Record<string, string>;
}) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { cacheControl: "3600", upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
      onAvatarUpdate(publicUrl);
      toast.success("Profile picture updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const initials = ((profile?.display_name || profile?.username || "?").slice(0, 1)).toUpperCase();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-start gap-4">
      {/* Avatar */}
      <div className="relative shrink-0 group">
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
            e.target.value = "";
          }}
        />
        <div className="size-16 rounded-full overflow-hidden bg-secondary border border-border flex items-center justify-center">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-xl font-bold text-muted-foreground">{initials}</span>
          )}
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
          aria-label="Change profile picture"
        >
          {uploading ? <Loader2 className="size-4 text-white animate-spin" /> : <Camera className="size-4 text-white" />}
        </button>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-base truncate">{profile?.display_name || `@${profile?.username}`}</p>
        {profile?.display_name && (
          <p className="text-xs text-muted-foreground">@{profile.username}</p>
        )}

        {/* Bio */}
        <button
          onClick={onOpenBio}
          className="group mt-1.5 text-left w-full"
          title="Edit bio"
        >
          <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition">
            {profile?.bio || <span className="italic">Add a bio…</span>}
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-accent opacity-0 group-hover:opacity-100 transition mt-0.5">
            <Pencil className="size-3" /> Edit bio
          </span>
        </button>

        {/* Social icons + edit */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {filledSocials.map((p) => (
            <a
              key={p.key}
              href={socials[p.key]}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-full hover:bg-secondary transition text-muted-foreground hover:text-foreground"
              title={p.label}
            >
              <p.Icon className="size-4" />
            </a>
          ))}
          <button
            onClick={onOpenSocials}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border hover:bg-secondary transition text-muted-foreground"
          >
            <Pencil className="size-3" />
            {filledSocials.length > 0 ? "Edit socials" : "Add socials"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Bio Modal ─────────────────────────────────────────────────────────── */

function BioModal({ initialBio, onSave, onClose }: {
  initialBio: string;
  onSave: (bio: string) => void;
  onClose: () => void;
}) {
  const [bio, setBio] = useState(initialBio);

  return (
    <Modal title="Edit bio" onClose={onClose}>
      <div className="space-y-4">
        <textarea
          autoFocus
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={400}
          rows={4}
          placeholder="Tell people a bit about yourself…"
          className="w-full bg-background border border-border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
        />
        <p className="text-[11px] text-muted-foreground">{bio.length}/400</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-secondary transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(bio)}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
          >
            Save bio
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Socials Modal ─────────────────────────────────────────────────────── */

function SocialsModal({ initialSocials, onSave, onClose }: {
  initialSocials: Record<string, string>;
  onSave: (socials: Record<string, string>) => void;
  onClose: () => void;
}) {
  const [socials, setSocials] = useState<Record<string, string>>(initialSocials);

  function handleSave() {
    const cleaned: Record<string, string> = {};
    for (const [k, v] of Object.entries(socials)) {
      const t = v.trim();
      if (t) cleaned[k] = t;
    }
    onSave(cleaned);
  }

  return (
    <Modal title="Social links" onClose={onClose}>
      <div className="space-y-3">
        {SOCIAL_PLATFORMS.map((p) => (
          <div key={p.key} className="flex items-center gap-3">
            <div className="w-8 flex justify-center text-muted-foreground shrink-0">
              <p.Icon className="size-4" />
            </div>
            <input
              value={socials[p.key] || ""}
              onChange={(e) => setSocials((s) => ({ ...s, [p.key]: e.target.value }))}
              placeholder={p.placeholder}
              className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        ))}
        <div className="flex gap-2 justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-border text-sm font-medium hover:bg-secondary transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition"
          >
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Modal wrapper ─────────────────────────────────────────────────────── */

function Modal({ title, children, onClose }: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-secondary transition text-muted-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}


/* ─── Sortable Link Row ──────────────────────────────────────────────────── */

function SortableRow({
  link,
  onUpdate,
  onDelete,
}: {
  link: Link;
  onUpdate: (patch: { title?: string; url?: string; featured?: boolean; visible?: boolean; image_url?: string | null }) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const [editing, setEditing] = useState<null | "title" | "url">(null);
  const [title, setTitle] = useState(link.title);
  const [url, setUrl] = useState(link.url);
  const [uploading, setUploading] = useState(false);
  const [isVisible, setIsVisible] = useState(link.visible !== false);
  const fileRef = useRef<HTMLInputElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  function commit(field: "title" | "url", value: string) {
    setEditing(null);
    const original = field === "title" ? link.title : link.url;
    if (value.trim() && value !== original) {
      onUpdate({ [field]: value });
    } else {
      if (field === "title") setTitle(link.title);
      else setUrl(link.url);
    }
  }

  async function handleUpload(file: File) {
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/${link.id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("link-images").upload(path, file, {
        cacheControl: "3600", upsert: true, contentType: file.type,
      });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("link-images").getPublicUrl(path);
      onUpdate({ image_url: publicUrl });
      toast.success("Cover image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`group bg-card border rounded-2xl overflow-hidden flex ${
        isDragging ? "border-accent shadow-lg" : "border-border"
      } ${!isVisible ? "opacity-60" : ""}`}
    >
      <button
        {...attributes}
        {...listeners}
        className="flex items-center justify-center px-2 text-muted-foreground hover:bg-secondary cursor-grab active:cursor-grabbing touch-none shrink-0"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-5" />
      </button>


      <div className="flex-1 min-w-0 p-4 pl-2">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0 space-y-0.5">
            <EditableField
              value={title}
              onChange={setTitle}
              editing={editing === "title"}
              onStartEdit={() => setEditing("title")}
              onCommit={(v) => commit("title", v)}
              className="font-bold text-base"
              maxLength={120}
              placeholder="Title"
            />
            <EditableField
              value={url}
              onChange={setUrl}
              editing={editing === "url"}
              onStartEdit={() => setEditing("url")}
              onCommit={(v) => commit("url", v)}
              className="text-sm text-muted-foreground"
              placeholder="https://…"
            />
          </div>

          {/* Visibility toggle */}
          <button
            onClick={() => { setIsVisible((v) => !v); onUpdate({ visible: !isVisible }); }}
            role="switch"
            aria-checked={isVisible}
            title={isVisible ? "Visible — click to hide" : "Hidden — click to show"}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              isVisible ? "bg-green-500" : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                isVisible ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-0.5">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleUpload(f);
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className={`p-2 rounded-full transition hover:bg-secondary hover:text-foreground ${link.image_url ? "text-accent" : ""}`}
              title={link.image_url ? "Change cover image" : "Add cover image"}
            >
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <ImageIcon className="size-4" />}
            </button>

            <button
              onClick={() => onUpdate({ featured: !link.featured })}
              className={`p-2 rounded-full transition ${
                link.featured ? "text-amber-400 hover:text-amber-500" : "hover:bg-secondary hover:text-foreground"
              }`}
              title={link.featured ? "Featured — click to unfeature" : "Feature this link"}
            >
              <Star className="size-4" fill={link.featured ? "currentColor" : "none"} />
            </button>

            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full hover:bg-secondary hover:text-foreground transition"
              title="Open link"
            >
              <ExternalLink className="size-4" />
            </a>

            <span className="flex items-center gap-1 px-2 text-xs tabular-nums">
              <BarChart2 className="size-3.5" />
              {link.click_count} clicks
            </span>
          </div>

          <button
            onClick={onDelete}
            className="p-2 rounded-full hover:bg-destructive/10 hover:text-destructive transition"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </li>
  );
}

/* ─── Editable Field ────────────────────────────────────────────────────── */

function EditableField({
  value, onChange, editing, onStartEdit, onCommit,
  className = "", maxLength, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  editing: boolean;
  onStartEdit: () => void;
  onCommit: (v: string) => void;
  className?: string;
  maxLength?: number;
  placeholder?: string;
}) {
  if (editing) {
    return (
      <div className="flex items-center gap-1.5">
        <input
          autoFocus
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onCommit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") onCommit(value);
          }}
          maxLength={maxLength}
          placeholder={placeholder}
          className={`w-full bg-background border border-accent rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-accent ${className}`}
        />
        <Check className="size-3.5 text-accent shrink-0" />
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onStartEdit}
      className={`group w-full text-left flex items-center gap-1.5 rounded-md px-2 py-1 -mx-2 hover:bg-secondary/50 transition ${className}`}
    >
      <span className="truncate">{value || <span className="text-muted-foreground italic">{placeholder}</span>}</span>
      <Pencil className="size-3 opacity-0 group-hover:opacity-60 shrink-0" />
    </button>
  );
}
