import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    conditions: ["@zod/source", "default"],
    externalConditions: ["@zod/source", "default"],
  },
  ssr: {
    resolve: {
      conditions: ["@zod/source", "default"],
      externalConditions: ["@zod/source", "default"],
    },
  },
  test: {
    watch: false,
    isolate: true,
    include: ["packages/zod/src/v4/classic/tests/tuple.test.ts"],
    setupFiles: [resolve(__dirname, "fail-on-console.ts")],
    typecheck: { enabled: false },
    silent: true,
  },
});
