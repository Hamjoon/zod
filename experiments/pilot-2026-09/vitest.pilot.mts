import { defineConfig } from "vitest/config";
export default defineConfig({
  resolve: { conditions: ["@zod/source"] },
  test: {
    watch: false,
    include: ["packages/zod/src/v4/**/*.pilot.test.ts"],
    typecheck: { enabled: false },
  },
});
