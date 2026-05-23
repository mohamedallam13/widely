import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticateApiKey, jsonResponse, corsPreflight, unauthorized } from "@/lib/api-key.server";

const createSchema = z.object({
  title: z.string().min(1).max(120),
  url: z.string().url().max(2048),
  featured: z.boolean().optional(),
});

export const Route = createFileRoute("/api/public/v1/links")({
  server: {
    handlers: {
      OPTIONS: () => corsPreflight(),
      GET: async ({ request }) => {
        const userId = await authenticateApiKey(request);
        if (!userId) return unauthorized();
        const { data, error } = await supabaseAdmin
          .from("links")
          .select("id, title, url, featured, visible, position, image_url, click_count, created_at")
          .eq("user_id", userId)
          .order("position", { ascending: true });
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ data });
      },
      POST: async ({ request }) => {
        const userId = await authenticateApiKey(request);
        if (!userId) return unauthorized();
        let body: unknown;
        try { body = await request.json(); } catch { return jsonResponse({ error: "Invalid JSON" }, 400); }
        const parsed = createSchema.safeParse(body);
        if (!parsed.success) return jsonResponse({ error: parsed.error.flatten() }, 400);
        const { count } = await supabaseAdmin
          .from("links").select("id", { count: "exact", head: true }).eq("user_id", userId);
        const { data, error } = await supabaseAdmin
          .from("links")
          .insert({
            user_id: userId,
            title: parsed.data.title,
            url: parsed.data.url,
            featured: parsed.data.featured ?? false,
            position: count ?? 0,
          })
          .select("id, title, url, featured, visible, position, image_url, click_count, created_at")
          .single();
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ data }, 201);
      },
    },
  },
});
