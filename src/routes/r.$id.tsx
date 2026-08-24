import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/r/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          { auth: { persistSession: false } }
        );
        const { data } = await supabase
          .from("links")
          .select("id, url")
          .eq("id", params.id)
          .maybeSingle();
        if (!data) {
          return new Response("Not found", { status: 404 });
        }
        await Promise.all([
          supabaseAdmin.rpc("increment_link_click", { p_link_id: data.id }),
          supabaseAdmin.from("click_events").insert({
            link_id: data.id,
            referrer: request.headers.get("referer"),
            user_agent: request.headers.get("user-agent"),
          }),
        ]);
        return new Response(null, {
          status: 302,
          headers: { location: data.url, "cache-control": "no-store" },
        });
      },
    },
  },
});
