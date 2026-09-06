# Zod paper-prompt test generation pilot (2026-09 1주차)

Ouédraogo et al. (EMSE 31:103, 2026)의 prompt-only 방법(ZSL/FSL/COT/TOT/GTOT)을 zod v4의 class 단위에 적용하고
그 결과를 zod의 개발자 test와 비교한 pilot의 결과물 아카이브 브랜치입니다 (히스토리 없는 orphan).

- 실험 대상: [colinhacks/zod](https://github.com/colinhacks/zod), t = v4.0.5 (`45afab0f846dffd591362b6f770017507eb185b5`, 2025-07-11). 시간축 없음, 모든 측정은 t에서
- 단위: `class` 선언 또는 `$constructor` 정의 + 같은 파일의 `XDef` `XInternals` `XParams` `XConfig` `XIssue` `XFn` 타입. 모집단 233, token 필터(최장 prompt 4,096 이하) 후 232, pool 228, 층화 표본 5 (core 2, classic 2, mini 1, seed 20260904)
- 모델: `openai/gpt-oss-120b` via OpenRouter, temperature 0, (단위 × 기법)당 1회 호출, 재시도 없음
- 이번 실행: COT, TOT, GTOT만 호출 (15회). ZSL/FSL은 렌더링해 보관만 (논문 저자 회신 대기, provisional)

요약 보고서: [`docs/zod-2026-09-week1-pilot-report.md`](docs/zod-2026-09-week1-pilot-report.md)

## 주요 문서 및 결과물

1. `docs/zod-2026-09-week1-pilot-report.md` 요약 보고서
2. `docs/zod-2026-09-week1-pilot-report-full.md` 상세 보고서
3. `experiments/pilot-2026-09/results/matrix.md` RQ 표 (기법 × MSR, CSR, syntax, tsc, pass rate, coverage), 단위별 표, 정적 품질 표
4. `experiments/pilot-2026-09/results/run-notes.md` 편차·판정·관찰 기록 (D-01, O-01 포함, 시간순)
5. `experiments/pilot-2026-09/manifest.json` 모델, t, 템플릿 해시, 표본, 결정 D1~D6

## 디렉토리 구조

```
docs/
├── zod-2026-09-week1-pilot-report.md         : ★ 요약 보고서
└── zod-2026-09-week1-pilot-report-full.md    : 상세 보고서

experiments/pilot-2026-09/                    : t로 checkout한 zod 위에 얹으면 재현 가능
├── manifest.json                             : 모델, t, 템플릿 SHA-256, provisional 플래그, D1~D6, 표본 5개, 토큰 수
├── vitest.pilot.mts                          : 생성 test 실행 전용 vitest 설정 (소스 직접 테스트, typecheck off)
├── prompts/                                  : 템플릿 5개 (ZSL, FSL은 provisional) + paper-original/ 논문 원문 3개
├── llm/{unit_id}/{TECH}/                     : prompt.md 25개. 호출한 15개에는 request.json (본문만), raw-response.json, response.md (응답 원문), usage.json, run.json
│                                             
├── generated/                                : 응답에서 추출한 test 파일 14개 ({unit_id}.{TECH}.test.ts), _unstructured/에 1개
├── dev-baseline/                             : t의 개발자 test 실행 raw (dev-run.json), 집계 (dev-counts.json), v8 커버리지 (coverage/), 단위별 커버리지 (dev-coverage-units.json)
│                                             
├── results/
│   ├── matrix.md                             : ★ RQ 표
│   ├── run-notes.md                          : ★ 편차·판정·관찰 기록
│   ├── units-all.json, units-selected.json,  : 단위 인벤토리, token 필터, 표본
│   │     units-sampled.json               
│   ├── rq1-extraction.json                   : 추출 (MSR, CSR, strict CSR)
│   ├── rq2-syntax-typecheck-run.json         : syntax, tsc, 실행 (typecheck/, tests/에 파일별 tsconfig와 로그)
│   ├── rq5-coverage.json                     : 커버리지 (실행된 파일 없음, 크기 지표만)
│   ├── rq7-static-quality.json               : biome + test smell (smell-rules.md, smells-dev.json, smells-llm.json)
│   ├── env.json, prompt-tokens.json,
│   │     phase2-review.md, phase3-runs.json,
│   └──   phase*.log
└── scripts/                                  : 실행 순서 - inventory-units.ts → count-tokens.py → render-prompts.py →
                                              dev-coverage-units.py → sample-units.py → run-generation.py → extract.py →
                                              check-syntax.ts → run-typecheck.py → run-tests.py → run-coverage.py →
                                              run-biome.py → smells.ts → build-matrix.py (공통: pilot_common.py)
```

## 결과 한 줄 요약

15개 응답 모두 구분자를 지켰고 (MSR 15/15) 14개가 구조를 갖춘 test 파일로 추출됐지만 (CSR 14/15, strict 9/15)
tsc 통과 0/14, 실행은 import 단계에서 14/14 실패 (모델이 class를 같은 디렉토리의 동명 모듈에서 import).
실행된 case 0, 커버리지 측정 불가. 개발자 test는 888/888 통과, 표본 5개 단위의 line 커버리지 100%.

## 재현 방법

```bash
git clone https://github.com/Hamjoon/zod.git && cd zod && git checkout 45afab0f   # v4.0.5
pnpm install --frozen-lockfile
# 이 브랜치의 experiments/pilot-2026-09/ 를 위 checkout에 복사한 뒤 repo root에서
npx tsx experiments/pilot-2026-09/scripts/inventory-units.ts
python experiments/pilot-2026-09/scripts/count-tokens.py          # tiktoken 0.14.0, o200k_base
python experiments/pilot-2026-09/scripts/render-prompts.py count
# 이후 단계는 scripts/ 각 파일의 docstring 참조. Phase 3 (run-generation.py)는 OPENROUTER_API_KEY 필요
```
