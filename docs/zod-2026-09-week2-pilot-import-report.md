# Pilot rerun with the class's module path in the prompt: zod (2026-09 week 2)

## 1. Study design

Week 1 applied the CoT, ToT and GToT prompts of *Prompt Engineering in LLMs for Automated Unit Test Generation: A Large-Scale Study* (Ouédraogo et al., EMSE 31:103, 2026) to five zod class units. No generated test file loaded, mainly because the model imported the class from a module that does not exist. This run repeats week 1 with one change: each prompt gains one line that names the module exporting the class, as a path relative to the test file. For `ZodNull` the added line reads:

```
The ZodNull class is exported from `./schemas.js` (path relative to the test file).
```

Units, model, test placement and all measurements are unchanged, and generated files are not modified. The paper used no import injection, so the added line is reported as a deviation.

| item | week 1 | week 2 |
|---|---|---|
| prompt | paper wording, language nouns substituted | same + one line with the class's module path |
| units | 5 zod class units (stratified random sample) | the same 5 |
| model, sampling | gpt-oss-120b; temperature 0; 1 run | same |
| baseline | dev test suite at t (81 files, 888 cases, all passing) | same |
| added measurement | none | import audit: does the class import resolve, which other imports fail |

Sampled units: `$ZodCheckUpperCase` (core/checks), `$ZodType` (core/schemas), `ZodEnum` (classic), `ZodNull` (classic, thin wrapper), `ZodMiniLazy` (mini, thin wrapper).

## 2. Results by RQ

**RQ0 Generation.** 15/15 calls complete (`finish_reason` stop, no truncation).

**RQ1 Format compliance.** MSR 15/15, CSR 15/15 (week 1: 14/15), CSR strict 9/15. Six responses decorated the markers. One also quoted the markers inside the test file's own comment, so markers are recognized only when they stand alone on a line.

**RQ2 Syntax, typecheck, execution.**

| technique | syntax ok | tsc ok | loads at t | cases run | passed | pass rate |
|---|---|---|---|---|---|---|
| CoT | 5/5 | 0/5 | 4/5 | 38 | 13 | 34.2% |
| ToT | 5/5 | 0/5 | 4/5 | 46 | 11 | 23.9% |
| GToT | 5/5 | 0/5 | 3/5 | 35 | 11 | 31.4% |
| all | 15/15 | 0/15 | 11/15 | 119 | 35 | 29.4% |
| all, week 1 | 14/15 | 0/15 | 0/15 | 0 | 0 | n/a |
| DEV | 81/81 | by construction | 81/81 | 888 | 888 | 100% |

The class import resolves in 15/15 files (week 1: 0 of 14).

tsc errors grouped by the paper's compilation-error layers:

| run | Package Does Not Exist-like | Cannot Find Symbol-like | type or argument mismatch | constructor called without `new` | other | total |
|---|---|---|---|---|---|---|
| week 1 | 24 (41%) | 16 (27%) | 0 | 0 | 19 (32%) | 59 |
| week 2 | 3 (4%) | 4 (5%) | 12 (16%) | 45 (62%) | 9 (12%) | 73 |

Finding 2: the added line removes the class-import failure, and generated tests run for the first time (11/15 files load, 35 of 119 cases pass).

Finding 2a: the next failure layer is now visible. 62% of tsc errors are calls to a zod class without `new` (`ZodNull()`). zod builds its classes with `core.$constructor`, and the prompt shows the definition but no usage. A Java compiler reports the same mistake as Cannot Find Symbol, the paper's dominant layer. The pattern already appeared in 6 of 14 week-1 files but was hidden behind the import failures.

Finding 2c: 33 of the 35 passing cases come from `ZodEnum`, the only unit whose tests use `new` (all three files). The other four units pass 2 of 85 cases. Of the 84 failing cases, 79 end in `TypeError` and 5 in `AssertionError`; 4 files fail at load.

**RQ3 Static quality (biome, repository rules).** LLM files: 13 errors, 1 warning over 15 files (CoT 4/0, ToT 5/1, GToT 4/0); week 1: 9/10 over 14. Dev files: 0/0.

**RQ4 Readability.** Excluded (Java-only model).

**RQ5 Coverage.** Line coverage of each unit, measured on the files that load and including the execution of failing cases.

| technique | mean over 5 units (non-loading file = 0) | mean over files that ran |
|---|---|---|
| CoT | 61.73% | 77.16% (4 files) |
| ToT | 80.0% | 100.0% (4 files) |
| GToT | 41.73% | 69.55% (3 files) |
| DEV | 100.0% | |

Finding 5: these numbers describe execution, not test adequacy. Six of the eleven files that ran reach 100% line coverage of their unit while passing at most one case; all six target the three smallest units (4 to 7 executable lines). Only the two larger units discriminate: `$ZodType` files cover 8.64% (7/81) against 100% for the dev suite, and `ZodEnum` files cover 100% with passing tests. No file passes tsc, so under the paper's rule (coverage on compilable suites only) there is no LLM coverage value.

**RQ6 Test smells.**

| | tests | assertion roulette | magic number |
|---|---|---|---|
| CoT | 52 | 65.4% | 5.8% |
| ToT | 41 | 58.5% | 7.3% |
| GToT | 60 | 48.3% | 5.0% |
| DEV | 820 | 60.1% | 26.0% |

Finding 6: close to week 1. Assertion roulette is near the dev rate (57% vs 60%), and magic numbers are rarer than in dev tests (6% vs 26%).

**Size.** LLM 153 tests over 15 files (10.2 per file); dev 888 cases over 81 files (11.0 per file), not matched by design.

## 3. Threats to validity

ZSL and FSL not run. Five units, one model, one run at temperature 0; different upstream providers served the calls in the two weeks, so differences other than the import outcome cannot be attributed to the added line alone. The added line deviates from the paper, which used no import injection. Unit coverage saturates on the small units and v8 branch totals vary between runs, so coverage is reported as line coverage and read as execution only. Two of the five units are thin wrappers with no own methods, while the prompt asks to test "all public methods". The dev baseline is the whole suite, not per-class files. Smell rules re-implement two TsDetect rules. One time point.

## 4. Next step

ZSL and FSL on the authors' reply. To discuss: whether the next run also shows how the class is constructed, or moves to the code-evolution question with the tests that already run.

Full record: [`zod-2026-09-week2-pilot-import-report-full.md`](zod-2026-09-week2-pilot-import-report-full.md).
