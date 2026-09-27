# Stage C handover: coverage at t = v4.0.5, complete

## Result

Coverage is now measured in TypeScript source coordinates (`packages/zod/src/**/*.ts`) over a fixed file set D of 63 files, for S124 (266 tests), S60 (139 tests) and the developer suite (888 cases). This removes L-01 (last week's nyc measured only the wrapper's one-line `index.js`). All figures below are computed by `scripts/analyze-coverage.py` and appear in [coverage-summary.md](../results/coverage-summary.md). No model calls.

| Over D | Loading | S124 | S60 | Developer suite |
| --- | --- | --- | --- | --- |
| Statements | 15.19% (857/5640) | **46.38%** (2616/5640) | 39.23% (2213/5640) | 59.65% (3033/5084) |
| Branches | 0.19% (7/3623) | **20.03%** (726/3623) | 15.37% (557/3623) | 35.40% (1234/3485) |
| Functions | 1.10% (13/1174) | 52.12% (612/1174) | 38.16% (448/1174) | 73.33% (795/1084) |
| Lines | 15.74% (796/5054) | 47.40% (2396/5054) | 40.24% (2034/5054) | 59.76% (2721/4553) |

The developer totals come from a different transform (vitest-istanbul on the `.ts` source); the LLM maps come from nyc on the built CommonJS, remapped through source maps. Their statement, branch and function counts are therefore not directly comparable. The cross-corpus comparison is at line level (part C).

## Build with source maps (Step 1)

- `cp -a /work/zod-versions/v4.0.5 /work/zod-versions/v4.0.5-cov`. The only config change, in the copy's `packages/zod/tsconfig.build.json`:

```diff
     "customConditions": ["@zod/source"],
+    "sourceMap": true,
   }
```

- Rebuilt with last week's v4.0.5 build command, `HUSKY=0 pnpm build` at the copy's root (zshy + Biome postbuild + `packages/tsc`), no reinstall; exit 0 ([build.log](../results/coverage/build.log)).
- Gates ([build-check.json](../results/coverage/build-check.json), `scripts/check-coverage-build.py`):
  - Gate 2: **360 of 360** built files (`.cjs/.js/.d.ts/.d.cts`) are byte-identical to v4.0.5 once the `//# sourceMappingURL=` line (180 files) is removed. No file exists in only one tree.
  - Gate 3: `src/` has 243 files, byte-identical (frozen `tests/` included).
  - Outside `node_modules`, the only other differing file is `tsconfig.build.json`.
  - **Gate 1 first failed:** 180 `.map` files existed, but all **90 `.cjs` files referenced the ESM map** (`schemas.cjs` → `schemas.js.map`) instead of their own, correct `.cjs.map`.
  - After D-33 (below), gate 1 passes 180/180, and gates 2 and 3 still pass.
- **Note for anyone measuring coverage on zod's CommonJS build:** zshy builds the CommonJS output by renaming TypeScript's emit to `.cjs`. It writes a correct `<name>.cjs.map`, but it leaves the `//# sourceMappingURL=<name>.js.map` comment, which points to the ESM map, and the map's `"file": "<name>.js"`. Source-map-aware tools that follow the comment, such as nyc, therefore remap CommonJS coverage through the ESM map, onto wrong source lines. (All 90 `.cjs.map` files carry `"file": "<name>.js"`, before and after D-33; the maps were not modified. `file` is informational and does not affect remapping.)
- Remap check (`scripts/check-remap.py`; nyc json report of `require('.')` in the copy). nyc's `fnMap` declaration line and the first statement of the body, expected vs actual; **all 7 match**:

| File | Function | Declaration expected / actual | First statement expected / actual |
| --- | --- | --- | --- |
| `v4/classic/schemas.ts` | `string` (overloaded) | 371 / 371 | 372 / 372 |
| `v4/classic/schemas.ts` | `array` | 1038 / 1038 | 1039 / 1039 |
| `v4/classic/schemas.ts` | `object` (multi-line signature) | 1150 / 1150 | 1154 / 1154 |
| `v4/core/core.ts` | `config` | 131 / 131 | 132 / 132 |
| `v4/core/util.ts` | `getEnumValues` | 201 / 201 | 202 / 202 |
| `v4/core/util.ts` | `joinValues` | 209 / 209 | 210 / 210 |
| `v4/locales/en.ts` | default export (`default_1`) | 123 / 123 | 124 / 124 |

- Provider: **`@vitest/coverage-istanbul` 2.1.9** (= the tree's vitest 2.1.9), `HUSKY=0 pnpm add -Dw` in the copy only, first try. It added 46 store entries and removed none; the only lockfile lines removed are peer-resolution suffixes of the docs packages.

## File set D (Step 3)

D is the `src/**/*.ts` files in the remapped nyc report of testpilot2's loading measurement (`package_stats.ts`: `nyc … node -e 'require(".")'`, plus `--reporter=json`) with cwd = the copy's `packages/zod`. It has **63 files**: `src/index.ts`, 8 in `v4/classic/`, 14 in `v4/core/`, and **all 40** in `v4/locales/`. The instruction expected only the default locale, but the locales index that `require('zod')` loads imports every locale. D has no `tests/` file. List: [file-set-D.txt](../results/coverage/file-set-D.txt); loading coverage in [loading/](../results/coverage/loading/).

## Gates (Steps 4 and 5)

- LLM coverage under nyc (`scripts/replay-coverage.py` → `scripts/run-coverage-llm.py`). **S124: 266/266 pass, S60: 139/139 pass** (allowances 3 and 2), so no test is excluded. Every test produced a coverage map. Wall: 180.0 s and 98.7 s. The wrapper symlink was restored after the driver and probes `4.0.5 object function`.
- Developer suite (`scripts/run-coverage-dev.py`): last week's exact command plus the coverage options, which vitest 2.1.9 accepted as given ("Coverage enabled with istanbul"). Result: **81 files, 888 cases, 888 passed**, and case statuses identical to last week's `dev-cases.json` (0 differing). 14.3 s.
- The merged maps (testpilot2's `istanbul-lib-coverage`, `scripts/merge-coverage.cjs`) are restricted to D and keyed by paths relative to `packages/zod/src/`, identical for all three corpora. The developer map lacks 4 files of D (`index.ts`, `v4/classic/checks.ts`, `v4/core/index.ts`, `v4/locales/index.ts`). They are re-export-only modules, which have no statements when the `.ts` source is instrumented; the CommonJS build turns the re-exports into getter statements.

## Headline figures (Step 6)

**A. Paper metrics.** Over loading: S124 +31.19 pp statements and +19.84 pp branches; S60 +24.04 and +15.18 pp.
- Per-function statement coverage: all 124 functions located, 91 through `fnMap`, 28 through the re-export fallback (D-36) and 5 as exported `const`s. S124 over its 124 functions: median 100%, 106 at 100%, 17 at 0%. S60 over its 60 functions: median 100%, 50 at 100%, 10 at 0%.
- The function bodies are very short (median 1 statement, max 14), because most public functions are one-line wrappers around core. So per-function coverage is close to a yes/no measure.
- Several functions at 0% do have passing tests, but those tests never call the top-level function. Examples: `z.positive`/`z.nullish` tests call the method form `.positive()`/`.nullish()`, and `gen-n124-run2/test_601.js` (`z.maxSize`) defines its own stand-in `z` object. One passing S124 test, `gen-n124-run2/test_84.js` (`z.guid`), never loads zod; it tests `crypto.randomUUID`.
- Uniquely contributing tests: S124 43 of 266 (16.17%); S60 28 of 139 (20.14%).

**B. Developer reference.** 59.65% statements, 35.40% branches, 73.33% functions over D (in its own transform).

**C. Lines** (5070 executable lines; a line counts as covered if a covered statement starts on it):

| | LLM | Dev | Both | LLM only | Dev only | Neither |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| S124 vs dev | 2396 (47.26%) | 2721 (53.67%) | 1868 | 528 | 853 | 1821 |
| S60 vs dev | 2034 (40.12%) | 2721 (53.67%) | 1510 | 524 | 1211 | 1825 |

87 of the "LLM only" lines are in the 4 re-export files, which the developer map cannot cover. Without those files: S124 441, S60 437 LLM-only lines (second pair of rows in the summary).

**D. Changed code.** Old-side lines of `git diff -U0 v4.0.5 <tag>` that are executable lines in D:

| Release | Changed executable lines | S124 | Dev | Both | S124 only | Dev only | Neither |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| v4.1.0 | 239 | 133 | 208 | 118 | 15 | 90 | 16 |
| v4.3.0 | 1311 | 230 | 644 | 203 | 27 | 441 | 640 |
| v4.6.0 | 1946 | 727 | 1221 | 689 | 38 | 532 | 687 |

(All six releases are in `coverage-changed-lines.csv`, with S60 as an extra column.) **Executing changed code vs survival to v4.6.0:** S124: 257 executed changed v4.6.0 lines and survived, 8 executed them and broke, 1 never executed them and survived (`test_84.js`, which never loads zod), 0 never executed them and broke. S60: 138 / 1 / 0 / 0. In other words, nearly every surviving LLM test did reach code that v4.6.0 changed. The tests survived because they did not detect those changes, not because they never reached them.

## Deviations (D-33 on)

- **D-33** (advisor): in `v4.0.5-cov` only, the last line of each of the 90 `.cjs` files was changed from `//# sourceMappingURL=<name>.js.map` to `//# sourceMappingURL=<name>.cjs.map`, so that nyc reads each file's own map. Executable code is untouched; gate 2 ignores this line. Reason: zshy's comment points to the ESM map (see the note above).
- **D-34**: nyc `--cwd` is the coverage build's package directory instead of the wrapper, so that zod's files fall under nyc's working directory. All other validator arguments are kept.

  | | Command |
  | --- | --- |
  | testpilot2 validator (`src/mochaValidator.ts`) | `nyc --cwd=<wrapper dir> --exclude=<scratch dir> --reporter=json --report-dir=<tmp>/coverage --temp-dir=<tmp>/coverage mocha --full-trace --exit --allow-uncaught=false --reporter=json --reporter-option output=<tmp>/report.json -- <test>` |
  | `run-coverage-llm.py` | `nyc --cwd=/work/zod-versions/v4.0.5-cov/packages/zod --exclude=test-s --reporter=json --report-dir=<tmp>/coverage --temp-dir=<tmp>/coverage mocha --full-trace --exit --allow-uncaught=false --reporter=json --reporter-option output=/dev/stdout -- <test>` |

  (The Mocha report goes to stdout, as in `run-survival-llm.py`.)
- **D-35**: vitest's `coverage.reportsDirectory` is `$ROOT/coverage-raw/dev/vitest` instead of `results/coverage/dev`. vitest empties that directory before a run, and its unrestricted `coverage-final.json` would collide with the D-restricted `results/coverage/dev/coverage-final.json`; raw data also belongs outside the repository. The JSON test report is at `results/coverage/dev/v4.0.5/`.
- **D-36**: the per-function locator follows `export { _x as x } from "../core/index.js"` in `v4/classic/checks.ts` to `export function _x` in `v4/core/api.ts`. This covers 28 check functions (`lt` … `toUpperCase`) that have no declaration in `classic/`. The instruction's text-search fallback did not reach them.

Other notes: `$ROOT/coverage-raw` is bind-mounted with `docker compose run -v` (compose.yml unchanged). `merge-coverage` is a `.cjs` because the repository's `package.json` has `"type": "module"`. `results/coverage/` is matched by the zod root `.gitignore` rule `coverage`, so it was committed with `git add -f` (no `.gitignore` changed). `check-release-trees-n124.py` was re-run for integrity (`INTEGRITY_OK`); its rewrite of the committed `results/survival-n124/source-integrity.json` was reverted at once.

## Cleanup

Wrapper symlink `../../../../../packages/zod`, probe `4.0.5 object function`; no `test-s`, `.nyc_output`, `nyc_output` or `coverage/` in the wrapper or the read-only trees. No file in `zod-versions/{v4.0.5 … v4.6.0, frozen-v4.0.5-tests}` was modified during this stage. Left in place: `$ROOT/zod-versions/v4.0.5-cov` (1.0 GB) and `$ROOT/coverage-raw/` (424 MB: 266 + 139 per-test nyc maps, the developer raw map, merge lists, the remap-check report). Committed per-test data: `results/coverage/<set>/per-test-lines.json.gz` (covered lines per file per test; enough to redo parts C and D).

## Open questions

1. Per-function coverage is nearly binary, because most public zod functions are one-statement wrappers. Should per-function coverage follow the call into `core` (e.g. the `$ZodString` constructor) to say more?
2. Some tests labelled for a function exercise a different API form (method vs top-level function) or no zod at all (`test_84.js`, the mock in `test_601.js`). Should the function attribution in the paper metrics use what the tests call rather than the label the tool assigned?
3. Should zshy's `.cjs` source-map comment be reported upstream?
