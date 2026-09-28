# Zod paper-prompt test generation pilot, 표본 30개로 확대 (2026-09 4주차)

2주차 pilot([`experiment/2026-09-week2-pilot-import`](https://github.com/Hamjoon/zod/tree/experiment/2026-09-week2-pilot-import))을 같은 조건으로 표본만 5개에서 30개로 늘려 다시 실행한 결과물 아카이브 브랜치입니다 (히스토리 없는 orphan).
바꾼 것은 표본 수뿐입니다. 2주차 5개 단위도 포함해 30개 전부 새로 생성했습니다. 생성된 test 파일은 고치지 않았습니다.

- 실험 대상: [colinhacks/zod](https://github.com/colinhacks/zod), t = v4.0.5 (`45afab0f846dffd591362b6f770017507eb185b5`, 2025-07-11). 시간축 없음, 모든 측정은 t에서
- 단위: 풀 228개에서 디렉토리별 비례 30개 (core 12, classic 9, mini 9). 2주차 5개(seed 20260904) + 나머지에서 추가 25개(seed 20260925)
- 프롬프트: 2주차 템플릿 그대로 (CUT를 export하는 모듈 경로 한 줄 포함). 템플릿 SHA-256 일치, 2주차 5개 단위의 프롬프트 25개는 바이트 단위 일치
- 모델: `openai/gpt-oss-120b` via OpenRouter, temperature 0, (단위 × 기법)당 1회 호출, 재시도 없음
- 이번 실행: COT, TOT, GTOT만 호출 (90회). ZSL/FSL은 렌더링해 보관만 (논문 저자 회신 대기, provisional)

요약 보고서: [`docs/zod-2026-09-week4-pilot-import-n30-report.md`](docs/zod-2026-09-week4-pilot-import-n30-report.md)

## 주요 문서 및 결과물

1. `docs/zod-2026-09-week4-pilot-import-n30-report.md` 요약 보고서
2. `docs/zod-2026-09-week4-pilot-import-n30-report-full.md` 상세 보고서
3. `experiments/pilot-2026-09-import-n30/results/matrix.md` RQ 표, 디렉토리별 표, 단위별 표, tsc 오류 분류(1주차 분류와 논문 층 분류), 정적 품질 표
4. `experiments/pilot-2026-09-import-n30/results/comparison-week2-overlap.md` 2주차 5개 단위를 다시 생성한 15쌍 비교 (실행 간 변동)
5. `experiments/pilot-2026-09-import-n30/results/rq2-import-audit.md` import audit (CUT import 해결 여부, 나머지 import, CUT를 `new` 있이/없이 호출한 횟수)
6. `experiments/pilot-2026-09-import-n30/results/timing.md` 단계별 소요 시간 (전체 실행 일정 추정용)
7. `experiments/pilot-2026-09-import-n30/results/run-notes.md` 편차·판정·관찰 기록 (D-01~D-09, O-01~O-11, 시간순)
8. `experiments/pilot-2026-09-import-n30/manifest.json` 모델, t, 2주차 아카이브 커밋, 템플릿 해시, 표본 30개와 seed, 토큰 수

## 디렉토리 구조

```
docs/
├── zod-2026-09-week4-pilot-import-n30-report.md       : ★ 요약 보고서
└── zod-2026-09-week4-pilot-import-n30-report-full.md  : 상세 보고서

experiments/pilot-2026-09-import-n30/                  : t로 checkout한 zod 위에 얹으면 재현 가능
├── manifest.json                                      : 모델, t, 2주차 아카이브 커밋(39950c5d), 템플릿 SHA-256, 표본 30개, seed, 토큰 수
├── vitest.pilot.mts                                   : 생성 test 실행 전용 vitest 설정 (소스 직접 테스트, typecheck off)
├── prompts/                                           : 템플릿 5개 (2주차와 동일, ZSL/FSL은 provisional) + paper-original/ 논문 원문
├── llm/{unit_id}/{TECH}/                              : prompt.md 150개. 호출한 90개에는 request.json (본문만), raw-response.json, response.md, usage.json, run.json
├── generated/                                         : 응답에서 추출한 test 파일 87개 ({unit_id}.{TECH}.test.ts), _unstructured/ 구조 검사 탈락분
├── dev-baseline/                                      : 1주차 dev 기준선 사본 (dev-run.json, dev-counts.json, coverage/, dev-coverage-units.json)
├── results/
│   ├── matrix.md                                      : ★ RQ 표
│   ├── comparison-week2-overlap.md, .json             : ★ 2주차 5개 단위 반복 비교
│   ├── run-notes.md                                   : ★ 편차·판정·관찰 기록
│   ├── timing.md, .json, phase-times.jsonl            : 단계별 소요 시간
│   ├── rq2-import-audit.json, .md                     : import audit
│   ├── rq1-extraction.json                            : 추출 (MSR, CSR, strict CSR)
│   ├── rq2-syntax-typecheck-run.json                  : syntax, tsc, 실행 (typecheck/, tests/에 파일별 로그)
│   ├── rq5-coverage.json                              : 커버리지 (coverage/에 파일별 v8 결과)
│   ├── rq7-static-quality.json                        : biome + test smell (smell-rules.md, smells-dev.json, smells-llm.json)
│   ├── prompt-identity-week2.txt,                     : 2주차 프롬프트와 바이트 일치 확인, 추가 25개 단위의 import 줄 확인
│   │     prompt-import-line-check.txt
│   ├── dev-check-run.json, dev-coverage-recheck/,     : dev 스위트 재실행, Node v24.21.0에서 다시 잰 dev 커버리지 (30개 단위 모두 기준선과 일치)
│   │     dev-coverage-recheck-units.json
│   ├── units-all.json, units-selected.json,           : 단위 인벤토리 사본, 30개 표본, t에서 다시 추출한 결과와 해시
│   │     units-sampled.json, units-all-recheck.json, unit-text-hashes.json, export-check.json
│   ├── week2/, week2-generated/                       : 비교에 쓴 2주차 결과와 test 파일 사본
│   └── env.json, prompt-tokens.json, phase2-review.md, phase3-runs.json, phase5-*.json, phase7-biome.json, *.log
└── scripts/                                           : 2주차 스크립트(경로만 변경) + extend-sample.py(표본 확대), build-overlap-comparison.py,
                                                         build-timing.py (공통: pilot_common.py)
```

## 결과 요약

- 90회 호출에서 test 파일 87개를 얻었고 85개가 CUT를 주어진 모듈 경로에서 import했다.
- tsc 통과는 6/87이다. 오류 896건 중 504건(56%)은 class를 `new` 없이 호출했거나(TS2348, 282건) class에 바로 `parse` 같은 메서드를 호출한(TS2339, 222건) 경우다.
- 69개 파일이 로드돼 920개 case 중 296개가 통과했다 (32.2%). 통과한 case는 30개 단위 중 26개에 퍼져 있다 (2주차는 35개 중 33개가 ZodEnum).
- 2주차 5개 단위를 같은 프롬프트로 다시 생성한 15쌍 중 같은 파일은 0개였고 6쌍은 로드 여부가 바뀌었다. 90회 호출은 14개 제공자로 나뉘어 처리됐다.
- 개발자 test는 888/888 통과. 작은 단위에서는 통과한 case가 없어도 line 커버리지가 100%로 나오므로 이 수치는 test 품질 지표로 쓰지 않는다.

## 재현 방법

```bash
git clone https://github.com/Hamjoon/zod.git && cd zod && git checkout 45afab0f   # v4.0.5
pnpm install --frozen-lockfile
# 이 브랜치의 experiments/pilot-2026-09-import-n30/ 를 위 checkout에 복사한 뒤 repo root에서
python experiments/pilot-2026-09-import-n30/scripts/extend-sample.py                    # 표본 30개 (2주차 5개 + seed 20260925)
python experiments/pilot-2026-09-import-n30/scripts/render-prompts.py write            # tiktoken 0.14.0, o200k_base
# 이후 단계는 scripts/ 각 파일의 docstring 참조. run-generation.py는 OPENROUTER_API_KEY 필요
# 커버리지는 @vitest/coverage-v8@2.1.9를 임시 설치하고 --coverage.reportOnFailure=true로 측정
```
