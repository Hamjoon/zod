# Zod 30-case 스크리닝: 후보 풀과 검증 큐 (2026-07 3주차)

## 목적

S(stale-test) / P(production-regression) / N(normal) 각 10개, 총 30개 신규 케이스를 선정하기 위한
후보 채굴 결과. 선정 규칙은 채굴 전에 고정했고, 표집 seed를 기록하여 재현 가능하다.

## 대상과 윈도우

- 대상 저장소: colinhacks/zod (main, 2026-06-10 `912f0f5` 시점)
- 후보 윈도우: **2025-01-01 이후** upstream 커밋
  - 모델 gpt-oss-120b 공식 knowledge cutoff: 2024-06-01
  - 지난 실험(6월 4주차~7월 1주차)과 동일한 operational filter를 유지 (cutoff 대비 7개월 버퍼)
- merge commit 제외, 커밋 총 829건 스캔

## 제외 기준 (채굴 전 고정, 적용 순서대로)

1. 지난 6케이스의 upstream 커밋 6건
   (`0fe88407`, `ae68f62f`, `f32ddf9e`, `cede2c63`, `61d7bedb`, `b5ab55e4`) — 4건이 윈도우 내 존재, 제외됨
2. production/테스트 코드 변경이 없는 커밋 (docs, build, workflow 등): 447건
3. production 변경이 locale 파일(`src/v4/locales/`)뿐인 커밋: 36건
4. 버전 릴리스 커밋 (메시지가 `vX.Y.Z` / `Publish` / `Release`로 시작): 50건
5. production 변경에 `packages/zod/src/v4/` 경로가 하나도 없는 커밋 (v3 전용 등, 파이프라인은 v4 대상): 6건
6. production diff 250라인 초과 또는 production 파일 5개 이상 (fixture 구성 비현실적): 18건

추가 규칙 (검증 단계 적용):
7. 지난 6케이스와 동일한 upstream PR 번호를 참조하는 커밋은 채택하지 않는다.
   (예: S 큐 13번 `1cab6938`은 P3와 같은 #5937 참조 → 검증 시 skip)
8. subject line이 동일한 중복 커밋은 하나로 취급한다.
   (예: P 큐 7번 `584b1089` / 9번 `91a7d0d1` — 동일 변경의 중복 랜딩)

## 분류 휴리스틱 (라인 단위)

- **S 후보** (45건): production 변경 + 기존 테스트 기대값 재작성 흔적 (test 삭제 라인 ≥ 2).
  fixture 구성: production 변경만 적용, 테스트는 base 상태 유지 → stale 상태.
- **P 후보** (67건): `fix`/`bug`로 시작하는 커밋 + 테스트가 주로 추가 (추가 ≥ 3라인, 삭제 ≤ 추가의 30%).
  fixture 구성: 신규 테스트 oracle만 base에 적용 → pre-fix production의 버그가 드러남.
- **N 후보** (73건): production 변경만 있고 테스트 변경 없음.
  fixture 구성: production 변경 적용, 테스트 무변경. 기대 정답 = "수정 불필요" 판단.

주의: S/P 휴리스틱은 message와 diff 형태 기반이므로 개별 후보가 실제로 해당 카테고리의
성질(S: prod 적용 시 기존 테스트 red / P: oracle 적용 시 base에서 red)을 갖는지는
검증 단계에서 실행으로 확인한다.

## 표집 방식

- 각 풀을 `random.Random(20260715)`로 셔플한 순서 = 검증 큐
- **검증 큐 앞에서부터 순서대로 검증을 수행하고, 통과한 첫 10개를 채택한다.**
  검증 실패(빌드 불가, red/green 조건 불충족, 규칙 7/8 해당)는 사유를 기록하고 다음 후보로 넘어간다.
  이 방식은 무작위성을 유지하면서 실행 불가능한 후보를 걸러내며, 채택/탈락 사유가 전부 기록되므로
  사후 체리피킹 여지가 없다.

## 검증 큐 (카테고리별 상위 14)

### S 검증 큐

| # | date | sha | prod | test +/- | subject |
|---|------|-----|------|----------|---------|
| 1 | 2025-08-25 | 940383d0 | 2f/2L | +177/-142 | Update JSON codec and docs |
| 2 | 2025-08-25 | 0cf45896 | 1f/6L | +23/-19 | fix(v4): toJSONSchema - add missing oneOf inside items in tuple |
| 3 | 2025-12-31 | 66bda749 | 1f/5L | +0/-19 | Remove .refine() from ZodMiniType |
| 4 | 2025-05-28 | 3a8edd74 | 2f/22L | +0/-27 | Revert "Use output type for preprocess (#4552)" |
| 5 | 2025-05-27 | 6b13cc94 | 1f/12L | +46/-36 | Polish JSON Schema for patterns |
| 6 | 2025-09-10 | 27f13d62 | 1f/18L | +12/-10 | Improve regex precision and eliminate duplicates in regexes.ts |
| 7 | 2025-07-02 | 90fa0cdc | 2f/5L | +12/-13 | Switch to `zshy` (#4777) |
| 8 | 2025-05-27 | 7ca67d31 | 2f/14L | +53/-42 | Support stringbool custom messages |
| 9 | 2025-05-22 | 6d47791b | 2f/10L | +7/-5 | Fix v.custom input type, add z.core., error map docs |
| 10 | 2026-04-29 | 6db607be | 1f/4L | +6/-6 | fix(release): keep JSR manifest publishable |
| 11 | 2025-05-22 | 2529f827 | 1f/4L | +108/-108 | fix: update correct JSON Schema identifiers (#4485) |
| 12 | 2025-05-29 | ad2fc5ee | 3f/36L | +40/-4 | Implement OpenAPI-friendly JSON Schema for File schemas (#4567) |
| 13 | 2026-05-03 | 1cab6938 | 1f/13L | +25/-28 | fix(v4): restore catch handling for absent object keys — **규칙 7 해당 (P3와 동일 #5937), skip 예정** |
| 14 | 2025-06-13 | af88d743 | 1f/2L | +5/-44 | Fix test |

### P 검증 큐

| # | date | sha | prod | test +/- | subject |
|---|------|-----|------|----------|---------|
| 1 | 2026-04-27 | 7f789def | 1f/2L | +58/-0 | fix: skip non-enumerable properties in record validation (#5719) |
| 2 | 2025-07-23 | f75d8529 | 1f/2L | +28/-0 | fix: escapes decimal place in `z.literal` (#4895) |
| 3 | 2025-11-17 | 002e01ad | 1f/2L | +140/-1 | fix(record): handle non-function constructor field in isPlainObject |
| 4 | 2025-07-23 | 3048d14b | 2f/243L | +18/-0 | Fix #4961 |
| 5 | 2025-12-30 | 363c966b | 1f/8L | +34/-1 | Fix #5560 |
| 6 | 2026-02-08 | 3cd45ebc | 4f/23L | +6/-0 | fix (v4): adds strict validation to httpUrl() (#5672) |
| 7 | 2026-04-28 | 584b1089 | 1f/2L | +15/-0 | fix(v4): reject whitespace in z.base64() to close atob bypass (#58…) |
| 8 | 2025-06-06 | 2be1c6ad | 2f/41L | +16/-0 | Fix generic assignability issue. 3.25.54 |
| 9 | 2026-04-28 | 91a7d0d1 | 1f/2L | +15/-0 | **규칙 8 해당 (7번과 동일 subject), skip 예정** |
| 10 | 2025-08-24 | 25a4c376 | 1f/38L | +58/-0 | fix(v4): toJSONSchema - wrong record tuple output when targeting … |
| 11 | 2026-04-27 | 2e5b23dc | 3f/7L | +5/-1 | fix: add options to invalid discriminator errors (#5723) |
| 12 | 2025-08-25 | 8bf0c163 | 1f/12L | +98/-3 | fix(v4): toJSONSchema tuple path handling for draft-7 with metadata |
| 13 | 2025-12-29 | 7e9ad3f0 | 1f/6L | +21/-2 | Fix JSON Schema generation for `z.iso.time` with minute precision |
| 14 | 2025-05-30 | 508e3065 | 3f/26L | +15/-0 | Fix type inference in ZodMiniType check method (#4568) |

### N 검증 큐

| # | date | sha | prod | test +/- | subject |
|---|------|-----|------|----------|---------|
| 1 | 2025-06-09 | 0d87aa4a | 1f/3L | +0/-0 | Make id lazy |
| 2 | 2025-05-23 | 592de8de | 3f/87L | +0/-0 | fix: Rollup comment warning. (#4462) |
| 3 | 2025-05-27 | 1fa86899 | 1f/19L | +0/-0 | Move to top |
| 4 | 2025-05-29 | abc13de0 | 1f/17L | +0/-0 | Add major version section |
| 5 | 2025-10-21 | d85f3ea4 | 1f/2L | +0/-0 | Fix #5353 |
| 6 | 2026-02-08 | 5b574501 | 2f/13L | +0/-0 | fix: respect `abort: true` in `.refine()` for checks with `when` |
| 7 | 2025-07-09 | 5905a8d8 | 2f/4L | +0/-0 | Improve check-versions script |
| 8 | 2025-12-16 | 9712a670 | 1f/5L | +0/-0 | perf: lazy initialize ~standard schema property (#5363) |
| 9 | 2025-08-05 | 4975f3a0 | 4f/64L | +0/-0 | feat: add discriminator generic (#5044) |
| 10 | 2025-09-11 | 36c4ee35 | 1f/4L | +0/-0 | Switch back to weakmap |
| 11 | 2026-04-28 | 195e8696 | 4f/23L | +0/-0 | perf(v4): mark top-level factory calls as `/*@__PURE__*/` |
| 12 | 2025-05-29 | c5d9e7ce | 2f/5L | +0/-0 | Allow arbitary strings for JWT alg |
| 13 | 2025-06-12 | b142ea8f | 1f/2L | +0/-0 | Fix $strip |
| 14 | 2025-10-16 | 39f8c45b | 4f/68L | +0/-0 | faster initialization (#5352) |

큐 15번 이후 후보는 `screening_queues.json` (S 45 / P 67 / N 73 전체, seed 순서 보존)에 있다.

## 케이스별 검증 절차 (채택 조건)

각 후보에 대해 base = 후보 커밋의 parent로 두고:

- **S**: production diff만 base에 적용 → `pnpm test` 대상 테스트 파일이 **red**여야 채택.
  (red를 만드는 기존 테스트가 없으면 stale-test 상태가 아니므로 탈락)
- **P**: 테스트 diff만 base에 적용 → 신규 oracle이 **red**여야 하고,
  production diff까지 적용하면 **green**이어야 채택.
- **N**: production diff 적용 전후 모두 관련 테스트 **green**이어야 채택.
  (빌드/타입체크 통과 포함)

공통 탈락 사유 기록 항목: 빌드 실패, red/green 조건 불충족, 규칙 7/8 해당, 기타(사유 명기).

## 프로토콜 v2 참고사항

- 30케이스는 통일 프레이밍("수정 필요 여부를 판단하고 필요 시 수정")의 프로토콜 v2로 실행한다.
- v2 결과는 7월 1주차 6케이스(v1, failure-triggered 프레이밍)와 수치를 직접 비교하지 않는다.
- N 케이스 지표: (1) 불필요 수정 발생률, (2) 수정 발생 시 mutation 기반 signal 변화.
  signal 지표는 green 상태에만 적용한다는 기존 taxonomy 원칙 유지.
