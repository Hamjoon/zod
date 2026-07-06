# GPT-OSS repair target classification 3:3 다중 사례 실험

## 공개 산출물 링크

- 실험 대상 프로젝트: [colinhacks/zod](https://github.com/colinhacks/zod)
- 산출물 저장소: [Hamjoon/zod](https://github.com/Hamjoon/zod)
- 보고서 고정 태그: [experiment-2026-07-week1-repair-classification-matrix](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix)
- 보고서 직접 링크: [docs/zod-repair-classification-multi-case.md](https://github.com/Hamjoon/zod/blob/experiment-2026-07-week1-repair-classification-matrix/docs/zod-repair-classification-multi-case.md)
- archive branch: [experiment/2026-07-week1-repair-classification-archive](https://github.com/Hamjoon/zod/tree/experiment/2026-07-week1-repair-classification-archive)
- 작업 확인용 PR: [Hamjoon/zod#9](https://github.com/Hamjoon/zod/pull/9)

## 실험 질문

이 실험은 Zod의 targeted test failure를 보고 `gpt-oss-120b`가 올바른 repair target을 고르는지 확인한다.

비교 대상은 두 종류다.

1. stale-test case
   - upstream `t+1`에서 production behavior가 의도적으로 바뀌었고, 올바른 대응은 test expectation update인 사례
2. production-regression case
   - upstream `t+1`에서 새 test oracle이 production bug를 드러내고, 올바른 대응은 production code fix인 사례

핵심 평가는 patch quality 전체가 아니라 first-order classification이다.

> Failing test를 보고 model이 test file을 고쳐야 하는 상황과 production file을 고쳐야 하는 상황을 구분하는가?

## 실행 방식

모든 case는 같은 shared runner를 사용했다.

- runner: `scripts/run-gptoss-test-maintenance.py`
- model: `openai/gpt-oss-120b`
- provider: OpenRouter
- signal runner: `scripts/run-zod-signal-eval.mjs`

Mode는 case bucket에 따라 달리 사용했다.

- stale-test: default `test-maintenance`
- production-regression: `--mode repair-classification`

Raw model run은 먼저 repository 밖의 `/tmp/zod-matrix-results/<case>/`에 저장했다. 공개 산출물에는 재현 가능한 case packet을 아래 경로로 보존했다.

```text
experiments/zod-repair-classification-matrix/cases/<case>/
```

각 case directory에는 fixture patch, failure log, GPT-OSS repair patch, GPT-OSS response, token/cost usage JSON이 들어 있다. Coverage와 StrykerJS 결과는 각 case의 `signal/` directory에 보존했다.

## Commit 구성

이 산출물은 Zod source tree를 상속하지 않는 orphan archive branch 위에 구성했다. 브랜치에는 보고서, runner, case artifact만 포함하고, 실제 Zod source tree는 포함하지 않는다.

Archive branch는 여섯 개 case pair와 마지막 summary commit 하나로 구성했다.

stale-test case는 다음 두 commit으로 구성했다.

1. fixture commit: production evolution만 적용하고 기존 test expectation은 stale 상태로 둔다.
2. repair commit: GPT-OSS가 생성한 test repair packet을 보존한다.

production-regression case는 다음 두 commit으로 구성했다.

1. fixture commit: production regression을 드러내는 test-only oracle만 적용한다.
2. repair commit: GPT-OSS가 생성한 production repair packet을 보존한다.

브랜치 마지막 commit은 이 summary document와 shared runner update를 담는다. 전체 구조는 다음과 같다.

- stale-test case pair 3개: commit `6`개
- production-regression case pair 3개: commit `6`개
- 결과 문서와 shared runner: commit `1`개
- 총 commit 수: `13`개

## Case Matrix 결과

| ID | 분류 | Base commit | Upstream commit | 기대 target /<br>Model 선택 | Repair<br>완성도 | Signal 유지 판정 | 비고 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | stale-test | [1899684f](https://github.com/colinhacks/zod/commit/1899684fc34d149ebb5d6f9fd95a588e94f27053) | [0fe88407](https://github.com/colinhacks/zod/commit/0fe88407a4149c907929b757dc6618d8afe998fc) object extend production change | test / test (일치) | complete | signal_weakened | Model은 `object.test.ts` expectation을 throw에서 non-throw로 수정했지만 focused mutants 일부가 survived/no-coverage였다. |
| S2 | stale-test | [7abe4e51](https://github.com/colinhacks/zod/commit/7abe4e510042cc05aafdcf4c1a80ba9c91d998f5) | [ae68f62f](https://github.com/colinhacks/zod/commit/ae68f62fddc4f7b2bbc5df5a9ca49a83c697eef2) tuple `too_big` inclusive issue | test / test (일치) | complete | signal_preserved | Model은 tuple inline snapshot에 `inclusive: true`와 `<=`를 반영했고 focused mutants 3개를 모두 killed했다. |
| S3 | stale-test | [57d80a82](https://github.com/colinhacks/zod/commit/57d80a82bde8877f3eb79e5dad9786096c37490f) | [f32ddf9e](https://github.com/colinhacks/zod/commit/f32ddf9e581d5ba5f0278ad26b1bfb9ff8f8a6dd) `z.undefined()` optout change | test / test (일치) | partial | partial_repair | Model은 test patch를 선택했지만 direct `z.undefined()` expectation만 수정했고 target validation이 실패했다. |
| P1 | production-regression | [95ccab42](https://github.com/colinhacks/zod/commit/95ccab423aec720b2523c3a64cdc7e3204537cc7) | [cede2c63](https://github.com/colinhacks/zod/commit/cede2c63739a5823d6aa5093d291e9a111da943d) tuple holes before required defaults | production / production (일치) | yes | complete | signal_preserved | Model은 `core/schemas.ts`를 선택했고 focused mutants 2개를 모두 killed했다. |
| P2 | production-regression | [195e8696](https://github.com/colinhacks/zod/commit/195e86962b5156012a4cdcfbff87dffddce87b78) | [61d7bedb](https://github.com/colinhacks/zod/commit/61d7bedb873bf8185162bb51d027fd8acf2710ee) `z.record()` key schema transforms | production / production (일치) | yes | complete | signal_preserved | 핵심 key schema 실행과 transformed output key 저장 sub-range에서 focused mutants 4개를 모두 killed했다. |
| P3 | production-regression | [02c2baf7](https://github.com/colinhacks/zod/commit/02c2baf7d0d615872fa4528a8020603b71211702) | [b5ab55e4](https://github.com/colinhacks/zod/commit/b5ab55e41b615e961775feb2160c2eddf29fdf84) catch/preprocess absent object keys | production / production (일치) | yes | complete | signal_weakened | Target test는 통과했지만 focused mutants 2개가 survived했다. |

요약:

- target classification: expected target과 `6 / 6` 일치
- stale-test controls: `3 / 3` 모두 test file repair 선택
- production-regression cases: `3 / 3` 모두 production file repair 선택
- repair completeness: `5 / 6` complete, `1 / 6` partial
- signal verdict: `3 / 6` signal_preserved, `2 / 6` signal_weakened, `1 / 6` partial_repair

`Repair 완성도`는 target 선택 이후 model patch가 해당 case의 oracle repair 범위를 얼마나 채웠는지를 나타낸다. `partial`은 repair target은 맞았지만 upstream oracle의 일부 assertion이나 expectation을 놓친 경우다.

## Coverage 및 Mutation Signal

이번 보고서에서는 6개 case에 대해 coverage와 focused StrykerJS signal check를 수행했다. S3는 GPT-OSS repair가 partial이라 target validation에서 실패했고, coverage/StrykerJS는 실행하지 않고 `partial_repair`로 기록했다. 나머지 5개 case는 target validation, coverage, focused StrykerJS를 실행했다.

Coverage는 target test가 관련 production file을 실행하는지 확인하는 용도다. StrykerJS는 해당 production change 주변의 focused mutant가 repaired test에 의해 killed되는지 확인하는 용도다. Coverage만으로는 signal 보존 여부를 판정하지 않는다. [Hamjoon/zod#7](https://github.com/Hamjoon/zod/pull/7)에서도 같은 production path를 실행하는 두 repair를 coverage만으로는 구분하지 못했고, focused StrykerJS가 weak repair를 구분했다.

| ID | Target validation | Coverage line summary | Focused StrykerJS scope | Mutants | Signal verdict | Artifact |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | pass | `util.ts` 130/313 lines, 41.53% | `util.ts:656-677` | Killed 8 / Survived 9 / NoCoverage 2 | signal_weakened | [signal](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix/experiments/zod-repair-classification-matrix/cases/s1-stale-object-extend/signal) |
| S2 | pass | `schemas.ts` 194/1084 lines, 17.89% | `schemas.ts:2537-2537` | Killed 3 / Survived 0 / NoCoverage 0 | signal_preserved | [signal](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix/experiments/zod-repair-classification-matrix/cases/s2-stale-tuple-too-big/signal) |
| S3 | fail | not run | not run | not run | partial_repair | [signal](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix/experiments/zod-repair-classification-matrix/cases/s3-stale-undefined-optout/signal) |
| P1 | pass | `schemas.ts` 314/1161 lines, 27.04% | `schemas.ts:2680-2681` | Killed 2 / Survived 0 / NoCoverage 0 | signal_preserved | [signal](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix/experiments/zod-repair-classification-matrix/cases/p1-prod-tuple-holes/signal) |
| P2 | pass | `schemas.ts` 429/1134 lines, 37.83% | `schemas.ts:2791`, `schemas.ts:2806-2807` | Killed 4 / Survived 0 / NoCoverage 0 | signal_preserved | [signal](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix/experiments/zod-repair-classification-matrix/cases/p2-prod-record-key-transform/signal) |
| P3 | pass | `schemas.ts` 372/1165 lines, 31.93% | `schemas.ts:1762-1762` | Killed 7 / Survived 2 / NoCoverage 0 | signal_weakened | [signal](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix/experiments/zod-repair-classification-matrix/cases/p3-prod-catch-absent-key/signal) |

Signal check 결과는 target classification 결과보다 더 엄격하다.

- S2, P1, P2는 focused mutants가 모두 killed되어 `signal_preserved`로 판정했다.
- S1은 object extend target test가 pass하고 coverage도 잡혔지만, overlapping-key/refinement behavior 주변 mutant가 다 죽지 않아 `signal_weakened`로 판정했다.
- S3는 GPT-OSS test repair가 incomplete라 target validation부터 실패했고 `partial_repair`로 판정했다.
- P3는 production repair target과 target test pass는 맞지만, absent-key handling 조건의 focused mutant 2개가 survived하여 `signal_weakened`로 판정했다.

## Stale-Test Control 사례

### S1. Object extend stale expectation

- case packet: [experiments/zod-repair-classification-matrix/cases/s1-stale-object-extend](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix/experiments/zod-repair-classification-matrix/cases/s1-stale-object-extend)
- base commit: [1899684f](https://github.com/colinhacks/zod/commit/1899684fc34d149ebb5d6f9fd95a588e94f27053)
- upstream commit: [0fe88407](https://github.com/colinhacks/zod/commit/0fe88407a4149c907929b757dc6618d8afe998fc) (`allow non-overwriting extends with refinements. 4.3.1`)
- fixture commit: [187b3f03](https://github.com/Hamjoon/zod/commit/187b3f036f317362750160137c78b401ec3b895b) (`experiment fixture: S1 object extend production evolution`)
- GPT-OSS repair commit: [a2d3b28b](https://github.com/Hamjoon/zod/commit/a2d3b28b2bb98bc9eb3054acfa7314e51b14310f) (`test: S1 repair object extend stale expectation with gpt-oss`)
- 기대 target: `packages/zod/src/v4/classic/tests/object.test.ts`
- production context: `packages/zod/src/v4/core/util.ts`
- fail-before:
  - `object.test.ts`
  - `1 failed | 99 passed`
  - stale expectation: `schema.extend({ b: z.string() })` should throw
- model result:
  - test patch 선택
  - expectation을 `.not.toThrow()`로 변경
  - test name을 throw behavior에서 non-throw behavior로 변경

사용량:

```json
{
  "prompt_tokens": 1735,
  "completion_tokens": 404,
  "total_tokens": 2139,
  "cost": 0.000136345
}
```

### S2. Tuple `too_big` stale snapshots

- case packet: [experiments/zod-repair-classification-matrix/cases/s2-stale-tuple-too-big](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix/experiments/zod-repair-classification-matrix/cases/s2-stale-tuple-too-big)
- base commit: [7abe4e51](https://github.com/colinhacks/zod/commit/7abe4e510042cc05aafdcf4c1a80ba9c91d998f5)
- upstream commit: [ae68f62f](https://github.com/colinhacks/zod/commit/ae68f62fddc4f7b2bbc5df5a9ca49a83c697eef2) (`fix: Fix error details for tuples with extraneous elements (#5555)`)
- fixture commit: [1f3f1c58](https://github.com/Hamjoon/zod/commit/1f3f1c58fe8a2f11c4d05826aaee430038d674f1) (`experiment fixture: S2 tuple too_big production evolution`)
- GPT-OSS repair commit: [a474d130](https://github.com/Hamjoon/zod/commit/a474d1301f5601fb7341b002a389c2ce5195d449) (`test: S2 repair tuple too_big stale snapshots with gpt-oss`)
- prior signal-preservation PR: [Hamjoon/zod#7](https://github.com/Hamjoon/zod/pull/7)
- 기대 target: `packages/zod/src/v4/classic/tests/tuple.test.ts`
- production context: `packages/zod/src/v4/core/schemas.ts`
- fail-before:
  - `tuple.test.ts`
  - `2 failed | 12 passed`
  - stale snapshot은 `<2`를 기대했지만, 새 production behavior는 `inclusive: true`와 `<=2`를 emit
- model result:
  - test patch 선택
  - sync/async inline snapshot 둘 다 수정
  - 새 issue shape에 맞추면서 failure signal 유지

사용량:

```json
{
  "prompt_tokens": 2077,
  "completion_tokens": 712,
  "total_tokens": 2789,
  "cost": 0.0005637
}
```

### S3. `z.undefined()` optout stale expectation

- case packet: [experiments/zod-repair-classification-matrix/cases/s3-stale-undefined-optout](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix/experiments/zod-repair-classification-matrix/cases/s3-stale-undefined-optout)
- base commit: [57d80a82](https://github.com/colinhacks/zod/commit/57d80a82bde8877f3eb79e5dad9786096c37490f)
- upstream commit: [f32ddf9e](https://github.com/colinhacks/zod/commit/f32ddf9e581d5ba5f0278ad26b1bfb9ff8f8a6dd) (`fix: drop z.undefined()'s optout = "optional"`)
- fixture commit: [e0d9d20e](https://github.com/Hamjoon/zod/commit/e0d9d20e19a99294a5883f79e733e7c87faad81e) (`experiment fixture: S3 undefined optout production evolution`)
- GPT-OSS repair commit: [132569a3](https://github.com/Hamjoon/zod/commit/132569a38dad38b298bcd4f6b07062e04440dc1c) (`test: S3 repair undefined optout stale expectation with gpt-oss`)
- 기대 target: `packages/zod/src/v4/classic/tests/optional.test.ts`
- production context: `packages/zod/src/v4/core/schemas.ts`
- fail-before:
  - `optional.test.ts`
  - `1 failed | 29 passed`
  - stale expectation: `z.undefined()._zod.optout` should equal `"optional"`
  - new production behavior: `_zod.optout` is `undefined`
- model result:
  - test patch 선택
  - direct `z.undefined()` assertion 수정
  - upstream이 함께 수정한 `z.union([z.string(), z.undefined()])` assertion은 수정하지 못함
  - type-level expectation 하나를 과하게 좁힘

이 case는 target-classification 관점에서는 correct로 계산하지만, complete test repair로 보지는 않는다.

사용량:

```json
{
  "prompt_tokens": 1416,
  "completion_tokens": 578,
  "total_tokens": 1994,
  "cost": 0.000153484
}
```

## Production-Regression 사례

### P1. Tuple holes before required defaults

- case packet: [experiments/zod-repair-classification-matrix/cases/p1-prod-tuple-holes](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix/experiments/zod-repair-classification-matrix/cases/p1-prod-tuple-holes)
- base commit: [95ccab42](https://github.com/colinhacks/zod/commit/95ccab423aec720b2523c3a64cdc7e3204537cc7)
- upstream commit: [cede2c63](https://github.com/colinhacks/zod/commit/cede2c63739a5823d6aa5093d291e9a111da943d) (`fix(v4): reject tuple holes before required defaults (#5900)`)
- upstream PR: [colinhacks/zod#5900](https://github.com/colinhacks/zod/pull/5900)
- fixture commit: [02cf354c](https://github.com/Hamjoon/zod/commit/02cf354c5f37b6b953c1ece9aa9d85d71362e712) (`experiment fixture: P1 add tuple holes regression tests`)
- GPT-OSS repair commit: [3b454d61](https://github.com/Hamjoon/zod/commit/3b454d6180284dc0ab7ab47125fdcf71e6d405ce) (`fix: P1 repair tuple holes regression with gpt-oss`)
- 기대 target: `packages/zod/src/v4/core/schemas.ts`
- test oracle: `packages/zod/src/v4/classic/tests/tuple.test.ts`
- fail-before:
  - `tuple.test.ts`
  - `3 failed | 33 passed`
  - old parser는 `success: true`를 반환했지만, oracle은 required/defaulted output tail 앞의 absent optional slot에서 rejection을 기대
- model result:
  - production patch 선택
  - response가 `packages/zod/src/v4/core/schemas.ts`를 명시적으로 target
  - test를 약화하지 않고 tuple output truncation logic 변경을 제안

사용량:

```json
{
  "prompt_tokens": 3093,
  "completion_tokens": 3479,
  "total_tokens": 6572,
  "cost": 0.0014575
}
```

### P2. `z.record()` key schema transforms

- case packet: [experiments/zod-repair-classification-matrix/cases/p2-prod-record-key-transform](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix/experiments/zod-repair-classification-matrix/cases/p2-prod-record-key-transform)
- base commit: [195e8696](https://github.com/colinhacks/zod/commit/195e86962b5156012a4cdcfbff87dffddce87b78)
- upstream commit: [61d7bedb](https://github.com/colinhacks/zod/commit/61d7bedb873bf8185162bb51d027fd8acf2710ee) (`fix(v4): apply key schema transforms in z.record() (#5891)`)
- upstream PR: [colinhacks/zod#5891](https://github.com/colinhacks/zod/pull/5891)
- fixture commit: [e8daa1b9](https://github.com/Hamjoon/zod/commit/e8daa1b94658ca2bc63d35b15871ba84eb5dfbad) (`experiment fixture: P2 add record key transform regression tests`)
- GPT-OSS repair commit: [4b129246](https://github.com/Hamjoon/zod/commit/4b1292465315749aaaf6a1df008f37e0e2793465) (`fix: P2 repair record key transform regression with gpt-oss`)
- 기대 target: `packages/zod/src/v4/core/schemas.ts`
- test oracle: `packages/zod/src/v4/classic/tests/record.test.ts`
- fail-before:
  - `record.test.ts`
  - `2 failed | 46 passed`
  - old parser는 original key를 그대로 저장했고 key schema refinement failure를 surface하지 못함
- model result:
  - production patch 선택
  - `def.keyType._zod.run(...)` 실행 제안
  - transformed key를 output storage에 사용하는 방향 제안
  - key schema failure를 `invalid_key`로 surface하는 방향 제안

사용량:

```json
{
  "prompt_tokens": 2437,
  "completion_tokens": 3712,
  "total_tokens": 6149,
  "cost": 0.00259275
}
```

### P3. Catch/preprocess absent object keys

- case packet: [experiments/zod-repair-classification-matrix/cases/p3-prod-catch-absent-key](https://github.com/Hamjoon/zod/tree/experiment-2026-07-week1-repair-classification-matrix/experiments/zod-repair-classification-matrix/cases/p3-prod-catch-absent-key)
- base commit: [02c2baf7](https://github.com/colinhacks/zod/commit/02c2baf7d0d615872fa4528a8020603b71211702)
- upstream commit: [b5ab55e4](https://github.com/colinhacks/zod/commit/b5ab55e41b615e961775feb2160c2eddf29fdf84) (`fix(v4): allow catch/preprocess to handle absent object keys (#5937)`)
- upstream PR: [colinhacks/zod#5937](https://github.com/colinhacks/zod/pull/5937)
- fixture commit: [ef09bedf](https://github.com/Hamjoon/zod/commit/ef09bedfaf03ffa82b45dd3364b78f20dc60399a) (`experiment fixture: P3 add catch/preprocess absent-key regression tests`)
- GPT-OSS repair commit: [da8d9572](https://github.com/Hamjoon/zod/commit/da8d95720009dd50c9dd73233d4426d5169f796b) (`fix: P3 repair catch/preprocess absent-key regression with gpt-oss`)
- 기대 target: `packages/zod/src/v4/core/schemas.ts`
- test oracle:
  - `packages/zod/src/v4/classic/tests/catch.test.ts`
  - `packages/zod/src/v4/classic/tests/partial.test.ts`
- fail-before:
  - `catch.test.ts` and `partial.test.ts`
  - `4 failed | 64 passed`
  - old object parser는 `.catch()` / preprocess chains가 absent keys를 처리하기 전에 `nonoptional` issue를 생성
- model result:
  - production patch 선택
  - response는 `core/schemas.ts`의 object parsing behavior를 target
  - 새 test를 약화하는 방향은 제안하지 않음

사용량:

```json
{
  "prompt_tokens": 3005,
  "completion_tokens": 2177,
  "total_tokens": 5182,
  "cost": 0.00175695
}
```

## 전체 사용량

```json
{
  "prompt_tokens": 13763,
  "completion_tokens": 15062,
  "total_tokens": 28825,
  "cost": 0.006660729
}
```

## 해석

이 반복 결과는 단일 production-regression 예시보다 교수님께 설명하려는 claim을 더 직접적으로 뒷받침한다.

S3 stale-test repair는 `partial`이었다. Model은 test repair를 선택했지만, upstream test update 중 direct `z.undefined()` assertion만 반영했고 union optout assertion과 type expectation은 완전히 맞추지 못했다. 그러나 repair target decision은 일관적이었다.

- failure가 의도적인 production behavior change에서 온 경우 GPT-OSS는 test repair를 선택했다.
- failure가 새 oracle이 드러낸 production regression에서 온 경우 GPT-OSS는 production repair를 선택했다.

따라서 이번 결과는 세 질문을 분리해서 볼 수 있게 한다.

1. repair target classification: `6 / 6` expected target과 일치
2. repair completeness: `5 / 6` complete, `1 / 6` partial
3. test signal preservation: `3 / 6` signal_preserved, `2 / 6` signal_weakened, `1 / 6` partial_repair

논문 실험 관점에서 가장 강하게 말할 수 있는 문장은 다음과 같다.

> Zod의 stale-test case 3개와 production-regression case 3개로 구성한 3:3 matrix에서 GPT-OSS는 여섯 번 모두 expected repair target을 선택했다. 다만 coverage와 focused StrykerJS로 test signal을 따로 평가하면, signal_preserved는 3개였고 S1/P3는 signal_weakened, S3는 partial_repair였다. 즉 repair target 분류 능력은 안정적으로 관찰됐지만, 생성된 repair가 항상 충분한 test signal을 보존한다고 보기는 어렵다.
