# GPT-OSS 통일 프로토콜(v2) 30-case 실험: repair target 분류·완성도·test signal

## 공개 산출물 링크

- 실험 대상 프로젝트: [colinhacks/zod](https://github.com/colinhacks/zod)
- 산출물 저장소: [Hamjoon/zod](https://github.com/Hamjoon/zod)
- archive branch: [experiment/2026-07-week3-v2-30case-archive](https://github.com/Hamjoon/zod/tree/experiment/2026-07-week3-v2-30case-archive)
- 보고서 직접 링크: [docs/zod-v2-30case-report.md](https://github.com/Hamjoon/zod/blob/experiment/2026-07-week3-v2-30case-archive/docs/zod-v2-30case-report.md)
- 케이스 선별·검증 기록: `zod-30case-verification-results.md` (검증 배치, 2026-07-15)

## 실험 질문

이 실험은 upstream 커밋 히스토리에서 샘플링한 30개 케이스(S/P/N 각 10개)에 대해,
`gpt-oss-120b`가 **통일된 프레이밍** 아래에서 다음 세 가지를 수행하는지 확인한다.

1. 최근 변경 diff와 현재 테스트 상태만 보고 올바른 대응(`no_change` / `fix_tests` / `fix_production`)을 고르는가?
2. 생성한 repair를 적용하면 target 테스트가 실제로 green이 되는가?
3. green repair가 coverage와 focused StrykerJS 기준으로 test signal을 보존하는가?

케이스 카테고리는 다음과 같다.

- **S (stale-test)**: production behavior가 의도적으로 바뀌어 기존 테스트가 red — 올바른 대응은 `fix_tests`
- **P (production-regression)**: 새 테스트 oracle이 production bug를 드러내 red — 올바른 대응은 `fix_production`
- **N (normal)**: production 변경 후에도 스위트 green — 올바른 대응은 `no_change`

## 명시 사항

이 보고서를 읽을 때 반드시 전제해야 하는 세 가지:

1. **v2 수치는 v1(7월 1주차) 수치와 직접 비교할 수 없다.** v1의 S 케이스는
   `test-maintenance` 모드로 실행되어 모드 자체가 test 수정을 강제한 control이었다.
   v2에서 S 케이스는 처음으로 자유 선택이 되었고, 이번에 관찰된 S 케이스의
   `fix_production` 선택(5/10)은 v1에서는 구조적으로 나타날 수 없던 행동이다.
2. **분류 지표는 보조 지표다.** v2 프롬프트는 diff 위치(테스트 파일 vs production 파일)와
   테스트 상태(red vs green)라는 표면 규칙만으로도 기대 분류를 복원할 수 있는 구조다.
   따라서 주 지표는 repair 완성도, focused mutation signal, N 불필요 수정률이고,
   DECISION 일치율은 참고용이다. 다만 반증 관찰을 병기한다: 모델이 실제로 이 표면 규칙
   ("최근 바뀐 쪽이 옳다")을 따랐다면 DECISION은 30/30이어야 하나 실측은 S 5/10이었다.
   즉 모델은 표면 규칙을 사용하지 않았고, P 10/10 vs S 5/10의 비대칭은 diff 위치와 무관하게
   **테스트를 스펙으로 신뢰하는** 사전 성향과 정합한다.
3. 빌드 산출물에서 테스트가 zod를 import하는 upstream 구간은 **"dist-mode 구간(2025-09~2025-12)"**
   으로 통일해 부른다. 이번 30케이스 중 dist-mode 구간 케이스는 p03(base `f97e80da`) 1건이며,
   fixture 구성·validation·signal 측정 모두 재빌드 상태에서 수행했다.

## 실행 방식

모든 케이스는 같은 runner의 새 `v2-unified` 모드를 사용했다 (기존 두 모드는 수정하지 않음).

- runner: `scripts/run-gptoss-test-maintenance.py --mode v2-unified`
- model: `openai/gpt-oss-120b` (OpenRouter, temperature 0, single-shot)
- signal runner: `scripts/run-zod-signal-eval.mjs`
- 케이스 메타데이터: `experiments/zod-repair-classification-v2/cases.json`

프롬프트는 카테고리 힌트 없이 모든 케이스 동일한 intro/constraints를 쓰고, 입력 3종을 포함한다.

1. `<recent_change_diff>`: fixture에 적용된 diff (S/N=production diff, P=신규 테스트 diff)
2. `<test_output>`: 현재 테스트 실행 결과 (S/P=failure log, N=green 요약)
3. `<test_snippet>` / `<production_snippet>`: 변경 hunk 주변 ±25라인 (파일당 최대 220라인)

응답 형식은 첫 줄 `DECISION: no_change | fix_tests | fix_production`, `fix_*`인 경우에만
unified diff를 잇는 규약이다. fixture는 검증 배치에서 채택 확정된 30케이스를 케이스별
worktree로 재구성했고, 30건 모두 red/green 상태가 검증 배치 기록과 일치했다.

### 실행 노트

- **모델 diff는 전부 비표준 형식이었다.** 적용에 성공한 14건 모두 hunk 헤더가 라인 번호 없는
  `@@`(다수는 `---/+++` 파일 헤더도 없음)여서 `git apply`(`--recount` 포함)와 `patch -p1`이
  전건 실패했고, 전부 context-match 방식(`apply-patch.py`: pre-image 문맥 탐색, 들여쓰기 관용,
  headerless hunk의 후보 파일 추론)으로 적용했다. 적용 실패로 남은 4건(s02, s05, s08, p06)은
  모델이 스니펫 밖 코드를 지어내거나(fabricated pre-image) hunk 문맥 라인을 건너뛰어(elided
  context) 어떤 방식으로도 대응 위치를 특정할 수 없는 경우다.
- **s07 transport 재시도 1회**: 첫 호출이 약 14분 후 손상된 응답 body(JSONDecodeError)로
  실패해, 동일 프롬프트로 1회 재호출했다(temperature 0, self-correction 아님). runner의
  timeout(120→600s)과 응답 파싱 관용화는 이 재시도 전에 반영했다.
- **s04 재검증 1회**: 초기 응답 파서가 파일 헤더 없는 fenced diff를 인식하지 못해
  `decision-without-diff`로 잘못 기록됐고, 파서 수정 후 재검증했다(p02/p04/p05 동일).
  모델 응답 자체는 변경 없음.
- vitest 실행은 `packages/zod` cwd 기본, "No projects were found" 구간은 repo root로 폴백.
  root 실행의 실패 판정은 "Tests N failed" 카운트 기준(무관한 sibling 패키지 노이즈 무시).

## Commit 구성

산출물은 Zod source tree를 상속하지 않는 orphan archive branch에 보존했다.
케이스별 packet commit 30개(채택 순서) + 보고서·runner·도구 commit 1개로 구성된다.
각 케이스 packet은 다음을 포함한다.

- `fixture.patch` (base에 적용된 diff), `test-output.txt` (모델에게 준 테스트 상태)
- `gptoss-prompt.md`, `gptoss-response.md`, `gptoss-usage.json`
- `gptoss-repair.patch` (모델 원문 diff), `applied-repair.diff` (적용 후 정규화 diff)
- `result.json`, `validation.log`, `signal/` (green repair의 coverage·StrykerJS 결과)

## Case Matrix — S (stale-test, 기대 DECISION: fix_tests)

| ID | Base | Upstream 변경 | DECISION | Repair 완성도 | Signal 판정 |
| --- | --- | --- | --- | --- | --- |
| s01 | [a410616b](https://github.com/colinhacks/zod/commit/a410616b) | [0cf45896](https://github.com/colinhacks/zod/commit/0cf45896) tuple→JSON Schema oneOf | fix_tests ✅ | complete | signal_preserved |
| s02 | [9443aab0](https://github.com/colinhacks/zod/commit/9443aab0) | [66bda749](https://github.com/colinhacks/zod/commit/66bda749) ZodMiniType `.refine()` 제거 | fix_production ❌ | patch 적용 실패 | - |
| s03 | [103f69be](https://github.com/colinhacks/zod/commit/103f69be) | [3a8edd74](https://github.com/colinhacks/zod/commit/3a8edd74) preprocess output type revert | fix_production ❌ | reverse_green | (별도 표) |
| s04 | [39d84d03](https://github.com/colinhacks/zod/commit/39d84d03) | [6b13cc94](https://github.com/colinhacks/zod/commit/6b13cc94) JSON Schema pattern polish | fix_production ❌ | reverse_green | (별도 표) |
| s05 | [845a230b](https://github.com/colinhacks/zod/commit/845a230b) | [27f13d62](https://github.com/colinhacks/zod/commit/27f13d62) regex 정밀도 개선 | fix_tests ✅ | patch 적용 실패 | - |
| s06 | [a2c98924](https://github.com/colinhacks/zod/commit/a2c98924) | [6d47791b](https://github.com/colinhacks/zod/commit/6d47791b) v.custom input type fix | fix_production ❌ | reverse_green | (별도 표) |
| s07 | [98c849de](https://github.com/colinhacks/zod/commit/98c849de) | [2529f827](https://github.com/colinhacks/zod/commit/2529f827) JSON Schema identifier 교정 | fix_tests ✅ | partial (37→17 red) | partial_repair |
| s08 | [f97733ff](https://github.com/colinhacks/zod/commit/f97733ff) | [ad2fc5ee](https://github.com/colinhacks/zod/commit/ad2fc5ee) File schema JSON Schema | fix_production ❌ | patch 적용 실패 | - |
| s09 | [592de8de](https://github.com/colinhacks/zod/commit/592de8de) | [f98d1a30](https://github.com/colinhacks/zod/commit/f98d1a30) URL behavior 표준화 | fix_tests ✅ | partial (1 red) | partial_repair |
| s10 | [a73a3b30](https://github.com/colinhacks/zod/commit/a73a3b30) | [5fdece94](https://github.com/colinhacks/zod/commit/5fdece94) min/maxLength inclusive 반영 | fix_tests ✅ | partial (10→11 red) | partial_repair |

`reverse_green`은 target validation은 green이지만 fixture로 적용된 최근 변경이 repair 후
트리에 보존되지 않은 — 즉 **의도된 behavior 변경을 되돌려 green에 도달한** — 경우로,
completeness 집계에서 제외하고 misrepair로 분류한다 (taxonomy 정의는 요약 절 참조).

## Case Matrix — P (production-regression, 기대 DECISION: fix_production)

| ID | Base | Upstream 변경 | DECISION | Repair 완성도 | Signal 판정 |
| --- | --- | --- | --- | --- | --- |
| p01 | [2e5b23dc](https://github.com/colinhacks/zod/commit/2e5b23dc) | [7f789def](https://github.com/colinhacks/zod/commit/7f789def) record 비열거 속성 skip | fix_production ✅ | complete | signal_preserved |
| p02 | [17e7f3b4](https://github.com/colinhacks/zod/commit/17e7f3b4) | [f75d8529](https://github.com/colinhacks/zod/commit/f75d8529) `z.literal` 소수점 escape | fix_production ✅ | complete | signal_weakened |
| p03 | [f97e80da](https://github.com/colinhacks/zod/commit/f97e80da) | [002e01ad](https://github.com/colinhacks/zod/commit/002e01ad) isPlainObject constructor 처리 (dist-mode 구간) | fix_production ✅ | complete | signal_preserved |
| p04 | [34b400a5](https://github.com/colinhacks/zod/commit/34b400a5) | [3048d14b](https://github.com/colinhacks/zod/commit/3048d14b) extend 관련 #4961 fix | fix_production ✅ | complete | signal_preserved |
| p05 | [8506c352](https://github.com/colinhacks/zod/commit/8506c352) | [363c966b](https://github.com/colinhacks/zod/commit/363c966b) standard-schema toJSONSchema #5560 | fix_production ✅ | partial (red + type error) | partial_repair |
| p06 | [3a818de1](https://github.com/colinhacks/zod/commit/3a818de1) | [3cd45ebc](https://github.com/colinhacks/zod/commit/3cd45ebc) httpUrl() strict validation | fix_production ✅ | patch 적용 실패 | - |
| p07 | [15cafa13](https://github.com/colinhacks/zod/commit/15cafa13) | [584b1089](https://github.com/colinhacks/zod/commit/584b1089) base64 whitespace 거부 | fix_production ✅ | complete | signal_preserved |
| p08 | [8ab23742](https://github.com/colinhacks/zod/commit/8ab23742) | [2be1c6ad](https://github.com/colinhacks/zod/commit/2be1c6ad) generic assignability | fix_production ✅ | partial (typecheck red) | partial_repair |
| p09 | [e45e61b6](https://github.com/colinhacks/zod/commit/e45e61b6) | [25a4c376](https://github.com/colinhacks/zod/commit/25a4c376) openapi-3.0 record/tuple 출력 | fix_production ✅ | complete | signal_weakened |
| p10 | [518f15dd](https://github.com/colinhacks/zod/commit/518f15dd) | [2e5b23dc](https://github.com/colinhacks/zod/commit/2e5b23dc) invalid discriminator options | fix_production ✅ | partial (1 red) | partial_repair |

## Case Matrix — N (normal, 기대 DECISION: no_change)

| ID | Base | Upstream 변경 | DECISION | 불필요 수정 | Signal 변화 |
| --- | --- | --- | --- | --- | --- |
| n01 | [ed933d91](https://github.com/colinhacks/zod/commit/ed933d91) | [0d87aa4a](https://github.com/colinhacks/zod/commit/0d87aa4a) Make id lazy | no_change ✅ | 없음 | 해당 없음 |
| n02 | [5e4ff20b](https://github.com/colinhacks/zod/commit/5e4ff20b) | [592de8de](https://github.com/colinhacks/zod/commit/592de8de) Rollup comment warning | no_change ✅ | 없음 | 해당 없음 |
| n03 | [65f1f404](https://github.com/colinhacks/zod/commit/65f1f404) | [5b574501](https://github.com/colinhacks/zod/commit/5b574501) refine abort+when | no_change ✅ | 없음 | 해당 없음 |
| n04 | [b2592111](https://github.com/colinhacks/zod/commit/b2592111) | [5905a8d8](https://github.com/colinhacks/zod/commit/5905a8d8) check-versions script | no_change ✅ | 없음 | 해당 없음 |
| n05 | [73b071d7](https://github.com/colinhacks/zod/commit/73b071d7) | [9712a670](https://github.com/colinhacks/zod/commit/9712a670) ~standard lazy init | no_change ✅ | 없음 | 해당 없음 |
| n06 | [d589186c](https://github.com/colinhacks/zod/commit/d589186c) | [4975f3a0](https://github.com/colinhacks/zod/commit/4975f3a0) discriminator generic | no_change ✅ | 없음 | 해당 없음 |
| n07 | [aab33566](https://github.com/colinhacks/zod/commit/aab33566) | [36c4ee35](https://github.com/colinhacks/zod/commit/36c4ee35) weakmap 복귀 | no_change ✅ | 없음 | 해당 없음 |
| n08 | [285bde7f](https://github.com/colinhacks/zod/commit/285bde7f) | [195e8696](https://github.com/colinhacks/zod/commit/195e8696) `@__PURE__` 표기 | no_change ✅ | 없음 | 해당 없음 |
| n09 | [edc34778](https://github.com/colinhacks/zod/commit/edc34778) | [c5d9e7ce](https://github.com/colinhacks/zod/commit/c5d9e7ce) JWT alg 임의 문자열 | no_change ✅ | 없음 | 해당 없음 |
| n10 | [f350a693](https://github.com/colinhacks/zod/commit/f350a693) | [b142ea8f](https://github.com/colinhacks/zod/commit/b142ea8f) Fix $strip | no_change ✅ | 없음 | 해당 없음 |

**N 불필요 수정률: 0/10 (0%).** 열 개 케이스 모두 첫 줄 `DECISION: no_change`에 diff 없는
규약 준수 응답이었다. 불필요 수정이 없으므로 survived-mutant 집합 비교는 수행 대상이 없다.

## 요약

- DECISION 분류: 전체 `25 / 30` (S `5/10`, P `10/10`, N `10/10`)
- S 오분류 5건은 모두 `fix_production` — 의도된 변경을 되돌리는 방향
- repair 완성도 (S/P 20건): **complete `7` · reverse_green `3` · partial `6` · patch 적용 실패 `4`**
  - complete (기대 target대로 green + 최근 변경 보존): s01, p01, p02, p03, p04, p07, p09
  - reverse_green (green이지만 최근 변경이 되돌려짐 — misrepair): s03, s04, s06
- Signal 판정 (정방향 green 7건 기준): signal_preserved `5`, signal_weakened `2`
  - reverse_green 3건의 mutation 측정치는 별도 표로 보고 (본 지표와 의미가 다름)
- N 불필요 수정률: `0 / 10`

### Taxonomy 정의와 계보

`Repair 완성도`는 모델 diff 적용 후 target validation(S/P는 대상 테스트 파일, N은 `packages/zod`
스위트) 실행 결과에 **recent-change preservation 체크**를 결합해 판정한다.

- `complete` = green 도달 **+** fixture로 적용한 최근 변경이 repair 후 트리에 보존
  (`git apply --reverse --check fixture.patch` 성공)
- `reverse_green` = green 도달했으나 최근 변경이 되돌려지거나 훼손됨. completeness 집계에서
  제외하고 misrepair로 분류
- `partial` = 적용됐으나 red, `patch 적용 실패` = 어떤 적용 방식으로도 diff를 적용할 수 없음

정의 계보: v1에서 승계한 green 기준 completeness 정의는 v1 프로토콜의 constraint상
역방향 green이 발생할 수 없어 충분했으나, v2에서 S의 target 선택이 자유로워지며 불충분함이
드러났다. 이에 사후 재분석에서 `reverse_green`을 분리하고 preservation을 `complete`의
필요조건으로 추가했다. preservation 체크는 30건 전체에 소급 실행했으며(정적 검사만,
모델·테스트·Stryker 재실행 없음), 실패 3건(s03/s04/s06)은 diff를 열어 전면/부분 revert임을
확인한 뒤 판정했다 — 정당한 수정이 fixture hunk와 라인만 겹친 경우는 없었다.

`Signal 판정`은 7월 1주차와 동일한 분류를 쓴다: target validation green이면서 focused mutants가
모두 killed면 `signal_preserved`, survived/no-coverage가 남으면 `signal_weakened`, validation red면
`partial_repair`, mutation 결과가 판정 불능이면 `signal_unknown`.

## Coverage 및 Mutation Signal (정방향 green 7건)

Focused StrykerJS scope는 검증된 worktree의 production 순변경(base 대비 git diff) hunk 라인으로
한정했다. S/N은 upstream production diff, P는 모델 patch에 해당한다.

| ID | Scope (파일: 라인) | Coverage lines | Mutants (K/S/NC) | Signal 판정 |
| --- | --- | --- | --- | --- |
| s01 | `to-json-schema.ts:387-391` | 710/798 (88.97%) | 2 / 0 / 0 | signal_preserved |
| p01 | `schemas.ts:2818-2828` 3구간 | 231/1124 (20.55%) | 3 / 0 / 0 | signal_preserved |
| p02 | `schemas.ts:2798-2802` | 470/1713 (27.43%) | 3 / 2 / 0 | signal_weakened |
| p03 | `util.ts:378-390` 3구간 | 95/280 (33.92%) | 7 / 0 / 0 | signal_preserved |
| p04 | `util.ts:288-301` | 165/530 (31.13%) | 3 / 0 / 0 | signal_preserved |
| p07 | `schemas.ts:890-895` | 270/1128 (23.93%) | 4 / 0 / 0 | signal_preserved |
| p09 | `to-json-schema.ts:371-408` 8구간 | 708/791 (89.5%) | 12 / 4 / 0 | signal_weakened |

### reverse_green 3건의 mutation 측정치 (참고용 별도 보고)

아래 측정치는 **mutation scope의 대상인 upstream 변경 자체가 부재한(되돌려진) 트리에서의
측정**으로, 위 본 지표와 의미가 다르다. 폐기하지 않고 참고용으로 보존한다.

| ID | Scope (파일: 라인) | Mutants (K/S/NC) | 당시 판정 |
| --- | --- | --- | --- |
| s03 | `v3/types.ts:4077-4426` 7구간 / `to-json-schema.ts:502-509` | 0/15/0 · 8/0/0 | signal_weakened |
| s04 | `to-json-schema.ts:51-172` 4구간 | 9 / 6 / 2 | signal_weakened |
| s06 | `classic/schemas.ts:1966`, `errors.ts:89,152-153` | 0 / 0 / 0 (타입 전용, mutant 없음) | signal_unknown |

## 핵심 발견: target validation은 preservation 체크 없이는 불완전하다

reverse_green 3건(s03/s04/s06)은 red→green이라는 validation 신호만 보면 올바른 repair와
구분되지 않는다. 셋 모두 대상 테스트를 전부 통과시켰지만, green의 달성 경로는 "테스트를
새 behavior에 맞춘 것"이 아니라 "**의도된 production 변경을 되돌려 옛 behavior를 복원한 것**"
이었다. 이 구분은 `git apply --reverse --check fixture.patch`라는 정적 검사 하나로 기계적으로
잡힌다 (30건 소급 실행 결과 정확히 이 3건만 실패, 오탐 0건). 따라서 **recent-change
preservation 체크는 automated repair 평가에서 target validation의 필수 구성요소**이며,
green 여부만 보는 completeness 정의는 target 선택이 자유로운 프로토콜에서 misrepair를
complete로 과대집계한다.

## 이상 케이스 상세

### reverse_green 3건 + S 오분류 잔여 2건 — 전부 "의도된 변경 되돌리기" 방향

- **s02** (`.refine()` 제거): 모델은 제거된 `.refine()`을 복원하는 production patch를 시도했다.
  하지만 hunk pre-image가 fixture에 존재하지 않는 라인(제거 전 코드)을 문맥으로 포함해 적용 실패.
- **s03** (preprocess revert) → **reverse_green**: 모델은 fixture가 바꾼 `isValid` 반환
  (`return base`)과 `innerType` 단순화를 **동일 hunk에서 역방향으로** 수정해 revert 이전
  behavior(`return INVALID` + transform-skip 로직)를 복원했다. 코드 형태만 다른 기능적
  전면 revert. preservation 체크 실패.
- **s04** (JSON Schema pattern polish) → **reverse_green**: fixture가 추가한 `regex: ""`
  formatMap 항목과 `string | undefined` 타입을 동일 라인에서 제거 — 핵심 변경의 직접 역전.
  preservation 체크 실패.
- **s06** (v.custom input type) → **reverse_green**: fixture가 단순화한 `z.custom` 시그니처
  (`custom<O>`, `data: unknown`)를 두-generic 형태(`custom<O = unknown, I = O>`, `data: I`)로
  역전(원형의 `data: O`와 다른 변형 포함). errors.ts·docs 등 나머지 fixture hunk는 보존된
  **부분 역전**이지만, green을 만든 수정 자체가 역방향이므로 reverse_green. preservation 체크 실패.
- **s08** (File schema JSON Schema): production patch 시도가 스니펫 밖 `to-json-schema.ts`
  내용을 지어낸 pre-image라 적용 실패.

S 케이스에서 diff가 production에 있고 테스트가 red인 상황은, 모델에게 "테스트가 맞고 변경이
버그"라는 P-형 해석과 "변경이 의도이고 테스트가 stale"이라는 S-형 해석이 모두 열려 있다.
gpt-oss-120b는 절반의 케이스에서 전자를 골랐고, 그 절반 중 3건은 실제로 green까지 만들었다.
어느 해석이 옳은지는 결국 upstream 의도(커밋 맥락)의 문제지만, **역방향 green의 기계적 판별
자체는 preservation 체크로 가능하다** (핵심 발견 절 참조).

### Partial repair 6건 (적용됐으나 red)

- **s07** (37 failed → 17 failed): 대형 스냅샷 교정 케이스. 모델 diff가 절반가량만 교정 —
  under-repair. transport 재시도 1회 후 얻은 응답 기준.
- **s09** (1 red): URL 표준화의 stale 기대 중 `toThrow` 기대 1건을 놓침 — under-repair.
- **s10** (10 → 11 red): array 쪽 stale 기대는 고쳤지만 validations에서 이전에 green이던
  테스트를 새로 red로 만들었다 — 신규 실패 유발이므로 mis-generalization으로 분류.
- **p05** (red + type error): oracle 실패(`Non-representable type`)가 그대로 남았고
  `exactOptionalPropertyTypes` 위반 type error를 새로 유발 — mis-generalization.
- **p08** (typecheck red): 타입 레벨 oracle(assignability)을 만족시키지 못함 — under-repair.
- **p10** (1 red): invalid discriminator 에러에 `options`를 추가하는 방향은 맞았지만
  스냅샷 기대 형태에 못 미침 — under-repair.

### Patch 적용 실패 4건

s02, s05, s08, p06. 네 건 모두 모델이 제공받은 스니펫 범위 밖의 코드를 pre-image 문맥으로
추정해 써넣었고(s05는 존재하지 않는 테스트 블록, p06은 hunk 내부 문맥 라인 생략), 실제 파일과
대조 가능한 연속 pre-image가 없어 context-match 방식으로도 적용 불가였다. single-shot
프로토콜에서는 이런 diff는 실패로 확정된다. 참고로 적용에 성공한 14건도 전부 `git apply`가
거부하는 비표준 diff였다(실행 노트 참조) — 적용기 관용성이 없었다면 v2 완성도 수치는
대부분 "적용 실패"로 측정됐을 것이다.

## 전체 사용량

```json
{
  "prompt_tokens": 122352,
  "completion_tokens": 36315,
  "total_tokens": 158667,
  "cost": 0.02129815
}
```

(31회 호출 — 30케이스 + s07 transport 재시도 1회 포함.)

## 해석

1. **P·N 방향의 분류는 안정적이다.** production-regression 20건 상당(P 10, N 10)은 전건
   기대와 일치했고, N에서 불필요 수정이 전혀 발생하지 않은 것은 "green이면 손대지 않는다"는
   행동이 통일 프레이밍에서도 유지됨을 보여준다.
2. **S 방향은 자유 선택이 되는 순간 절반이 무너졌다.** v1에서 6/6으로 보였던 분류 능력은
   S 쪽이 모드에 의해 강제된 control이었기 때문이며(명시 사항 1), 통일 프레이밍에서 모델은
   S 케이스 절반에서 의도된 변경을 되돌리는 `fix_production`을 골랐다. 그 중 3건은 target
   validation까지 통과하는 reverse_green이었고, 이 3건은 preservation 체크로만 잡혔다
   (핵심 발견 절).
3. **completeness와 signal은 여전히 병목이다.** complete(green + 최근 변경 보존)는 S/P
   20건 중 7건이고, 그 7건 중 focused mutants를 전부 죽인 것은 5건이다. survived mutant가
   남은 2건(p02, p09)은 관련 behavior의 회귀를 테스트가 놓칠 수 있는 구멍이 확인된 경우다.
4. **diff 형식 품질이 별도의 실패 축으로 드러났다.** 적용 실패 4건은 모두 모델이 보지 못한
   코드를 추정해 쓴 데서 왔고, 적용 성공 건도 전부 표준 도구가 거부하는 형식이었다.
   single-shot repair의 실측 완성도는 diff 적용기의 관용성 정의에 민감하다.
