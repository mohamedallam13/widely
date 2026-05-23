import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticateApiKey, jsonResponse, corsPreflight, unauthorized } from "@/lib/api-key.server";

const patchSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  url: z.string().url().max(2048).optional(),
  featured: z.boolean().optional(),
  visible: z.boolean().optional(),
  position: z.number().int().min(0).optional(),
  image_url: z.string().url().max(2048).nullable().optional(),
});

export const Route = createFileRoute("/api/public/v1/links/$id")({
  server: {
    handlers: {
      OPTIONS: () => corsPreflight(),
      GET: async ({ request, params }) => {
        const userId = await authenticateApiKey(request);
        if (!userId) return unauthorized();
        const { data, error } = await supabaseAdmin
          .from("links").select("id, title, url, featured, visible, position, image_url, click_count, created_at")
          .eq("id", params.id).eq("user_id", userId).maybeSingle();
        if (error) return jsonResponse({ error: error.message }, 500);
        if (!data) return jsonResponse({ error: "Not found" }, 404);
        return jsonResponse({ data });
      },
      PATCH: async ({ request, params }) => {
        const userId = await authenticateApiKey(request);
        if (!userId) return unauthorized();
        let body: unknown;
        try { body = await request.json(); } catch { return jsonResponse({ error: "Invalid JSON" }, 400); }
        const parsed = patchSchema.safeParse(body);
        if (!parsed.success) return jsonResponse({ error: parsed.error.flatten() }, 400);
        const { data, error } = await supabaseAdmin
          .from("links").update(parsed.data)
          .eq("id", params.id).eq("user_id", userId)
          .select("id, title, url, featured, visible, position, image_url, click_count, created_at").maybeSingle();
        if (error) return jsonResponse({ error: error.message }, 500);
        if (!data) return jsonResponse({ error: "Not found" }, 404);
        return jsonResponse({ data });
      },
      DELETE: async ({ request, params }) => {
        const userId = await authenticateApiKey(request);
        if (!userId) return unauthorized();
        const { error } = await supabaseAdmin
          .from("links").delete().eq("id", params.id).eq("user_id", userId);
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ ok: true });
      },
    },
  },
});
