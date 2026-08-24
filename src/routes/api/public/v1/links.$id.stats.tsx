import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { authenticateApiKey, jsonResponse, corsPreflight, unauthorized } from "@/lib/api-key.server";

const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;

// Buckets click_events by UTC day. Fine at link-in-bio volumes; move the
// bucketing into a DB-side RPC (group by date) if a link's click_events
// table ever grows large enough for this to matter.
export const Route = createFileRoute("/api/public/v1/links/$id/stats")({
  server: {
    handlers: {
      OPTIONS: () => corsPreflight(),
      GET: async ({ request, params }) => {
        const userId = await authenticateApiKey(request);
        if (!userId) return unauthorized();

        const { data: link, error: linkError } = await supabaseAdmin
          .from("links").select("id, click_count")
          .eq("id", params.id).eq("user_id", userId).maybeSingle();
        if (linkError) return jsonResponse({ error: linkError.message }, 500);
        if (!link) return jsonResponse({ error: "Not found" }, 404);

        const url = new URL(request.url);
        const days = Math.min(
          MAX_DAYS,
          Math.max(1, Number(url.searchParams.get("days")) || DEFAULT_DAYS)
        );
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

        const { data: events, error } = await supabaseAdmin
          .from("click_events")
          .select("clicked_at")
          .eq("link_id", params.id)
          .gte("clicked_at", since);
        if (error) return jsonResponse({ error: error.message }, 500);

        const byDay = new Map<string, number>();
        for (const { clicked_at } of events ?? []) {
          const day = clicked_at.slice(0, 10); // YYYY-MM-DD (UTC)
          byDay.set(day, (byDay.get(day) ?? 0) + 1);
        }
        const daily = [...byDay.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, clicks]) => ({ date, clicks }));

        return jsonResponse({
          data: {
            total_clicks: link.click_count,
            clicks_in_range: events?.length ?? 0,
            days,
            daily,
          },
        });
      },
    },
  },
});
