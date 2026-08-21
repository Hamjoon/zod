# Zod LLM test generation·survival·repair - main experiment (2026-08 2~3주차)

smoke test에서 검증한 cycle(LLM test 생성 → 생존 추적 → stale 판정 → repair)을
7개 파일·105 case 규모로 확장해 실행한 본 실험의 결과물 아카이브 브랜치입니다
(히스토리 없는 orphan).

- 실험 대상: [colinhacks/zod](https://github.com/colinhacks/zod), t = v4.0.5 (`45afab0f`, 2025-07-11)
- 관찰 구간: t 이후 `packages/zod`를 건드린 316커밋 (~2026-08-18 `3c9ca1d9`)
- 대상 파일: 7개, t 시점 합계 10,931 LOC / 모델: `openai/gpt-oss-120b` (temperature 0, 파일당 1회 호출)
- 선행 smoke test: [`experiment/2026-08-week3-smoke`](https://github.com/Hamjoon/zod/tree/experiment/2026-08-week3-smoke)

요약 보고서: [`docs/zod-2026-08-week2-3-main-report.md`](docs/zod-2026-08-week2-3-main-report.md)

## 디렉토리 구조

```
docs/                                         실험 기록·보고서
├── zod-2026-08-week2-3-main-report.md        ★ 요약 보고서
├── zod-2026-08-week2-3-main-report-full.md   상세 보고서
├── t-gate-drops.md                           t 탈락 19건 건별 기록 (원인 5분류)
├── phase6-judgment-brief.md                  깨짐 3건의 stale / production 버그 판정 근거
├── llm/                                      test 생성 호출 증거 (파일별 디렉토리 7개)
│   ├── manifest.json                         생성 실행 메타 (모델·t·파일 목록)
│   └── 01-core-util ... 07-mini-schemas/
│       ├── llm-prompt.md                     프롬프트 전문 (대상 파일 소스 전체 포함)
│       ├── llm-request.json                  API 요청 본문
│       ├── llm-response.md                   모델 응답 원문 (code fence 그대로)
│       ├── llm-raw-response.json             API 응답 raw
│       └── llm-usage.json / llm-run.json     토큰·비용 / 실행 메타
├── repair/                                   repair 호출 증거 (stale 2건)
│   ├── repair-manifest.json
│   └── repair-01-mini-keyof, repair-02-util-floatsaferemainder/
│       ├── repair-prompt.md                  repair 프롬프트 전문 (깨진 case + diff + 실행 출력)
│       ├── repair-response.md                모델의 repair 응답 원문
│       ├── repaired-case.ts                  응답에서 추출한 수리본 case
│       └── repair-request/raw/usage/run.json + meta.json
└── results/                                  실행 결과 원본
    ├── window-commits.txt                    관찰 구간 316커밋 목록 (오래된 순)
    ├── t-gate-result.json                    t gate 실행 raw (vitest JSON, 105 case)
    ├── t-gate-drops.json                     탈락 19건 구조화 기록
    ├── survival-summary.json                 생존 추적 요약 (깨짐 3 · 생존 83)
    ├── head-check.json                       HEAD(3c9ca1d9)에서 105 case 재실행 raw
    └── repair-validation.json                repair 2건 검증 결과 (깨졌던 커밋에서 실행)

experiments/                                  실험 하네스·test (t로 checkout한 zod 위에 얹으면 재현 가능)
├── vitest.gate.mts                           생성 test 전용 vitest 설정 (소스 직접 테스트, typecheck off)
├── generated-tests/                          모델이 생성한 test 원본 7파일 (105 case, t 기준·수리 전)
└── repair/                                   repair 응답을 반영한 case 2건 (둘 다 검증 실패 - 기록용)
```

## 결과 한 줄 요약

생성 105 case 중 86개가 t에서 통과(탈락 19건은 전부 생성 시점의 모델 이해 오류),
316커밋 관찰에서 3 case가 깨졌고(생존 83개, 96.5%), 판정은 stale 2건 ·
production 버그 1건(기록만, repair 대상 아님). stale 2건에 각 1회 repair를
시도했으나 둘 다 실패했습니다 (0/2 - production 미수정·assertion 수 보존,
통과만 실패).
