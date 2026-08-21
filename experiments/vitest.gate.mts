import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    conditions: ["@zod/source"],
  },
  test: {
    watch: false,
    include: ["experiments/generated-tests/**/*.test.ts"],
    typecheck: {
      enabled: false,
    },
  },
});
