# Timing

Times are KST. Built from `results/phase-times.jsonl` and the per-file fields recorded by the scripts.

## Phases (wall clock)

| phase | start | end | duration |
|---|---|---|---:|
| phase1 | 20:07:09 | 20:12:56 | 5 m 47 s |
| phase2 | 20:13:34 | 20:15:45 | 2 m 11 s |
| phase3 | 20:18:51 | 21:25:20 | 66 m 29 s |
| phase4 | 21:26:05 | 21:26:05 | 0 m 0 s |
| phase5 | 21:26:56 | 21:31:09 | 4 m 13 s |
| phase6 | 21:31:09 | 21:32:32 | 1 m 23 s |
| phase7 | 21:32:32 | 21:33:07 | 0 m 35 s |
| phase8 | 21:34:04 | 21:34:49 | 0 m 45 s |

Total machine time (phases only): 81 m 23 s. Review waiting, shown separately:

| after | stop | resume | waiting |
|---|---|---|---:|
| phase2-stop | 20:15:45 | 20:18:37 | 2 m 52 s |

## Steps

| phase | step | wall | files | per-file total (s) | mean s/file | max s/file | basis |
|---|---|---:|---:|---:|---:|---:|---|
| phase1 | clone | 0 m 19 s | - | - | - | - | no file count (setup or aggregation step) |
| phase1 | pnpm-install | 0 m 5 s | - | - | - | - | no file count (setup or aggregation step) |
| phase1 | archive-extract | 0 m 0 s | - | - | - | - | no file count (setup or aggregation step) |
| phase1 | step1-copy | 0 m 47 s | - | - | - | - | no file count (setup or aggregation step) |
| phase1 | step2-dev-check | 0 m 7 s | - | - | - | - | no file count (setup or aggregation step) |
| phase1 | step3-coverage-provider | 0 m 11 s | - | - | - | - | no file count (setup or aggregation step) |
| phase1 | step4-env | 0 m 26 s | - | - | - | - | no file count (setup or aggregation step) |
| phase1 | step5-sample | 0 m 0 s | - | - | - | - | no file count (setup or aggregation step) |
| phase1 | step6-unit-text | 0 m 2 s | - | - | - | - | no file count (setup or aggregation step) |
| phase1 | step7-export | 0 m 0 s | - | - | - | - | no file count (setup or aggregation step) |
| phase1 | step8-dev-coverage-recheck | 0 m 24 s | - | - | - | - | no file count (setup or aggregation step) |
| phase2 | template-hash-check | 0 m 1 s | - | - | - | - | no file count (setup or aggregation step) |
| phase2 | render-write | 0 m 0 s | - | - | - | - | no file count (setup or aggregation step) |
| phase2 | prompt-checks | 0 m 0 s | - | - | - | - | no file count (setup or aggregation step) |
| phase3 | generation | 66 m 15 s | 90 | 6364.8 | 70.72 | 1640.48 | recorded per file |
| phase4 | extraction | 0 m 0 s | 90 | - | 0.0 | - | step timed as a whole (wall / files) |
| phase5 | syntax | 0 m 2 s | 85 | - | 0.02 | - | step timed as a whole (wall / files) |
| phase5 | typecheck | 1 m 33 s | 85 | 93.5 | 1.1 | 1.6 | recorded per file |
| phase5 | tests | 1 m 3 s | 85 | 63.1 | 0.74 | 1.1 | recorded per file |
| phase5 | import-audit | 0 m 21 s | 85 | - | 0.25 | - | step timed as a whole (wall / files) |
| phase6 | coverage | 1 m 4 s | 67 | 64.0 | 0.96 | 1.5 | recorded per file |
| phase7 | biome | 0 m 19 s | 166 | - | 0.11 | - | step timed as a whole (wall / files) |
| phase7 | smells-llm | 0 m 1 s | 85 | - | 0.01 | - | step timed as a whole (wall / files) |
| phase7 | smells-dev | 0 m 1 s | 81 | - | 0.01 | - | step timed as a whole (wall / files) |
| phase7 | build-matrix | 0 m 0 s | - | - | - | - | no file count (setup or aggregation step) |
| phase8 | overlap-comparison | 0 m 0 s | - | - | - | - | no file count (setup or aggregation step) |
| phase8 | timing | 0 m 0 s | - | - | - | - | no file count (setup or aggregation step) |

Notes: Phase3 generation ran at concurrency 2, so the sum of per-call latencies exceeds the step's wall time. Per-file seconds for typecheck, tests and coverage include npx/tsc/vitest start-up for each file.

Rerun note (added 2026-09-27): after Ruling A (run-notes D-08), Phases 4 to 7 were rerun for the two newly structured files, in 2 m 28 s wall time (18:53:55 to 18:56:23 KST, phase `rulingA` in `phase-times.jsonl`). The tables above are not rebuilt and describe the original run; `coverage_seconds` in `rq5-coverage.json` now holds the rerun's per-file times.
