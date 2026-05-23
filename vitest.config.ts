import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import { resolve } from "path";

const env = loadEnv("test", process.cwd(), "");

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    env,
    testTimeout: 15000,
    // Run tests sequentially so POST/DELETE order is preserved
    pool: "forks",
    fileParallelism: false,
  },
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
});
