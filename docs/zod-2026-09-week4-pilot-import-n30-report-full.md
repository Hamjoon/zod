# Pilot with the class's module path in the prompt, 30 units: zod, full record (2026-09 week 4)

Status: full record (authoritative). The summary report `zod-2026-09-week4-pilot-import-n30-report.md` is an excerpt of this document; every number there must match a number here.
Run date: 2026-09-25 (KST). Instruction document: `pilot-import-n30-cc-instructions-2026-09-week4.md`, executed by Claude Code. Evidence root: `experiments/pilot-2026-09-import-n30/` (tables in `results/matrix.md`, run notes in `results/run-notes.md`). Week-2 record: `zod-2026-09-week2-pilot-import-report-full.md`.

## 1. Study design

### 1.1 Question

The week-2 pilot applied the prompts of *Prompt Engineering in LLMs for Automated Unit Test Generation: A Large-Scale Study* (Ouédraogo et al., EMSE 31:103, 2026) to five class units of zod, with one added prompt line that names the module exporting the class under test (CUT). The line removed the CUT import failure of week 1, and the dominant remaining compile error was a call to a zod class without `new`.

While the paper authors' original zero-shot and few-shot prompts are pending, the advisor asked for the same condition on a larger sample. This run keeps the week-2 condition and grows the sample from 5 to 30 units. It asks:

1. Does the week-2 picture (imports resolve, compilation still fails, a minority of cases pass) hold on 30 units?
2. How large is the variation between two runs of the same prompt?

Scope is unchanged: CoT, ToT and GToT only, one anchor commit, no time axis.

### 1.2 What changed from week 2

| item | week 2 | this run |
|---|---|---|
| sample | 5 units | **30 units** (the 5 week-2 units + 25 added) |
| generation | 15 calls | 90 calls; all 30 units generated fresh, including the 5 week-2 units |
| prompt templates | with the module-path line | identical (SHA-256 equal; the 25 prompts of the week-2 units are byte-identical) |
| model and sampling | `openai/gpt-oss-120b` via OpenRouter, temperature 0, one call per unit × technique, no retries | same |
| extraction, typecheck, execution, coverage, lint, smell rules | week-2 rules | same, applied as fixed rules from the start (§1.4) |
| executor | Codex | Claude Code, following the same instruction format |

The prompt line is a deviation from the paper, which evaluated full classes without import injection (paper §4.3 and §4.1). It is carried over from week 2 unchanged.

### 1.3 Units

Anchor t = zod v4.0.5, commit `45afab0f846dffd591362b6f770017507eb185b5`. Pool as in weeks 1 and 2: 228 class units (core 93, classic 68, mini 67).

Sample: 30 units, proportional to the strata (core 12, classic 9, mini 9). The five week-2 units (drawn with seed 20260904) are kept, and 25 are drawn at random from the rest of each stratum with seed 20260925 (core 10, classic 7, mini 8). Because the five were themselves a random draw within their strata, the union has the same distribution as a single random draw of 12/9/9.

All 30 units are `$constructor` classes; none of the four plain `class` declarations in the core stratum was drawn. The full list is in `results/units-sampled.json`.

### 1.4 Pipeline and environment

As in week 2: extraction (delimiter first), structure check, syntax, typecheck (`tsc --noEmit` per file in place), execution (vitest, one file at a time), unit coverage (v8, unit's declaring statement), biome, two smell rules, and an import audit with the TypeScript compiler API.

Rules applied from the start: extraction markers count only on their own line; coverage is measured for every file that loads, including files with failing cases; TS2348 (class called without `new`) is its own error category. The structure check's HTML rule recognises a tag only by tag syntax, so a TypeScript generic such as `<B extends string>` in a comment is not read as `<b>`; no week-1 or week-2 file was affected by this rule. A test that writes a first-run vitest snapshot is counted as vitest reports it (one file, 7 cases, §2.3).

Environment: vitest 2.1.9, TypeScript 5.5.4, Biome 1.9.4 (as in week 2); Node v24.21.0. The dev suite's coverage of the 30 units was re-measured on this Node and matches the week-1 baseline exactly, so the baseline values are used.

## 2. Results

Denominators: 30 units per technique. Week-2 values (5 units) are shown for context only; the samples differ.

### 2.1 Headline matrix

| | COT | TOT | GTOT | all | week 2 (all) | DEV |
|---|---|---|---|---|---|---|
| MSR | 29/30 | 30/30 | 30/30 | 89/90 | 15/15 | |
| CSR | 28/30 | 29/30 | 30/30 | 87/90 | 15/15 | |
| syntax ok | 28 | 29 | 29 | 86/87 | 15/15 | |
| tsc ok | 3 | 2 | 1 | 6/87 | 0/15 | |
| files that load | 22/28 | 23/29 | 24/30 | 69/87 | 11/15 | 81/81 |
| cases passed | 105/286 (36.7%) | 93/287 (32.4%) | 98/347 (28.2%) | 296/920 (32.2%) | 35/119 (29.4%) | 888/888 |
| unit line coverage, mean over 30 (missing = 0) | 51.6% | 63.2% | 56.1% | | | 97.6% |
| unit line coverage, mean over files that ran | 70.4% | 82.5% | 70.1% | | | |

### 2.2 Format compliance and imports

- MSR 89/90. The one miss (`181-ZodMiniCUID2` COT) is a response that fell into a repetition loop and stopped at the length limit (40,951 completion tokens), with no end marker.
- CSR 87/90; strict CSR (markers without markdown decoration) 69/90. Two further files were rejected because prose and a table followed the code inside the markers.
- CUT import: 85/87 files import the class from the given module and the import resolves. One file imports `./iso` (also resolves), one imports a non-existent `./$ZodType`.

Finding 1. The module-path line keeps working at 30 units: the CUT import is no longer a source of failure.

### 2.3 Compilation and execution

**Typecheck.** 6 of 87 files pass tsc. The 87 files carry 896 errors.

| layer (paper's view) | codes | errors | share |
|---|---|---|---|
| PDNE-like (module or path not found) | TS2307, TS2834, TS2835 | 9 | 1.0% |
| CFS-like (symbol or member not found) | TS2339, TS2305, TS2459, TS2724, TS2304, TS2552, TS2551 | 360 | 40.2% |
| class called without `new` | TS2348 | 282 | 31.5% |
| type or argument mismatch | TS2322, TS2345, TS2554, TS2555 | 127 | 14.2% |
| other | | 118 | 13.2% |

The two largest codes are TS2339 "property does not exist" (341) and TS2348 (282). Of the 341 TS2339 errors, 222 (in 16 files) call a schema method such as `parse`, `safeParse`, `optional` or `create` on the class object itself, for example `ZodUUID.parse(...)`, instead of on an instance. Another 66 (in 4 files) read `.issues` or `.value` from the result of an internal `run` call whose type may be a Promise.

Finding 2. Most compile errors come from using zod's `$constructor` classes the wrong way: calling the class without `new` (282) or calling instance methods on the class (222), together 504 of 896 errors (56%). In week 2 the same misuse appeared almost only as TS2348 (62% of 73 errors). The paper's dominant layer, Cannot Find Symbol, reappears here as the largest layer (40%), mostly through the second form of the misuse. The prompt shows the class definition but not how an instance is created.

**Execution.** 69 of 87 files load and run 920 cases, of which 296 pass (32.2%). The 624 failures are mostly `TypeError` (511), then `AssertionError` (87). Of the 18 files that fail to load, 11 stop at `Cannot read properties of undefined` during file setup, mostly reading `checks` or `pattern` from a definition object that was never passed when a class was built. This is the same class misuse at runtime.

Passing cases are spread over the sample: 26 of 30 units have at least one passing case, led by `ZodEnum` (35), `$ZodDate` (29), `ZodSuccess` (26), `ZodMiniVoid` (24) and `$ZodCheckStartsWith` (23). In week 2, 33 of 35 passing cases came from `ZodEnum`.

| stratum | files that load | cases passed |
|---|---|---|
| core (12 units) | 29/35 | 130/290 (44.8%) |
| classic (9 units) | 23/27 | 93/305 (30.5%) |
| mini (9 units) | 17/25 | 73/325 (22.5%) |

`105-$ZodEmoji` TOT counts 7 passing cases that only wrote a first-run snapshot of a `TypeError`; they are kept as vitest reports them (without them: 289/920).

Finding 3. The pass rate is close to week 2 (32% vs 29%), but the passing tests are no longer concentrated in one unit. The week-2 observation that only the `ZodEnum` files passed was a property of the 5-unit sample.

**Typecheck and execution disagree.** Of the 6 files that pass tsc, 2 are working tests of the class (`088-$ZodCheckStartsWith` COT 7/8, `137-$ZodDate` TOT 6/7). The others pass 0/8, pass 0/17, fail to load, or pass 7/8 against a hand-written stand-in for the class (§2.5). Many files with type errors still pass most of their cases.

### 2.4 Static quality and test smells

| | files | biome errors | biome warnings | tests (AST) | assertion roulette | magic number |
|---|---|---|---|---|---|---|
| COT | 28 | 20 | 3 | 369 | 155 (42.0%) | 45 (12.2%) |
| TOT | 29 | 11 | 5 | 281 | 136 (48.4%) | 26 (9.2%) |
| GTOT | 30 | 23 | 11 | 373 | 171 (45.8%) | 41 (11.0%) |
| all LLM | 87 | 54 | 19 | 1,023 | 462 (45.2%) | 112 (10.9%) |
| DEV | 81 | 0 | 0 | 820 | 493 (60.1%) | 213 (26.0%) |

DEV figures reproduce weeks 1 and 2 exactly. The profile matches week 2: every technique violates the repository's lint rules, assertion roulette is somewhat below the dev suite, and magic numbers are much rarer.

### 2.5 Coverage

| | mean over 30 units (missing = 0) | mean over files that ran | mean over files that also pass tsc |
|---|---|---|---|
| COT | 51.6% | 70.4% (n=22) | 66.7% (n=3) |
| TOT | 63.2% | 82.5% (n=23) | 78.8% (n=2) |
| GTOT | 56.1% | 70.1% (n=24) | none |
| DEV | 97.6% | | |

Branch coverage is in `results/matrix.md`; v8 branch totals depend on what ran and are not compared across runs.

Finding 4. Unit line coverage does not tell working tests from broken ones. 40 of the 69 files that ran reach 100% line coverage. Twelve of them pass at most 10% of their cases; all twelve target units with 4 to 8 executable lines, where constructing the class executes every line. In the other direction, two files pass 7 of 8 cases with 0% coverage because they test a stand-in (a hand-made mock object, or a `vi.mock` re-implementation of the class) instead of the class.

### 2.6 Run-to-run variation (the five week-2 units)

The five week-2 units were generated again with byte-identical prompts, the same model and temperature 0.

| measure | result |
|---|---|
| pairs (unit × technique) with an identical extracted file | 0 of 15 |
| pairs whose load status changed | 6 of 15 |
| pairs whose passed count changed | 5 of 15 |
| pooled over the 15 pairs | week 2: 35/119 passed, 11 files loaded; this run: 44/126 passed, 10 files loaded |

OpenRouter routed the 90 calls to 14 upstream providers (week 2: 9 providers for 15 calls); the provider is not pinned.

Finding 5. One generation per unit and technique is a noisy measurement. Temperature 0 does not make the output repeatable across calls, and a single unit's outcome can flip between loading and not loading. Pooled figures are comparable between runs; per-unit results are not.

### 2.7 Cost and time

90 calls, $0.087, 273,258 completion tokens (median 2,430 per call). Machine time about 81 minutes, of which generation took 66 minutes at concurrency 2. One call (the repetition loop in §2.2) ran for 27 minutes; the other 89 calls finished within 40 minutes. The later steps took about 1 second per file each (typecheck 1.1 s, execution 0.7 s, coverage 1.0 s).

## 3. Threats to validity

1. ZSL and FSL not run; their templates are reconstructions pending the authors' text.
2. One generation per unit and technique, with unpinned providers. §2.6 shows the size of the resulting variation; per-unit differences, including those between week 2 and this run, are not attributable to anything but chance.
3. The module-path line deviates from the paper (no import injection).
4. All 30 units are `$constructor` classes. The four plain classes in the pool were not drawn, so the class-misuse finding is about zod's `$constructor` pattern.
5. Line coverage saturates on small units and can be 0% for tests of stand-ins (Finding 4). Under the paper's rule (coverage only for compilable suites) almost no LLM coverage exists here.
6. The dev baseline is the whole suite, not per-class files. Smell rules are re-implementations of two TsDetect rules. One time point.

## 4. Next steps

- ZSL and FSL on the authors' reply, then the full pool of 228 units.
- For the full run: decide whether to repeat each generation (or pin the provider) so per-unit results become usable, and add a guard against runaway calls such as the 27-minute repetition loop.
- Open question from week 2, now sharper: whether a prompt should also show how a `$constructor` class is instantiated, since that misuse accounts for most compile and load failures.

## 5. Archive

`experiments/pilot-2026-09-import-n30/`: `manifest.json`, `prompts/`, `llm/` (150 prompts; 90 calls with request, response, usage and run records), `generated/`, `dev-baseline/`, `results/` (`matrix.md` with per-stratum and per-unit tables, `run-notes.md`, `comparison-week2-overlap.md`, `timing.md`, `rq*.json`, `week2/` reference copies), `scripts/`. Branch `experiment/2026-09-week4-pilot-import-n30` (orphan archive), created on commit.
