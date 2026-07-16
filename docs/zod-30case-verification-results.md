# Zod 30-case 검증 실행 기록 (2026-07-15)

- 입력: `screening_queues.json` (seed 20260715), `zod-30case-screening.md`
- 실행 환경: 실험용 로컬 클론 @ `912f0f51`, node v24.11.0, pnpm 10.12.1
- 방법: 카테고리별 worktree (`.worktrees/lane-{S,P,N}`), base = 후보 커밋의 parent에 checkout 후
  - **S**: 커밋이 수정한 기존 테스트 파일이 base에서 green 확인 → production diff만 적용 → 동일 테스트 red면 채택
  - **P**: 테스트 diff만 적용 → 대상 테스트 red 확인 → production diff 적용 → green이면 채택
  - **N**: base에서 v4 테스트 green → production diff 적용 후에도 green + `packages/zod` build 통과면 채택
- rule 7 제외 PR 집합 (지난 6케이스): #5555, #5900, #5891, #5937
- 로그: scratchpad `logs/<CAT>-<sha>/`

## S 큐 진행 (목표 10 채택)

| # | sha | 결과 | 사유 |
|---|-----|------|------|
| 1 | 940383d0 | ❌ 탈락 | prod diff 적용 후에도 대상 테스트 green (38/38) — stale-test 조건 불충족. base=0fa4f464 |
| 2 | 0cf45896 | ✅ 채택 | base green (110/110) → prod 적용 후 red (snapshot 2건 mismatch). base=a410616b |
| 3 | 66bda749 | ✅ 채택 | base green (4/4) → prod 적용 후 red (4 failed + type error 2). base=9443aab0 |
| 4 | 3a8edd74 | ✅ 채택 | base green (112/112) → prod 적용 후 red (2 failed). base=103f69be |
| 5 | 6b13cc94 | ✅ 채택 | base green (82/82) → prod 적용 후 red (2 failed). base=39d84d03 |
| 6 | 27f13d62 | ✅ 채택 | base green (138/138) → prod 적용 후 red (5 failed). base=845a230b |
| 7 | 90fa0cdc | ❌ 탈락 | zshy 전환(repo 전면 재구조화) 커밋 — 실제 diff 2,400+ 파일로 스크리닝 통계(2f/5L)와 불일치, prod-only diff 적용 불가(56k라인 패치, lockfile 충돌). fixture 구성 불가. base=1b0a5e58 |
| 8 | 7ca67d31 | ❌ 탈락 | 삭제된 테스트 라인이 신규 파일(stringbool.test.ts)로의 이동분 — base에 존재하는 index.test.ts는 prod 적용 후에도 green (116/116). stale-test 조건 불충족. base=e656947f |
| 9 | 6d47791b | ✅ 채택 | base green (136/136) → prod 적용 후 red (1 failed + type error 1). base=a2c98924 |
| 10 | 6db607be | ❌ 탈락 | release/manifest 성격 커밋(jsr.json·스크립트·JSDoc) — prod 적용 후에도 대상 테스트 green (34/34). stale-test 조건 불충족. base=ad0b8271 |
| 11 | 2529f827 | ✅ 채택 | base green (78/78) → prod 적용 후 red (37 failed). base=98c849de |
| 12 | ad2fc5ee | ✅ 채택 | base green (86/86) → prod 적용 후 red (1 failed). base=f97733ff |
| 13 | 1cab6938 | ⏭️ skip | 규칙 7 — 지난 6케이스 중 b5ab55e4와 동일 PR(#5937) 참조. 검증 미수행 |
| 14 | af88d743 | ❌ 탈락 | "Fix test" 커밋 — 대상 테스트(file.test.ts)가 base에서 이미 red (1 failed/4). base green 전제 불충족. base=0c686afd |
| 15 | f98d1a30 | ✅ 채택 | base green (124/124) → prod 적용 후 red (1 failed). base=592de8de |
| 16 | 5fdece94 | ✅ 채택 | base green (122/122, 테스트 5파일) → prod 적용 후 red (10 failed). base=a73a3b30 — **10번째 채택, S 큐 완료** |

## P 큐 진행 (목표 10 채택)

| # | sha | 결과 | 사유 |
|---|-----|------|------|
| 1 | 7f789def | ✅ 채택 | oracle(base) red (1 failed) → prod 적용 후 green. base=2e5b23dc |
| 2 | f75d8529 | ✅ 채택 | oracle(base) red (2 failed/36) → prod 적용 후 green (36/36). base=17e7f3b4 |
| 3 | 002e01ad | ✅ 채택 | dist-mode 시대(테스트가 빌드 산출물 import) — build 후 oracle red (6 failed/130) → prod+rebuild 후 green (130/130). base=f97e80da |
| 4 | 3048d14b | ✅ 채택 | oracle(base) red (1 failed/2) → prod 적용 후 green (2/2). base=34b400a5 |
| 5 | 363c966b | ✅ 채택 | oracle(base) red (1 failed/4) → prod 적용 후 green (4/4). base=8506c352 |
| 6 | 3cd45ebc | ✅ 채택 | oracle(base) red (1 failed/94) → prod 적용 후 green (94/94). base=3a818de1 |
| 7 | 584b1089 | ✅ 채택 | oracle(base) red (2 failed/148) → prod 적용 후 green (148/148). base=15cafa13 |
| 8 | 2be1c6ad | ✅ 채택 | oracle(base) red (1 failed/10 + type error) → prod 적용 후 green (10/10). base=8ab23742 |
| 9 | 91a7d0d1 | ⏭️ skip | 규칙 8 — 7번(584b1089)과 동일 subject의 중복 랜딩. 검증 미수행 |
| 10 | 25a4c376 | ✅ 채택 | oracle(base) red (2 failed/110) → prod 적용 후 green (110/110). base=e45e61b6 |
| 11 | 2e5b23dc | ✅ 채택 | oracle(base) red (1 failed/44) → prod 적용 후 green (44/44). base=518f15dd — **10번째 채택, P 큐 완료** |

## N 큐 진행 (목표 10 채택)

| # | sha | 결과 | 사유 |
|---|-----|------|------|
| 1 | 0d87aa4a | ✅ 채택 | v4 테스트 1660개 전후 모두 green + build 통과. base=ed933d91 |
| 2 | 592de8de | ✅ 채택 | v4 테스트 1592개 전후 모두 green + build 통과. base=5e4ff20b |
| 3 | 1fa86899 | ❌ 탈락 | prod diff 적용 후 json-schema.test.ts 2건 red (recursive interface snapshot에 `$schema` 추가됨) — N의 전후 green 조건 위반. base=6b13cc94 |
| 4 | abc13de0 | ❌ 탈락 | prod diff(core/function.ts) 적용 후 red (2 failed + type error 2) — 전후 green 조건 위반. base=99e23292 |
| 5 | d85f3ea4 | ❌ 탈락 | prod diff 적용 후 record.test.ts "partial record" 1건 red (unrecognized_keys) — 전후 green 조건 위반. base=b73b1f61 |
| 6 | 5b574501 | ✅ 채택 | v4 테스트 2524개 전후 모두 green + build 통과. base=65f1f404 |
| 7 | 5905a8d8 | ✅ 채택 | v4 테스트 1706개 전후 모두 green + build 통과. base=b2592111 |
| 8 | 9712a670 | ✅ 채택 | v4 테스트 2371개 전후 모두 green + build 통과. base=73b071d7 |
| 9 | 4975f3a0 | ✅ 채택 | v4 테스트 1760개 전후 모두 green + build 통과. base=d589186c |
| 10 | 36c4ee35 | ✅ 채택 | v4 테스트 1946개 전후 모두 green + build 통과. base=aab33566 |
| 11 | 195e8696 | ✅ 채택 | v4 테스트 2662개 전후 모두 green + build 통과. base=285bde7f |
| 12 | c5d9e7ce | ✅ 채택 | v4 테스트 1600개 전후 모두 green + build 통과. base=edc34778 |
| 13 | b142ea8f | ✅ 채택 | v4 테스트 1684개 전후 모두 green + build 통과. base=f350a693 — **10번째 채택, N 큐 완료** |

## 채택 확정

### S (stale-test) — 10/10

`0cf45896`, `66bda749`, `3a8edd74`, `6b13cc94`, `27f13d62`, `6d47791b`, `2529f827`, `ad2fc5ee`, `f98d1a30`, `5fdece94`

(큐 1~16 소진: 탈락 5건 — 940383d0, 90fa0cdc, 7ca67d31, 6db607be, af88d743 / 규칙7 skip 1건 — 1cab6938)

### P (production-regression) — 10/10

`7f789def`, `f75d8529`, `002e01ad`, `3048d14b`, `363c966b`, `3cd45ebc`, `584b1089`, `2be1c6ad`, `25a4c376`, `2e5b23dc`

(큐 1~11 소진: 탈락 0건 / 규칙8 skip 1건 — 91a7d0d1)

### N (normal) — 10/10

`0d87aa4a`, `592de8de`, `5b574501`, `5905a8d8`, `9712a670`, `4975f3a0`, `36c4ee35`, `195e8696`, `c5d9e7ce`, `b142ea8f`

(큐 1~13 소진: 탈락 3건 — 1fa86899, abc13de0, d85f3ea4)

## 실행 노트 (fixture 구성 시 참고)

- **dist-mode 시대**: 2025-09~2025-12 무렵 커밋(예: P3 002e01ad, base f97e80da)은 테스트가 `zod/v4`를 빌드 산출물에서 import한다 (CI도 `pnpm build` 후 `pnpm test`). 이 시대의 fixture는 **base에서 `packages/zod` build 후 테스트 실행, prod diff 적용 시 재빌드**가 필요하다. 그 외 시대는 `@zod/source` resolve condition으로 소스를 직접 실행하므로 빌드 불필요. 판별 signature: `Cannot find package 'zod/v4'`.
- **vitest 실행 위치**: 시대에 따라 `packages/zod` cwd 실행이 "No projects were found"로 실패하는 구간이 있음(root config의 `projects: ["packages/*"]`를 패키지 config가 merge하는 시대). repo root 실행으로 fallback하면 되지만, root 실행은 bench/resolution 패키지의 무관한 typecheck 노이즈가 섞이는 시대가 있어 실패 판정은 "Tests N failed" 카운트 기준으로 해야 한다.
- **prod diff에서 pnpm-lock.yaml 제외**: `pnpm install`이 lockfile을 다시 쓰므로 diff가 충돌한다. 어차피 프로덕션 코드가 아님.
- 검증 로그 전체: scratchpad `logs/<CAT>-<sha>/` (base/prod 적용 전후 vitest 로그, 적용 patch, build 로그 포함)
