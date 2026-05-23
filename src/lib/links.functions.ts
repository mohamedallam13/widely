import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const linkInput = z.object({
  title: z.string().min(1).max(120),
  url: z.string().min(1).max(2048).transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`)).pipe(z.string().url()),
  featured: z.boolean().optional(),
});

export const listLinks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("links")
      .select("id, title, url, featured, visible, position, click_count, image_url, created_at")
      .eq("user_id", userId)
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const createLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => linkInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { count } = await supabase
      .from("links")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);
    const { data: row, error } = await supabase
      .from("links")
      .insert({
        user_id: userId,
        title: data.title,
        url: data.url,
        featured: data.featured ?? false,
        position: count ?? 0,
      })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

export const updateLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({
      id: z.string().uuid(),
      title: z.string().min(1).max(120).optional(),
      url: z.string().min(1).max(2048).transform((v) => (/^https?:\/\//i.test(v) ? v : `https://${v}`)).pipe(z.string().url()).optional(),
      featured: z.boolean().optional(),
      visible: z.boolean().optional(),
      position: z.number().int().min(0).optional(),
      image_url: z.string().url().max(2048).nullable().optional(),
    }).parse(d)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { id, ...patch } = data;
    const { error } = await supabase.from("links").update(patch).eq("id", id).eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("links").delete().eq("id", data.id).eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderLinks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ ids: z.array(z.string().uuid()).min(1).max(200) }).parse(d)
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await Promise.all(
      data.ids.map((id, position) =>
        supabase.from("links").update({ position }).eq("id", id).eq("user_id", userId)
      )
    );
    return { ok: true };
  });
