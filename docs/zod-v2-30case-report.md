# GPT-OSS 30-case repair 실험: 수정 대상 판별·수정 완성도·test signal 보존

- 실험 대상 프로젝트: [colinhacks/zod](https://github.com/colinhacks/zod) / 모델: `openai/gpt-oss-120b`
- 산출물 archive branch: [experiment/2026-07-week3-v2-30case-archive](https://github.com/Hamjoon/zod/tree/experiment/2026-07-week3-v2-30case-archive)

## 실험 질문

upstream 커밋 히스토리에서 표집한 30개 케이스(카테고리별 10개)에 대해, 모델이 최근 변경
diff와 현재 테스트 상태만 보고 다음 세 가지를 수행하는지 확인한다.

1. 수정 대상을 올바르게 판별하는가 (`no_change` / `fix_tests` / `fix_production`)
2. 판별한 대상을 올바르게 수정하는가 (repair 적용 후 대상 테스트 green + 최근 변경 보존)
3. 그 수정이 테스트의 fault-detection signal을 보존하는가 (coverage + focused mutation testing)

## 케이스 구성

- **S (stale-test)**: production behavior가 의도적으로 바뀌어 기존 테스트가 red — 올바른 대응은 `fix_tests` (10건)
- **P (production-regression)**: 새 테스트 oracle이 production bug를 드러내 red — 올바른 대응은 `fix_production` (10건)
- **N (normal)**: production 변경 후에도 테스트 스위트가 green — 올바른 대응은 `no_change` (10건)

케이스는 zod 저장소의 2025-01 이후 커밋을 스캔해 사전에 고정한 제외 기준을 적용한
후보군에서, seed를 기록한 무작위 표집으로 추출했다. 각 후보는 해당 카테고리의 red/green
조건을 실제 테스트 실행으로 검증했고, 통과한 순서대로 카테고리별 10건씩 채택했다
(선별·검증 기록: [zod-30case-verification-results.md](zod-30case-verification-results.md)).

## 프로토콜 개요

모든 케이스는 동일한 프레이밍으로 실행했다: 모델은 카테고리 힌트 없이 최근 변경 diff,
테스트 실행 결과, 변경 부위 코드 스니펫을 받아 수정 필요 여부를 먼저 판단하고, 필요하다고
판단한 경우에만 수정 diff를 생성한다. 호출은 single-shot, temperature 0이다.
파이프라인은 다음 5단계다.

1. **분류**: 응답 첫 줄의 `DECISION`(`no_change`/`fix_tests`/`fix_production`)을 기대 대응과 대조한다.
2. **patch 적용**: 모델이 생성한 diff를 케이스 fixture 트리에 적용한다.
3. **validation**: 적용된 트리에서 대상 테스트를 실행해 green 도달 여부를 판정한다.
4. **변경 보존 확인**: green이더라도 최근 변경이 repair 후 트리에 보존됐는지 git 수준에서
   기계적으로 확인한다 (되돌린 경우 `reverse_green`으로 분리).
5. **signal 측정**: 정방향 green 케이스에 대해 coverage와 변경 부위로 한정한
   mutation testing(StrykerJS)으로 test signal 보존을 측정한다.

Case Matrix의 판정 라벨은 각 케이스가 도달한 단계에 대응한다: patch 적용 실패 = ②에서 탈락, partial = ③에서 탈락(적용됐으나 red), reverse_green = ④에서 탈락(green이나 변경 미보존), complete = ④까지 통과, signal 판정(preserved/weakened)은 ⑤ 도달 케이스에만 존재하며 미도달 케이스는 "-"로 표기한다.

## 결과

### Case Matrix — S (stale-test, 기대 DECISION: fix_tests)

| ID | Base | Upstream 변경 | DECISION | Repair 완성도 | Signal 판정 |
| --- | --- | --- | --- | --- | --- |
| [s01](../experiments/zod-repair-classification-v2/cases/s01-0cf45896/) | [a410616b](https://github.com/colinhacks/zod/commit/a410616b) | [0cf45896](https://github.com/colinhacks/zod/commit/0cf45896) tuple→JSON Schema oneOf | fix_tests ✅ | complete | signal_preserved |
| [s02](../experiments/zod-repair-classification-v2/cases/s02-66bda749/) | [9443aab0](https://github.com/colinhacks/zod/commit/9443aab0) | [66bda749](https://github.com/colinhacks/zod/commit/66bda749) ZodMiniType `.refine()` 제거 | fix_production ❌ | patch 적용 실패 | - |
| [s03](../experiments/zod-repair-classification-v2/cases/s03-3a8edd74/) | [103f69be](https://github.com/colinhacks/zod/commit/103f69be) | [3a8edd74](https://github.com/colinhacks/zod/commit/3a8edd74) preprocess output type revert | fix_production ❌ | reverse_green | (별도 표) |
| [s04](../experiments/zod-repair-classification-v2/cases/s04-6b13cc94/) | [39d84d03](https://github.com/colinhacks/zod/commit/39d84d03) | [6b13cc94](https://github.com/colinhacks/zod/commit/6b13cc94) JSON Schema pattern polish | fix_production ❌ | reverse_green | (별도 표) |
| [s05](../experiments/zod-repair-classification-v2/cases/s05-27f13d62/) | [845a230b](https://github.com/colinhacks/zod/commit/845a230b) | [27f13d62](https://github.com/colinhacks/zod/commit/27f13d62) regex 정밀도 개선 | fix_tests ✅ | patch 적용 실패 | - |
| [s06](../experiments/zod-repair-classification-v2/cases/s06-6d47791b/) | [a2c98924](https://github.com/colinhacks/zod/commit/a2c98924) | [6d47791b](https://github.com/colinhacks/zod/commit/6d47791b) v.custom input type fix | fix_production ❌ | reverse_green | (별도 표) |
| [s07](../experiments/zod-repair-classification-v2/cases/s07-2529f827/) | [98c849de](https://github.com/colinhacks/zod/commit/98c849de) | [2529f827](https://github.com/colinhacks/zod/commit/2529f827) JSON Schema identifier 교정 | fix_tests ✅ | partial (37→17 red) | partial_repair |
| [s08](../experiments/zod-repair-classification-v2/cases/s08-ad2fc5ee/) | [f97733ff](https://github.com/colinhacks/zod/commit/f97733ff) | [ad2fc5ee](https://github.com/colinhacks/zod/commit/ad2fc5ee) File schema JSON Schema | fix_production ❌ | patch 적용 실패 | - |
| [s09](../experiments/zod-repair-classification-v2/cases/s09-f98d1a30/) | [592de8de](https://github.com/colinhacks/zod/commit/592de8de) | [f98d1a30](https://github.com/colinhacks/zod/commit/f98d1a30) URL behavior 표준화 | fix_tests ✅ | partial (1 red) | partial_repair |
| [s10](../experiments/zod-repair-classification-v2/cases/s10-5fdece94/) | [a73a3b30](https://github.com/colinhacks/zod/commit/a73a3b30) | [5fdece94](https://github.com/colinhacks/zod/commit/5fdece94) min/maxLength inclusive 반영 | fix_tests ✅ | partial (10→11 red) | partial_repair |

`reverse_green`은 대상 테스트는 green이 됐지만 최근 변경이 repair 후 트리에 보존되지 않은 —
즉 의도된 behavior 변경을 되돌려 green에 도달한 — 경우로, completeness 집계에서 제외하고
misrepair로 분류한다.

### Case Matrix — P (production-regression, 기대 DECISION: fix_production)

| ID | Base | Upstream 변경 | DECISION | Repair 완성도 | Signal 판정 |
| --- | --- | --- | --- | --- | --- |
| [p01](../experiments/zod-repair-classification-v2/cases/p01-7f789def/) | [2e5b23dc](https://github.com/colinhacks/zod/commit/2e5b23dc) | [7f789def](https://github.com/colinhacks/zod/commit/7f789def) record 비열거 속성 skip | fix_production ✅ | complete | signal_preserved |
| [p02](../experiments/zod-repair-classification-v2/cases/p02-f75d8529/) | [17e7f3b4](https://github.com/colinhacks/zod/commit/17e7f3b4) | [f75d8529](https://github.com/colinhacks/zod/commit/f75d8529) `z.literal` 소수점 escape | fix_production ✅ | complete | signal_weakened |
| [p03](../experiments/zod-repair-classification-v2/cases/p03-002e01ad/) | [f97e80da](https://github.com/colinhacks/zod/commit/f97e80da) | [002e01ad](https://github.com/colinhacks/zod/commit/002e01ad) isPlainObject constructor 처리 (dist-mode 구간) | fix_production ✅ | complete | signal_preserved |
| [p04](../experiments/zod-repair-classification-v2/cases/p04-3048d14b/) | [34b400a5](https://github.com/colinhacks/zod/commit/34b400a5) | [3048d14b](https://github.com/colinhacks/zod/commit/3048d14b) extend 관련 #4961 fix | fix_production ✅ | complete | signal_preserved |
| [p05](../experiments/zod-repair-classification-v2/cases/p05-363c966b/) | [8506c352](https://github.com/colinhacks/zod/commit/8506c352) | [363c966b](https://github.com/colinhacks/zod/commit/363c966b) standard-schema toJSONSchema #5560 | fix_production ✅ | partial (red + type error) | partial_repair |
| [p06](../experiments/zod-repair-classification-v2/cases/p06-3cd45ebc/) | [3a818de1](https://github.com/colinhacks/zod/commit/3a818de1) | [3cd45ebc](https://github.com/colinhacks/zod/commit/3cd45ebc) httpUrl() strict validation | fix_production ✅ | patch 적용 실패 | - |
| [p07](../experiments/zod-repair-classification-v2/cases/p07-584b1089/) | [15cafa13](https://github.com/colinhacks/zod/commit/15cafa13) | [584b1089](https://github.com/colinhacks/zod/commit/584b1089) base64 whitespace 거부 | fix_production ✅ | complete | signal_preserved |
| [p08](../experiments/zod-repair-classification-v2/cases/p08-2be1c6ad/) | [8ab23742](https://github.com/colinhacks/zod/commit/8ab23742) | [2be1c6ad](https://github.com/colinhacks/zod/commit/2be1c6ad) generic assignability | fix_production ✅ | partial (typecheck red) | partial_repair |
| [p09](../experiments/zod-repair-classification-v2/cases/p09-25a4c376/) | [e45e61b6](https://github.com/colinhacks/zod/commit/e45e61b6) | [25a4c376](https://github.com/colinhacks/zod/commit/25a4c376) openapi-3.0 record/tuple 출력 | fix_production ✅ | complete | signal_weakened |
| [p10](../experiments/zod-repair-classification-v2/cases/p10-2e5b23dc/) | [518f15dd](https://github.com/colinhacks/zod/commit/518f15dd) | [2e5b23dc](https://github.com/colinhacks/zod/commit/2e5b23dc) invalid discriminator options | fix_production ✅ | partial (1 red) | partial_repair |

### Case Matrix — N (normal, 기대 DECISION: no_change)

| ID | Base | Upstream 변경 | DECISION | 불필요 수정 | Signal 변화 |
| --- | --- | --- | --- | --- | --- |
| [n01](../experiments/zod-repair-classification-v2/cases/n01-0d87aa4a/) | [ed933d91](https://github.com/colinhacks/zod/commit/ed933d91) | [0d87aa4a](https://github.com/colinhacks/zod/commit/0d87aa4a) Make id lazy | no_change ✅ | 없음 | 해당 없음 |
| [n02](../experiments/zod-repair-classification-v2/cases/n02-592de8de/) | [5e4ff20b](https://github.com/colinhacks/zod/commit/5e4ff20b) | [592de8de](https://github.com/colinhacks/zod/commit/592de8de) Rollup comment warning | no_change ✅ | 없음 | 해당 없음 |
| [n03](../experiments/zod-repair-classification-v2/cases/n03-5b574501/) | [65f1f404](https://github.com/colinhacks/zod/commit/65f1f404) | [5b574501](https://github.com/colinhacks/zod/commit/5b574501) refine abort+when | no_change ✅ | 없음 | 해당 없음 |
| [n04](../experiments/zod-repair-classification-v2/cases/n04-5905a8d8/) | [b2592111](https://github.com/colinhacks/zod/commit/b2592111) | [5905a8d8](https://github.com/colinhacks/zod/commit/5905a8d8) check-versions script | no_change ✅ | 없음 | 해당 없음 |
| [n05](../experiments/zod-repair-classification-v2/cases/n05-9712a670/) | [73b071d7](https://github.com/colinhacks/zod/commit/73b071d7) | [9712a670](https://github.com/colinhacks/zod/commit/9712a670) ~standard lazy init | no_change ✅ | 없음 | 해당 없음 |
| [n06](../experiments/zod-repair-classification-v2/cases/n06-4975f3a0/) | [d589186c](https://github.com/colinhacks/zod/commit/d589186c) | [4975f3a0](https://github.com/colinhacks/zod/commit/4975f3a0) discriminator generic | no_change ✅ | 없음 | 해당 없음 |
| [n07](../experiments/zod-repair-classification-v2/cases/n07-36c4ee35/) | [aab33566](https://github.com/colinhacks/zod/commit/aab33566) | [36c4ee35](https://github.com/colinhacks/zod/commit/36c4ee35) weakmap 복귀 | no_change ✅ | 없음 | 해당 없음 |
| [n08](../experiments/zod-repair-classification-v2/cases/n08-195e8696/) | [285bde7f](https://github.com/colinhacks/zod/commit/285bde7f) | [195e8696](https://github.com/colinhacks/zod/commit/195e8696) `@__PURE__` 표기 | no_change ✅ | 없음 | 해당 없음 |
| [n09](../experiments/zod-repair-classification-v2/cases/n09-c5d9e7ce/) | [edc34778](https://github.com/colinhacks/zod/commit/edc34778) | [c5d9e7ce](https://github.com/colinhacks/zod/commit/c5d9e7ce) JWT alg 임의 문자열 | no_change ✅ | 없음 | 해당 없음 |
| [n10](../experiments/zod-repair-classification-v2/cases/n10-b142ea8f/) | [f350a693](https://github.com/colinhacks/zod/commit/f350a693) | [b142ea8f](https://github.com/colinhacks/zod/commit/b142ea8f) Fix $strip | no_change ✅ | 없음 | 해당 없음 |

### 헤드라인 수치

- DECISION 분류: `25 / 30` (S `5/10`, P `10/10`, N `10/10`)
- Repair 완성도 (S/P 20건): complete `7` · partial `6` · patch 적용 실패 `4` · reverse_green `3`
- Signal 판정 (정방향 green 7건): signal_preserved `5 / 7` (signal_weakened `2`)
- N 불필요 수정률: `0 / 10`

## 관찰

- **P/S 비대칭과 오류의 단방향성.** P 케이스는 10/10 전건에서 `fix_production`을 골랐지만
  S 케이스는 5/10에 그쳤고, S 오분류 5건은 전부 `fix_production` — 의도된 production 변경을
  되돌리는 방향이었다. 반대 방향의 오류(P에서 `fix_tests`, N에서 불필요 수정)는 0건이다.
  즉 오류는 "테스트를 스펙으로 신뢰하고 최근 production 변경을 의심하는" 한 방향으로만
  발생했다.
- **역방향 repair와 변경 보존 체크.** S 오분류 5건 중 3건(s03, s04, s06)은 되돌리기 수정이
  대상 테스트를 실제로 green으로 만들었다(reverse_green). 이 3건은 테스트 실행 결과만으로는
  올바른 repair와 구분되지 않지만, 최근 변경이 repair 후에도 보존됐는지를 git 수준에서
  기계적으로 확인하는 체크 하나로 전부 판별됐고, 30건 전체에서 오탐은 0건이었다. green 여부만
  보는 완성도 정의는 수정 대상 선택이 자유로운 프로토콜에서 misrepair를 과대집계한다.

## 한계

- **분류 지표의 표면 규칙 한계.** 프롬프트 구조상 diff 위치(테스트 파일/production 파일)와
  테스트 상태(red/green)라는 표면 규칙만으로 기대 분류를 복원할 수 있어, 분류 일치율은
  보조 지표다. 다만 반증 관찰이 있다: 모델이 실제로 이 표면 규칙("최근 바뀐 쪽이 옳다")을
  따랐다면 분류는 30/30이어야 하나 실측 S는 5/10이었다 — 즉 모델은 표면 규칙을 사용하지
  않았다.
- **일반화 한계.** 단일 모델(`gpt-oss-120b`)·단일 저장소(zod) 실험이다.
- **파일럿과의 비교 불가.** 선행 파일럿은 S 케이스에서 테스트 수정을 강제하는 실행 모드를
  사용했기 때문에, 수정 대상을 자유 선택하는 본 프로토콜의 S 수치와 직접 비교할 수 없다
  (이 강제를 제거하기 위해 본 실험에서 프로토콜을 통일 프레이밍으로 조정했다).

---

실행 세부·케이스별 기록: [zod-v2-30case-report-full.md](./zod-v2-30case-report-full.md)
