// Test config — reads from .env.test (gitignored)
// Create .env.test with:
//   WIDELY_BASE_URL=https://widely.mohamedallam-tu.workers.dev
//   WIDELY_API_KEY=wdly_...
//   TEST_EMAIL=confessions.cairo@gmail.com
//   TEST_PASSWORD=...
//   SUPABASE_URL=https://sudbnkfkzmmzjlwwvrik.supabase.co
//   SUPABASE_SERVICE_ROLE_KEY=sb_secret_...

import { loadEnv } from "vite";
import { beforeAll } from "vitest";

beforeAll(() => {
  const env = loadEnv("test", process.cwd(), "");
  Object.assign(process.env, env);
});
