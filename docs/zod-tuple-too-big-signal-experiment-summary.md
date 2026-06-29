# LLM 기반 Unit Test Signal 유지 여부 판단 자동화 실험 요약 - Zod tuple too_big 사례

## 1. 목적

production code가 의도적으로 evolution되는 경우, 이전 behavior를 기준으로 작성된 unit test가 깨질 수 있다. 이 실험은 오픈소스 프로젝트의 작은 변경 사례를 대상으로 그런 상황을 재현하고, LLM이 깨진 test를 새 production behavior에 맞게 유지보수할 수 있는지 확인하기 위한 것이다.

이번 주 실험의 핵심은 한 단계 더 나아가, LLM이 산출한 test-only snapshot update가 단순히 test를 pass시키는 데 그치지 않고 원래 test가 가지고 있던 signal을 유지하는지 자동으로 판단할 수 있는가를 보는 것이다.

이번 사례에서는 coverage를 이용해 repaired test가 변경된 tuple `too_big` production path를 계속 실행한다는 점을 먼저 확인했다. 여기에 StrykerJS mutation test를 추가로 수행해, 변경된 behavior의 핵심 detail이 깨졌을 때 test가 실제로 실패하는지도 확인했다. 관련 mutant 3개가 모두 killed되었기 때문에, 이번 LLM repair는 실행 경로뿐 아니라 test signal도 유지한 것으로 판단했다.

예제 프로젝트는 TypeScript/JavaScript 생태계에서 널리 쓰이는 schema validation library인 Zod이다. 대상 unit은 tuple schema에서 배열 길이가 초과될 때 발생하는 `too_big` issue의 error detail이다.

## 2. Commit Pair

이번 실험에서 사용한 upstream evolution commit은 다음과 같다.

- project: `colinhacks/zod`
- base commit `t`: `7abe4e51` (`ae68f62f^`)
- upstream evolution commit `t+1`: `ae68f62f`
- commit title: `fix: Fix error details for tuples with extraneous elements (#5555)`
- production file: `packages/zod/src/v4/core/schemas.ts`
- test file: `packages/zod/src/v4/classic/tests/tuple.test.ts`

upstream `t+1`인 `ae68f62f`에서는 tuple schema의 `too_big` issue에 `inclusive: true`가 추가되었다. 이 change는 tuple의 최대 길이 조건이 exclusive bound가 아니라 inclusive bound라는 점을 error detail에 명시한다.

예를 들어 길이 2 tuple에 길이 3 배열이 들어온 경우, 기존 error message는 다음과 같았다.

```text
Too big: expected array to have <2 items
```

새 production behavior에서는 `inclusive: true`가 포함되면서 message가 다음처럼 바뀐다.

```text
Too big: expected array to have <=2 items
```

이번 실험에서는 LLM에게 repair해야 할 broken input을 만들기 위해 `ae68f62f`의 production change 중 `packages/zod/src/v4/core/schemas.ts` 변경만 분리해서 실험용 fixture commit으로 구성했다. test file은 `t` 시점의 stale snapshot expectation을 유지했다. 따라서 worktree는 새 production behavior를 포함하지만, test는 여전히 이전 message와 issue detail을 기대하는 상태가 되었다.

## 3. Legacy Test와 실패 상황

stale 상태에서 실패한 test는 `packages/zod/src/v4/classic/tests/tuple.test.ts`의 tuple validation snapshot이다.

실패한 snapshot은 다음 두 test에 포함되어 있었다.

- `successful validation`
- `async validation`

legacy snapshot은 tuple 길이가 초과될 때 `inclusive` field가 없고, message도 `<2 items` 형태라고 기대한다. 그러나 새 production behavior에서는 issue object에 `inclusive: true`가 포함되고, message도 `<=2 items`로 바뀐다.

즉 이번 실패는 production code의 오류가 아니라, production behavior가 바뀌면서 이전 behavior를 기준으로 작성된 test expectation이 stale해진 사례다.

## 4. LLM Repair Setup

이번 run에서는 `gpt-oss-120b`를 OpenRouter 경유로 사용했다.

- model: `openai/gpt-oss-120b`
- provider: OpenRouter
- mode: single-shot prompt
- runner: `scripts/run-gptoss-test-maintenance.py`
- prompt tokens: `2218`
- completion tokens: `559`
- total tokens: `2777`
- reported cost: `$0.0006681`

`gpt-oss-120b`를 사용한 이유는 지난주 실험과 같은 계열의 open-weight model을 유지하면서, LLM 기반 test maintenance 자동화 흐름을 이어가기 위해서다.

이번 실험에서도 `scripts/run-gptoss-test-maintenance.py`를 사용했다. 이 runner는 지난주 object extend 실험에서 사용한 자동화 흐름을 이어받아, 다음 입력을 조합해 OpenRouter로 전달한다.

- stale failure log
- 관련 test snippet
- 관련 production snippet
- 작업 제약: test file만 수정하고 production source는 수정하지 말 것
- 추가 제약: 기존 test signal을 약화하지 말 것

runner는 실행 시 prompt, model response, token usage, cost 정보를 local artifact로 저장한다. 이번 PR에는 재현과 검토에 필요한 핵심 파일만 남기고, raw artifact directory, JSON log, Stryker/Vitest config, lockfile change는 포함하지 않았다.

## 5. Model Repair Result

모델은 production source를 수정하지 않고, stale snapshot expectation을 새 production behavior에 맞게 갱신하는 test-only patch를 산출했다.

이 patch는 새 test logic을 추가한 것이 아니라, `packages/zod/src/v4/classic/tests/tuple.test.ts` 안의 inline snapshot expectation 두 곳을 갱신한 것이다.

핵심 변화는 다음과 같다.

- `too_big` issue detail에 `inclusive: true` 추가
- error message를 `<2 items`에서 `<=2 items`로 갱신
- `successful validation`과 `async validation` 양쪽 snapshot을 모두 수정

즉 모델은 failing assertion을 삭제하거나 error 발생 여부만 확인하는 방향으로 가지 않았다. tuple 길이 초과 issue의 `code`, `maximum`, `inclusive`, message detail을 유지한 채 stale expectation을 새 behavior에 맞게 갱신했다.

따라서 이번 repair의 의미는 snapshot text 자체를 새로 작성했다는 데 있다기보다, 실패 원인을 production behavior change로 보고 production source를 되돌리지 않은 채 test expectation update로 처리했다는 점에 있다.

targeted validation은 다음 명령으로 수행했다.

```bash
pnpm vitest run packages/zod/src/v4/classic/tests/tuple.test.ts --config vitest.config.ts
```

결과는 다음과 같다.

```text
Test Files 2 passed
Tests 14 passed
Type Errors no errors
```

따라서 pass/fail 기준에서는 LLM repair가 성공했다.

## 6. Test Signal 평가 Setup

이번 실험에서는 pass/fail만으로 repair quality를 판단하지 않고, repaired test가 변경된 production behavior를 계속 유지하는지 추가로 확인했다.

평가 기준은 두 단계로 잡았다.

1. Coverage 확인
   - repaired test가 변경된 tuple `too_big` production path를 계속 실행하는지 확인한다.
   - 이는 LLM repair가 관련 code path를 놓치지 않았는지 보는 1차 자동화 지표다.

2. StrykerJS mutation test
   - 변경된 production line에 mutant를 만들고, repaired test가 그 mutant를 잡아내는지 확인한다.
   - 이는 단순 실행 여부를 넘어, assertion이 새 behavior의 핵심 detail을 실제로 잃지 않는지 확인하기 위한 보강 지표다.

이번 실험에서 확인하려는 질문은 다음과 같다.

> LLM이 산출한 snapshot update가 stale expectation을 새 behavior에 맞게 갱신한 뒤에도, 변경된 `too_big` behavior에 대한 test signal을 유지하는가?

## 7. Coverage 결과

먼저 Vitest v8 coverage를 이용해 repaired test가 변경된 production path를 계속 실행하는지 확인했다. upstream maintainer repair와 LLM repair의 coverage 측정 결과는 동일했고, 결과 수치는 다음 표와 같다.

| Lines | Statements | Branches | Functions |
| ---: | ---: | ---: | ---: |
| 14.00% | 13.10% | 4.13% | 8.05% |

coverage 결과만으로 assertion의 의미 보존을 직접 증명할 수는 없다. 예를 들어 test가 같은 branch를 실행하더라도, error detail에 대한 expectation을 약하게 만들면 coverage 수치는 그대로일 수 있다.

다만 이번 실험에서 coverage는 repaired test가 변경된 tuple `too_big` path를 계속 실행한다는 1차 확인 지표로 사용할 수 있었다.

## 8. StrykerJS Mutation Test 결과

coverage 확인에 더해, 이번 실험에서는 StrykerJS를 이용한 focused mutation test를 수행했다.

StrykerJS는 변경된 production line만 대상으로 실행했다.

```text
packages/zod/src/v4/core/schemas.ts:2537-2537
```

이 범위에서 생성된 mutant는 3개였다.

1. `ObjectLiteral`
   - `too_big` issue object를 `{}`로 바꾸는 mutant

2. `StringLiteral`
   - `"too_big"`을 `""`로 바꾸는 mutant

3. `BooleanLiteral`
   - `inclusive: true`를 `inclusive: false`로 바꾸는 mutant

mutation test 결과는 다음과 같다.

| Mutants | Killed | Survived | Mutation score |
| ---: | ---: | ---: | ---: |
| 3 | 3 | 0 | 100% |

LLM repair는 3개 mutant를 모두 killed 처리했다. 즉 production code에서 `too_big` issue object, issue code, `inclusive` flag가 깨지면 repaired test가 실패한다.

특히 `inclusive: true`를 `inclusive: false`로 바꾸는 mutant가 killed되었다는 점이 중요하다. 이는 repaired test가 단순히 error 발생 여부만 확인하는 것이 아니라, 이번 production change의 핵심 behavior detail을 잃지 않았다는 증거다.

## 9. 평가 기준과 결과

1. Targeted test가 pass하는가
   - 결과: pass
   - tuple test 기준 2 test files, 14 tests가 통과했다.

2. Repair 단계에서 production source file을 수정하지 않았는가
   - 결과: pass
   - LLM repair commit은 test snapshot만 수정한다.

3. 새 production behavior를 반영했는가
   - 결과: pass
   - `inclusive: true`와 `<=2 items` message를 반영했다.

4. 변경된 production path를 계속 실행하는가
   - 결과: pass
   - Vitest coverage 기준, repaired test가 tuple `too_big` path를 계속 실행한다.

5. 의미 있는 test signal이 남아 있는가
   - 결과: pass
   - StrykerJS 기준, 변경된 production line의 3개 mutant를 모두 killed했다.

## 10. 해석

이번 run에서 `gpt-oss-120b`는 production source를 과거 behavior로 되돌리지 않고, stale해진 test expectation을 test file 쪽에서 갱신했다. 이 repair는 새 test logic 추가가 아니라 inline snapshot expectation update에 해당한다. 또한 failing snapshot을 단순 삭제하거나 error 발생 여부만 확인하는 방식이 아니라, `too_big` issue의 핵심 detail을 유지했다.

coverage 결과는 repaired test가 변경된 tuple `too_big` production path를 계속 실행한다는 점을 보여준다. 이는 LLM이 관련 code path를 놓치지 않았는지 자동으로 확인하는 데 유용한 1차 지표다.

다만 coverage는 실행 여부 중심의 지표이므로, assertion이 새 behavior의 핵심 detail까지 유지하는지는 추가 확인이 필요하다. 그래서 이번 실험에서는 StrykerJS mutation test를 추가로 수행했다. 변경된 production line의 핵심 mutant 3개가 모두 killed되었기 때문에, 이번 LLM repair는 실행 경로뿐 아니라 test signal도 유지한 것으로 판단했다.

따라서 이번 실험의 결론은 다음과 같다.

> Coverage는 LLM 기반 test maintenance 결과를 자동 확인하는 1차 지표로 사용할 수 있다. 여기에 mutation test를 추가하면 LLM repair가 test signal을 잃지 않았는지 더 확실하게 확인할 수 있다.

## 11. 한계와 후속 실험

이번 실험은 하나의 오픈소스 프로젝트, 하나의 behavior change, 하나의 model run을 대상으로 했다. 또한 StrykerJS mutation test는 전체 프로젝트가 아니라 변경된 production line에 집중해서 실행했다.

후속 실험에서는 다음을 추가할 수 있다.

- 여러 stale-test 사례에서 같은 mutation-based signal 평가가 재현되는지 확인
- LLM repair와 upstream maintainer repair의 killed mutant set overlap 비교
- 여러 model의 repair 결과를 같은 mutation test 기준으로 비교
- prompt에 test-signal preservation guardrail을 넣었을 때와 제거했을 때의 차이 비교
- mutation target range를 changed line, changed function, changed file 단위로 넓혔을 때 비용과 signal의 trade-off 확인
- StrykerJS 실행 비용을 줄이기 위한 자동 target range selection

이번 결과는 LLM repair가 test를 통과한 뒤에도, coverage와 focused mutation testing을 함께 사용해 test signal 유지 여부를 더 확실하게 확인할 수 있음을 보여준다.

## 12. 참고

PR structure:

- Commit 1: production-only fixture evolution commit that intentionally creates the stale-test state
- Commit 2: `gpt-oss-120b` test-only repair commit
- Commit 3: experiment summary document and shared runner

Changed files:

- `packages/zod/src/v4/core/schemas.ts`
- `packages/zod/src/v4/classic/tests/tuple.test.ts`
- `docs/zod-tuple-too-big-signal-experiment-summary.md`
- `scripts/run-gptoss-test-maintenance.py`
