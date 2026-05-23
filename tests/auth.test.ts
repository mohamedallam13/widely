import { describe, it, expect } from "vitest";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, TEST_EMAIL, TEST_PASSWORD } from "./helpers";

const AUTH_URL = `${SUPABASE_URL}/auth/v1`;

async function signIn(email: string, password: string) {
  return fetch(`${AUTH_URL}/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

describe("Email login", () => {
  it("succeeds with correct credentials", async () => {
    const res = await signIn(TEST_EMAIL, TEST_PASSWORD);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toHaveProperty("access_token");
    expect(body).toHaveProperty("user");
  });

  it("fails with wrong password", async () => {
    const res = await signIn(TEST_EMAIL, "wrong-password-123");
    expect(res.status).toBe(400);
  });

  it("fails with unknown email", async () => {
    const res = await signIn("nobody@example.com", "anything");
    expect(res.status).toBe(400);
  });
});

describe("Handle → email lookup (DB function)", () => {
  it("resolves cairoconfessions handle to an email", async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_email_by_username`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_username: "cairoconfessions" }),
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(typeof body).toBe("string");
    expect(body).toContain("@");
  });

  it("returns null for unknown handle", async () => {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_email_by_username`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_username: "this_handle_does_not_exist_xyz" }),
    });
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toBeNull();
  });
});
