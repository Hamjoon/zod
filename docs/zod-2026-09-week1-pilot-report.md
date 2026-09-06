# Pilot: paper-prompt test generation on zod vs developer tests (2026-09 week 1)

## 1. Study design

The paper *Prompt Engineering in LLMs for Automated Unit Test Generation: A Large-Scale Study* (Ouédraogo et al., EMSE 31:103, 2026) prompts an LLM with the source of one Java class and five prompting techniques (ZSL, FSL, CoT, ToT, GToT), then measures generation, format compliance, syntax and compilation, static quality, readability, coverage and test smells against EvoSuite. This pilot applies the same prompt-only method to class units of zod (TypeScript) at v4.0.5 and compares the output with zod's own developer tests (dev tests). Per the advisor's instruction, CoT, ToT and GToT are run now; ZSL and FSL (whose original text is not published) wait for the authors' reply.

| item | paper | pilot |
|---|---|---|
| unit | Java class | zod class unit (`class` or `$constructor` definition + its type declarations) |
| population, sample | benchmark classes under a 4,096-token prompt limit, all used (690) | all 233 zod v4 class units under the same token rule (232 kept), stratified random sample of 5 |
| context | class source only | unit source only; no import guidance (as in the paper) |
| placement | not stated | test file in the unit's source directory |
| model, sampling | GPT-3.5/4, Mistral, Mixtral; 0.7; 30 runs | gpt-oss-120b; 0; 1 run |
| baseline | EvoSuite per class | dev test suite at t (81 files, 888 cases, all passing) |
| metrics | RQ0 to RQ6 | RQ0, RQ1, RQ2, RQ3 (biome), RQ5, RQ6 (two smells); RQ4 excluded (Java-only model) |

Sampled units: `$ZodCheckUpperCase` (core/checks), `$ZodType` (core/schemas, base class of all schemas), `ZodEnum` (classic), `ZodNull` (classic, thin wrapper), `ZodMiniLazy` (mini, thin wrapper). Dev line coverage of all five is 100%.

## 2. Results by RQ

**RQ0 Generation.** 15/15 calls complete (`finish_reason` stop, no truncation). Finding 0: generation is not the bottleneck.

**RQ1 Format compliance.**

| technique | MSR | CSR | CSR strict |
|---|---|---|---|
| CoT | 5/5 | 5/5 | |
| ToT | 5/5 | 4/5 | |
| GToT | 5/5 | 5/5 | |
| all | 15/15 | 14/15 | 9/15 |

Finding 1: every response used the delimiters, but 6 of 15 wrapped them in markdown bold and one mixed prose into the block; format compliance is imperfect even with explicit markers, as in the paper.

**RQ2 Syntax, typecheck, execution.**

| technique | syntax ok | tsc ok | loads at t | cases run |
|---|---|---|---|---|
| CoT | 5/5 | 0/5 | 0/5 | 0 |
| ToT | 4/4 | 0/4 | 0/4 | 0 |
| GToT | 5/5 | 0/5 | 0/5 | 0 |
| DEV | 81/81 | by construction | 81/81 | 888 (100% pass) |

Of 59 tsc errors, 24 (41%) are import-path errors, 10 property-does-not-exist, 6 name-not-found, 19 other. All 14 files fail at load: 12 import the class from a module named after the class in the same directory (`./ZodNull`), which does not exist in zod; one never imports the class; one breaks in a `vi.mock` factory.

Finding 2: syntax is not the problem (14/14); execution is (0/14). The main cause is the location of the file that defines the class. In Java a public class's file name is the class name, so the paper's prompt never had to state where the class lives; in TypeScript every import is explicit and zod keeps dozens of classes per file, so "class named X" does not locate X. The paper's condition transferred verbatim is stricter in TypeScript than in Java, and the paper's "Cannot Find Symbol" layer is never reached.

**RQ3 Static quality (biome, repository rules).** LLM files: 9 errors, 10 warnings over 14 files (CoT 3/4, ToT 5/4, GToT 1/2). Dev files: 0/0 (enforced in CI). Finding 3: every technique violates project lint rules the model was never shown; GToT least.

**RQ4 Readability.** Excluded (Java-only model).

**RQ5 Coverage.** Not measurable: no LLM file loads. Dev suite: 100% lines on the five units (branches 71 to 100%), 97.1% lines over the 228-unit pool. Finding 5: the intended comparison could not be made; the dev row is the ceiling for the next run.

**RQ6 Test smells.**

| | tests | assertion roulette | magic number |
|---|---|---|---|
| CoT | 53 | 71.7% | 3.8% |
| ToT | 31 | 71.0% | 6.5% |
| GToT | 54 | 57.4% | 5.6% |
| DEV | 820 | 60.1% | 26.0% |

Finding 6: assertion roulette is similar in LLM and dev tests (66% vs 60%; neither corpus uses assertion messages). Magic numbers are rarer in LLM tests (5%) than in dev tests (26%), the reverse of the paper's near-100% rate, because the pilot rule counts only literals inside expect chains and the LLM tests assert on shapes and errors more than on values.

**Size.** LLM 138 tests over 14 files (9.9 per file); dev 888 cases over 81 files (11.0 per file), not matched by design.

## 3. Threats to validity

ZSL and FSL not run. Population is the repository, not a benchmark; five units, one model, one run at temperature 0. The Java rule "class name = file name" does not transfer, so every RQ2 failure is an import-path failure; the paper does not state where its test files were placed, and the in-directory placement is the pilot's choice. Two of the five units are thin wrappers with no own methods, while the prompt asks to test "all public methods". The dev baseline is the whole suite, not per-class files. Smell rules are pilot re-implementations of two TsDetect rules. One time point.

## 4. Next step

Run the TypeScript equivalent of the paper's condition: same prompts plus, as one import line, the information the class name carried in Java (the path of the file that defines the class), on units with at least one own public member. The added line is a deviation in wording, not in information. Then ZSL/FSL on the authors' reply.

Full record: `zod-2026-09-week1-pilot-report-full.md`.
