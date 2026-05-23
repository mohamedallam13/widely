export const BASE_URL = process.env.WIDELY_BASE_URL ?? "https://widely.mohamedallam-tu.workers.dev";
export const API_KEY = process.env.WIDELY_API_KEY ?? "";
export const TEST_EMAIL = process.env.TEST_EMAIL ?? "";
export const TEST_PASSWORD = process.env.TEST_PASSWORD ?? "";
export const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://sudbnkfkzmmzjlwwvrik.supabase.co";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_FDycDSbSRV0Xrie8icGQqA_3Q2feCeR";

export async function apiGet(path: string, key = API_KEY) {
  return fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  });
}

export async function apiPost(path: string, body: unknown, key = API_KEY) {
  return fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function apiPatch(path: string, body: unknown, key = API_KEY) {
  return fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function apiDelete(path: string, key = API_KEY) {
  return fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${key}` },
  });
}

export async function supabasePost(path: string, body: unknown, useServiceRole = false) {
  const key = useServiceRole ? SUPABASE_SERVICE_ROLE_KEY : SUPABASE_PUBLISHABLE_KEY;
  return fetch(`${SUPABASE_URL}${path}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
