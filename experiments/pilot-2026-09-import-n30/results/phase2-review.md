# Phase 2 stop: review request (n30)

Prepared 2026-09-25 20:15 KST, for the Claude Cowork session (via Gary). No model call has been made.

## Phase 1

| check | result |
|---|---|
| week-2 branch tip | `39950c5d2c93b99ef274f7f03f7aafdf8eac404b`, as expected; `2ffee7ec…` → `39950c5…` changes only `README.md` |
| anchor t | `45afab0f846dffd591362b6f770017507eb185b5` checked out by hash |
| dev suite check | runtime half 81 files / 888 cases, all passed; typecheck half 81 / 820, all passed |
| coverage provider (D-01) | `@vitest/coverage-v8@2.1.9` installed, package.json and lock restored, tracked tree clean; nullable.test.ts probe wrote a summary; scratch removed |
| environment | vitest 2.1.9, typescript 5.5.4, biome 1.9.4 equal week 2. Differences: Node **v24.21.0** (week 2 v25.7.0, week 1 v24.11.0), npx 11.19.0 (week 2 11.10.1), clone and venv paths. Python 3.14.7 and tiktoken 0.14.0 equal week 2 |
| pool | 228 units: core 93, classic 68, mini 67; exclusions equal week 2 |
| sample (D-04) | `extend-sample.py` matches the §1.2 table in all 30 rows |
| unit texts | SHA-256 of `source_text` matches for 30/30 units + `$ZodRegistry` (31/31); all 233 match (`results/unit-text-hashes.json`) |
| export check | 30/30 `export const <class_name>:` (kind b) (`results/export-check.json`) |
| DEV coverage recheck (O-03) | Node v24.21.0: all 30 sampled units match the v24.11.0 baseline exactly. Outside the sample, `139-$ZodObject` (in the pool) differs by one branch: 58/54 vs 57/53 (93.10% vs 92.98%); lines identical. Means are unchanged to two decimals either way: sample 97.64% line / 98.02% branch; pool 97.10% / 97.91% |

**Decision needed:** which DEV values the report uses. My suggestion is the week-1 baseline `dev-baseline/dev-coverage-units.json`, as week 2 did. The only difference is one pool branch, and it doesn't move either reported mean.

## Phase 2

| check | result |
|---|---|
| template hashes | 5/5 equal `W2/manifest.json`; `paper-original/` byte-identical |
| rendering | `render-prompts.py write`: 150 prompts; `count` mode not run |
| prompt identity (5 week-2 units) | 25/25 byte-identical (`results/prompt-identity-week2.txt`) |
| import line (25 added units) | 125/125: the D1 line exactly once, with correct class_name and module_specifier, directly above the source-introduction line (`results/prompt-import-line-check.txt`) |
| max prompt tokens | **3,374** (`098-$ZodType` FSL) ≤ 4,096; the maximum over the sent techniques is 1,438 (`098-$ZodType` GTOT) |
| manifest.json | written |
| `OPENROUTER_API_KEY` | **not present** in this session's environment (`test -n` failed). It must be set before Phase 3 |

## Deviations and script changes

- `import-audit.ts` adapted per §7 step 4 now, during Phase 1: its `W1` path was the only `pilot-2026-09` hit not ending in `-n30`. The W1 input is removed and rows are labelled `run: "n30"`; all fields are kept.
- `recheck-dev-coverage.py`: Node labels now read `v24.11.0` (baseline) and the current Node from `env.json`.
- Files added beyond the §11 layout, to record the checks: `results/unit-text-hashes.json`, `results/export-check.json`, `results/dev-coverage-recheck/run.stdout.log`, and this file.
- The first DEV coverage attempt failed before vitest ran (stdout was redirected into a directory that didn't exist yet); I reran it at once. The details are in O-03.
- O-04: `168-ZodMiniISODate` calls `$constructor("$ZodISODate", …)`, the only sampled unit whose constructor name differs from its export name. Recorded, no action.

## Elapsed time (KST)

| phase | start | end | duration |
|---|---|---|---|
| Phase 1 | 20:07:09 | 20:12:56 | 5 m 47 s |
| Phase 2 | 20:13:34 | 20:15:45 | 2 m 11 s |
| review wait | 20:15:45 | (on approval) | |

Per-step times are in `results/phase-times.jsonl`.

## Prompt tokens (tiktoken 0.14.0, o200k_base)

| # | unit_id | origin | ZSL | FSL | COT | TOT | GTOT |
|---|---|---|---:|---:|---:|---:|---:|
| 1 | 086-$ZodCheckUpperCase | week2 | 276 | 2398 | 384 | 339 | 464 |
| 2 | 098-$ZodType | week2 | 1252 | 3374 | 1358 | 1317 | 1438 |
| 3 | 053-ZodEnum | week2 | 537 | 2659 | 643 | 604 | 724 |
| 4 | 038-ZodNull | week2 | 161 | 2283 | 267 | 228 | 348 |
| 5 | 231-ZodMiniLazy | week2 | 204 | 2326 | 311 | 270 | 392 |
| 6 | 117-$ZodIPv6 | added | 363 | 2485 | 470 | 427 | 550 |
| 7 | 088-$ZodCheckStartsWith | added | 427 | 2549 | 535 | 490 | 615 |
| 8 | 140-$ZodUnion | added | 795 | 2917 | 901 | 860 | 981 |
| 9 | 087-$ZodCheckIncludes | added | 442 | 2564 | 549 | 506 | 629 |
| 10 | 130-$ZodSymbol | added | 322 | 2444 | 428 | 387 | 508 |
| 11 | 147-$ZodEnum | added | 492 | 2614 | 598 | 557 | 678 |
| 12 | 159-$ZodPipe | added | 534 | 2656 | 640 | 599 | 720 |
| 13 | 153-$ZodDefault | added | 600 | 2722 | 706 | 665 | 786 |
| 14 | 105-$ZodEmoji | added | 213 | 2335 | 319 | 278 | 399 |
| 15 | 137-$ZodDate | added | 447 | 2569 | 553 | 512 | 633 |
| 16 | 055-ZodFile | added | 308 | 2430 | 414 | 375 | 495 |
| 17 | 013-ZodUUID | added | 182 | 2304 | 288 | 249 | 369 |
| 18 | 036-ZodSymbol | added | 159 | 2281 | 265 | 226 | 346 |
| 19 | 062-ZodSuccess | added | 203 | 2325 | 309 | 270 | 390 |
| 20 | 003-ZodISODateTime | added | 188 | 2310 | 296 | 253 | 377 |
| 21 | 021-ZodKSUID | added | 193 | 2315 | 300 | 259 | 381 |
| 22 | 058-ZodNullable | added | 208 | 2330 | 314 | 275 | 395 |
| 23 | 168-ZodMiniISODate | added | 194 | 2316 | 302 | 259 | 383 |
| 24 | 210-ZodMiniDiscriminatedUnion | added | 232 | 2354 | 342 | 295 | 423 |
| 25 | 197-ZodMiniBigInt | added | 216 | 2338 | 324 | 281 | 405 |
| 26 | 206-ZodMiniDate | added | 197 | 2319 | 304 | 263 | 385 |
| 27 | 205-ZodMiniVoid | added | 191 | 2313 | 298 | 257 | 379 |
| 28 | 232-ZodMiniPromise | added | 204 | 2326 | 311 | 270 | 392 |
| 29 | 211-ZodMiniIntersection | added | 220 | 2342 | 327 | 286 | 408 |
| 30 | 181-ZodMiniCUID2 | added | 214 | 2336 | 323 | 278 | 404 |
| | **max** | | **1252** | **3374** | **1358** | **1317** | **1438** |

## Rendered COT prompts, one added unit per stratum

### 117-$ZodIPv6 (`llm/117-$ZodIPv6/COT/prompt.md`)

````text
As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named $ZodIPv6 by following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file ($ZodIPv6.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The $ZodIPv6 class is exported from `./schemas.js` (path relative to the test file).
Here is the $ZodIPv6 class:
export interface $ZodIPv6Def extends $ZodStringFormatDef<"ipv6"> {
  version?: "v6";
}

export interface $ZodIPv6Internals extends $ZodStringFormatInternals<"ipv6"> {
  def: $ZodIPv6Def;
}

export interface $ZodIPv6 extends $ZodType {
  _zod: $ZodIPv6Internals;
}

export const $ZodIPv6: core.$constructor<$ZodIPv6> = /*@__PURE__*/ core.$constructor("$ZodIPv6", (inst, def): void => {
  def.pattern ??= regexes.ipv6;
  $ZodStringFormat.init(inst, def);

  inst._zod.onattach.push((inst) => {
    const bag = inst._zod.bag as $ZodStringInternals<unknown>["bag"];
    bag.format = `ipv6`;
  });

  inst._zod.check = (payload) => {
    try {
      new URL(`http://[${payload.value}]`);
      // return;
    } catch {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort,
      });
    }
  };
});
````

### 055-ZodFile (`llm/055-ZodFile/COT/prompt.md`)

````text
As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodFile by following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file (ZodFile.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodFile class is exported from `./schemas.js` (path relative to the test file).
Here is the ZodFile class:
// ZodFile
export interface ZodFile extends _ZodType<core.$ZodFileInternals>, core.$ZodFile {
  min(size: number, params?: string | core.$ZodCheckMinSizeParams): this;
  max(size: number, params?: string | core.$ZodCheckMaxSizeParams): this;
  mime(types: util.MimeTypes | Array<util.MimeTypes>, params?: string | core.$ZodCheckMimeTypeParams): this;
}

export const ZodFile: core.$constructor<ZodFile> = /*@__PURE__*/ core.$constructor("ZodFile", (inst, def) => {
  core.$ZodFile.init(inst, def);
  ZodType.init(inst, def);

  inst.min = (size, params) => inst.check(core._minSize(size, params));
  inst.max = (size, params) => inst.check(core._maxSize(size, params));
  inst.mime = (types, params) => inst.check(core._mime(Array.isArray(types) ? types : [types], params));
});
````

### 168-ZodMiniISODate (`llm/168-ZodMiniISODate/COT/prompt.md`)

````text
As a professional software tester who writes TypeScript test methods, generate Vitest test cases to comprehensively test all methods in the following class named ZodMiniISODate by following these steps:
- Extract and list all the public methods including their signatures
- For each methods, generate a basic Vitest test case that checks the method's functionality
- Given the source code of the class and the listed methods, identify potential edge cases and exception handling scenarios that should be tested
- Generate Vitest test cases that specifically test for the identified edge cases and exceptions
- Merge all the individual test cases into a complete Vitest test file (ZodMiniISODate.test.ts) for the given TypeScript class. The complete Vitest test file must start with ###Test START## and finish with ###Test END##
The ZodMiniISODate class is exported from `./iso.js` (path relative to the test file).
Here is the ZodMiniISODate class:
// iso date
export interface ZodMiniISODate extends schemas.ZodMiniStringFormat<"date"> {
  _zod: core.$ZodISODateInternals;
}

export const ZodMiniISODate: core.$constructor<ZodMiniISODate> = /*@__PURE__*/ core.$constructor(
  "$ZodISODate",
  (inst, def) => {
    core.$ZodISODate.init(inst, def);
    schemas.ZodMiniStringFormat.init(inst, def);
  }
);
````

