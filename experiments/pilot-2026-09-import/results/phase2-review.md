# Phase 2 review hand-off

## Phase 1 verification

- Anchor commit: `45afab0f846dffd591362b6f770017507eb185b5`.
- Week-1 archive branch tip: `c922ec9f2773f6a0eb6a38ef1623e161bc83ae45`, matching the fixed archive commit.
- Developer check: 81 unique runtime files, 888 inferred runtime cases, all passing; the paired typecheck half contains 820 cases, for 1,708 total reporter cases.
- Coverage provider: `@vitest/coverage-v8@2.1.9`; probe passed and wrote `coverage-summary.json`; tracked dependency files were restored.
- Fixed tool versions match week 1: pnpm 10.12.1, Vitest 2.1.9, TypeScript 5.5.4, Biome 1.9.4, tiktoken 0.14.0 with `o200k_base`.
- Environment differences: Darwin kernel 25.5.0 → 25.6.0, Node v24.11.0 → v25.7.0, npx 11.6.1 → 11.10.1, Python 3.14.1 → 3.14.7, clone path, and virtual-environment path.
- `OPENROUTER_API_KEY` is present; its value was not printed.

### Unit text hashes

| Unit | Stored SHA-256 | Re-derived SHA-256 | Match |
|---|---|---|---|
| `086-$ZodCheckUpperCase` | `a5325a2b456be8fbc892462e6fc01d3e7e661987cb3e39ba69d6a7240147284d` | `a5325a2b456be8fbc892462e6fc01d3e7e661987cb3e39ba69d6a7240147284d` | yes |
| `098-$ZodType` | `64f5e08fd09d8f60f851c16af00bddfaf3a0ce873f856a0cc44d157ff15eb0b3` | `64f5e08fd09d8f60f851c16af00bddfaf3a0ce873f856a0cc44d157ff15eb0b3` | yes |
| `053-ZodEnum` | `b00a18fcc0c1a55a3d3a79ef8bd128bdf13b306f1577fe5bbc4f70ba630c5735` | `b00a18fcc0c1a55a3d3a79ef8bd128bdf13b306f1577fe5bbc4f70ba630c5735` | yes |
| `038-ZodNull` | `1553a569e1aac7c2daa0469a0c1f15aec3af8c6a53a3b2e49c087e15ad68e897` | `1553a569e1aac7c2daa0469a0c1f15aec3af8c6a53a3b2e49c087e15ad68e897` | yes |
| `231-ZodMiniLazy` | `289ebd61a723cae92bb521bc51e0f3320f508ad3270a76aaed75da94b2337db0` | `289ebd61a723cae92bb521bc51e0f3320f508ad3270a76aaed75da94b2337db0` | yes |
| FSL example `$ZodRegistry` | `80b4c10e316ff964c724f73c47f2fb5638d786af222c96e56733a2c86d954bcd` | `80b4c10e316ff964c724f73c47f2fb5638d786af222c96e56733a2c86d954bcd` | yes |

### Export check

| Unit | Kind | Export line |
|---|---:|---:|
| `086-$ZodCheckUpperCase` | b | `core/checks.ts:930` |
| `098-$ZodType` | b | `core/schemas.ts:172` |
| `053-ZodEnum` | b | `classic/schemas.ts:1438` |
| `038-ZodNull` | b | `classic/schemas.ts:930` |
| `231-ZodMiniLazy` | b | `mini/schemas.ts:1443` |

## Phase 2 verification

- Module specifiers derived from `units-sampled.json` exactly match §1.2.
- All five template diffs contain exactly the D1 line and no other change: `results/template-diff.txt`.
- All 25 rendered-prompt diffs contain exactly the filled D1 line and no other change: `results/prompt-diff.txt`.
- All 25 prompts are at most 4,096 tokens; maximum is 3,374 (`098-$ZodType`, FSL).
- No protocol deviation or verification mismatch was found.

### Prompt token counts

| Unit | ZSL | FSL | COT | TOT | GTOT |
|---|---:|---:|---:|---:|---:|
| `086-$ZodCheckUpperCase` | 276 | 2,398 | 384 | 339 | 464 |
| `098-$ZodType` | 1,252 | 3,374 | 1,358 | 1,317 | 1,438 |
| `053-ZodEnum` | 537 | 2,659 | 643 | 604 | 724 |
| `038-ZodNull` | 161 | 2,283 | 267 | 228 | 348 |
| `231-ZodMiniLazy` | 204 | 2,326 | 311 | 270 | 392 |

## Fully rendered `038-ZodNull` prompts

### COT

```text
As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodNull by following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file (ZodNull.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodNull class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodNull class:
// ZodNull
export interface ZodNull extends _ZodType<core.$ZodNullInternals> {}

export const ZodNull: core.$constructor<ZodNull> = /*@__PURE__*/ core.$constructor("ZodNull", (inst, def) => {
  core.$ZodNull.init(inst, def);
  ZodType.init(inst, def);
});
```

### TOT

```text
Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class. All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The ZodNull class is exported from `./schemas.js` (path relative to the test file).
The TypeScript class is:
// ZodNull
export interface ZodNull extends _ZodType<core.$ZodNullInternals> {}

export const ZodNull: core.$constructor<ZodNull> = /*@__PURE__*/ core.$constructor("ZodNull", (inst, def) => {
  core.$ZodNull.init(inst, def);
  ZodType.init(inst, def);
});
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file (ZodNull.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
```

### GTOT

```text
Imagine three different experts in software testing who are tasked with developing comprehensive Vitest test cases for the following TypeScript class.To comprehensively test all methods in the following class named ZodNull they must following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file (ZodNull.test.ts) for the given TypeScript class.All experts will propose one test cases for each method, share it with the group, and then proceed to the next step. If any expert realizes they're wrong at any point, they leave.
The ZodNull class is exported from `./schemas.js` (path relative to the test file).
The TypeScript class is:
// ZodNull
export interface ZodNull extends _ZodType<core.$ZodNullInternals> {}

export const ZodNull: core.$constructor<ZodNull> = /*@__PURE__*/ core.$constructor("ZodNull", (inst, def) => {
  core.$ZodNull.init(inst, def);
  ZodType.init(inst, def);
});
At the end they must propose one complete (including typical use cases, edge cases, and error scenarios) Vitest test file (ZodNull.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
```

## Stop point

Phase 3 has not started. Awaiting Claude Cowork approval relayed by Gary before any OpenRouter model calls.
