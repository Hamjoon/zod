# Pilot: paper-prompt test generation on zod vs developer tests, full record (2026-09 week 1)

Status: full record (authoritative). The summary report `zod-2026-09-week1-pilot-report.md` is an excerpt of this document; every number there must match a number here.
Run date: 2026-09-05 (KST). Instruction document: `pilot-cc-instructions-2026-09-week1.md` ("Issued 2026-09-05"). Evidence root: `experiments/pilot-2026-09/`. Run notes: `results/run-notes.md` (21 entries, cited below by id).

## 1. Study design

### 1.1 Question

The paper *Prompt Engineering in LLMs for Automated Unit Test Generation: A Large-Scale Study* (Ouédraogo et al., EMSE 31:103, 2026) generates JUnit tests for Java classes with five prompting techniques (ZSL, FSL, CoT, ToT, GToT), each prompt containing only the class under test, and measures the output on seven research questions (RQ0 generation, RQ1 format compliance, RQ2 syntax and compilation, RQ3 static quality, RQ4 readability, RQ5 coverage, RQ6 test smells) against EvoSuite. This pilot applies the same prompt-only method to class units of the zod TypeScript library at one fixed commit and compares the generated tests with zod's own developer-written tests (dev tests) on the paper's language-independent metrics. Sub-questions: do the prompting techniques differ, and does the failure distribution match the paper's (Cannot Find Symbol 68 to 86% of compilation failures)?

Scope decided with the advisor (2026-09-04): CoT, ToT and GToT now; ZSL and FSL after the paper's authors reply with the original prompt text. No time axis: everything is measured at the anchor commit.

### 1.2 Paper vs pilot

| item | paper | pilot | note |
|---|---|---|---|
| language, framework | Java, JUnit 4 | TypeScript, Vitest | task premise |
| unit | class under test (CUT) | class unit: a `class` declaration or a `$constructor` definition plus same-name type declarations in the same file (§1.3) | zod declares 6 `class`es and 228 `$constructor` classes |
| population | benchmark classes (SF110, Defects4J, CMD) filtered by token limit | all 233 class units in `packages/zod/src/v4` (tests and locales excluded) filtered by the same token rule | population is the repository, not a benchmark (deviation) |
| sample | every filtered class (690) | stratified random 5 of 228 (seed 20260904) | pilot scale (deviation) |
| token rule | every prompt for the class fits 4,096 tokens | longest rendered prompt (FSL, example included) ≤ 4,096 tokens, tiktoken o200k_base | same rule |
| context given to the model | CUT source only | unit source only | same |
| import guidance | none (in Java a public class's file name is the class name, so "class named X" already locates X) | none (D1) | same wording; different consequence, see Finding 2 |
| test placement | not stated in the paper; the package's compile script compiles against the project sources | unit's source directory, `<class>.pilot.test.ts`, transient (D6) | pilot choice |
| model | GPT-3.5-turbo, GPT-4, Mistral 7B, Mixtral 8×7B | `openai/gpt-oss-120b` via OpenRouter | same model as earlier experiments |
| temperature, runs | 0.7, 30 per class | 0, 1 per class | deviation |
| prompts | 5 | CoT, ToT, GToT run; ZSL, FSL rendered and archived, not sent | ZSL/FSL original text not published |
| baseline | EvoSuite, 30 suites per class | dev test suite at t (81 files, 888 cases) | no per-class dev suite exists |
| metrics | RQ0 to RQ6 | RQ0, RQ1, RQ2, RQ3 (biome), RQ5, RQ6 (two smells) | RQ4 readability excluded (Java-only model) |

### 1.3 Units

Anchor t = zod v4.0.5, commit `45afab0f846dffd591362b6f770017507eb185b5` (verified equal to upstream tag). Unit text = the declaring statement plus every top-level `interface`/`type` in the same file named `X` or `X{Def,Internals,Params,Config,Issue,Fn}`, with the comment block immediately preceding each statement (J-01: section banners excluded); if the `$constructor` initializer is a separately defined identifier, that declaration is included. Population 233 (core 96, classic 70, mini 67; `$ZodRegistry` reserved as the FSL example). Token rule kept 232 (dropped `JSONSchemaGenerator`, FSL prompt 8,129 tokens). Pool after excluding four error classes whose initializer is a separate function and none for missing coverage data: 228 (core 93, classic 68, mini 67).

Sample (seed 20260904; core 2, classic 2, mini 1):

| unit | file | kind | unit tokens | FSL prompt tokens | dev line cov | dev branch cov |
|---|---|---|---|---|---|---|
| 086-$ZodCheckUpperCase | core/checks.ts | $constructor | 186 | 2,374 | 100% (7/7) | 100% (1/1) |
| 098-$ZodType | core/schemas.ts | $constructor (base class of all schemas) | 1,168 | 3,352 | 100% (81/81) | 96.2% (50/52) |
| 053-ZodEnum | classic/schemas.ts | $constructor | 457 | 2,638 | 100% (35/35) | 71.4% (5/7) |
| 038-ZodNull | classic/schemas.ts | $constructor (thin wrapper: two `init` calls) | 81 | 2,262 | 100% (4/4) | 100% (1/1) |
| 231-ZodMiniLazy | mini/schemas.ts | $constructor (thin wrapper) | 182 | 2,304 | 100% (7/7) | 100% (1/1) |

Kept-unit token distribution: median 136, p90 427, max 1,871. Dev coverage per unit is the whole dev suite's coverage restricted to the unit's declaring-statement line range (source-mapped executable lines, O-07); over the 228-unit pool: lines 97.1% mean, branches 97.9% mean.

### 1.4 Prompts

Templates: `prompts/{COT,TOT,GTOT}.txt` are the paper's Fig. 3a, 3b, 4 with only the language nouns substituted (`Java` → `TypeScript`; `JUnit 4 test cases` → `Vitest test cases`; `JUnit (4) test file` → `Vitest test file`; `{class_name}Test.java` → `{class_name}.test.ts`); the paper's typos are kept. Paper originals are archived under `prompts/paper-original/`. `prompts/ZSL.txt` (CoT minus the step list) and `prompts/FSL.txt` (ZSL with the `$ZodRegistry` unit and `classic/tests/registries.test.ts` prepended) are reconstructions, flagged `provisional` in `manifest.json`, rendered but not sent. SHA-256 of every template is in `manifest.json`. Delimiters `###Test START##` / `###Test END##` as printed in the paper's figures. Rendered prompt tokens (o200k_base):

| unit | COT | TOT | GTOT | (ZSL) | (FSL) |
|---|---|---|---|---|---|
| 086-$ZodCheckUpperCase | 360 | 315 | 440 | 252 | 2,374 |
| 098-$ZodType | 1,336 | 1,295 | 1,416 | 1,230 | 3,352 |
| 053-ZodEnum | 622 | 583 | 703 | 516 | 2,638 |
| 038-ZodNull | 246 | 207 | 327 | 140 | 2,262 |
| 231-ZodMiniLazy | 289 | 248 | 370 | 182 | 2,304 |

### 1.5 Pipeline

Generation (Phase 3): one `user` message, no system message, temperature 0, no `max_tokens`, no retries, concurrency ≤ 2; six evidence files per call under `llm/{unit}/{TECH}/` (`prompt.md`, `request.json` body only, `raw-response.json`, `response.md`, `usage.json`, `run.json`). Extraction (Phase 4): delimiter-first, fallback patterns only when delimiters are absent; structure check = has `import`, a `test(`/`it(` call, an `expect(`, balanced braces, no fence or HTML lines. Syntax (Phase 5a): TypeScript parser diagnostics. Typecheck (5b): `tsc --noEmit` per file at its in-place path with a tsconfig extending `packages/zod/tsconfig.test.json`. Execution (5c): vitest with `experiments/pilot-2026-09/vitest.pilot.mts` (source-tree resolution, typecheck disabled), one file at a time, JSON reporter. Coverage (6): v8, restricted to the unit's line range, only for files that load. Static quality (7): biome 1.9.4 with the repo `biome.jsonc`; test smells with `scripts/smells.ts` (rules in `results/smell-rules.md`). Dev baseline: the repo's own v4 suite at t (`npx vitest run src/v4` from `packages/zod`), runtime half of the reporter (typecheck half excluded).

## 2. Results

### RQ0 Generation

15/15 calls returned HTTP 200, `finish_reason` = `stop`, non-empty content; no call repeated. OpenRouter routed the calls to six upstream providers (recorded per call). Completion tokens (reasoning included):

| unit | COT | TOT | GTOT |
|---|---|---|---|
| 086-$ZodCheckUpperCase | 2,058 | 3,087 | 2,156 |
| 098-$ZodType | 3,849 | 3,788 | 2,397 |
| 053-ZodEnum | 2,123 | 1,923 | 2,152 |
| 038-ZodNull | 2,496 | 1,393 | 3,298 |
| 231-ZodMiniLazy | 2,344 | 2,623 | 2,206 |

Finding 0. Generation is not the bottleneck: every prompt produced a complete response.

### RQ1 Format compliance (MSR, CSR)

| technique | MSR | CSR (marker decoration accepted, J-02) | CSR strict |
|---|---|---|---|
| COT | 5/5 | 5/5 | see `rq1-extraction.json` |
| TOT | 5/5 | 4/5 | see `rq1-extraction.json` |
| GTOT | 5/5 | 5/5 | see `rq1-extraction.json` |
| all | 15/15 | 14/15 | 9/15 |

All 15 responses contained both delimiters. In 6 of 15 the model wrote them in markdown bold (`**###Test START##**`) with the file fenced between them; the extractor accepts the emphasis as marker decoration (J-02) and reports the strict count alongside. The one unstructured response (`086-$ZodCheckUpperCase` TOT) has prose between the closing fence and the END marker, so its delimiter block is not a single file; it was not sent to Phase 5.

Finding 1. The delimiter instruction is followed in wording but not in form: 40% of responses decorate the markers, and one mixes prose into the block. This matches the paper's observation that format compliance is imperfect even with explicit markers (paper: MSR varies by technique; CSR below MSR).

### RQ2 Syntax, typecheck, execution

| technique | files | syntax ok | tsc ok | files that load at t | cases run | pass rate |
|---|---|---|---|---|---|---|
| COT | 5 | 5/5 | 0/5 | 0/5 | 0 | n/a |
| TOT | 4 | 4/4 | 0/4 | 0/4 | 0 | n/a |
| GTOT | 5 | 5/5 | 0/5 | 0/5 | 0 | n/a |
| DEV | 81 | 81/81 | by construction | 81/81 | 888 | 100% |

tsc error codes across the 14 files (59 errors): TS2834 18 and TS2835 6 (relative import path needs an explicit extension under `nodenext`; raised by imports such as `./ZodNull`), TS2339 10 (property does not exist), TS2304 6 (name not found), TS6133 5, TS7006 4, TS2578 4, TS7053 3, TS2683 1, TS18046 1, TS2698 1. Reporting categories after folding TS2834 and TS2835 into "module or path not found" (R-02, R-02b): module or path not found 24 (41%), property does not exist 10, name not found 6, other 19. Per technique: COT 15 errors (module/path 6, name 3, other 6), TOT 29 (module/path 9, property 10, other 10), GTOT 15 (module/path 9, name 3, other 3).

Execution: all 14 files fail at load time, so no test case ran. Load failure kinds (O-11): 12 files import the class from a sibling module named after the class (`./ZodNull`, `./ZodEnum`, `./$ZodType`, `./$ZodCheckUpperCase`, `./ZodMiniLazy`), which does not exist (the classes live in `schemas.ts` or `checks.ts`); several carry a comment such as `// adjust the import path as needed`. 1 file (`086-$ZodCheckUpperCase` COT) never imports the class (`$ZodCheckUpperCase is not defined`). 1 file (`231-ZodMiniLazy` TOT) fails inside a hoisted `vi.mock` factory that references top-level variables.

Finding 2. Syntax is not the problem (14/14 parse); typecheck and execution are (0/14). The main cause is the location of the file that defines the class: the model assumes one class per file, named after the class, in the same directory. In Java a public class's file name is the class name, so "class named X" already tells the model where X is and the paper's prompt did not need to say it. In TypeScript every import is explicit and zod keeps dozens of classes per file, so "class named X" does not locate X. The paper's condition transferred verbatim is therefore stricter in TypeScript than in Java, and the paper's "Cannot Find Symbol" layer is never reached because the import-path layer (paper: Package Does Not Exist, up to 23%) absorbs every file. The paper itself did not post-process imports and criticizes prior work that did (§4.4, Relation to Prior Work); the next run adds the path before generation, as one prompt line, and records it as a deviation.

Finding 2a. Even a correct relative path would fail typecheck without the `.js` extension under zod's `nodenext` resolution (TS2834/2835), while vitest would still resolve it; typecheck and execution can diverge, which is why both are recorded.

### RQ3 Static quality (biome)

| technique | files | biome errors | biome warnings |
|---|---|---|---|
| COT | 5 | 3 | 4 |
| TOT | 4 | 5 | 4 |
| GTOT | 5 | 1 | 2 |
| all LLM | 14 | 9 | 10 |
| DEV | 81 | 0 | 0 |

Categories in LLM files: `noUnusedVariables`, `noUnusedImports`, `noForEach`, `noAssignInExpressions`, `useNumberNamespace`. Dev files are lint-clean because the repo enforces biome in CI.

Finding 3. Every technique violates the repository's lint rules; GToT least. The dev suite is clean by construction (CI), so this comparison measures conformance to a project convention the model was never shown.

### RQ4 Readability

Excluded: the paper's readability model (Scalabrino et al.) is trained on Java features and has no TypeScript counterpart.

### RQ5 Coverage

Not measurable for any LLM file (none loads). DEV: 100% line coverage on all five sampled units (branch 71.4 to 100%, mean 93.5%); over the 228-unit pool, 97.1% lines and 97.9% branches (means).

Finding 5. The comparison the pilot was designed for (LLM file coverage of the class vs the dev suite's coverage of the class) could not be made; the dev row stands as the ceiling for the next run.

### RQ6 Test smells

| technique | files | tests (AST) | expect calls | assertion roulette | magic number |
|---|---|---|---|---|---|
| COT | 5 | 53 | 113 | 38 (71.7%) | 2 (3.8%) |
| TOT | 4 | 31 | 73 | 22 (71.0%) | 2 (6.5%) |
| GTOT | 5 | 54 | 105 | 31 (57.4%) | 3 (5.6%) |
| all LLM | 14 | 138 | 291 | 91 (65.9%) | 7 (5.1%) |
| DEV | 81 | 820 | 2,709 | 493 (60.1%) | 213 (26.0%) |

Rules (`results/smell-rules.md`): assertion roulette = a test with ≥ 2 `expect(` calls and no assertion message; magic number = a numeric literal other than 0, 1, -1 inside an `expect` chain. No `expect` call in either corpus carries a message, so assertion roulette reduces to "two or more expects per test". Dev test counts are static AST counts (820; the runtime reporter registers 888 because some tests are created in loops).

Finding 6. Assertion roulette is similar in LLM and dev tests (66% vs 60%); the dev suite's own style does not use assertion messages either. Magic numbers are far rarer in LLM tests (5%) than in dev tests (26%), the opposite of the paper's near-100% Magic Number Test rate; the pilot rule counts only literals inside expect chains, and the LLM tests assert on shapes and errors more than on concrete values, so the two numbers are not comparable with the paper's TsDetect figure.

### Size

LLM: 138 tests over 14 files (9.9 per file; per technique 10.6 COT, 7.8 TOT, 10.8 GTOT). DEV: 888 runtime cases over 81 files (11.0 per file), suite level, no per-class mapping.

## 3. Threats to validity

1. ZSL and FSL not run; their templates are reconstructions pending the authors' original text.
2. Population is the repository, not a benchmark; five units by stratified random draw; one model, one run at temperature 0. No variance estimate.
3. D1 (no import guidance) transfers the paper's wording, but the Java rule "class name = file name" does not hold in zod; every failure is an import-path failure, so RQ2 measures a different layer than the paper's compilation results. The paper does not state where its test files were placed; D6 (same directory as the class's source file) is the pilot's choice.
4. Unit texts of `$constructor` wrappers can contain no method at all (`ZodNull`, `ZodMiniLazy`), while the prompt asks to list and test "all public methods"; the paper's Java classes carried their own methods. Own-member content was not a sampling criterion in this run.
5. O-01: FSL, when run, will be the only technique whose prompt shows an import statement (through the example test file); this mirrors the paper's design.
6. Dev baseline is the whole suite; per-class dev coverage is the suite's coverage of the class, not a per-class dev test file. Case counts are reported, not matched.
7. Smell rules are pilot re-implementations of two of TsDetect's rules, with a narrower magic-number definition.
8. One time point; no code-evolution axis.

## 4. Deviations and judgment calls (from `run-notes.md`)

D-01 temporary `@vitest/coverage-v8@2.1.9` install for the dev coverage run, `package.json`/lockfile restored, tree clean. D-02 fresh clone (earlier clone absent); Phase 1 rerun, identical counts. O-02 static `test(`/`it(` count 869 (45 commented-out occurrences; no `test.each` in v4). J-01 attached comments = immediately preceding block only. O-06 mini unit label 231 vs 230 in an earlier draw (name only). O-07 executable line = source-mapped line. O-09 reported prompt tokens exceed tiktoken counts by 50 to 70 (chat template). J-02 marker decoration accepted, strict count reported. O-10/R-02/R-02b TS2834 and TS2835 folded into module-or-path. O-11 load failures as listed. O-12 coverage not measurable. O-13 biome glob fixed to recursive before hand-off (81 files).

## 5. Usage

15 calls; prompt tokens 207 to 1,416 per call (tiktoken) plus template overhead; completion tokens 1,393 to 3,849 (reasoning included). Total OpenRouter cost about $0.01 (per-call cost in `usage.json`). Wall time for Phases 3 to 7 about 30 minutes including script writing.

## 6. Archive

`experiments/pilot-2026-09/`: `manifest.json`, `vitest.pilot.mts`, `prompts/` (5 templates, 3 paper originals), `llm/` (25 prompts, 15 calls × 6 evidence files), `generated/` (14 structured files + `_unstructured/`), `dev-baseline/`, `results/` (RQ JSONs, `matrix.md`, `smell-rules.md`, `run-notes.md`, phase logs, per-file typecheck/test/coverage outputs), `scripts/`. Branch `experiment/2026-09-week1-pilot` (orphan archive) on commit.

## 7. Next step

A second run under the TypeScript equivalent of the paper's condition: keep the paper's prompts and add, as one import line, the information that the class name carried in Java (the path of the file that defines the class), and restrict the sample to units with at least one own public member (the prompt's premise). The added line is a deviation in wording, not in information. Then ZSL/FSL on the authors' reply. The code-evolution axis remains a later decision.
