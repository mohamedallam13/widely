import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticateApiKey, jsonResponse, corsPreflight, unauthorized } from "@/lib/api-key.server";

const schema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(200),
});

export const Route = createFileRoute("/api/public/v1/links/reorder")({
  server: {
    handlers: {
      OPTIONS: () => corsPreflight(),
      POST: async ({ request }) => {
        const userId = await authenticateApiKey(request);
        if (!userId) return unauthorized();
        let body: unknown;
        try { body = await request.json(); } catch { return jsonResponse({ error: "Invalid JSON" }, 400); }
        const parsed = schema.safeParse(body);
        if (!parsed.success) return jsonResponse({ error: parsed.error.flatten() }, 400);

        // Verify all ids belong to this user before updating
        const { data: existing } = await supabaseAdmin
          .from("links").select("id").eq("user_id", userId);
        const ownedIds = new Set((existing ?? []).map((l) => l.id));
        if (!parsed.data.ids.every((id) => ownedIds.has(id))) {
          return jsonResponse({ error: "One or more link IDs not found" }, 404);
        }

        await Promise.all(
          parsed.data.ids.map((id, position) =>
            supabaseAdmin.from("links").update({ position }).eq("id", id).eq("user_id", userId)
          )
        );

        return jsonResponse({ ok: true });
      },
    },
  },
});
