import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticateApiKey, jsonResponse, corsPreflight, unauthorized } from "@/lib/api-key.server";

const patchSchema = z.object({
  display_name: z.string().max(80).optional(),
  bio: z.string().max(400).optional(),
  theme: z.enum(["noir", "neon", "midnight", "bone", "indigo_mist", "sunset", "forest", "mono"]).optional(),
  socials: z.record(z.string().min(1).max(40), z.string().max(2048)).optional(),
});

export const Route = createFileRoute("/api/public/v1/profile")({
  server: {
    handlers: {
      OPTIONS: () => corsPreflight(),
      GET: async ({ request }) => {
        const userId = await authenticateApiKey(request);
        if (!userId) return unauthorized();
        const { data, error } = await supabaseAdmin
          .from("profiles")
          .select("username, display_name, bio, avatar_url, theme, socials")
          .eq("id", userId)
          .maybeSingle();
        if (error) return jsonResponse({ error: error.message }, 500);
        if (!data) return jsonResponse({ error: "Not found" }, 404);
        return jsonResponse({ data });
      },
      PATCH: async ({ request }) => {
        const userId = await authenticateApiKey(request);
        if (!userId) return unauthorized();
        let body: unknown;
        try { body = await request.json(); } catch { return jsonResponse({ error: "Invalid JSON" }, 400); }
        const parsed = patchSchema.safeParse(body);
        if (!parsed.success) return jsonResponse({ error: parsed.error.flatten() }, 400);
        const { data, error } = await supabaseAdmin
          .from("profiles")
          .update(parsed.data)
          .eq("id", userId)
          .select("username, display_name, bio, avatar_url, theme, socials")
          .maybeSingle();
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ data });
      },
    },
  },
});
