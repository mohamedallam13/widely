import { describe, it, expect } from "vitest";
import { apiGet, apiPost, apiPatch, apiDelete, BASE_URL } from "./helpers";

// ID of a link created during the test run — cleaned up after
let createdLinkId: string | null = null;

describe("Auth guard", () => {
  it("rejects missing API key with 401", async () => {
    const res = await fetch(`${BASE_URL}/api/public/v1/links`);
    expect(res.status).toBe(401);
  });

  it("rejects invalid API key with 401", async () => {
    const res = await apiGet("/api/public/v1/links", "wdly_invalid_key");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/public/v1/links", () => {
  it("returns 200 with data array", async () => {
    const res = await apiGet("/api/public/v1/links");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);
  });

  it("each link has required fields", async () => {
    const res = await apiGet("/api/public/v1/links");
    const { data } = await res.json();
    if (data.length > 0) {
      const link = data[0];
      expect(link).toHaveProperty("id");
      expect(link).toHaveProperty("title");
      expect(link).toHaveProperty("url");
      expect(link).toHaveProperty("featured");
      expect(link).toHaveProperty("visible");
      expect(link).toHaveProperty("position");
    }
  });
});

describe("POST /api/public/v1/links", () => {
  it("creates a link and returns 201", async () => {
    const res = await apiPost("/api/public/v1/links", {
      title: "Test Link — vitest",
      url: "https://example.com/test",
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data).toHaveProperty("id");
    expect(body.data.title).toBe("Test Link — vitest");
    createdLinkId = body.data.id;
  });

  it("rejects missing title with 400", async () => {
    const res = await apiPost("/api/public/v1/links", { url: "https://example.com" });
    expect(res.status).toBe(400);
  });

  it("rejects invalid URL with 400", async () => {
    const res = await apiPost("/api/public/v1/links", { title: "Bad", url: "not-a-url" });
    expect(res.status).toBe(400);
  });

  it("rejects invalid JSON body with 400", async () => {
    const res = await fetch(`${BASE_URL}/api/public/v1/links`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.WIDELY_API_KEY}`, "Content-Type": "application/json" },
      body: "{ bad json }",
    });
    expect(res.status).toBe(400);
  });
});

describe("PATCH /api/public/v1/links/:id", () => {
  it("updates a link", async () => {
    if (!createdLinkId) return;
    const res = await apiPatch(`/api/public/v1/links/${createdLinkId}`, {
      title: "Updated title",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.title).toBe("Updated title");
  });

  it("returns 404 for unknown link id", async () => {
    const res = await apiPatch("/api/public/v1/links/00000000-0000-0000-0000-000000000000", {
      title: "Ghost",
    });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/public/v1/links/:id", () => {
  it("deletes the test link", async () => {
    if (!createdLinkId) return;
    const res = await apiDelete(`/api/public/v1/links/${createdLinkId}`);
    expect(res.status).toBe(200);
    createdLinkId = null;
  });
});

describe("GET /api/public/v1/profile", () => {
  it("returns 200 with profile data", async () => {
    const res = await apiGet("/api/public/v1/profile");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data).toHaveProperty("username");
    expect(body.data).toHaveProperty("display_name");
  });
});

describe("PATCH /api/public/v1/profile", () => {
  it("updates display_name", async () => {
    const res = await apiPatch("/api/public/v1/profile", {
      display_name: "Cairo Confessions (test)",
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.display_name).toBe("Cairo Confessions (test)");
  });

  it("restores original display_name", async () => {
    const res = await apiPatch("/api/public/v1/profile", {
      display_name: "Cairo Confessions",
    });
    expect(res.status).toBe(200);
  });
});
