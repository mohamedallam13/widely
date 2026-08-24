import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticateApiKey, jsonResponse, corsPreflight, unauthorized } from "@/lib/api-key.server";

const MAX_LIMIT = 200;
const DEFAULT_LIMIT = 50;

export const Route = createFileRoute("/api/public/v1/links/$id/clicks")({
  server: {
    handlers: {
      OPTIONS: () => corsPreflight(),
      GET: async ({ request, params }) => {
        const userId = await authenticateApiKey(request);
        if (!userId) return unauthorized();

        const { data: link, error: linkError } = await supabaseAdmin
          .from("links").select("id")
          .eq("id", params.id).eq("user_id", userId).maybeSingle();
        if (linkError) return jsonResponse({ error: linkError.message }, 500);
        if (!link) return jsonResponse({ error: "Not found" }, 404);

        const url = new URL(request.url);
        const limit = Math.min(
          MAX_LIMIT,
          Math.max(1, Number(url.searchParams.get("limit")) || DEFAULT_LIMIT)
        );
        const offset = Math.max(0, Number(url.searchParams.get("offset")) || 0);

        const { data, error } = await supabaseAdmin
          .from("click_events")
          .select("id, clicked_at, referrer, user_agent")
          .eq("link_id", params.id)
          .order("clicked_at", { ascending: false })
          .range(offset, offset + limit - 1);
        if (error) return jsonResponse({ error: error.message }, 500);
        return jsonResponse({ data, limit, offset });
      },
    },
  },
});
