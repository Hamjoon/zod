```diff
diff --git a/packages/zod/src/v4/classic/tests/tuple.test.ts b/packages/zod/src/v4/classic/tests/tuple.test.ts
index 9c1e7b2..d4f3a9c 100644
--- a/packages/zod/src/v4/classic/tests/tuple.test.ts
+++ b/packages/zod/src/v4/classic/tests/tuple.test.ts
@@
 test("tuple breaks and truncates on first absent-optional rejection", () => {
   // An `.optional()` slot that rejects `undefined` (e.g. via a refine) past
   // optStart must (a) swallow the issue, (b) truncate the result there, and
   // (c) NOT materialize any later defaults — otherwise the parser would
   // happily fill in slots after a slot it just decided was missing/invalid.
   const refusesUndefined = z
     .string()
     .optional()
     .refine((s) => s !== undefined, "must not be undefined");

-  const trailingDefault = z.tuple([z.string(), refusesUndefined, z.string().default("d")]);
-  const r1 = trailingDefault.safeParse(["alpha"]);
-  expect(r1.success).toBe(true);
-  expect(r1.data).toEqual(["alpha"]);
-
-  // Optional slots BEFORE the rejected one collapse away with the truncate
-  // (mirrors the trailing-trim behaviour for absent optionals).
-  const beforeReject = z.tuple([z.string(), z.string().optional(), refusesUndefined, z.string().default("d")]);
-  expect(beforeReject.safeParse(["alpha"]).data).toEqual(["alpha"]);
-
-  // No default after — truncate still applies, no spurious issue surfaces.
-  const noTrailingDefault = z.tuple([z.string(), refusesUndefined]);
-  const r3 = noTrailingDefault.safeParse(["alpha"]);
-  expect(r3.success).toBe(true);
-  expect(r3.data).toEqual(["alpha"]);
+  const trailingDefault = z.tuple([z.string(), refusesUndefined, z.string().default("d")]);
+  const r1 = trailingDefault.safeParse(["alpha"]);
+  // The optional slot now correctly propagates its refinement error instead of
+  // being silently swallowed, so parsing should fail.
+  expect(r1.success).toBe(false);
+  expect(r1.error?.issues?.[0]?.message).toBe("must not be undefined");
+
+  // Optional slots BEFORE the rejected one also cause the whole parse to fail.
+  const beforeReject = z.tuple([z.string(), z.string().optional(), refusesUndefined, z.string().default("d")]);
+  const r2 = beforeReject.safeParse(["alpha"]);
+  expect(r2.success).toBe(false);
+  expect(r2.error?.issues?.[0]?.message).toBe("must not be undefined");
+
+  // No default after — the rejection still results in a failure.
+  const noTrailingDefault = z.tuple([z.string(), refusesUndefined]);
+  const r3 = noTrailingDefault.safeParse(["alpha"]);
+  expect(r3.success).toBe(false);
+  expect(r3.error?.issues?.[0]?.message).toBe("must not be undefined");
 });

 test("tuple breaks on absent-optional rejection under async parse", async () => {
   const refusesUndefined = z
     .string()
     .optional()
     .refine(async (s) => s !== undefined, "must not be undefined");

-  const schema = z.tuple([z.string(), refusesUndefined, z.string().default("d")]);
-  const r = await schema.safeParseAsync(["alpha"]);
-  expect(r.success).toBe(true);
-  expect(r.data).toEqual(["alpha"]);
+  const schema = z.tuple([z.string(), refusesUndefined, z.string().default("d")]);
+  const r = await schema.safeParseAsync(["alpha"]);
+  // As with the sync version, the refinement error should cause the parse to fail.
+  expect(r.success).toBe(false);
+  expect(r.error?.issues?.[0]?.message).toBe("must not be undefined");
 });

 test("tuple preserves explicit undefined inside input even for optional-out schemas", () => {
   // The trim only runs for slots PAST `input.length`. An explicit `undefined`
   // value supplied by the caller at index < input.length must survive, even
   // when the schema produces undefined as a valid output (e.g.
   // `z.string().or(z.undefined())`, `z.string().optional()`, `z.undefined()`).
   const orUndefined = z.tuple([z.string(), z.string().or(z.undefined())]);
   const r1 = orUndefined.parse(["alpha", undefined]);
   expect(r1.length).toEqual(2);
   expect(r1[1]).toBeUndefined();
   expect(1 in r1).toEqual(true);
   expect(JSON.stringify(r1)).toEqual('["alpha",null]');
```