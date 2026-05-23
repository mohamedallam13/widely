import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/r/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const supabase = createClient(
          process.env.SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY!,
          { auth: { persistSession: false } }
        );
        const { data } = await supabase
          .from("links")
          .select("id, url, click_count")
          .eq("id", params.id)
          .maybeSingle();
        if (!data) {
          return new Response("Not found", { status: 404 });
        }
        void supabaseAdmin
          .from("links")
          .update({ click_count: (data.click_count ?? 0) + 1 })
          .eq("id", data.id);
        return new Response(null, {
          status: 302,
          headers: { location: data.url, "cache-control": "no-store" },
        });
      },
    },
  },
});
