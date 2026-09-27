# Stage C: coverage at t = v4.0.5

## A. Paper metrics (LLM corpora)

Denominator: the file set D (63 files; see notes). Coverage of the passing tests only (tests that pass under nyc). Loading coverage is `require('zod')` alone.

| Metric | Loading | S124 (266 tests) | S124 − loading | S60 (139 tests) | S60 − loading |
| --- | --- | --- | --- | --- | --- |
| statements | 857/5640 (15.19%) | 2616/5640 (46.38%) | +31.19 pp | 2213/5640 (39.23%) | +24.04 pp |
| branches | 7/3623 (0.19%) | 726/3623 (20.03%) | +19.84 pp | 557/3623 (15.37%) | +15.18 pp |
| functions | 13/1174 (1.1%) | 612/1174 (52.12%) | +51.02 pp | 448/1174 (38.16%) | +37.06 pp |
| lines | 796/5054 (15.74%) | 2396/5054 (47.4%) | +31.66 pp | 2034/5054 (40.24%) | +24.50 pp |

### Statement coverage per API function

For each function of `population-main.json`, the statements inside its declaration (Istanbul `fnMap` of the merged map: the exported function of that name, or `_name` exported as `name`, in `src/v4/classic/*.ts`, or `coerce.ts`/`iso.ts` for `coerce.*`/`iso.*`; fallbacks: a re-export `_name as name` from `../core/index.js` in a classic file, followed to the exported function `_name` in `src/v4/core/`, then a text search for an exported `const`), and the fraction covered by all of the set's passing tests. S124 over its 124 functions, S60 over its 60 sampled functions (all 124 are in the CSV).

| Set | Functions | Min | Median | Max | At 0% | At 100% | Body statements min / median / max |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S124 | 124 | 0.00% | 100.00% | 100.00% | 17 | 106 | 1 / 1.0 / 14 |
| S60 | 60 | 0.00% | 100.00% | 100.00% | 10 | 50 | 1 / 1.0 / 4 |

Located: 124 of 124 (91 by fnMap, 5 by text (exported const), 28 by fnMap via re-export in v4/classic/checks.ts). Not located: none.

Functions at 0% — S124: `zod.z.file`, `zod.z.json`, `zod.z.keyof`, `zod.z.maxSize`, `zod.z.mime`, `zod.z.minSize`, `zod.z.negative`, `zod.z.nonnegative`, `zod.z.nonpositive`, `zod.z.normalize`, `zod.z.nullish`, `zod.z.positive`, `zod.z.property`, `zod.z.size`, `zod.z.startsWith`, `zod.z.url`, `zod.z.xid`; S60: `zod.z.coerce.boolean`, `zod.z.keyof`, `zod.z.ksuid`, `zod.z.maxSize`, `zod.z.negative`, `zod.z.nonpositive`, `zod.z.positive`, `zod.z.property`, `zod.z.size`, `zod.z.templateLiteral`.

### Uniquely contributing tests

A passing test that covers at least one statement of D that no other passing test of the same set covers (from the per-test raw maps).

| Set | Passing tests | Uniquely contributing | Share |
| --- | --- | --- | --- |
| S124 | 266 | 43 | 16.17% |
| S60 | 139 | 28 | 20.14% |

## B. Developer reference

The 888 frozen v4.0.5 developer cases, vitest-istanbul on the TypeScript source, restricted to D.

| Metric | Loading | Developer suite | Developer − loading |
| --- | --- | --- | --- |
| statements | 857/5640 (15.19%) | 3033/5084 (59.65%) | +44.46 pp |
| branches | 7/3623 (0.19%) | 1234/3485 (35.4%) | +35.21 pp |
| functions | 13/1174 (1.1%) | 795/1084 (73.33%) | +72.23 pp |
| lines | 796/5054 (15.74%) | 2721/4553 (59.76%) | +44.02 pp |

Statement, branch and function totals differ between the developer map and the LLM maps because the transforms differ (vitest-istanbul instruments the TypeScript source; nyc instruments the built JavaScript and remaps). Compare corpora at line level (part C).

## C. Line-level comparison with the developer suite

Executable lines of a file: lines on which at least one statement starts in either corpus's map. A line is covered by a corpus if a covered statement of that corpus starts on it.

| Comparison | Executable lines | LLM | Dev | Both | LLM only | Dev only | Neither |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S124 vs dev | 5070 | 2396 (47.26%) | 2721 (53.67%) | 1868 | 528 | 853 | 1821 |
| S60 vs dev | 5070 | 2034 (40.12%) | 2721 (53.67%) | 1510 | 524 | 1211 | 1825 |
| S124 vs dev, without the 4 re-export-only files | 4983 | 2309 (46.34%) | 2721 (54.61%) | 1868 | 441 | 853 | 1821 |
| S60 vs dev, without the 4 re-export-only files | 4983 | 1947 (39.07%) | 2721 (54.61%) | 1510 | 437 | 1211 | 1825 |

The 4 files `index.ts`, `v4/classic/checks.ts`, `v4/core/index.ts`, `v4/locales/index.ts` only re-export (`export { … } from`, `export * from`). Instrumented as TypeScript source they have no statements, so the developer map omits them. The CommonJS build turns the re-exports into getter code, so the LLM map has statements there. Their lines count as executable and cannot be covered by the developer corpus under this definition, hence the second pair of rows.

Executable lines by area: index.ts 4, classic 740, core 2462, locales 1864. Per-file rows are in `coverage-lines-<set>-vs-dev.csv`.

## D. Changed-code coverage

Old-side lines of `git diff -U0 v4.0.5 <tag> -- packages/zod/src` (lines of v4.0.5 modified or deleted by the release) in files of D, excluding `tests/`, intersected with the executable lines of part C; coverage at t.

| Release | Changed executable lines | S124 | Dev | Both | S124 only | Dev only | Neither | (S60) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v4.1.0 | 239 | 133 | 208 | 118 | 15 | 90 | 16 | 117 |
| v4.2.0 | 829 | 211 | 611 | 184 | 27 | 427 | 191 | 162 |
| v4.3.0 | 1311 | 230 | 644 | 203 | 27 | 441 | 640 | 180 |
| v4.4.0 | 1475 | 353 | 796 | 326 | 27 | 470 | 652 | 295 |
| v4.5.0 | 1829 | 634 | 1110 | 596 | 38 | 514 | 681 | 561 |
| v4.6.0 | 1946 | 727 | 1221 | 689 | 38 | 532 | 687 | 633 |

### Executing changed code (v4.6.0) vs surviving to v4.6.0

Per passing test: did it cover at least one changed executable line of v4.6.0 at t, and did it pass at v4.6.0 (survival matrix)?

| Set | Executed changed code, survived | Executed changed code, broke | Never executed it, survived | Never executed it, broke |
| --- | --- | --- | --- | --- |
| S124 | 257 | 8 | 1 | 0 |
| S60 | 138 | 1 | 0 | 0 |

## E. Notes

- **Denominator D**: the 63 `src/**/*.ts` files in the remapped nyc report of `require('.')` in the coverage build (`results/coverage/file-set-D.txt`, from Step 3): src/ (root) 1, v4/classic 8, v4/core 14, v4/locales 40. All 40 locale files are loaded by `require('zod')` (the locales index imports every locale), not just the default one. No `tests/` file is in D. The same D is used for every corpus.
- **Two measurement routes.** The LLM corpora run on the built CommonJS files under nyc, remapped through source maps to the TypeScript source. The developer suite runs on the TypeScript source under vitest's Istanbul provider. Statement, branch and function counts are therefore per corpus and are not subtracted from each other; the cross-corpus comparison is at line level (C, D).
- **Different targets.** The LLM corpora target 124 (S124) or 60 (S60) public functions; the developer suite targets the whole package. The package-level gap is expected and is context, not a finding.
- D files absent from the developer map (re-export-only modules: no statements when the TypeScript source is instrumented; see part C): `index.ts`, `v4/classic/checks.ts`, `v4/core/index.ts`, `v4/locales/index.ts`.
- Passing tests that never load zod (empty coverage map; they count as passing tests that cover nothing): S124 `gen-n124-run2/test_84.js`; S60 none.
- Tests excluded from coverage because they did not pass under nyc: S124 none; S60 none.
