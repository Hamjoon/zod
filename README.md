# LLM-Based Test Maintenance on Real Commit History

This branch archives an experiment on **automated test maintenance**: when a code
repository has just been changed and some tests now fail (or still pass), can a
language model decide what — if anything — should be fixed, and then fix it correctly?

Cases are built from real commits of [colinhacks/zod](https://github.com/colinhacks/zod).
Each case gives the model only the recent change, the current test results, and nearby
code, with no hint about which situation it is in. The correct response differs by
category: update the outdated tests (`fix_tests`), fix the buggy production code
(`fix_production`), or leave everything alone (`no_change`). The model's repair is then
evaluated by scripts — including a check that it did not make the tests pass by simply
reverting the intended change.

## Overview

<img src="./docs/images/zod_experiment_overview.png" width="85%"/>

## Reports

- [Summary report](./docs/zod-v2-30case-report.md) — question, protocol, results, observations
- [Full report](./docs/zod-v2-30case-report-full.md) — execution details and per-case records
- [Case selection & verification record](./docs/zod-30case-verification-results.md) — how the 30 cases (10 per category) were adopted

## Repository layout

- `docs/` — reports and diagrams
- `experiments/` — per-case artifact packets (prompt, response, diffs, logs, results) and evaluation tooling
- `scripts/` — the LLM runner and the signal (coverage) runner

This is an orphan archive branch: it preserves the experiment's artifacts and does not
inherit the zod source tree. Model: `openai/gpt-oss-120b`, one request per case,
temperature 0.
