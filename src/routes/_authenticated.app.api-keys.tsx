import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { listApiKeys, createApiKey, revokeApiKey } from "@/lib/api-keys.functions";
import { Copy, Plus, ChevronDown, ChevronUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/app/api-keys")({
  head: () => ({ meta: [{ title: "API — Widely" }] }),
  component: ApiKeysPage,
});

const BASE = typeof window !== "undefined" ? window.location.origin : "https://widely.app";

const GAS_SNIPPET = `// ── Widely API helper ──────────────────────────────────────────
const WIDELY_KEY = "lv_live_YOUR_KEY_HERE"; // paste your key
const BASE = "${BASE}/api/public/v1";

function widelyFetch(path, method, body) {
  const opts = {
    method: method || "GET",
    headers: {
      "Authorization": "Bearer " + WIDELY_KEY,
      "Content-Type": "application/json",
    },
    muteHttpExceptions: true,
  };
  if (body) opts.payload = JSON.stringify(body);
  const res = UrlFetchApp.fetch(BASE + path, opts);
  return JSON.parse(res.getContentText());
}

// ── Examples ────────────────────────────────────────────────────

function listMyLinks() {
  const { data } = widelyFetch("/links");
  Logger.log(data);
}

function toggleLink(linkId, visible) {
  // visible = true | false
  widelyFetch("/links/" + linkId, "PATCH", { visible });
}

function setFeatured(linkId, featured) {
  widelyFetch("/links/" + linkId, "PATCH", { featured });
}

function addLink(title, url) {
  const { data } = widelyFetch("/links", "POST", { title, url });
  Logger.log("Created:", data.id);
  return data.id;
}

function deleteLink(linkId) {
  widelyFetch("/links/" + linkId, "DELETE");
}

function reorderLinks(orderedIds) {
  // pass array of link IDs in the order you want them displayed
  widelyFetch("/links/reorder", "POST", { ids: orderedIds });
}

function updateBio(bio) {
  widelyFetch("/profile", "PATCH", { bio });
}

function setTheme(theme) {
  // themes: noir | neon | midnight | bone | indigo_mist | sunset | forest | mono
  widelyFetch("/profile", "PATCH", { theme });
}`;

const ENDPOINTS = [
  {
    method: "GET", path: "/links",
    desc: "List all your links in position order.",
    response: `{ data: [{ id, title, url, featured, visible, position, image_url, click_count, created_at }] }`,
  },
  {
    method: "POST", path: "/links",
    desc: "Create a new link.",
    body: `{ "title": "My link", "url": "https://example.com", "featured": false }`,
    response: `{ data: { id, title, url, … } }  // 201 Created`,
  },
  {
    method: "PATCH", path: "/links/:id",
    desc: "Update any field on a link. All fields optional.",
    body: `{ "visible": false, "featured": true, "title": "New title", "url": "https://…", "position": 0 }`,
    response: `{ data: { id, title, url, … } }`,
  },
  {
    method: "DELETE", path: "/links/:id",
    desc: "Delete a link permanently.",
    response: `{ ok: true }`,
  },
  {
    method: "POST", path: "/links/reorder",
    desc: "Reorder all links by passing an array of IDs in the desired display order.",
    body: `{ "ids": ["uuid-1", "uuid-2", "uuid-3"] }`,
    response: `{ ok: true }`,
  },
  {
    method: "GET", path: "/profile",
    desc: "Get your profile.",
    response: `{ data: { username, display_name, bio, avatar_url, theme, socials } }`,
  },
  {
    method: "PATCH", path: "/profile",
    desc: "Update your profile.",
    body: `{ "bio": "new bio", "theme": "midnight", "display_name": "CC", "socials": { "instagram": "https://…" } }`,
    response: `{ data: { username, display_name, bio, … } }`,
  },
];

const METHOD_COLOR: Record<string, string> = {
  GET: "bg-blue-500/15 text-blue-400",
  POST: "bg-green-500/15 text-green-400",
  PATCH: "bg-amber-500/15 text-amber-400",
  DELETE: "bg-red-500/15 text-red-400",
};

function copy(text: string, label = "Copied") {
  navigator.clipboard.writeText(text).then(() => toast.success(label));
}

function EndpointRow({ ep }: { ep: typeof ENDPOINTS[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/40 transition text-left"
      >
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded font-mono shrink-0 ${METHOD_COLOR[ep.method]}`}>
          {ep.method}
        </span>
        <code className="text-sm font-mono flex-1">/api/public/v1{ep.path}</code>
        {open ? <ChevronUp className="size-4 text-muted-foreground shrink-0" /> : <ChevronDown className="size-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3">
          <p className="text-sm text-muted-foreground">{ep.desc}</p>
          {"body" in ep && ep.body && (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Body</p>
              <pre className="text-xs bg-secondary rounded-xl px-3 py-2.5 overflow-x-auto">{ep.body}</pre>
            </div>
          )}
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Response</p>
            <pre className="text-xs bg-secondary rounded-xl px-3 py-2.5 overflow-x-auto">{ep.response}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

function ApiKeysPage() {
  const qc = useQueryClient();
  const list = useServerFn(listApiKeys);
  const create = useServerFn(createApiKey);
  const revoke = useServerFn(revokeApiKey);

  const { data: keys = [] } = useQuery({ queryKey: ["api-keys"], queryFn: () => list() });
  const [label, setLabel] = useState("");
  const [justCreated, setJustCreated] = useState<string | null>(null);
  const [showGas, setShowGas] = useState(false);

  const createM = useMutation({
    mutationFn: () => create({ data: { label } }),
    onSuccess: (r) => { setJustCreated(r.raw); setLabel(""); qc.invalidateQueries({ queryKey: ["api-keys"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const revokeM = useMutation({
    mutationFn: (id: string) => revoke({ data: { id } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["api-keys"] }); toast.success("Key revoked"); },
  });

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">API</h1>
        <p className="text-sm text-muted-foreground">
          Control your links programmatically — from Google Apps Script, cron jobs, or any HTTP client.
          All requests use <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">Bearer</code> auth.
        </p>
      </div>

      {/* Key management */}
      <section className="mb-8">
        <h2 className="text-base font-semibold mb-3">API Keys</h2>

        <form
          onSubmit={(e) => { e.preventDefault(); if (label) createM.mutate(); }}
          className="bg-card border border-border rounded-2xl p-4 mb-4 flex gap-2"
        >
          <input
            value={label} onChange={(e) => setLabel(e.target.value)}
            placeholder="Label — e.g. GAS Cron, CC Dashboard"
            maxLength={60}
            className="flex-1 bg-background border border-border rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            disabled={createM.isPending || !label}
            className="rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5 shrink-0"
          >
            <Plus className="size-4" /> Create
          </button>
        </form>

        {justCreated && (
          <div className="rounded-2xl border border-accent bg-accent/10 p-4 mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">
              Save this key — it won't show again
            </p>
            <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 font-mono text-xs">
              <span className="flex-1 truncate">{justCreated}</span>
              <button
                onClick={() => copy(justCreated, "Key copied")}
                className="p-1.5 rounded-lg hover:bg-secondary shrink-0"
              >
                <Copy className="size-4" />
              </button>
            </div>
            <button onClick={() => setJustCreated(null)} className="text-xs text-muted-foreground underline mt-2">
              I've saved it
            </button>
          </div>
        )}

        {keys.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8 border border-dashed border-border rounded-2xl">
            No keys yet. Create one above.
          </p>
        ) : (
          <ul className="space-y-2">
            {keys.map((k) => (
              <li key={k.id} className="bg-card border border-border rounded-2xl px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{k.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{k.key_prefix}</p>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block shrink-0">
                  {k.revoked_at ? "Revoked" : k.last_used_at ? `Used ${new Date(k.last_used_at).toLocaleDateString()}` : "Never used"}
                </p>
                {!k.revoked_at && (
                  <button
                    onClick={() => confirm("Revoke this key? It stops working immediately.") && revokeM.mutate(k.id)}
                    className="text-xs px-3 py-1.5 rounded-full hover:bg-destructive/10 text-destructive shrink-0"
                  >
                    Revoke
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Endpoints */}
      <section className="mb-8">
        <h2 className="text-base font-semibold mb-3">Endpoints</h2>
        <div className="space-y-2">
          {ENDPOINTS.map((ep) => <EndpointRow key={ep.method + ep.path} ep={ep} />)}
        </div>
      </section>

      {/* GAS Snippet */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Google Apps Script snippet</h2>
          <button
            onClick={() => setShowGas(o => !o)}
            className="text-xs px-3 py-1.5 rounded-full hover:bg-secondary text-muted-foreground transition"
          >
            {showGas ? "Hide" : "Show"}
          </button>
        </div>
        {showGas && (
          <div className="relative">
            <button
              onClick={() => copy(GAS_SNIPPET, "GAS snippet copied")}
              className="absolute top-3 right-3 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-background/80 backdrop-blur border border-border hover:bg-secondary transition"
            >
              <Copy className="size-3" /> Copy
            </button>
            <pre className="text-xs bg-card border border-border rounded-2xl p-5 overflow-x-auto leading-relaxed pr-20">
              {GAS_SNIPPET}
            </pre>
          </div>
        )}
        {!showGas && (
          <p className="text-sm text-muted-foreground">
            Drop into any Google Apps Script project. Paste your key, call <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">toggleLink(id, false)</code> or any helper directly.
          </p>
        )}
      </section>
    </div>
  );
}
