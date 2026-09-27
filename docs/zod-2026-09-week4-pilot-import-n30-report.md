# Pilot with the class's module path in the prompt, 30 units: zod (2026-09 week 4)

## 1. Question

The week-2 pilot used the prompts of Ouédraogo et al. (EMSE 2026) on five zod classes, with one added line naming the module that exports the class. That line fixed the class import, but compilation still failed and a minority of test cases passed. While the authors' zero-shot and few-shot prompts are pending, this run repeats the week-2 condition on 30 classes and asks:

1. Does the week-2 picture hold on 30 classes?
2. How much do results vary when the same prompt is sent again?

## 2. Cases

30 class units of zod v4.0.5, drawn at random in proportion to the three source directories (core 12, classic 9, mini 9) from the same pool of 228. The five week-2 units are included. All 30 are generated fresh.

## 3. Protocol

Unchanged from week 2: the paper's CoT, ToT and GToT prompts with the module-path line, `gpt-oss-120b` via OpenRouter, temperature 0, one call per class and technique (90 calls). Each generated file is checked for format, syntax, typecheck, execution, unit line coverage, lint and two test smells, and compared with zod's own tests (DEV).

## 4. Results

| | COT | TOT | GTOT | all | DEV |
|---|---|---|---|---|---|
| test file extracted (CSR) | 28/30 | 29/30 | 30/30 | 87/90 | |
| class import resolves | | | | 85/87 | |
| passes tsc | 3 | 2 | 1 | 6/87 | |
| file loads | 22 | 23 | 24 | 69/87 | 81/81 |
| cases passed | 105/286 (37%) | 93/287 (32%) | 98/347 (28%) | 296/920 (32%) | 888/888 |
| unit line coverage (mean over 30, missing = 0) | 51.6% | 63.2% | 56.1% | | 97.6% |

Week 2 (5 classes): 15/15 extracted, 0/15 pass tsc, 11/15 load, 35/119 cases passed (29%).

Repeat of the five week-2 classes with identical prompts: none of the 15 files is the same as in week 2, and 6 of 15 changed between loading and not loading. The 90 calls went to 14 different providers.

Cost $0.087 for 90 calls; about 81 minutes of machine time, mostly generation.

## 5. Observations

1. **The import line keeps working.** 85 of 87 files import the class from the given module.
2. **Compilation fails mainly because the model misuses zod's classes.** 56% of the 896 type errors are either a class called without `new` (282) or a schema method called on the class itself, such as `ZodUUID.parse(...)` (222). The paper's dominant error layer, Cannot Find Symbol, is again the largest here (40%). The prompt shows the class definition but not how an instance is created.
3. **The pass rate is close to week 2 (32% vs 29%), but the passing tests are spread out.** 26 of 30 classes have at least one passing case. In week 2 almost all passes came from one class, so that observation came from the small sample.
4. **Typecheck, pass rate and coverage disagree.** Only 2 of the 6 files that pass tsc are working tests of the class. Twelve files reach 100% line coverage while passing at most 10% of their cases (small classes), and two files pass 7 of 8 cases with 0% coverage because they test a stand-in instead of the class.
5. **One run per class is noisy.** Temperature 0 does not give repeatable output through OpenRouter. Pooled figures are comparable across runs; per-class results are not.

## 6. Limitations

Zero-shot and few-shot prompts not run (pending the authors). The module-path line deviates from the paper. One generation per class with unpinned providers. All 30 sampled classes use zod's `$constructor` pattern. Line coverage saturates on small classes. The DEV baseline is the whole test suite. One time point.

## 7. Next step

Zero-shot and few-shot prompts on the authors' reply, then the full pool of 228 classes. For that run: repeated generations or a pinned provider, and a guard against runaway calls. Open question: whether the prompt should also show how a class is instantiated.

Full record: [`zod-2026-09-week4-pilot-import-n30-report-full.md`](zod-2026-09-week4-pilot-import-n30-report-full.md)
