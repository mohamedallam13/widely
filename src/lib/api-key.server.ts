// Server-only helpers for API key generation + verification.
// Hashed with SHA-256 using Web Crypto (works on Cloudflare Workers runtime).

import { supabaseAdmin } from "@/integrations/supabase/client.server";

const KEY_PREFIX = "lv_live_";

function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

export async function hashKey(rawKey: string): Promise<string> {
  const data = new TextEncoder().encode(rawKey);
  const hashed = await crypto.subtle.digest("SHA-256", data);
  return toHex(hashed);
}

export function generateRawKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  // base36-ish: hex is fine and URL-safe
  let body = "";
  for (let i = 0; i < bytes.length; i++) body += bytes[i].toString(16).padStart(2, "0");
  return `${KEY_PREFIX}${body}`;
}

export function previewKey(rawKey: string): string {
  return rawKey.slice(0, KEY_PREFIX.length + 6) + "…";
}

/** Validate Bearer token; returns owner user_id or null. */
export async function authenticateApiKey(request: Request): Promise<string | null> {
  const header = request.headers.get("authorization");
  if (!header || !header.toLowerCase().startsWith("bearer ")) return null;
  const raw = header.slice(7).trim();
  if (!raw.startsWith(KEY_PREFIX)) return null;

  const hash = await hashKey(raw);
  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("id, user_id, revoked_at")
    .eq("key_hash", hash)
    .maybeSingle();

  if (error || !data || data.revoked_at) return null;

  // fire-and-forget last_used_at update
  void supabaseAdmin
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return data.user_id;
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
      "access-control-allow-headers": "authorization,content-type",
    },
  });
}

export function corsPreflight(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET,POST,PATCH,PUT,DELETE,OPTIONS",
      "access-control-allow-headers": "authorization,content-type",
      "access-control-max-age": "86400",
    },
  });
}

export function unauthorized(): Response {
  return jsonResponse({ error: "Unauthorized" }, 401);
}
