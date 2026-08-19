# Zod LLM test generation·survival·repair - smoke test

LLM test 생성 → 생존 추적 → stale 판정 → repair의 전체 cycle이 실제 저장소에서
끝까지 도는지 확인한 smoke test의 결과물 아카이브 브랜치입니다 (히스토리 없는 orphan).

- 실험 대상: [colinhacks/zod](https://github.com/colinhacks/zod), t = v4.0.5 (`45afab0f`, 2025-07-10)
- 관찰 구간: t 이후 `packages/zod`를 건드린 316커밋 (~2026-08-17)
- 대상 파일: `packages/zod/src/v4/core/util.ts` / 모델: `openai/gpt-oss-120b` (temperature 0, 1회 호출)

**먼저 볼 문서 → [`docs/smoke/zod-smoke-report.md`](docs/smoke/zod-smoke-report.md)** (요약 보고서)

## 디렉토리 구조

```
docs/smoke/                        실험 기록·보고서
├── zod-smoke-report.md            ★ 요약 보고서
├── zod-smoke-report-full.md       상세 보고서 (정본 - 요약본은 이것의 발췌)
├── results-table.md               결과 표 (case 단위 18행)
├── functions-vs-changes.md        모델이 고른 18개 함수 × 관찰 구간 내 변경 여부 대조표
├── timing-summary.md              커밋당 실행 시간 요약 (checkout / install / vitest)
├── llm/                           test 생성 호출 증거
│   ├── llm-prompt.md              프롬프트 전문 (대상 파일 소스 전체 포함)
│   ├── llm-request.json           API 요청 본문
│   ├── llm-response.md            모델 응답 원문 (code fence 그대로)
│   ├── llm-raw-response.json      API 응답 raw
│   └── llm-usage.json / llm-run.json   토큰·비용 / 실행 메타
└── repair/                        repair 호출 증거
    ├── repair-prompt.md           repair 프롬프트 전문 (깨진 test + diff + 실행 출력)
    ├── red-commit-diff.txt        test를 깨뜨린 커밋(5b7ed214)의 관련 diff
    ├── red-test-output.txt        해당 커밋에서의 실제 assertion 오류 출력
    ├── repair-response.md         모델의 repair 응답 원문
    ├── repair-validation.md       repair 검증 기록 (깨졌던 커밋에서 통과 + 수정 범위 확인)
    └── repair-request/raw/usage/run.json   요청·raw·토큰·실행 메타

experiments/                       실험 하네스·test (t로 checkout한 zod 위에 얹으면 재현 가능)
├── vitest.smoke.mts               생성 test 전용 vitest 설정 (소스 직접 테스트, typecheck off)
├── generated-tests/
│   └── util-main.test.ts          모델이 생성한 test 원본 (18 case, t 기준·수리 전)
└── repair/
    └── util-main.repaired.test.ts case7 repair가 반영된 버전 (5b7ed214에서 통과)
```

## 결과 한 줄 요약

생성 18 case 중 16개가 t에서 통과, 316커밋 관찰에서 1개 case(floatSafeRemainder)만
깨졌고(생존 199/316), stale 판정 후 모델이 한 번의 호출로 repair에 성공했습니다
(깨진 assertion만 수정, 검증 통과). 나머지 15개 case는 전 구간 생존.
