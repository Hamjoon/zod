# Zod 30-case 프로토콜 v2 본실험 배치 지시서 (2026-07 3주차)

Claude Code 실행용. 검증 배치(`zod-30case-verification-results.md`)에서 채택 확정된
30케이스에 대해 fixture 구성 → gpt-oss-120b 실행 → validation → signal 측정을 수행하고
7월 1주차 포맷의 archive branch 산출물을 만든다.

## 입력

- repo: zod-thesis 로컬 클론 (origin=Hamjoon/zod, upstream=colinhacks/zod, upstream fetch 완료 상태)
- 채택 케이스: `zod-30case-verification-results.md`의 "채택 확정" 섹션 (S/P/N 각 10, base sha 포함)
- 검증 로그: scratchpad `logs/<CAT>-<sha>/` (base 확인용 재활용 가능)
- runner: `scripts/run-gptoss-test-maintenance.py` (아래 0단계에서 수정)

## 0단계 — runner에 `--mode v2-unified` 추가

기존 두 모드(test-maintenance, repair-classification)는 수정하지 말 것 (v1 재현성 보존).
새 모드 사양:

- **입력 3종을 프롬프트에 포함**:
  1. `<recent_change_diff>`: 이 케이스에서 base에 적용된 diff (S/N=production diff, P=신규 테스트 diff)
  2. `<test_output>`: 테스트 실행 결과 (S/P=failure log, N=green 요약. 예: "Tests 2524 passed")
  3. `<test_snippet>` / `<production_snippet>`: 기존과 동일
- **intro (모든 케이스 동일, 카테고리 힌트 금지)**:
  "You are maintaining a TypeScript library. A change was recently applied to this repository.
  Review the recent change and the current test results, then decide whether any modification
  is needed: update tests, fix production code, or no change at all."
- **constraints (모든 케이스 동일)**:
  - 첫 줄에 반드시 `DECISION: no_change | fix_tests | fix_production` 중 하나를 출력
  - fix_* 인 경우에만 이어서 unified diff 출력, no_change면 diff 없음
  - allowed files: 케이스 메타데이터의 test_path / prod_path
  - "Do not weaken, delete, or skip assertions" / "Preserve nearby behavior" 유지
- temperature 0, single-shot 유지. self-correction/재시도 없음.

## 1단계 — 케이스 메타데이터 작성

`experiments/zod-repair-classification-v2/cases.json`에 30건 각각:

```json
{
  "id": "s01-0cf45896",
  "category": "S",
  "upstream_sha": "0cf45896",
  "base_sha": "a410616b",
  "test_paths": ["<upstream 커밋이 수정한 테스트 파일들>"],
  "prod_paths": ["<upstream 커밋이 수정한 production 파일들>"],
  "dist_mode": false
}
```

- `dist_mode` 판별: base commit 날짜가 2025-09~2025-12 구간이면 후보로 보고,
  base에서 build 없이 vitest 실행 시 `Cannot find package 'zod/v4'` 에러가 나면 true 확정.
  (검증 배치에서 확인된 확정 dist-mode 케이스: p03-002e01ad / base f97e80da)
- id 규칙: `<cat><번호 2자리>-<upstream sha 8자리>`, 큐 채택 순서대로 번호 부여.

## 2단계 — fixture 구성 (케이스별 worktree)

`git worktree add .worktrees/<id> <base_sha>` 후:

- **S**: upstream 커밋의 diff 중 production 파일 변경분만 적용 (`git show <sha> -- <prod paths> | git apply`).
  테스트는 base 그대로. **pnpm-lock.yaml은 diff에서 항상 제외.**
- **P**: 테스트 파일 변경분만 적용. production은 base 그대로.
- **N**: production diff 전체 적용 (원래 테스트 변경 없음).
- `pnpm install` (pnpm store-dir를 공유 경로로 고정해 캐시 활용).
- dist_mode=true 케이스는 여기서 `packages/zod` build 1회.
- fixture 상태 확인 (검증 배치에서 이미 통과했으므로 스모크 수준):
  - S/P: targeted 테스트 red 확인 + failure log 캡처 → `<test_output>` 입력
  - N: `packages/zod` 스위트 green 확인 + 요약 캡처
- vitest 실행 위치: `packages/zod` cwd 실행이 "No projects were found"로 실패하는 구간은
  repo root 실행으로 폴백. root 실행 시 실패 판정은 "Tests N failed" 카운트 기준
  (bench/resolution 패키지의 무관한 typecheck 노이즈 무시).
- vitest 출력은 파일로 리다이렉트하고 요약만 읽을 것 (토큰 절약).

## 3단계 — 모델 실행

케이스별 1회:

```bash
OPENROUTER_API_KEY=$(security find-generic-password -s openrouter-api-key -w) \
  python3 scripts/run-gptoss-test-maintenance.py --mode v2-unified --case <id> ...
```

- key는 호출 시점 환경변수 주입만. 파일/로그/아티팩트에 절대 기록 금지.
- 아티팩트(prompt, response, usage JSON)는 `experiments/zod-repair-classification-v2/cases/<id>/`에 저장.

## 4단계 — validation (targeted 실행)

response에서 DECISION과 diff를 파싱해 기록 후:

- **DECISION 채점**: 기대값 S=fix_tests, P=fix_production, N=no_change.
- **N + no_change**: 정답 행동. 추가 실행 없음. 종료.
- **diff가 있는 경우**: 모델 patch 적용 →
  - dist_mode=true이고 production을 건드렸으면 **재빌드 후** 테스트 실행 (누락 시 완성도 판정 오염됨 — 필수)
  - S/P: targeted 테스트 실행 (케이스의 test_paths)
  - N(불필요 수정 발생): `packages/zod` 스위트 실행
- 결과 기록: complete(green) / partial(적용됐으나 red) / patch 적용 실패.
  red인 경우 기존 taxonomy대로 under-repair vs mis-generalization 구분 메모.
- DECISION이 기대와 다른 경우(예: S에서 fix_production)에도 patch는 그대로 적용·실행하고
  결과를 기록한다. 채점상 misclassification이지만 실행 결과는 데이터임.

## 5단계 — signal 측정 (green repair만)

- 적용 대상: target validation을 통과한 green repair 전부 + N의 불필요 수정 중 green 유지 건.
  partial repair는 측정 없이 partial_repair로 기록 (기존 원칙).
- coverage: 실행 확인용 보조 지표 (`scripts/run-zod-signal-eval.mjs` 기존 흐름).
- focused StrykerJS: upstream production 변경 주변 라인 scope로 한정.
  - S/P: 판정은 killed/survived/no-coverage 기준, 7월 1주차와 동일한
    signal_preserved / signal_weakened 분류.
  - N 불필요 수정 건: 수정 전(base+prod diff 상태) vs 수정 후의 focused mutant 결과를
    **survived-mutant 집합 수준**으로 비교 (개수 동률이어도 집합이 다르면 변화로 기록).
- dist_mode 케이스의 Stryker/coverage 실행도 재빌드 상태에서 수행.

## 6단계 — 산출물

7월 1주차 패턴의 orphan archive branch:

- branch: `experiment/2026-07-week3-v2-30case-archive`
- 포함: 보고서 초안(`docs/zod-v2-30case-report.md`), runner(수정본), cases.json,
  케이스별 packet (fixture patch, test_output, repair patch, response, usage JSON, signal/)
- Zod source tree는 포함하지 않음. origin(Hamjoon/zod) push.
- 보고서 골격은 7월 1주차 문서 구조를 따르되:
  - Case Matrix 표에 DECISION 열 추가, N은 별도 표 (불필요 수정률 + signal 변화)
  - 상세 섹션은 이상 케이스만 (misclassification, partial, signal_weakened, N 불필요 수정)
  - 명시 사항 3건: (1) v2 통일 프레이밍이라 v1 수치와 직접 비교 불가
    — v1의 S는 모드가 test 수정을 강제한 control이었고 v2에서 처음 자유 선택이 됨,
    (2) diff 위치+테스트 상태의 표면 규칙만으로 분류가 가능한 구조이므로
    분류 지표는 보조 지표이고 주 지표는 completeness/signal/N 불필요 수정률,
    (3) "dist-mode 구간(2025-09~2025-12)" 용어로 통일 ("시대" 표기 금지).

## 실행 순서 요약

0. runner v2-unified 모드 추가 → 1. cases.json 30건 + dist_mode 판별
→ 2~5. 케이스 단위로 fixture → 모델 실행 → validation → signal (카테고리별 lane 병렬 가능)
→ 6. archive branch 구성·push. 각 단계 진행 상황은 결과 md에 검증 배치와 같은 표 형식으로 기록.
