import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name, bio, avatar_url, cover_url, theme, socials")
      .eq("id", userId)
      .maybeSingle();
    return data;
  });

const themeEnum = z.enum(["noir", "neon", "midnight", "bone", "indigo_mist", "sunset", "forest", "mono"]);

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      display_name: z.string().max(80).optional(),
      bio: z.string().max(400).optional(),
      avatar_url: z.string().url().max(2048).nullable().optional(),
      cover_url: z.string().url().max(2048).nullable().optional(),
      theme: themeEnum.optional(),
      socials: z.record(z.string().min(1).max(40), z.string().url().max(2048)).optional(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("profiles").update(data).eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
