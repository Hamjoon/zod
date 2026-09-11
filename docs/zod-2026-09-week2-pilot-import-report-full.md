# Pilot rerun with the class's module path in the prompt: zod, full record (2026-09 week 2)

Status: full record (authoritative). The summary report `zod-2026-09-week2-pilot-import-report.md` is an excerpt of this document; every number there must match a number here.
Run date: 2026-09-10 (KST). Instruction document: `pilot-import-cc-instructions-2026-09-week2.md` (issued 2026-09-10), executed by Codex. Evidence root: `experiments/pilot-2026-09-import/`. Run notes: `results/run-notes.md` (entries D-01 to D-03, O-01 to O-07, R-01 to R-03, cited below by id). Week-1 record: `zod-2026-09-week1-pilot-report-full.md`; week-1 run-notes entries are cited with a W1 prefix.

## 1. Study design

### 1.1 Question

The week-1 pilot applied the prompts of *Prompt Engineering in LLMs for Automated Unit Test Generation: A Large-Scale Study* (Ouédraogo et al., EMSE 31:103, 2026) to five class units of zod and found that no generated test file loaded. The main cause was the import of the class under test (CUT): the prompt names the class but not the file that defines it, and the model imported it from a non-existent module named after the class (`./ZodNull`). In Java a public class's file name is its class name, so the paper's prompt never needed that information.

The advisor asked for one more run with import information added and everything else unchanged. This run adds one line to each prompt that names the module exporting the CUT and asks two questions:

1. Does the line remove the CUT import failure?
2. Once files can load, which failures remain, and how do they relate to the paper's compilation-error layers (Cannot Find Symbol, Package Does Not Exist)?

Scope is unchanged from week 1: CoT, ToT and GToT only (ZSL and FSL wait for the authors' original prompts), one anchor commit, no time axis.

### 1.2 What changed and what did not

| item | week 1 | week 2 |
|---|---|---|
| prompt | paper wording, language nouns substituted | same + one line: ``The {class_name} class is exported from `{module_specifier}` (path relative to the test file).`` placed directly above the line that introduces the source |
| module specifier | n/a | `./checks.js` for `$ZodCheckUpperCase`, `./schemas.js` for the other four units (zod's own relative-import form under `module: nodenext`) |
| post-processing of generated files | none | none |
| units | stratified random 5 of 228 (seed 20260904) | the same 5, not redrawn; unit texts re-derived at t and SHA-256 identical (D-03) |
| model and sampling | `openai/gpt-oss-120b` via OpenRouter, temperature 0, 1 call per unit × technique, no retries | same |
| test placement | unit's source directory, `<class>.pilot.test.ts`, transient | same |
| extraction | delimiter-first, innermost marker pair, marker decoration accepted (W1 J-02) | same, plus markers count only when they stand alone on their line (R-01; no week-1 extraction changes) |
| coverage run | v8, unit's source file only, files that load | same, with `coverage.reportOnFailure=true` so files with failing cases are measured (R-02) |
| new analyses | none | import audit with the TypeScript compiler API (both weeks); tsc codes grouped by the paper's layers (both weeks); AST count of CUT calls without `new` (both weeks) |
| dev baseline | zod v4 suite at t (81 files, 888 cases) | reused; suite re-run (888/888 pass); unit coverage re-measured on this run's Node and identical (O-07) |

The added line is a deviation from the paper, which states that it evaluated full classes without import injection or post-hoc repair (paper §4.3, Relation to Prior Work and Finding 9; also §4.1, Relation to Prior Work). This run adds the information before generation, inside the prompt, and leaves generated files untouched (D-02).

Correction to the week-1 record: the week-1 full report cites this statement as §4.4; the correct sections are §4.3 and §4.1. The week-1 summary report does not carry the citation.

### 1.3 Units

Anchor t = zod v4.0.5, commit `45afab0f846dffd591362b6f770017507eb185b5`. Unit definition, population and sampling as in week 1 (§1.3 of the week-1 record).

| unit | file | module specifier in prompt | export line | executable lines (DEV rule) | DEV line cov | DEV branch cov |
|---|---|---|---|---|---|---|
| 086-$ZodCheckUpperCase | core/checks.ts | `./checks.js` | 930 | 7 | 100% (7/7) | 100% (1/1) |
| 098-$ZodType | core/schemas.ts | `./schemas.js` | 172 | 81 | 100% (81/81) | 96.2% (50/52) |
| 053-ZodEnum | classic/schemas.ts | `./schemas.js` | 1438 | 35 | 100% (35/35) | 71.4% (5/7) |
| 038-ZodNull | classic/schemas.ts | `./schemas.js` | 930 | 4 | 100% (4/4) | 100% (1/1) |
| 231-ZodMiniLazy | mini/schemas.ts | `./schemas.js` | 1443 | 7 | 100% (7/7) | 100% (1/1) |

### 1.4 Prompts

Templates `prompts/{COT,TOT,GTOT}.txt` are the week-1 templates with the one added line; `prompts/{ZSL,FSL}.txt` (provisional reconstructions) carry the same line and are rendered but not sent. The FSL example class gets no line. `results/template-diff.txt` shows exactly one added line per template, and `results/prompt-diff.txt` shows exactly one added line (with values filled in) for each of the 25 rendered prompts compared with week 1. Rendered prompt tokens (tiktoken o200k_base; week-1 values in parentheses):

| unit | COT | TOT | GTOT | (ZSL) | (FSL) |
|---|---|---|---|---|---|
| 086-$ZodCheckUpperCase | 384 (360) | 339 (315) | 464 (440) | 276 (252) | 2,398 (2,374) |
| 098-$ZodType | 1,358 (1,336) | 1,317 (1,295) | 1,438 (1,416) | 1,252 (1,230) | 3,374 (3,352) |
| 053-ZodEnum | 643 (622) | 604 (583) | 724 (703) | 537 (516) | 2,659 (2,638) |
| 038-ZodNull | 267 (246) | 228 (207) | 348 (327) | 161 (140) | 2,283 (2,262) |
| 231-ZodMiniLazy | 311 (289) | 270 (248) | 392 (370) | 204 (182) | 2,326 (2,304) |

Every prompt stays under the paper's 4,096-token limit (maximum 3,374).

### 1.5 Pipeline

As in week 1 (§1.5 of the week-1 record): generation with six evidence files per call; extraction and structure check; syntax (TypeScript parser), typecheck (`tsc --noEmit` per file in place, tsconfig extending `packages/zod/tsconfig.test.json`), execution (vitest, `vitest.pilot.mts`, one file at a time, 300 s limit); coverage (v8, unit declaring-statement range, same rule as DEV); biome 1.9.4 with the repository config; two smell rules (`results/smell-rules.md`). Additions in this run: the import audit (`scripts/import-audit.ts`, TypeScript compiler API, resolution from each file's in-place path), the two rulings on extraction and coverage (R-01, R-02), and the reporting changes in R-03.

### 1.6 Environment

pnpm 10.12.1, Vitest 2.1.9, TypeScript 5.5.4, Biome 1.9.4, tiktoken 0.14.0: identical to week 1. Node changed from v24.11.0 to v25.7.0 (also Darwin 25.5.0 → 25.6.0, Python 3.14.1 → 3.14.7). Because v8 coverage is produced by Node's engine, the dev suite was re-run with coverage on v25.7.0; all five units matched week 1 exactly in executable lines, covered lines, branches and percentages (O-07). The week-1 DEV figures are used throughout.

## 2. Results

Week-1 values are given next to week-2 values. Denominators are the 5 sampled units per technique (15 pooled), as in the week-1 matrix.

### RQ0 Generation

15/15 calls returned HTTP 200, `finish_reason` = `stop`, non-empty content; no call repeated (O-03). OpenRouter routed the calls to nine upstream providers (week 1: six). Completion tokens (reasoning included):

| unit | COT | TOT | GTOT |
|---|---|---|---|
| 086-$ZodCheckUpperCase | 2,332 | 2,184 | 1,808 |
| 098-$ZodType | 3,212 | 3,800 | 2,699 |
| 053-ZodEnum | 2,239 | 2,418 | 1,872 |
| 038-ZodNull | 1,843 | 1,413 | 2,645 |
| 231-ZodMiniLazy | 2,207 | 3,210 | 2,937 |

Finding 0. Generation is not the bottleneck, as in week 1.

### RQ1 Format compliance (MSR, CSR)

| technique | MSR w1 | MSR w2 | CSR w1 | CSR w2 | CSR strict w1 | CSR strict w2 |
|---|---|---|---|---|---|---|
| COT | 5/5 | 5/5 | 5/5 | 5/5 | 1/5 | 2/5 |
| TOT | 5/5 | 5/5 | 4/5 | 5/5 | 4/5 | 2/5 |
| GTOT | 5/5 | 5/5 | 5/5 | 5/5 | 4/5 | 5/5 |
| all | 15/15 | 15/15 | 14/15 | 15/15 | 9/15 | 9/15 |

Six of 15 responses decorated at least one marker (strict CSR 9/15, O-04). One response (`086-$ZodCheckUpperCase` COT) wrapped the file in bold markers and also quoted both markers inside the file's leading block comment ("Starts with `###Test START##`"). The week-1 extractor paired the quoted START with the final END and cut the start of the file, which then failed to parse. Ruling R-01 counts a marker only when it stands alone on its line (decoration allowed). Re-extracting all 30 responses changed only this file (week 1: no change); its syntax now passes. Before R-01 the pooled syntax count was 14/15.

Finding 1. Format compliance is unchanged by the added line: markers are always present, decorated in 40% of responses, and in one case also quoted inside the code. An extractor must treat marker mentions inside the output as text.

### RQ2 Syntax, typecheck, execution

| technique | run | syntax ok | tsc ok | files that load | cases run | passed | pass rate |
|---|---|---|---|---|---|---|---|
| COT | w1 | 5/5 | 0/5 | 0/5 | 0 | 0 | n/a |
| COT | w2 | 5/5 | 0/5 | 4/5 | 38 | 13 | 34.2% |
| TOT | w1 | 4/5 | 0/5 | 0/5 | 0 | 0 | n/a |
| TOT | w2 | 5/5 | 0/5 | 4/5 | 46 | 11 | 23.9% |
| GTOT | w1 | 5/5 | 0/5 | 0/5 | 0 | 0 | n/a |
| GTOT | w2 | 5/5 | 0/5 | 3/5 | 35 | 11 | 31.4% |
| all | w1 | 14/15 | 0/15 | 0/15 | 0 | 0 | n/a |
| all | w2 | 15/15 | 0/15 | 11/15 | 119 | 35 | 29.4% |
| DEV | | 81/81 | by construction | 81/81 | 888 | 888 | 100% |

(Week-1 TOT syntax is 4/5 because one response was not structured.)

#### Import audit (both weeks, same definition)

| measure | week 1 (14 structured files) | week 2 (15 structured files) |
|---|---|---|
| CUT import from the given specifier, resolves, exports the class | n/a (no specifier given) | 15/15 |
| CUT import present but unresolved | 13 | 0 |
| CUT import absent | 1 | 0 |
| non-CUT imports: total / unresolved / named import not exported | 26 / 4 / 6 | 23 / 1 / 5 |
| relative non-CUT imports with `.js` / without `.js` | 0 / 10 | 4 / 3 |
| files with a CUT call without `new` / such calls | 6 / 44 | 10 / 52 |
| files with `new` on the CUT / such expressions | 2 / 2 | 3 / 13 |

Finding 2. The added line removes the CUT import failure completely: every file imports the class from the given module and the import resolves (week 1: 13 unresolved, 1 absent). For the first time generated files load (11/15) and run (119 cases, 35 passing). The model partly copied the `.js` convention to its other relative imports (4 with, 3 without; week 1 none with), and unresolved non-CUT imports fell from 4 to 1 (O-02).

#### tsc errors

Error codes in the 15 checked files (73 errors; week 1: 59 in 14 files):

| code | count | meaning |
|---|---|---|
| TS2348 | 45 | value is not callable; did you mean to include `new`? |
| TS2345 | 12 | argument type not assignable |
| TS2578 | 6 | unused `@ts-expect-error` |
| TS2305 | 2 | module has no exported member |
| TS2835 | 2 | relative import needs an explicit extension |
| TS1361 | 2 | name imported with `import type` used as a value |
| TS2834 | 1 | relative import needs an explicit extension |
| TS6133 | 1 | declared but never read |
| TS2459 | 1 | module declares the name locally but does not export it |
| TS2339 | 1 | property does not exist |

Two groupings of the same codes, recomputed for both weeks from the recorded codes (R-03). Week-1 category view (the week-1 mapping, with TS2348 given its own category and TS2459 placed with TS2305):

| run | technique | module or path not found | name not found | property does not exist | type mismatch | constructor called without `new` | other | total |
|---|---|---|---|---|---|---|---|---|
| w1 | COT | 6 | 3 | 0 | 0 | 0 | 6 | 15 |
| w1 | TOT | 9 | 0 | 10 | 0 | 0 | 10 | 29 |
| w1 | GTOT | 9 | 3 | 0 | 0 | 0 | 3 | 15 |
| w1 | all | 24 | 6 | 10 | 0 | 0 | 19 | 59 |
| w2 | COT | 0 | 0 | 0 | 0 | 31 | 2 | 33 |
| w2 | TOT | 5 | 0 | 1 | 12 | 7 | 5 | 30 |
| w2 | GTOT | 1 | 0 | 0 | 0 | 7 | 2 | 10 |
| w2 | all | 6 | 0 | 1 | 12 | 45 | 9 | 73 |

Paper-layer view. PDNE-like (Package Does Not Exist: the module or path cannot be resolved): TS2307, TS2834, TS2835. CFS-like (Cannot Find Symbol: the module resolves but the symbol or member does not exist): TS2305, TS2459, TS2724, TS2304, TS2552, TS2339, TS2551. Type or argument mismatch: TS2322, TS2345, TS2554, TS2555. TS2348 is kept separate.

| run | PDNE-like | CFS-like | type or argument mismatch | constructor called without `new` | other | total |
|---|---|---|---|---|---|---|
| w1 | 24 (41%) | 16 (27%) | 0 | 0 | 19 (32%) | 59 |
| w2 | 3 (4%) | 4 (5%) | 12 (16%) | 45 (62%) | 9 (12%) | 73 |

Files with TS2348: `$ZodCheckUpperCase` COT and GTOT, `$ZodType` COT, all three `ZodNull` files, all three `ZodMiniLazy` files. The 12 type mismatches are all in `ZodEnum` TOT, which nevertheless passed 11/11 cases at runtime.

Finding 2a. With imports fixed, the dominant compile error is a call to a zod class without `new` (TS2348, 62% of errors). zod's classes are built with `core.$constructor`, and the prompt shows only that definition, not a usage. The model treated these classes as factory functions (`ZodNull()`). In Java the same mistake is reported by the compiler as Cannot Find Symbol, because no method named after the class exists; the paper's dominant layer therefore reappears here under a TypeScript-specific code. The AST count shows the pattern was already present in week 1 (6 of 14 files, 44 calls) but hidden, because those files never resolved the class (Finding 2 of week 1).

Finding 2b. Import-path errors do not disappear entirely: 6 remain (week-1 view), all outside the CUT import: three from extensionless relative imports in `$ZodType` TOT (TS2834, TS2835), two names imported from zod modules that do not export them (TS2305 in `$ZodCheckUpperCase` TOT) and one name that a module declares but does not export (TS2459 in `$ZodType` GTOT).

#### Execution

84 of 119 cases failed: 79 with `TypeError`, 5 with `AssertionError` (COT 21/4, TOT 34/1, GTOT 24/0). The `TypeError` messages fall into two groups: `Cannot read properties of undefined` (69) and `Cannot set property check of [object Module] which has only a getter` (10, `ZodMiniLazy` COT and TOT, where tests assign to a property of an imported ES module namespace).

Four files fail at load time:

| file | load error |
|---|---|
| `$ZodCheckUpperCase` COT | `Cannot read properties of undefined (reading 'pattern')` |
| `$ZodCheckUpperCase` GTOT | `Cannot read properties of undefined (reading 'pattern')` |
| `$ZodType` TOT | `vi.mock` factory references top-level variables (hoisting), as in W1 O-11 |
| `ZodMiniLazy` GTOT | `Cannot set property check of [object Module] which has only a getter` |

Passing cases by unit:

| unit | COT | TOT | GTOT | total |
|---|---|---|---|---|
| 086-$ZodCheckUpperCase | load error | 0/11 | load error | 0/11 |
| 098-$ZodType | 0/6 | load error | 0/14 | 0/20 |
| 053-ZodEnum | 12/13 | 11/11 | 10/10 | 33/34 |
| 038-ZodNull | 0/9 | 0/19 | 1/11 | 1/39 |
| 231-ZodMiniLazy | 1/10 | 0/5 | load error | 1/15 |

Finding 2c. Almost all passing cases come from `ZodEnum` (33 of 35). All three `ZodEnum` files construct the class with `new`, and none of the other twelve files does. The four other units pass 2 of 85 cases. Typecheck and execution diverge in both directions: `ZodEnum` TOT has 12 type errors and passes every case, while files free of CUT-related type errors still fail at runtime.

### RQ3 Static quality (biome)

| technique | files w1 | errors w1 | warnings w1 | files w2 | errors w2 | warnings w2 |
|---|---|---|---|---|---|---|
| COT | 5 | 3 | 4 | 5 | 4 | 0 |
| TOT | 4 | 5 | 4 | 5 | 5 | 1 |
| GTOT | 5 | 1 | 2 | 5 | 4 | 0 |
| all LLM | 14 | 9 | 10 | 15 | 13 | 1 |
| DEV | 81 | 0 | 0 | 81 | 0 | 0 |

Week-2 rules: `useNumberNamespace` 5, `useConst` 4, `noForEach` 2, `noUnusedImports` 2, `noUnusedVariables` 1. The DEV figures were recomputed and match week 1 exactly (D-03).

Finding 3. Every technique still violates the repository's lint rules (LLM errors/warnings 13/1 over 15 files; week 1: 9/10 over 14); the dev suite is clean by construction (DEV 0/0, enforced in CI).

### RQ4 Readability

Excluded, as in week 1 (the paper's readability model is Java-specific).

### RQ5 Coverage

Coverage is measured for the 11 files that load, including the execution of failing cases (R-02). Before R-02, Vitest's default `coverage.reportOnFailure=false` wrote no coverage for files with a failing case, so only the two fully passing `ZodEnum` files had values (pooled mean 13.33%, O-06).

| technique | unit line cov, mean over 5 (non-loading = 0) | line cov, mean over files that ran | unit branch cov, mean over 5 | branch cov, files that ran |
|---|---|---|---|---|
| COT | 61.73% | 77.16% (n=4) | 70.0% | 87.5% |
| TOT | 80.0% | 100.0% (n=4) | 80.0% | 100.0% |
| GTOT | 41.73% | 69.55% (n=3) | 50.0% | 83.33% |
| all LLM | 61.15% | | 66.67% | |
| DEV | 100.0% (five units) | | 93.52% | |

Per file:

| unit | executable lines | COT | TOT | GTOT | DEV |
|---|---|---|---|---|---|
| 086-$ZodCheckUpperCase | 7 | load error | 100% (7/7), 0/11 passed | load error | 100% |
| 098-$ZodType | 81 | 8.64% (7/81), 0/6 passed | load error | 8.64% (7/81), 0/14 passed | 100% |
| 053-ZodEnum | 35 | 100% (35/35), 12/13 passed | 100% (35/35), 11/11 passed | 100% (35/35), 10/10 passed | 100% |
| 038-ZodNull | 4 | 100% (4/4), 0/9 passed | 100% (4/4), 0/19 passed | 100% (4/4), 1/11 passed | 100% |
| 231-ZodMiniLazy | 7 | 100% (7/7), 1/10 passed | 100% (7/7), 0/5 passed | load error | 100% |

Under the paper's rule (coverage only on compilable suites) there is no LLM coverage value, because no file passes tsc.

Finding 5. Unit line coverage does not separate working from broken tests for the three smallest units. Six of the eleven files that ran reach 100% line coverage of their unit while passing at most one case (0% to 10%); all six target units with 4 to 7 executable lines, where a few executed calls cover every line even when every assertion then fails. Only the two larger units discriminate: `$ZodType` files cover 8.64% (7/81) against DEV 100%, and `ZodEnum` files cover 100% with passing tests. The DEV 100% on the three small units carries the same caveat. Branch totals are not comparable across runs: v8 reports branches only for code it has seen, so the same unit shows different denominators (for `ZodEnum`, 9 or 10 branches in LLM runs against 7 in the DEV run).

### RQ6 Test smells

| technique | run | files | tests (AST) | expect calls | assertion roulette | magic number |
|---|---|---|---|---|---|---|
| COT | w1 | 5 | 53 | 113 | 38 (71.7%) | 2 (3.8%) |
| COT | w2 | 5 | 52 | 112 | 34 (65.4%) | 3 (5.8%) |
| TOT | w1 | 4 | 31 | 73 | 22 (71.0%) | 2 (6.5%) |
| TOT | w2 | 5 | 41 | 91 | 24 (58.5%) | 3 (7.3%) |
| GTOT | w1 | 5 | 54 | 105 | 31 (57.4%) | 3 (5.6%) |
| GTOT | w2 | 5 | 60 | 94 | 29 (48.3%) | 3 (5.0%) |
| all LLM | w1 | 14 | 138 | 291 | 91 (65.9%) | 7 (5.1%) |
| all LLM | w2 | 15 | 153 | 297 | 87 (56.9%) | 9 (5.9%) |
| DEV | | 81 | 820 | 2,709 | 493 (60.1%) | 213 (26.0%) |

Rules as in week 1 (`results/smell-rules.md`). DEV figures recomputed and identical (D-03).

Finding 6. The smell profile is close to week 1: assertion roulette near the dev suite's rate (57% vs 60%) and magic numbers far rarer than in dev tests (6% vs 26%), with the same caveat on the narrower magic-number rule.

### Size

LLM: 153 tests (AST) over 15 files, 10.2 per file; 119 runtime cases over the 11 files that load, 10.8 per loaded file. DEV: 888 runtime cases over 81 files (11.0 per file), suite level, no per-class mapping.

## 3. Threats to validity

1. ZSL and FSL not run; their templates are reconstructions pending the authors' text.
2. Five units, one model, one run at temperature 0. OpenRouter routed calls to different upstream providers in the two weeks (six and nine). Differences between the weeks other than the import outcome (for example, 6 vs 10 files calling the CUT without `new`) cannot be attributed to the added line alone.
3. The added line deviates from the paper, which used no import injection (paper §4.3, §4.1). The line carries the information that Java's class-name rule gives implicitly, but its wording and the `.js` form are the pilot's choices, and the model partly copied the form to other imports.
4. Coverage of the three small units saturates with any call to the class (Finding 5); v8 branch denominators depend on what ran; the paper's compilable-only rule leaves no LLM coverage. Coverage numbers in this run describe execution, not test adequacy.
5. Two of the five units (`ZodNull`, `ZodMiniLazy`) are thin wrappers with no own methods, while the prompt asks to test "all public methods" (carried over from week 1).
6. The extraction rule was refined after outputs were seen (R-01). It changed one week-2 file and no week-1 file; the pre-ruling results are kept in `results/pre-rulings/`.
7. The dev baseline is the whole suite, not per-class files. Node differed between weeks; the dev coverage recheck matched exactly (O-07).
8. Smell rules are pilot re-implementations of two TsDetect rules. One time point; no code-evolution axis.

## 4. Deviations, observations and rulings (from `run-notes.md`)

- D-01 temporary `@vitest/coverage-v8@2.1.9` install; `package.json` and lockfile restored; probe passed.
- D-02 the added prompt line (deviation from the paper, §1.2).
- D-03 reuse of the week-1 sample, unit texts, dev baseline and scripts; verification results; DEV lint and smell figures recomputed and identical; scripts changed only in the output path and in the parts the instruction required (module specifier, time limits, `error_name`, import audit, comparison build, dev coverage recheck).
- O-01 FSL remains the only technique whose prompt shows import statements (not run).
- O-02 `.js` carried over to 4 of 7 non-CUT relative imports.
- O-03 generation without flags. O-04 marker decoration (strict CSR 9/15). O-05 CUT import fixed, tsc still 0/15. O-06 execution counts; coverage before R-02. O-07 dev coverage on Node v25.7.0 identical to v24.11.0.
- R-01 standalone-marker extraction rule: week 1 unchanged; week 2 changed `086-$ZodCheckUpperCase` COT only (syntax 14/15 → 15/15; loads, cases and passes unchanged; tsc codes 69 → 73 as five parse errors were replaced by nine TS2348; biome errors 18 → 13).
- R-02 `coverage.reportOnFailure=true`: all 11 loading files measured; pooled line mean 13.33% → 61.15%, branch mean 13.33% → 66.67%.
- R-03 TS2348 as its own category, TS2459 placed with TS2305, AST count of CUT calls without `new` for both weeks. Reporting only.

## 5. Usage

15 calls. OpenRouter-reported tokens: prompt 10,074 (includes chat template), completion 36,819 (reasoning 10,380). Cost about $0.012. Latency 5.9 to 85.5 s per call. Providers: CoreWeave 4, DeepInfra 3, Google 2, and one each for Groq, BaseTen, DigitalOcean, Mancer 2, SiliconFlow and Novita.

## 6. Archive

`experiments/pilot-2026-09-import/`: `manifest.json`, `vitest.pilot.mts`, `prompts/` (5 templates, paper originals, week-1 templates), `llm/` (25 prompts, 15 calls × 6 evidence files), `generated/` (15 structured files), `dev-baseline/` (copied from week 1), `results/` (RQ JSONs, `matrix.md`, `comparison-week1.md`, `rq2-import-audit.{json,md}`, `r01-extraction-changes.json`, `dev-coverage-recheck-units.json`, `run-notes.md`, `pre-rulings/`, `week1/` reference copies), `scripts/`. Branch `experiment/2026-09-week2-pilot-import` (orphan archive), created on commit.

## 7. Next step

ZSL and FSL on the authors' reply. For the advisor meeting: whether the next run should also show how the class is constructed (the dominant remaining failure), or move to the code-evolution question with the files that already run.
