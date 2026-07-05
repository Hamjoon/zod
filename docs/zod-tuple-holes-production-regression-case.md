# LLM 기반 Test Failure 원인 구분 실험 후보 - Zod tuple holes production regression 사례

## 1. 목적

이 문서는 `colinhacks/zod`에서 test failure가 단순한 stale test expectation이 아니라 production code 수정이 필요한 regression임을 보여주는 작은 사례를 정리한다.

이전 실험에서는 production behavior가 의도적으로 바뀐 뒤, LLM이 stale test expectation을 새 behavior에 맞게 고치는지 확인했다. 이번 후보는 반대 방향의 사례다. 새 test oracle은 의도된 behavior를 설명하고 있고, 기존 production parser가 그 behavior를 만족하지 못한다. 따라서 올바른 repair는 test를 약화하거나 expectation을 되돌리는 것이 아니라 production implementation을 수정하는 것이다.

이 사례는 다음 질문을 실험하기에 적합하다.

> LLM은 failing test를 보고 test update가 필요한 상황과 production regression 수정이 필요한 상황을 구분할 수 있는가?

## 2. Commit Pair

- project: `colinhacks/zod`
- base commit `t`: `95ccab42` (`test(v3): restore optional undefined expectations`)
- upstream maintainer repair `t+1`: `cede2c63` (`fix(v4): reject tuple holes before required defaults (#5900)`)
- PR: `https://github.com/colinhacks/zod/pull/5900`
- production file: `packages/zod/src/v4/core/schemas.ts`
- test file: `packages/zod/src/v4/classic/tests/tuple.test.ts`

`t+1`은 tuple parser에서 input optionality와 output optionality를 분리한 production fix다. 기존 parser는 하나의 `optStart` 기준을 사용했고, absent optional-output slot에서 issue가 발생하면 tail을 truncate했다. 이 로직은 뒤쪽에 `.default()`처럼 required output을 만드는 slot이 있어도 앞쪽 optional rejection을 삼켜버릴 수 있었다.

upstream maintainer repair는 이를 고치기 위해 다음 구조로 바꾼다.

- `optinStart`: input length가 부족한지 판단하는 기준
- `optoutStart`: output tail을 생략해도 되는지 판단하는 기준
- `handleTupleResults`: absent issue를 `optoutStart` 이후에서만 truncate

즉 이 change의 핵심은 test snapshot 갱신이 아니라 tuple production parser의 semantic bug fix다.

## 3. Failure Fixture

이번 branch의 첫 commit은 `t` 위에 upstream `t+1`의 test oracle만 적용한다.

- commit: `95521bb8`
- title: `experiment fixture: add tuple production regression tests`
- changed file: `packages/zod/src/v4/classic/tests/tuple.test.ts`

이 상태에서 production implementation은 아직 old behavior를 유지한다. 따라서 새 test oracle은 실패한다.

검증 명령:

```bash
pnpm vitest run packages/zod/src/v4/classic/tests/tuple.test.ts
```

결과:

```text
Test Files 1 failed | 1 passed
Tests 3 failed | 33 passed
Type Errors no errors
```

실패한 test는 다음 3개다.

- `tuple truncates absent optional rejections only when the output tail is optional`
- `tuple rejects absent optional before required output under async parse`
- `tuple rejects absent exact optional before defaulted output`

공통 실패 형태는 old production parser가 `success: true`를 반환하지만, 새 oracle은 `success: false`를 기대한다는 점이다. 이는 test가 stale한 것이 아니라 production parser가 새로 명시된 invariant를 만족하지 못한다는 신호다.

## 4. GPT-OSS Repair Result

두 번째 commit은 `gpt-oss-120b`의 repair classification run 결과를 production patch로 정규화해 적용한다.

- commit: `9239bf3c`
- title: `fix: repair tuple regression with gpt-oss production patch`
- changed file: `packages/zod/src/v4/core/schemas.ts`

모델은 failing test를 stale test expectation으로 보지 않고, `packages/zod/src/v4/core/schemas.ts`에 대한 production patch를 반환했다. 즉 classification 관점에서 이번 failure를 production regression으로 판단한 것이다.

핵심 변화:

- `handleTupleResults` 안에서 각 index 뒤쪽에 required output slot이 있는지 계산
- absent optional-output rejection이 발생했을 때, 뒤쪽에 required output slot이 있으면 issue를 surface
- 뒤쪽에 required output slot이 없을 때만 기존처럼 tuple tail truncate 허용

같은 targeted test를 다시 실행하면 통과한다.

```text
Test Files 2 passed
Tests 36 passed
Type Errors no errors
```

따라서 이 후보의 oracle 구조는 다음과 같다.

1. 새 test oracle만 적용하면 실패한다.
2. `gpt-oss-120b`가 test를 약화하지 않고 production parser patch를 선택했다.
3. 실패 원인은 stale test update가 아니라 production regression이다.

## 5. LLM Classification Setup

이번 branch는 지난 실험에서 사용한 shared prompt runner를 계속 사용하되, production regression 구분을 위한 mode를 추가한다.

- runner: `scripts/run-gptoss-test-maintenance.py`
- mode: `repair-classification`
- default model: `openai/gpt-oss-120b`
- provider: OpenRouter
- default artifact dir: `artifacts/gptoss-tuple-holes-production-regression`

runner는 failure log, test snippet, production snippet을 모델에 전달하고 다음 판단을 요구한다.

- stale test case이면 test expectation을 수정한다.
- production regression이면 production code를 수정한다.
- failing assertion을 삭제하거나 약화하지 않는다.
- unified diff만 반환한다.

실행 예:

```bash
ZOD_FAILURE_LOG=/tmp/zod-tuple-holes-production-regression-failure.log \
OPENROUTER_API_KEY=... \
python3 scripts/run-gptoss-test-maintenance.py \
  --mode repair-classification \
  --case "zod tuple holes production regression experiment" \
  --artifact-dir artifacts/gptoss-tuple-holes-production-regression
```

이번 run의 사용량은 다음과 같다.

- prompt tokens: `3224`
- completion tokens: `1852`
- total tokens: `5076`
- reported cost: `$0.000440576`

모델 출력은 production diff였지만, hunk header가 line-number 없는 `@@` 형태라 `git apply`에는 바로 적용되지 않았다. 실험 branch에는 모델이 제안한 production logic을 동일 의미로 정규화해 적용했다.

## 6. 평가 기준

LLM output은 다음 기준으로 평가한다.

1. Failure classification
   - production regression으로 판단하는가
   - test-only expectation rollback을 선택하지 않는가

2. Patch target
   - `packages/zod/src/v4/core/schemas.ts`를 수정하는가
   - failing assertions를 삭제하거나 약화하지 않는가

3. Targeted validation
   - `pnpm vitest run packages/zod/src/v4/classic/tests/tuple.test.ts`가 통과하는가

4. Behavior preservation
   - no trailing default case는 여전히 truncate 후 success인지 유지하는가
   - required/defaulted output tail 앞의 absent optional rejection은 failure로 남는가

## 7. 평가 결과

1. Failure classification
   - 결과: pass
   - 모델은 test file이 아니라 production file patch를 반환했다.

2. Patch target
   - 결과: pass
   - `packages/zod/src/v4/core/schemas.ts`만 수정했고, failing assertions는 유지했다.

3. Targeted validation
   - 결과: pass
   - tuple target test는 `2 passed`, `36 passed`, type errors 없음.

4. Behavior preservation
   - 결과: pass
   - no trailing default case는 truncate 후 success로 유지되고, required/defaulted output tail 앞의 absent optional rejection은 failure로 남는다.

## 8. 해석

이 사례는 교수님 피드백에 대응하기 좋은 production regression 후보로 보인다. 실패한 test는 새 production behavior를 설명하는 oracle이고, maintainer repair도 test update가 아니라 production parser 수정이다.

따라서 이전 `Hamjoon/zod#2`, `Hamjoon/zod#7`이 stale test update 계열을 보여줬다면, 이 후보는 같은 프로젝트 안에서 반대 방향의 사례를 제공한다.

정리하면 다음과 같다.

> 이 case에서 올바른 repair는 test를 pass시키기 위한 expectation update가 아니라, tuple parser의 optionality/truncation logic을 고치는 production code change다.

이번 `gpt-oss-120b` run은 그 방향을 실제로 선택했다. 다만 모델이 반환한 unified diff는 기계 적용 가능한 형식이 아니었기 때문에, patch application robustness는 별도 개선 지점으로 남는다.

## 9. Branch Structure

- Commit 1: test-only oracle fixture that exposes the production regression
- Commit 2: GPT-OSS production repair
- Commit 3: experiment case document and shared runner classification mode

Changed files:

- `packages/zod/src/v4/classic/tests/tuple.test.ts`
- `packages/zod/src/v4/core/schemas.ts`
- `docs/zod-tuple-holes-production-regression-case.md`
- `scripts/run-gptoss-test-maintenance.py`
