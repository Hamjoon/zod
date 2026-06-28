import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = dirname(
  fileURLToPath(new URL("../package.json", import.meta.url)),
);

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
    include: ["packages/zod/src/v4/classic/tests/object.test.ts"],
    isolate: true,
    setupFiles: [resolve(root, "scripts/fail-on-console.ts")],
    silent: true,
    typecheck: {
      enabled: false,
    },
    watch: false,
  },
});
