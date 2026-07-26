You are maintaining a TypeScript library. A change was recently applied to this repository.
Review the recent change and the current test results, then decide whether any modification
is needed: update tests, fix production code, or no change at all.

Constraints:
- The first line of your reply must be exactly one of: `DECISION: no_change`, `DECISION: fix_tests`, `DECISION: fix_production`.
- If the decision is `fix_tests` or `fix_production`, follow the DECISION line with a unified diff implementing the fix. If the decision is `no_change`, output no diff.
- Allowed files: .github/workflows/release.yml, packages/zod/package.json, packages/zod/src/v4/core/schemas.ts, packages/zod/src/v4/core/versions.ts, scripts/check-versions.ts.
- Do not weaken, delete, or skip assertions.
- Preserve nearby behavior that is still expected to pass.

Recent change applied to the repository:
<recent_change_diff>
diff --git a/.github/workflows/release.yml b/.github/workflows/release.yml
index 515a079b1..3d3a8c04c 100644
--- a/.github/workflows/release.yml
+++ b/.github/workflows/release.yml
@@ -34,7 +34,9 @@ jobs:
       - run: pnpm build
       - run: pnpm test
       - run: pnpm run --filter @zod/resolution test:all
-      
+      - run: pnpm run prepublishOnly
+        working-directory: ./packages/zod
+
       - id: publish
         name: Publish to NPM
         uses: JS-DevTools/npm-publish@v3
@@ -43,7 +45,7 @@ jobs:
           # dry-run: true
           provenance: true
           package: ./packages/zod
-
+      
       # - run: pnpm jsr publish --allow-slow-types # --dry-run
       #   working-directory: ./packages/zod
 
diff --git a/packages/zod/package.json b/packages/zod/package.json
index ea61dbaa7..ac1f25b57 100644
--- a/packages/zod/package.json
+++ b/packages/zod/package.json
@@ -1,6 +1,6 @@
 {
   "name": "zod",
-  "version": "4.0.1",
+  "version": "4.0.2",
   "type": "module",
   "author": "Colin McDonnell <zod@colinhacks.com>",
   "description": "TypeScript-first schema declaration and validation library with static type inference",
diff --git a/packages/zod/src/v4/core/schemas.ts b/packages/zod/src/v4/core/schemas.ts
index f9976aa8f..16ba5c6bd 100644
--- a/packages/zod/src/v4/core/schemas.ts
+++ b/packages/zod/src/v4/core/schemas.ts
@@ -2865,7 +2865,7 @@ export const $ZodLiteral: core.$constructor<$ZodLiteral> = /*@__PURE__*/ core.$c
 //////////////////////////////////////////
 
 // provide a fallback in case the File interface isn't provided in the environment
-declare global {
+declare /* deno-lint-ignore */ global {
   interface File {}
 }
 
diff --git a/packages/zod/src/v4/core/versions.ts b/packages/zod/src/v4/core/versions.ts
index dbf8e1c1c..61ed0cbec 100644
--- a/packages/zod/src/v4/core/versions.ts
+++ b/packages/zod/src/v4/core/versions.ts
@@ -1,5 +1,5 @@
 export const version = {
   major: 4,
   minor: 0,
-  patch: 0 as number,
+  patch: 2 as number,
 } as const;
diff --git a/scripts/check-versions.ts b/scripts/check-versions.ts
index 9f03b270c..952730b0b 100644
--- a/scripts/check-versions.ts
+++ b/scripts/check-versions.ts
@@ -40,14 +40,19 @@ if (tag === "latest") {
 // Get version from versions.ts
 const versionsVersion = `${version.major}.${version.minor}.${version.patch}`;
 
-// Compare versions
-const isValid =
+// Compare  versions
+const isPackageJsonValid =
   tag === "latest" ? packageJsonVersion === versionsVersion : packageJsonVersion.startsWith(versionsVersion);
-if (!isValid) {
+const isJsrJsonValid =
+  tag === "latest" ? jsrJsonVersion === versionsVersion : jsrJsonVersion.startsWith(versionsVersion);
+if (!isPackageJsonValid || !isJsrJsonValid) {
   console.error(`❌ Version mismatch:`);
   console.error(`   package.json: ${packageJsonVersion}`);
+  console.error(`   jsr.json:    ${jsrJsonVersion}`);
   console.error(`   versions.ts:  ${versionsVersion}`);
   console.error(`   tag:          ${tag}`);
+  console.error(`   isPackageJsonValid: ${isPackageJsonValid}`);
+  console.error(`   isJsrJsonValid: ${isJsrJsonValid}`);
   process.exit(1);
 } else {
   if (tag === "latest") {

</recent_change_diff>

Current test results:
<test_output>
 Test Files  162 passed (162)
      Tests  1706 passed (1706)
   Duration  7.77s (transform 498ms, setup 0ms, collect 22.34s, tests 5.53s, environment 11ms, prepare 9.51s, typecheck 7.28s)

</test_output>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/schemas.ts" lines="2843-2893">
//   }

//   if (util.propertyKeyTypes.has(typeof def.value)) {
//     inst._zod.pattern = new RegExp(
//       `^(${typeof def.value === "string" ? util.escapeRegex(def.value) : (def.value as any).toString()})$`
//     );
//   } else {
//     throw new Error("Const value cannot be converted to regex");
//   }

//   inst._zod.parse = (payload, _ctx) => {
//     payload.value = def.value; // always override
//     return payload;
//   };
// });

//////////////////////////////////////////
//////////////////////////////////////////
//////////                      //////////
//////////      $ZodFile        //////////
//////////                      //////////
//////////////////////////////////////////
//////////////////////////////////////////

// provide a fallback in case the File interface isn't provided in the environment
declare /* deno-lint-ignore */ global {
  interface File {}
}

export interface $ZodFileDef extends $ZodTypeDef {
  type: "file";
}

export interface $ZodFileInternals extends $ZodTypeInternals<File, File> {
  def: $ZodFileDef;
  isst: errors.$ZodIssueInvalidType;
  bag: util.LoosePartial<{
    minimum: number;
    maximum: number;
    mime: util.MimeTypes[];
  }>;
}

export interface $ZodFile extends $ZodType {
  _zod: $ZodFileInternals;
}

export const $ZodFile: core.$constructor<$ZodFile> = /*@__PURE__*/ core.$constructor("$ZodFile", (inst, def) => {
  $ZodType.init(inst, def);

  inst._zod.parse = (payload, _ctx) => {
</production_snippet>

Relevant production snippet:
<production_snippet path="packages/zod/src/v4/core/versions.ts" lines="1-29">
export const version = {
  major: 4,
  minor: 0,
  patch: 2 as number,
} as const;
</production_snippet>
