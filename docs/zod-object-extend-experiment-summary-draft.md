# LLM 기반 Unit Test 유지보수 실험 요약 - Zod object extend 사례

## 1. 목적

production code가 의도적으로 evolution되는 경우, 이전 behavior를 기준으로 작성된 unit test가 깨질 수 있다. 이 실험은 오픈소스 프로젝트의 작은 변경 사례를 대상으로 그런 상황을 재현하고, LLM이 깨진 test를 새 production behavior에 맞게 유지보수할 수 있는지 확인하기 위한 것이다.

이번 실험에서 본 핵심은 단순히 test를 pass시키는지가 아니라, production source를 되돌리지 않고 test expectation을 현재 behavior에 맞게 갱신하는가이다. 또한 repair 이후에도 의미 있는 test signal이 남아 있는지 함께 본다.

예제 프로젝트는 TypeScript/JavaScript 생태계에서 널리 쓰이는 schema validation library인 Zod이다. 대상 unit은 `z.object(...).refine(...).extend(...)`의 behavior다. refined object schema에 대해 `.extend(...)`를 호출할 때, 기존에는 refinement가 있는 object에서 extend 자체를 막는 형태였지만, 새 behavior에서는 기존 key를 덮어쓰지 않는 확장은 허용한다.

## 2. Commit Pair

이번 실험에서 사용한 upstream evolution commit은 다음과 같다.

- project: `colinhacks/zod`
- base commit `t`: `1899684fc34d149ebb5d6f9fd95a588e94f27053`
- upstream evolution commit `t+1`: `0fe88407a4149c907929b757dc6618d8afe998fc`
- commit title: `allow non-overwriting extends with refinements. 4.3.1`
- production file: `packages/zod/src/v4/core/util.ts`
- test file: `packages/zod/src/v4/classic/tests/object.test.ts`

upstream `t+1`인 `0fe88407`에서는 production behavior와 test expectation이 함께 바뀌었다. production code는 refined object schema의 `.extend(...)`를 모두 금지하지 않고, 새 shape가 기존 key를 덮어쓰는 경우에만 거부하도록 바뀌었다. 즉 새 property를 추가하는 extend는 허용하지만, 기존 property를 overwrite하는 extend는 여전히 막는다.

이번 실험에서는 LLM에게 repair해야 할 broken input을 만들기 위해 `0fe88407`의 production change 중 `packages/zod/src/v4/core/util.ts` 변경만 분리해서 실험용 fixture commit으로 구성했다. test file은 `t` 시점의 stale expectation을 유지했다. 따라서 worktree는 새 production behavior를 포함하지만, test는 여전히 이전 behavior를 기대하는 상태가 되었다.

## 3. Legacy Test와 실패 상황

stale 상태에서 실패한 test는 `packages/zod/src/v4/classic/tests/object.test.ts`의 다음 test다.

```ts
test("extent() on object with refinements should throw", () => {
  const schema = z
    .object({
      a: z.string(),
    })
    .refine(() => true);

  expect(() => schema.extend({ b: z.string() })).toThrow();
});
```

legacy test는 refinement가 있는 object schema에서 `.extend({ b: z.string() })`가 throw해야 한다고 기대한다. 그러나 새 production behavior에서는 `b`가 기존 key `a`를 덮어쓰지 않는 새 property이므로 이 extend는 허용된다. 따라서 기존 expectation은 더 이상 현재 production behavior와 맞지 않는다.

stale failure는 다음 명령으로 재현했다.

```bash
pnpm test packages/zod/src/v4/classic/tests/object.test.ts | tee /tmp/zod-object-stale-failure.log
```

실패 요약은 다음과 같다.

```text
FAIL src/v4/classic/tests/object.test.ts > extent() on object with refinements should throw
AssertionError: expected [Function] to throw an error

expect(() => schema.extend({ b: z.string() })).toThrow();
```

이 실패는 production code의 오류가 아니라, production behavior가 바뀌면서 이전 behavior를 기준으로 작성된 test expectation이 stale해진 사례다.

## 4. LLM Repair Setup

이번 run에서는 `gpt-oss-120b`를 OpenRouter 경유로 사용했다.

- model: `openai/gpt-oss-120b`
- provider: OpenRouter
- temperature: `0`
- prompt tokens: `3128`
- completion tokens: `514`
- total tokens: `3642`
- reasoning tokens: `394`
- reported cost: `0.00047082`

`gpt-oss-120b`를 먼저 사용한 이유는 open-weight model이고, 공개된 cutoff가 2024년 6월로 이번 target commit인 2025년 12월 30일보다 충분히 앞서 있기 때문이다. 따라서 이번 사례에서는 model이 target change를 학습 데이터로 이미 보았을 가능성을 낮추는 leakage-control baseline으로 쓰기 좋다.

LLM runner는 다음 입력만 전달했다.

- stale failure log: `/tmp/zod-object-stale-failure.log`
- 관련 test snippet: `packages/zod/src/v4/classic/tests/object.test.ts`의 실패 지점 주변
- 관련 production snippet: `packages/zod/src/v4/core/util.ts`의 `extend` 관련 구현 주변
- 작업 제약: test file만 수정하고 production source는 수정하지 말 것
- 출력 제약: unified diff만 반환할 것

이번 baseline prompt에서는 `Preserve the intent and strength of the test` 같은 test-signal 보존 guardrail을 의도적으로 제거했다. assertion 삭제나 weak repair가 발생하는지 관찰하기 위해서다. prompt에는 새 assertion 정답이나 upstream oracle test 이름을 넣지 않았다.

다만 production snippet 안에는 현재 구현의 주석인 `Only throw if new shape overlaps with existing shape`가 포함되어 있었다. 따라서 모델은 관련 구현 context를 볼 수 있었지만, prompt가 positive/negative assertion을 모두 복원하라고 직접 지시하지는 않았다.

실험용 runner script는 `scripts/run-gptoss-test-maintenance.py`로 작성했고, 실행 후 prompt와 response를 각각 다음 경로에 남겼다.

```text
/tmp/gptoss-prompt.md
/tmp/gptoss-response.md
```

## 5. Model Repair Result

모델은 production source를 수정하는 제안을 하지 않았고, 실패한 test expectation을 test file 안에서 갱신하는 방향을 제안했다. 모델이 제안한 핵심 변화는 다음과 같다.

```diff
-test("extent() on object with refinements should throw", () => {
+// Updated behavior: `extend` now only throws when trying to overwrite existing keys
+// on an object schema that has refinements. Adding new keys is allowed.
+test("extend() on object with refinements should not throw when adding new keys", () => {
   const schema = z
     .object({
       a: z.string(),
     })
     .refine(() => true);

-  expect(() => schema.extend({ b: z.string() })).toThrow();
+  expect(() => schema.extend({ b: z.string() })).not.toThrow();
 });
```

즉 모델은 “refinement가 있으면 extend가 항상 throw한다”는 오래된 expectation을 유지하지 않고, “기존 key와 겹치지 않는 새 key `b`를 추가하는 extend는 더 이상 throw하지 않는다”는 현재 production behavior의 positive case를 반영했다.

raw response는 full unified diff file header가 없어 `git apply --check /tmp/gptoss-response.md`로 바로 적용되지는 않았다. 이 포맷 이슈는 repair 내용 평가의 핵심은 아니며, 최종 repair commit은 모델이 제안한 test-only change를 수동으로 반영한 것이다.

upstream oracle과 비교하면 이 repair는 완전한 contract test라고 보기 어렵다. upstream repaired test는 다음 축을 함께 검증한다.

- non-overlapping key를 추가하는 extend는 throw하지 않아야 한다.
- overlapping key를 overwrite하는 extend는 throw해야 한다.
- extend 이후 기존 refinement가 extended schema에 유지되어야 한다.

이번 model repair는 첫 번째 축만 executable assertion으로 확인한다. 따라서 targeted stale failure는 복구했지만, upstream oracle 대비 test signal은 약해졌다.

## 6. 검증 결과

repair 단계에서는 production source를 수정하지 않았다. `packages/zod/src/v4/core/util.ts` 변경은 PR의 첫 번째 fixture commit에 포함된 production-only setup이고, LLM repair commit 자체는 `packages/zod/src/v4/classic/tests/object.test.ts`만 변경한다.

targeted validation은 다음 명령으로 수행했다.

```bash
pnpm test packages/zod/src/v4/classic/tests/object.test.ts
```

결과는 다음과 같다.

```text
Test Files 2 passed (2)
Tests 100 passed (100)O
Type Errors no errors
Duration 1.21s
```

즉 model-proposed repair를 반영한 뒤, targeted object test suite는 통과했다.

## 7. 평가 기준과 결과

1. Targeted test가 pass하는가
   - 결과: pass
   - `packages/zod/src/v4/classic/tests/object.test.ts` 기준 100 tests가 통과했다.

2. Repair 단계에서 production source file을 수정하지 않았는가
   - 결과: pass
   - `packages/zod/src/v4/core/util.ts`에는 repair commit의 추가 diff가 없었다.

3. Test file만 수정했는가
   - 결과: pass
   - repair commit의 변경 대상은 `packages/zod/src/v4/classic/tests/object.test.ts`로 제한되었다.

4. 새 production behavior를 반영했는가
   - 결과: partial pass
   - refined object에서 non-overlapping key 추가가 허용된다는 현재 behavior는 반영했다.
   - 기존 key overwrite가 여전히 throw해야 한다는 negative coverage는 추가하지 않았다.
   - extend 이후 refinement preservation도 별도 assertion으로 확인하지 않았다.

5. 의미 있는 test signal이 남아 있는가
   - 결과: weak / partial
   - production이 나중에 `schema.extend({ a: ... })`처럼 기존 key overwrite를 허용해도 이번 repaired test만으로는 잡기 어렵다.
   - extend 과정에서 refinement가 사라져도 이번 repaired test만으로는 잡기 어렵다.
   - 따라서 targeted validation은 통과했지만, upstream oracle이 유지한 핵심 test signal은 일부 손실되었다.

## 8. 해석

이번 run에서 `gpt-oss-120b`는 production source를 과거 behavior로 되돌리지 않고, stale해진 test expectation을 test file 쪽에서 갱신했다. 최소한의 failure log와 관련 source snippet만 받은 상태에서 실패 원인을 “새 key 추가 extend가 더 이상 throw하지 않는다”로 해석했고, targeted test suite를 통과시키는 repair를 만들었다.

따라서 pass/fail 관점에서는 이번 repair가 성공했다. production source preservation 조건도 만족했고, targeted test suite도 통과했다.

하지만 test maintenance quality 관점에서는 upstream oracle보다 약하다. upstream repair는 새 property 추가 허용, 기존 key overwrite 금지, refinement preservation까지 executable assertion으로 확인한다. 반면 이번 model repair는 새 property 추가 허용만 확인한다.

이 차이는 LLM 기반 test repair 평가에서 중요한 지점이다. 단순히 targeted test가 pass했다는 사실만으로 repair quality를 충분히 설명할 수 없고, repair 이후 test가 새 behavior의 어느 부분까지 검증하는지 따로 보아야 한다.

## 9. 한계와 후속 실험

이번 실험은 하나의 오픈소스 프로젝트, 하나의 failing test, 하나의 model run을 대상으로 했다. 또한 broken input은 실제 upstream behavior change를 바탕으로 fork branch에서 실험용으로 구성한 것이다.

후속 실험에서는 다음을 추가할 수 있다.

- 같은 stale failure에 대해 다른 open-weight model 결과 비교
- prompt에 test-signal preservation guardrail을 넣었을 때와 제거했을 때 repair quality 비교
- prompt에 production snippet 범위를 다르게 주었을 때 repair quality 비교
- model이 upstream oracle 수준의 positive/negative assertion을 모두 복원하는지 평가
- mutation check를 통해 repaired test가 overwrite 허용 회귀와 refinement drop 회귀를 각각 잡는지 확인
- 여러 failing tests가 동시에 있을 때 test-only repair 범위를 유지하는지 확인

이번 결과는 “LLM이 최소 지시만으로 항상 충분한 test repair를 수행한다”는 결론보다는, “LLM이 stale expectation의 핵심 방향은 잡을 수 있지만, upstream oracle 수준의 test signal을 항상 복원한다고 볼 수는 없다”는 쪽에 가깝다.

## 10. 참고 자료

Experiment PR:

- PR URL: `https://github.com/Hamjoon/zod/pull/2`
- PR title: `Experiment: zod object extend stale-test repair`
- base branch: `experiment/zod-v4.3.0-baseline`
- head branch: `experiment/gptoss-object-extend-repair`

Experiment commits:

- Base commit: `1899684fc34d149ebb5d6f9fd95a588e94f27053`
- Upstream evolution commit: `0fe88407a4149c907929b757dc6618d8afe998fc`
- Fixture commit: `experiment fixture: apply object extend production change`
- LLM repair commit: `test: repair object extend stale expectation with gpt-oss-120b`

PR structure:

- Commit 1: production-only fixture evolution commit that intentionally creates the stale-test state
- Commit 2: `gpt-oss-120b` test-only repair commit
- Changed files:
  - `packages/zod/src/v4/core/util.ts`
  - `packages/zod/src/v4/classic/tests/object.test.ts`

Local artifacts:

- Stale failure log: `/tmp/zod-object-stale-failure.log`
- LLM prompt: `/tmp/gptoss-prompt.md`
- LLM response: `/tmp/gptoss-response.md`
- Runner script: `scripts/run-gptoss-test-maintenance.py`
