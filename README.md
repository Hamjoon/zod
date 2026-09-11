# Zod paper-prompt test generation pilot, import 경로 추가 재실행 (2026-09 2주차)

1주차 pilot([`experiment/2026-09-week1-pilot`](https://github.com/Hamjoon/zod/tree/experiment/2026-09-week1-pilot))을 한 가지만 바꿔 다시 실행한 결과물 아카이브 브랜치입니다 (히스토리 없는 orphan).
바꾼 것은 프롬프트에 CUT(테스트 대상 class)를 export하는 모듈 경로 한 줄을 넣은 것뿐입니다. 생성된 test 파일은 고치지 않았습니다.

- 실험 대상: [colinhacks/zod](https://github.com/colinhacks/zod), t = v4.0.5 (`45afab0f846dffd591362b6f770017507eb185b5`, 2025-07-11). 시간축 없음, 모든 측정은 t에서
- 단위: 1주차 표본 5개 그대로 (seed 20260904). t에서 단위 소스를 다시 추출해 SHA-256 일치 확인
- 추가한 줄: ``The {class_name} class is exported from `{module_specifier}` (path relative to the test file).`` 소스를 소개하는 줄 바로 위에 넣음. `{module_specifier}`는 `./checks.js` 또는 `./schemas.js`
- 모델: `openai/gpt-oss-120b` via OpenRouter, temperature 0, (단위 × 기법)당 1회 호출, 재시도 없음
- 이번 실행: COT, TOT, GTOT만 호출 (15회). ZSL/FSL은 렌더링해 보관만 (논문 저자 회신 대기, provisional)
- 실행: Codex. 계획·판정·보고서: Claude Cowork

요약 보고서: [`docs/zod-2026-09-week2-pilot-import-report.md`](docs/zod-2026-09-week2-pilot-import-report.md)

## 주요 문서 및 결과물

1. `docs/zod-2026-09-week2-pilot-import-report.md` 요약 보고서
2. `docs/zod-2026-09-week2-pilot-import-report-full.md` 상세 보고서
3. `experiments/pilot-2026-09-import/results/comparison-week1.md` 1주차와 나란히 놓은 비교표
4. `experiments/pilot-2026-09-import/results/matrix.md` RQ 표, 단위별 표, tsc 오류 분류(1주차 분류와 논문 층 분류), 정적 품질 표
5. `experiments/pilot-2026-09-import/results/rq2-import-audit.md` import audit (CUT import 해결 여부, 나머지 import, `new` 없이 CUT를 호출한 횟수). 1주차 파일에도 같은 정의로 적용
6. `experiments/pilot-2026-09-import/results/run-notes.md` 편차·판정·관찰 기록 (D-01~D-03, O-01~O-07, R-01~R-03, 시간순)
7. `experiments/pilot-2026-09-import/manifest.json` 모델, t, 1주차 아카이브 커밋, 템플릿 해시, 추가한 줄, 표본, 토큰 수

## 디렉토리 구조

```
docs/
├── zod-2026-09-week2-pilot-import-report.md       : ★ 요약 보고서
└── zod-2026-09-week2-pilot-import-report-full.md  : 상세 보고서

experiments/pilot-2026-09-import/                  : t로 checkout한 zod 위에 얹으면 재현 가능
├── manifest.json                                  : 모델, t, 1주차 아카이브 커밋(c922ec9f), 템플릿 SHA-256, 추가한 줄, 표본 5개, 토큰 수
├── vitest.pilot.mts                               : 생성 test 실행 전용 vitest 설정 (소스 직접 테스트, typecheck off)
├── prompts/                                       : 템플릿 5개 (한 줄 추가, ZSL/FSL은 provisional) + paper-original/ 논문 원문 + week1/ 1주차 템플릿
├── llm/{unit_id}/{TECH}/                          : prompt.md 25개. 호출한 15개에는 request.json (본문만), raw-response.json, response.md, usage.json, run.json
├── generated/                                     : 응답에서 추출한 test 파일 15개 ({unit_id}.{TECH}.test.ts)
├── dev-baseline/                                  : 1주차 dev 기준선 사본 (dev-run.json, dev-counts.json, coverage/, dev-coverage-units.json)
├── results/
│   ├── comparison-week1.md                        : ★ 1주차 대비 비교표
│   ├── matrix.md                                  : ★ RQ 표
│   ├── run-notes.md                               : ★ 편차·판정·관찰 기록
│   ├── rq2-import-audit.json, .md                 : import audit (두 주차)
│   ├── rq1-extraction.json                        : 추출 (MSR, CSR, strict CSR)
│   ├── rq2-syntax-typecheck-run.json              : syntax, tsc, 실행 (typecheck/, tests/에 파일별 로그)
│   ├── rq5-coverage.json                          : 커버리지 (coverage/에 파일별 v8 결과)
│   ├── rq7-static-quality.json                    : biome + test smell (smell-rules.md, smells-dev.json, smells-llm.json)
│   ├── template-diff.txt, prompt-diff.txt         : 1주차 대비 템플릿·프롬프트 차이 (추가한 한 줄뿐임을 확인)
│   ├── r01-extraction-changes.json                : 추출 규칙 판정(R-01)으로 바뀐 파일
│   ├── dev-check-run.json,                        : dev 스위트 재실행, Node v25.7.0에서 다시 잰 dev 커버리지
│   │     dev-coverage-recheck/, dev-coverage-recheck-units.json
│   ├── units-all.json, units-selected.json,       : 1주차 단위 인벤토리·표본 사본, t에서 다시 추출한 결과
│   │     units-sampled.json, units-all-recheck.json
│   ├── pre-rulings/                               : 판정 R-01~R-03 반영 전 결과표
│   ├── week1/                                     : 비교에 쓴 1주차 결과 사본
│   └── env.json, prompt-tokens.json, phase2-review.md, phase3-runs.json, phase5-*.json, phase7-biome.json
└── scripts/                                       : 1주차 스크립트(경로만 변경) + render-prompts.py(module_specifier), import-audit.ts,
                                                     recheck-dev-coverage.py, build-comparison.py (공통: pilot_common.py)
```

## 결과 한 줄 요약

15개 파일 모두 CUT import가 해결됐고 (1주차 0/14) 11개 파일이 로드돼 119개 case 중 35개가 통과했다 (29.4%).
tsc 통과는 여전히 0/15이며 오류 73건 중 45건이 class를 `new` 없이 호출한 TS2348이다. 통과한 35개 중 33개는 ZodEnum에서 나왔다.
개발자 test는 888/888 통과. 작은 단위 3개는 통과 case가 없어도 line 커버리지 100%가 나오므로 커버리지는 실행 여부로만 읽는다.

## 재현 방법

```bash
git clone https://github.com/Hamjoon/zod.git && cd zod && git checkout 45afab0f   # v4.0.5
pnpm install --frozen-lockfile
# 이 브랜치의 experiments/pilot-2026-09-import/ 를 위 checkout에 복사한 뒤 repo root에서
python experiments/pilot-2026-09-import/scripts/render-prompts.py write            # tiktoken 0.14.0, o200k_base
# 이후 단계는 scripts/ 각 파일의 docstring 참조. run-generation.py는 OPENROUTER_API_KEY 필요
# 커버리지는 @vitest/coverage-v8@2.1.9를 임시 설치하고 --coverage.reportOnFailure=true로 측정
```
