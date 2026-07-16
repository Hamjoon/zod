# 후속 재분석 지시서: reverse_green 분리 및 preservation 체크 소급 (2026-07 3주차)

Claude Code 실행용. v2 30케이스 배치 결과에 대한 사후 재분석.
모델 재호출·테스트 재실행·Stryker 재실행 없음 — 정적 검사와 재집계·보고서 수정만.
예상 규모: 10~20분.

## 배경

- 배치 결과 중 S 오분류 5건(전부 fix_production) 가운데 3건(s03/s04/s06)이
  target validation을 통과한 "역방향 green" — 의도된 production 변경을 되돌려 green 도달.
- 현행 taxonomy는 completeness를 green 여부로만 정의(v1 승계)해 이 3건이 complete로 집계됨.
  v1에서는 프로토콜 constraint상 이 상태가 발생 불가능했으므로 정의가 충분했으나,
  v2에서 S의 target 선택이 자유로워지며 정의의 미비가 드러남.

## 1. taxonomy 수정

- `complete`의 필요조건에 **recent-change preservation** 추가:
  green 도달 + fixture로 적용한 최근 변경이 repair 후 트리에 보존.
- 신규 클래스 `reverse_green`: green 도달했으나 최근 변경이 되돌려진(또는 훼손된) 경우.
  completeness 집계에서 제외하고 misrepair로 분류.
- 보고서 taxonomy 섹션에 정의 계보 명시: "v1에서 승계한 green 기준 정의가
  v2에서 불충분함이 드러나 reverse_green을 분리, preservation을 complete의 필요조건으로 추가."

## 2. preservation 체크 소급 실행 (30건 전체)

각 케이스에 대해:

```bash
cd .worktrees/<id>           # repair 적용 상태의 케이스 worktree
git apply --reverse --check <packet>/fixture.patch
```

- **성공** = fixture 변경이 트리에 온전히 보존 → preserved
- **실패** = 되돌려졌거나 훼손 → 단, 자동으로 reverse_green 판정하지 말 것.
  실패 케이스는 diff를 열어 구분해 기록:
  - (a) 전면 revert (s03/s04/s06 예상) → `reverse_green`
  - (b) 모델의 정당한 수정이 fixture hunk와 라인 겹침 → 수동 검토 표시 후 판정 근거 기록
- 케이스별 판정을 배치 기록 md에 표로 추가 (id / 체크 결과 / 판정 / 근거).
- no_change로 끝난 N 케이스는 트리 무변경이므로 자동 preserved (실행은 하되 형식적).
- worktree가 없는 케이스가 있으면 base checkout + fixture.patch + repair.patch로 재구성.

## 3. 통계 재집계 (재실행 없이 기존 결과 재분류)

- Repair 완성도 (S/P 20건): complete 7 · reverse_green 3 · partial 6 · 적용 실패 4 (예상값 — 체크 결과로 확정)
- Signal: 기존 green 10건 중 reverse_green 3건을 분리.
  - 본 통계는 **정방향 green 7건** 기준으로 preserved/weakened/unknown 재산출.
  - reverse_green 3건의 기존 Stryker 결과는 폐기하지 말고 별도 행으로 보고하되
    "mutation scope의 대상인 upstream 변경 자체가 부재한 트리에서의 측정 — 본 지표와 의미가 다름" 주석.
- N 표는 변경 없음 (0/10 유지).

## 4. 보고서 수정 (docs/zod-v2-30case-report.md)

- Case Matrix: s03/s04/s06의 판정을 reverse_green으로 갱신, 헤드라인 수치 교체.
- 핵심 발견 절 추가: "target validation(red→green)은 올바른 repair와 역방향 revert를
  구분하지 못한다. preservation 체크가 validation의 필수 구성요소."
- 한계 섹션의 표면 규칙 문구 옆에 반증 관찰 병기: 표면 규칙("최근 바뀐 쪽이 옳다")을
  따랐다면 30/30이어야 하나 실제 S 5/10 — 모델이 표면 규칙을 사용하지 않음이 관찰됨.
  P 10/10 vs S 5/10의 비대칭은 "테스트를 스펙으로 신뢰하는" 사전 성향과 정합.
- 상세 섹션에 reverse_green 3건 추가 (이상 케이스 기준 충족).

## 5. 하우스키핑

- `.git/info/exclude`의 `scripts/run-gptoss-test-maintenance.py` 제외 줄 삭제 (배치에서 발견된 잔재).
- archive branch는 push된 이력 유지 — 수정분은 **추가 커밋**으로 (force-push 금지).
  커밋 메시지에 사후 재분석임을 명시 (예: "post-hoc: separate reverse_green, add preservation check").

## 완료 판정

30건 preservation 표 + 재집계 수치 + 보고서 4개 수정 반영 + archive branch 추가 커밋 push.
