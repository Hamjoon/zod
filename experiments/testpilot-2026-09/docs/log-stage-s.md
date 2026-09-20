# Stage S command log

Started 2026-09-19, Asia/Seoul. Read the supplied Stage S instructions and `docs/handover-stage-g.md`. No model calls; no credential file read or printed. All Node execution is in Docker; git on host.

## Preconditions

- `git status -sb`: expected branch, synchronized with origin; only pre-existing untracked `Claude outputs/` (documented in Stage G). Tracked tree clean.
- `git log -1 --format='%h %s'`: d250c509 Complete Stage G generation and analyze 60-function sample.
- `git config --get core.hooksPath`: /dev/null.
- Python manifest check: 139 entries, 139 distinct basenames, zero missing; testFile basename resolves directly under results/gen-n60/tests. First test: test_1.js, zod.z.discriminatedUnion.
- testpilot2 `git log -1`, `git status -sb`: 31c01799811ec1677d1c102074fc8f23f1a861c5, experiment/2026-09-week3-zod, clean and synchronized.
- `docker image ls testpilot-zod:latest`: sandbox Docker socket permission denied; approved rerun succeeded, image 68f92e010216, 1.65GB.
- `docker compose run --rm tp bash -c ...`: both /work/zod/node_modules/mocha/package.json and /work/testpilot2/node_modules/.bin/mocha exist. `readlink` wrapper target: ../../../../../packages/zod. Wrapper node package-version probe: 4.0.5. Compose warns about pre-existing orphan containers; left untouched.
- `rg -n 'mocha|spawn|5000' src` and `sed -n '40,115p' src/mochaValidator.ts` inspected validator. An incidental `git remote get-url upstream` in testpilot2 returned no such remote; no changes there.

## Release references

- `git remote -v`, `git tag -l 'v4.*'`: only origin, no local v4 tags.
- `git remote add upstream https://github.com/colinhacks/zod.git`: succeeded.
- `git fetch upstream 'refs/tags/v4.*:refs/tags/v4.*' --no-tags`: sandbox DNS failure; approved rerun succeeded, all seven requested tags present. D-10 fallback not needed.
- Python host validation invokes `git rev-parse TAG^{commit}`, `git log -1 --format=%cs COMMIT`, `git show TAG:packages/zod/package.json`, `git show TAG:package.json`; validates base commit, all package versions, strictly increasing dates; writes tags.json.

| Tag | Commit | Date | Package version | packageManager | engines.node |
| --- | --- | --- | --- | --- | --- |
| v4.0.5 | 45afab0f846dffd591362b6f770017507eb185b5 | 2025-07-10 | 4.0.5 | pnpm@10.12.1 | - |
| v4.1.0 | 2ca716d6313dcfab425d3555ac8bf85929bc57a4 | 2025-08-23 | 4.1.0 | pnpm@10.12.1 | - |
| v4.2.0 | dcef9734f55fc1c8e73795a2be80c60fa7a4a568 | 2025-12-14 | 4.2.0 | pnpm@10.12.1 | - |
| v4.3.0 | 1899684fc34d149ebb5d6f9fd95a588e94f27053 | 2025-12-30 | 4.3.0 | pnpm@10.12.1 | - |
| v4.4.0 | d05f026e9e6eae0e1e6c2efbf11c89007ca40494 | 2026-04-29 | 4.4.0 | pnpm@10.12.1 | - |
| v4.5.0 | 0a69bcb3d9554c6ec382ea9ba6b43c2421f3fa78 | 2026-08-28 | 4.5.0 | pnpm@10.12.1 | - |
| v4.6.0 | 1c51cbe0fe23d09f8d520b31487d50a01588fae5 | 2026-09-09 | 4.6.0 | nub@0.8.3 | - |

- `git archive --format=tar --prefix=v4.0.5/ v4.0.5 | tar -x -C ../zod-versions`: exit 0; package.json exists. `git diff --name-status 45afab0f v4.0.5 -- packages/zod/src/v4/**/tests/**`: {}.

- `git archive --format=tar --prefix=v4.1.0/ v4.1.0 | tar -x -C ../zod-versions`: exit 0; package.json exists. `git diff --name-status 45afab0f v4.1.0 -- packages/zod/src/v4/**/tests/**`: {'M': 36, 'A': 5}.

- `git archive --format=tar --prefix=v4.2.0/ v4.2.0 | tar -x -C ../zod-versions`: exit 0; package.json exists. `git diff --name-status 45afab0f v4.2.0 -- packages/zod/src/v4/**/tests/**`: {'M': 42, 'A': 16}.

- `git archive --format=tar --prefix=v4.3.0/ v4.3.0 | tar -x -C ../zod-versions`: exit 0; package.json exists. `git diff --name-status 45afab0f v4.3.0 -- packages/zod/src/v4/**/tests/**`: {'A': 20, 'M': 49}.

- `git archive --format=tar --prefix=v4.4.0/ v4.4.0 | tar -x -C ../zod-versions`: exit 0; package.json exists. `git diff --name-status 45afab0f v4.4.0 -- packages/zod/src/v4/**/tests/**`: {'A': 27, 'M': 51}.

- `git archive --format=tar --prefix=v4.5.0/ v4.5.0 | tar -x -C ../zod-versions`: exit 0; package.json exists. `git diff --name-status 45afab0f v4.5.0 -- packages/zod/src/v4/**/tests/**`: {'A': 49, 'M': 61}.

- `git archive --format=tar --prefix=v4.6.0/ v4.6.0 | tar -x -C ../zod-versions`: exit 0; package.json exists. `git diff --name-status 45afab0f v4.6.0 -- packages/zod/src/v4/**/tests/**`: {'A': 55, 'M': 62}.

## Mount and build

Added relative bind mount ../../../../zod-versions:/work/zod-versions. `docker compose config --no-env-resolution --format json` piped to volume-only Python filter verifies the mount without reading env_file contents. `docker compose run --rm tp bash -c 'ls /work/zod-versions'`: initial socket permission failure, approved rerun exit 0, seven directories. `git diff --check`, `git add .../docker/compose.yml`, `git commit`: mount commit 8ca91772 with required attribution.

Build commands are logged by scripts/build-survival.py, invoked via `docker compose run --rm tp python3 /work/zod/experiments/testpilot-2026-09/scripts/build-survival.py`. `npx --no-install vitest --version` prevents an unintended download on missing dependencies; observational command only.
- v4.0.5: HUSKY=0 `pnpm install --frozen-lockfile` (cwd /work/zod-versions/v4.0.5), exit 0; output `results/survival/v4.0.5/build.log`.
- v4.0.5: HUSKY=0 `pnpm build` (cwd /work/zod-versions/v4.0.5), exit 0; output `results/survival/v4.0.5/build.log`.
- v4.0.5: `npx --no-install vitest --version` exit 0; vitest/2.1.9 linux-arm64 node-v22.23.2
- v4.0.5: `node --version` exit 0; v22.23.2
- v4.0.5: `pnpm --version` exit 0; 10.12.1
- v4.0.5: build status {"release": "v4.0.5", "install": true, "build": true, "probe": "not-run", "fallbacks": [], "buildExitCode": 0, "exports": {"@zod/source": "./src/index.ts", "types": "./index.d.cts", "import": "./index.js", "require": "./index.cjs"}, "requireEntry": "./index.cjs", "entryExists": true, "wallSeconds": 54.62876527400002}
- v4.1.0: HUSKY=0 `pnpm install --frozen-lockfile` (cwd /work/zod-versions/v4.1.0), exit 0; output `results/survival/v4.1.0/build.log`.
- v4.1.0: HUSKY=0 `pnpm build` (cwd /work/zod-versions/v4.1.0), exit 0; output `results/survival/v4.1.0/build.log`.
- v4.1.0: `npx --no-install vitest --version` exit 0; vitest/2.1.9 linux-arm64 node-v22.23.2
- v4.1.0: `node --version` exit 0; v22.23.2
- v4.1.0: `pnpm --version` exit 0; 10.12.1
- v4.1.0: build status {"release": "v4.1.0", "install": true, "build": true, "probe": "not-run", "fallbacks": [], "buildExitCode": 0, "exports": {"@zod/source": "./src/index.ts", "types": "./index.d.cts", "import": "./index.js", "require": "./index.cjs"}, "requireEntry": "./index.cjs", "entryExists": true, "wallSeconds": 33.954418683}
- v4.2.0: HUSKY=0 `pnpm install --frozen-lockfile` (cwd /work/zod-versions/v4.2.0), exit 0; output `results/survival/v4.2.0/build.log`.
- v4.2.0: HUSKY=0 `pnpm build` (cwd /work/zod-versions/v4.2.0), exit 0; output `results/survival/v4.2.0/build.log`.
- v4.2.0: `npx --no-install vitest --version` exit 0; vitest/4.0.10 linux-arm64 node-v22.23.2
- v4.2.0: `node --version` exit 0; v22.23.2
- v4.2.0: `pnpm --version` exit 0; 10.12.1
- v4.2.0: build status {"release": "v4.2.0", "install": true, "build": true, "probe": "not-run", "fallbacks": [], "buildExitCode": 0, "exports": {"@zod/source": "./src/index.ts", "types": "./index.d.cts", "import": "./index.js", "require": "./index.cjs"}, "requireEntry": "./index.cjs", "entryExists": true, "wallSeconds": 40.189279018000036}

## Replay command equivalence

Inspected `testpilot2/src/mochaValidator.ts` lines 55–103. Replacement is exactly single-quoted `require('zod')` -> `require('..')`.

| Validator | Stage S |
| --- | --- |
| `/work/testpilot2/node_modules/.bin/nyc --cwd=$W --exclude=test-XXXXXX --reporter=json --report-dir=$coverageDir --temp-dir=$coverageDir /work/testpilot2/node_modules/.bin/mocha --full-trace --exit --allow-uncaught=false --reporter=json --reporter-option output=$reportFile -- $testFile` | `/work/testpilot2/node_modules/.bin/mocha --full-trace --exit --allow-uncaught=false --reporter=json --reporter-option output=/dev/stdout -- $W/test-s/$basename` |

D-11: drop nyc per instructions (L-01). All Mocha flags retained; reporter output destination is /dev/stdout for captured JSON. Same 5000 ms timeout, SIGKILL; runner kills process group on timeout. No failing test retries.

`python3 scripts/replay-survival.py` is run in Docker, sequentially. Commands and outcomes follow.
- v4.3.0: HUSKY=0 `pnpm install --frozen-lockfile` (cwd /work/zod-versions/v4.3.0), exit 0; output `results/survival/v4.3.0/build.log`.
- v4.3.0: HUSKY=0 `pnpm build` (cwd /work/zod-versions/v4.3.0), exit 0; output `results/survival/v4.3.0/build.log`.
- v4.3.0: `npx --no-install vitest --version` exit 0; vitest/4.0.10 linux-arm64 node-v22.23.2
- v4.3.0: `node --version` exit 0; v22.23.2
- v4.3.0: `pnpm --version` exit 0; 10.12.1
- v4.3.0: build status {"release": "v4.3.0", "install": true, "build": true, "probe": "not-run", "fallbacks": [], "buildExitCode": 0, "exports": {"@zod/source": "./src/index.ts", "types": "./index.d.cts", "import": "./index.js", "require": "./index.cjs"}, "requireEntry": "./index.cjs", "entryExists": true, "wallSeconds": 39.627193018000014}
- v4.4.0: HUSKY=0 `pnpm install --frozen-lockfile` (cwd /work/zod-versions/v4.4.0), exit 0; output `results/survival/v4.4.0/build.log`.
- v4.4.0: HUSKY=0 `pnpm build` (cwd /work/zod-versions/v4.4.0), exit 0; output `results/survival/v4.4.0/build.log`.
- v4.4.0: `npx --no-install vitest --version` exit 0; vitest/4.0.10 linux-arm64 node-v22.23.2
- v4.4.0: `node --version` exit 0; v22.23.2
- v4.4.0: `pnpm --version` exit 0; 10.12.1
- v4.4.0: build status {"release": "v4.4.0", "install": true, "build": true, "probe": "not-run", "fallbacks": [], "buildExitCode": 0, "exports": {"@zod/source": "./src/index.ts", "types": "./index.d.cts", "import": "./index.js", "require": "./index.cjs"}, "requireEntry": "./index.cjs", "entryExists": true, "wallSeconds": 38.49092310000003}
- v4.5.0: HUSKY=0 `pnpm install --frozen-lockfile` (cwd /work/zod-versions/v4.5.0), exit 0; output `results/survival/v4.5.0/build.log`.
- v4.5.0: HUSKY=0 `pnpm build` (cwd /work/zod-versions/v4.5.0), exit 0; output `results/survival/v4.5.0/build.log`.
- v4.5.0: `npx --no-install vitest --version` exit 0; vitest/4.1.5 linux-arm64 node-v22.23.2
- v4.5.0: `node --version` exit 0; v22.23.2
- v4.5.0: `pnpm --version` exit 0; 10.12.1
- v4.5.0: build status {"release": "v4.5.0", "install": true, "build": true, "probe": "not-run", "fallbacks": [], "buildExitCode": 0, "exports": {"@zod/source": "./src/index.ts", "types": "./index.d.cts", "import": "./index.js", "require": "./index.cjs"}, "requireEntry": "./index.cjs", "entryExists": true, "wallSeconds": 53.668298900000025}
- v4.6.0: HUSKY=0 `pnpm install --frozen-lockfile` (cwd /work/zod-versions/v4.6.0), exit 1; output `results/survival/v4.6.0/build.log`.
- v4.6.0: HUSKY=0 `pnpm install --no-frozen-lockfile` (cwd /work/zod-versions/v4.6.0), exit 1; output `results/survival/v4.6.0/build.log`.

- Build orchestrator exited 1 on v4.6.0 installation. Exact error: `Unsupported package manager specification (nub@0.8.3)`.
- D-13: fallback selector mistakenly matched `lockfile` in its logged command; ran `pnpm install --no-frozen-lockfile`, same error, exit 1. No dependency install or tests occurred. Preserve both attempts; correct selector to inspect subprocess output only.
- D-14: `docker compose run --rm tp bash -c 'cd /work/zod-versions/v4.6.0; HUSKY=0 COREPACK_ENABLE_STRICT=0 pnpm install --frozen-lockfile'` also exit 1, same unsupported-manager error. This release is installation/build failed; continue other releases and attempt dev per release-local failure rule. No unsupported package-manager substitution or source edits.
- Read first generated test confirms single-quoted require. Attempted root vitest.config.ts read returned no such file (read-only inspection).
- v4.0.5: wrapper symlink -> /work/zod-versions/v4.0.5/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.075s; `results/survival/v4.0.5/llm-probe.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.0.5 --out /work/zod/experiments/testpilot-2026-09/results/survival/v4.0.5` -> exit 0, 30.259s; v4.0.5 pass=139 / fail=0 / load-error=0 / timeout=0 / other=0 wall=30.220s
- v4.0.5: scratch absent; 278 raw files confirmed.
- LLM control non-passes (flaky at t): []
- v4.1.0: wrapper symlink -> /work/zod-versions/v4.1.0/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.053s; `results/survival/v4.1.0/llm-probe.txt`

- v4.6.0 `HUSKY=0 pnpm build`: exit 1, same unsupported package manager error; saved in build.log. `node --version`: v22.23.2; `pnpm --version`: unsupported-manager error; `npx --no-install vitest --version`: npm canceled due to missing vitest and no YES option (saved env.txt). No LLM probe possible.
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.1.0 --out /work/zod/experiments/testpilot-2026-09/results/survival/v4.1.0` -> exit 0, 25.997s; v4.1.0 pass=139 / fail=0 / load-error=0 / timeout=0 / other=0 wall=25.962s
- v4.1.0: scratch absent; 278 raw files confirmed.
- v4.2.0: wrapper symlink -> /work/zod-versions/v4.2.0/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.052s; `results/survival/v4.2.0/llm-probe.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.2.0 --out /work/zod/experiments/testpilot-2026-09/results/survival/v4.2.0` -> exit 0, 28.047s; v4.2.0 pass=139 / fail=0 / load-error=0 / timeout=0 / other=0 wall=28.009s
- v4.2.0: scratch absent; 278 raw files confirmed.
- v4.3.0: wrapper symlink -> /work/zod-versions/v4.3.0/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.054s; `results/survival/v4.3.0/llm-probe.txt`

- Host Python source-integrity check: git archive of each tag vs exported zod source, vitest configuration, root package.json and pnpm-lock.yaml excluding tests; all identical (source-integrity.json). Build formatter logs report no fixes. `ast.parse` validates all five Stage S Python scripts. `git diff --check` passed.
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.3.0 --out /work/zod/experiments/testpilot-2026-09/results/survival/v4.3.0` -> exit 0, 30.320s; v4.3.0 pass=139 / fail=0 / load-error=0 / timeout=0 / other=0 wall=30.278s
- v4.3.0: scratch absent; 278 raw files confirmed.
- v4.4.0: wrapper symlink -> /work/zod-versions/v4.4.0/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.059s; `results/survival/v4.4.0/llm-probe.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.4.0 --out /work/zod/experiments/testpilot-2026-09/results/survival/v4.4.0` -> exit 0, 28.242s; v4.4.0 pass=139 / fail=0 / load-error=0 / timeout=0 / other=0 wall=28.187s
- v4.4.0: scratch absent; 278 raw files confirmed.
- v4.5.0: wrapper symlink -> /work/zod-versions/v4.5.0/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.066s; `results/survival/v4.5.0/llm-probe.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.5.0 --out /work/zod/experiments/testpilot-2026-09/results/survival/v4.5.0` -> exit 0, 28.875s; v4.5.0 pass=138 / fail=1 / load-error=0 / timeout=0 / other=0 wall=28.831s
- v4.5.0: scratch absent; 278 raw files confirmed.
- v4.6.0: LLM skipped: build failed.
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.055s; 4.0.5 object function
- Original wrapper target restored and verified.
- D-12: copied v4.0.5 tests to /work/zod-versions/frozen-v4.0.5-tests before replacement. Literal T0 self-delete would erase control/source tests. Every release including control uses the same snapshot replacement.
- v4.0.5: tests directory diff exit=0, release=['classic/tests', 'core/tests', 'mini/tests'], baseline=['classic/tests', 'core/tests', 'mini/tests'].
- v4.0.5: remove release tests directories; copy frozen tests; SHA256 mapping identical to baseline, 81 .test.ts files.
- cwd `/work/zod-versions/v4.0.5/packages/zod`: `npx vitest run src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.0.5/dev-run.json` -> exit 0, 6.212s; `results/survival/v4.0.5/dev-stdout.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/summarize-dev-run.py --release v4.0.5 --out /work/zod/experiments/testpilot-2026-09/results/survival/v4.0.5` -> exit 1, 0.019s; Traceback (most recent call last):
  File "/work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py", line 25, in <module>
    if __name__=='__main__':main()
                            ^^^^^^
  File "/work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py", line 22, in main
    assert len({(c['file'],c['fullName']) for c in cases})==len(cases),'Duplicate case identities'
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
AssertionError: Duplicate case identities

## Stop and partial results

Ground rule 5 stop applied: unanticipated `AssertionError: Duplicate case identities` in the helper, after successful control test execution. No tests retried. Baseline raw JSON has 81 testResults and 888 passed assertions; nine repeated (file, fullName) groups. Later dev releases not run; analyzer not run. Host standard-library script computes this partial table and stopped handover from recorded artifacts; no numbers manually entered.

| Tag | Commit | Date | Build | Probe | LLM pass/fail/load/timeout/other | LLM survival | Dev files/passed/failed | Dev survival | Upstream dev A/M/D |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v4.0.5 | 45afab0f846dffd591362b6f770017507eb185b5 | 2025-07-10 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | 81 / 888 / 0 | 888/888 (100.00%) | 0/0/0 |
| v4.1.0 | 2ca716d6313dcfab425d3555ac8bf85929bc57a4 | 2025-08-23 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | not run (stopped) | unavailable | 5/36/0 |
| v4.2.0 | dcef9734f55fc1c8e73795a2be80c60fa7a4a568 | 2025-12-14 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | not run (stopped) | unavailable | 16/42/0 |
| v4.3.0 | 1899684fc34d149ebb5d6f9fd95a588e94f27053 | 2025-12-30 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | not run (stopped) | unavailable | 20/49/0 |
| v4.4.0 | d05f026e9e6eae0e1e6c2efbf11c89007ca40494 | 2026-04-29 | ok | ok | 139/0/0/0/0 | 139/139 (100.00%) | not run (stopped) | unavailable | 27/51/0 |
| v4.5.0 | 0a69bcb3d9554c6ec382ea9ba6b43c2421f3fa78 | 2026-08-28 | ok | ok | 138/1/0/0/0 | 138/139 (99.28%) | not run (stopped) | unavailable | 49/61/0 |
| v4.6.0 | 1c51cbe0fe23d09f8d520b31487d50a01588fae5 | 2026-09-09 | failed | not-run | not run (build failed) | unavailable | not run (stopped) | unavailable | 55/62/0 |

| Release | Build/env seconds | LLM seconds | Dev seconds |
| --- | --- | --- | --- |
| v4.0.5 | 54.629 | 30.22 | 6.212 |
| v4.1.0 | 33.954 | 25.962 | 0 |
| v4.2.0 | 40.189 | 28.009 | 0 |
| v4.3.0 | 39.627 | 30.278 | 0 |
| v4.4.0 | 38.491 | 28.187 | 0 |
| v4.5.0 | 53.668 | 28.831 | 0 |
| v4.6.0 | 0.057 | 0 | 0 |

## Final cleanup / verification

- `docker compose run --rm tp bash -c ...`: readlink original target ../../../../../packages/zod; Node probe `4.0.5 object function`; `test ! -e "$W/test-s"` succeeds; `du -sh /work/zod-versions` = 2.3G. Exit 0.
- `git status --porcelain --untracked-files=no`: empty after mount commit; generated sources unchanged. `git -C ../testpilot2 status -sb`: clean and synchronized.
- Host integrity check: six LLM result lists each exactly match 139-entry frozen manifest order; 1,668 raw artifacts; all parsed Mocha failure counts agree with statuses. `git diff d250c509 -- .../gen-n60 .../gen-n60-passing.json` empty.
- Wrote stopped-stage handover and partial summary; full analysis and matrices deliberately not claimed as complete.

- `git add` explicit Stage S experiment paths; staged 1,722 files, including all recorded raw outputs and draft helpers. `git diff --cached --check`: exit 0.
- Finalization commands: `git commit` with prescribed Stage S subject and body explicitly recording the stop, then `git push origin experiment/2026-09-week3-testpilot-zod`, followed by `git status -sb`. The user-facing completion message records their outcome.

- Commit 043638ab created and pushed successfully; status synchronized, only pre-existing Claude outputs/ untracked. Final tracked-artifact audit found global *.log ignore omitted seven build.log files from the directory add. Explicit `git add -f` adds all seven required logs; supplemental attributed commit preserves them without rewriting the pushed history.

## Authorized continuation

User requested reading the stopped handover and carrying out its work. Read handover and both helpers, branch synchronized at 1bc6cba9; pre-existing Claude outputs/ retained. D-15: fix case identity to (file, fullName, one-based occurrence) in summarizer and analysis, preserve all 888 cases and assert identical identity sets on later runs. Reprocess existing control JSON; do not rerun LLM or developer control.
- Host `python3 experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.0.5 --out .../v4.0.5`: exit 0; 81 loaded files, 888 cases, 888 passed, no failed/skipped. Restored control dev-status from original execution log (6.212 seconds). Added continuation-only runner refusing to overwrite any dev-stdout.txt.
- `docker compose run --rm tp python3 /work/zod/experiments/testpilot-2026-09/scripts/resume-survival-dev.py`: per-command outcomes follow.
- Developer continuation: npx commands use npm_config_yes=false to prohibit implicit installation of a different Vitest (D-16). Existing release-local Vitest is used; missing runner means harness unavailable.
- v4.1.0: tests directory diff exit=0, release=['classic/tests', 'core/tests', 'mini/tests'], baseline=['classic/tests', 'core/tests', 'mini/tests'].
- v4.1.0: remove release tests directories; copy frozen tests; SHA256 mapping identical to baseline, 81 .test.ts files.
- cwd `/work/zod-versions/v4.1.0/packages/zod`: `npx vitest run src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.1.0/dev-run.json` -> exit 1, 6.323s; `results/survival/v4.1.0/dev-stdout.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/summarize-dev-run.py --release v4.1.0 --out /work/zod/experiments/testpilot-2026-09/results/survival/v4.1.0` -> exit 0, 0.022s; v4.1.0 {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 871, "failed": 17, "skipped": 0}
- v4.2.0: tests directory diff exit=0, release=['classic/tests', 'core/tests', 'mini/tests'], baseline=['classic/tests', 'core/tests', 'mini/tests'].
- v4.2.0: remove release tests directories; copy frozen tests; SHA256 mapping identical to baseline, 81 .test.ts files.
- cwd `/work/zod-versions/v4.2.0/packages/zod`: `npx vitest run src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.2.0/dev-run.json` -> exit 1, 0.475s; `results/survival/v4.2.0/dev-stdout.txt`
- v4.2.0: dev harness failed; see dev-stdout.txt.
- v4.3.0: tests directory diff exit=0, release=['classic/tests', 'core/tests', 'mini/tests'], baseline=['classic/tests', 'core/tests', 'mini/tests'].
- v4.3.0: remove release tests directories; copy frozen tests; SHA256 mapping identical to baseline, 81 .test.ts files.
- cwd `/work/zod-versions/v4.3.0/packages/zod`: `npx vitest run src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.3.0/dev-run.json` -> exit 1, 0.326s; `results/survival/v4.3.0/dev-stdout.txt`
- v4.3.0: dev harness failed; see dev-stdout.txt.
- v4.4.0: tests directory diff exit=0, release=['classic/tests', 'core/tests', 'mini/tests'], baseline=['classic/tests', 'core/tests', 'mini/tests'].
- v4.4.0: remove release tests directories; copy frozen tests; SHA256 mapping identical to baseline, 81 .test.ts files.
- cwd `/work/zod-versions/v4.4.0/packages/zod`: `npx vitest run src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.4.0/dev-run.json` -> exit 1, 0.344s; `results/survival/v4.4.0/dev-stdout.txt`
- v4.4.0: dev harness failed; see dev-stdout.txt.
- v4.5.0: tests directory diff exit=0, release=['classic/tests', 'core/tests', 'mini/tests'], baseline=['classic/tests', 'core/tests', 'mini/tests'].
- v4.5.0: remove release tests directories; copy frozen tests; SHA256 mapping identical to baseline, 81 .test.ts files.
- cwd `/work/zod-versions/v4.5.0/packages/zod`: `npx vitest run src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.5.0/dev-run.json` -> exit 1, 0.413s; `results/survival/v4.5.0/dev-stdout.txt`
- v4.5.0: dev harness failed; see dev-stdout.txt.
- v4.6.0: tests directory diff exit=0, release=['classic/tests', 'core/tests', 'mini/tests'], baseline=['classic/tests', 'core/tests', 'mini/tests'].
- v4.6.0: remove release tests directories; copy frozen tests; SHA256 mapping identical to baseline, 81 .test.ts files.
- cwd `/work/zod-versions/v4.6.0/packages/zod`: `npx vitest run src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.6.0/dev-run.json` -> exit 1, 0.419s; `results/survival/v4.6.0/dev-stdout.txt`
- v4.6.0: dev harness failed; see dev-stdout.txt.
- cwd `/work/zod/experiments/testpilot-2026-09`: `du -sh /work/zod-versions` -> exit 0, 26.491s; 2.3G	/work/zod-versions
- `du -sh /work/zod-versions`: 2.3G	/work/zod-versions

- Regression validation uses synthetic copies of recorded JSON, never executes zod tests: duplicate-name individual failure and whole-file load failure both passed. Initial third check exposed an unterminated string in new handover prose; corrected quote before running analyzer.
- All six pending developer attempts completed. v4.1.0: 871 passed / 17 failed, 81 loaded files. v4.2.0–v4.4.0: Vitest startup error, no projects found. v4.5.0: Vitest startup error, missing referenced project path. v4.6.0: missing installed Vitest, npm refused implicit download. These follow the explicit dev-harness-failed path, not test failures; no configuration changes or retries made.

## Computed per-release results

| Release | Build | Probe | LLM P/F/load/timeout/other | Dev loaded/passed/failed | Wall seconds |
| --- | --- | --- | --- | --- | --- |
| v4.0.5 | ok | ok | 139/0/0/0/0 | 81/888/0 | 91.061 |
| v4.1.0 | ok | ok | 139/0/0/0/0 | 81/871/17 | 66.353 |
| v4.2.0 | ok | ok | 139/0/0/0/0 | unavailable | 68.761 |
| v4.3.0 | ok | ok | 139/0/0/0/0 | unavailable | 70.317 |
| v4.4.0 | ok | ok | 139/0/0/0/0 | unavailable | 67.1 |
| v4.5.0 | ok | ok | 138/1/0/0/0 | unavailable | 82.99 |
| v4.6.0 | failed | not-run | unavailable | unavailable | 0.564 |

## Computed per-release results

| Release | Build | Probe | LLM P/F/load/timeout/other | Dev loaded/passed/failed | Wall seconds |
| --- | --- | --- | --- | --- | --- |
| v4.0.5 | ok | ok | 139/0/0/0/0 | 81/888/0 | 91.061 |
| v4.1.0 | ok | ok | 139/0/0/0/0 | 81/871/17 | 66.353 |
| v4.2.0 | ok | ok | 139/0/0/0/0 | unavailable | 68.761 |
| v4.3.0 | ok | ok | 139/0/0/0/0 | unavailable | 70.317 |
| v4.4.0 | ok | ok | 139/0/0/0/0 | unavailable | 67.1 |
| v4.5.0 | ok | ok | 138/1/0/0/0 | unavailable | 82.99 |
| v4.6.0 | failed | not-run | unavailable | unavailable | 0.564 |

- `python3 -B scripts/test-survival-analysis.py`: all 3 regression tests pass (synthetic fixture validation, no experiment tests rerun). `python3 -B scripts/analyze-survival.py`: exit 0; generated complete analysis of available observations, matrices, pair-map and final handover. Re-executed analysis after adding exact startup errors; no tests re-executed.
- Host integrity audit: CSV row counts 139 LLM / 888 dev / 54 function pairs; all developer identity triples unique; 17 first-release developer failures and one LLM first break at v4.5.0; unavailable flags preserved; prior LLM raw outputs, original control dev JSON/stdout and generated tests unchanged vs 1bc6cba9. Details: results/survival/continuation-checks.json.

{"survival-llm-matrix.csv": 139, "survival-dev-matrix.csv": 888, "survival-pairs.csv": 54, "v4.0.5": {"files_passed": 81, "files_failed": 0, "cases_passed": 888, "cases_failed": 0}, "v4.1.0": {"files_passed": 69, "files_failed": 12, "cases_passed": 871, "cases_failed": 17}, "prior_raw_artifacts_unchanged": true}

## Continuation finalization

- Final Docker wrapper probe: original target ../../../../../packages/zod, `4.0.5 object function`, scratch absent; exit 0. Export size after all attempts: 2.3G. testpilot2 remains clean and synchronized.
- `git diff --check`: exit 0. All changed/new task files are under experiments/; pre-existing untracked Claude outputs/ untouched. The generated summary explicitly limits no-observed-break counts to available releases. Dev v4.1.0: 69 files passed / 12 files failed, 871 cases passed / 17 failed; control 81 files / 888 cases passed.
- Commit/push continuation with required attribution; final remote synchronization is checked and reported to the user. No report or archive branch created.

- Staged whitespace audit additionally found CSV CRLF row endings and verbatim Vitest stdout whitespace. Preserve raw stdout exactly; change CSV writer to explicit LF and regenerate derived analysis. The prior unstaged check did not cover newly staged CSVs. Final scoped whitespace check excludes only raw dev-stdout.txt evidence.

## Computed per-release results

| Release | Build | Probe | LLM P/F/load/timeout/other | Dev loaded/passed/failed | Wall seconds |
| --- | --- | --- | --- | --- | --- |
| v4.0.5 | ok | ok | 139/0/0/0/0 | 81/888/0 | 91.061 |
| v4.1.0 | ok | ok | 139/0/0/0/0 | 81/871/17 | 66.353 |
| v4.2.0 | ok | ok | 139/0/0/0/0 | unavailable | 68.761 |
| v4.3.0 | ok | ok | 139/0/0/0/0 | unavailable | 70.317 |
| v4.4.0 | ok | ok | 139/0/0/0/0 | unavailable | 67.1 |
| v4.5.0 | ok | ok | 138/1/0/0/0 | unavailable | 82.99 |
| v4.6.0 | failed | not-run | unavailable | unavailable | 0.564 |
- Final whitespace audit vs 1bc6cba9 passes after excluding verbatim dev-stdout.txt only. CSV parsed values unchanged by LF normalization. Main continuation commit de072430 pushed; supplemental formatting commit preserves raw evidence.

## Continuation 2 (addendum 2)

Read supplied addendum, current handover and command-log tail. Branch at 1fd2e532, synchronized; only pre-existing Claude outputs/ untracked. testpilot2 still 31c01799. No model calls or credentials read.
- Step 1: moved v4.0.5 prior developer files to dev-attempt1/: dev-run.json, dev-stdout.txt, dev-status.json, dev-cases.json, dev-summary.json, tests-dirs-release.txt, tests-dirs-t.txt. LLM/build/devtest-diff files untouched.
- Step 1: moved v4.1.0 prior developer files to dev-attempt1/: dev-run.json, dev-stdout.txt, dev-status.json, dev-cases.json, dev-summary.json, tests-dirs-release.txt, tests-dirs-t.txt. LLM/build/devtest-diff files untouched.
- Step 1: moved v4.2.0 prior developer files to dev-attempt1/: dev-stdout.txt, dev-status.json, tests-dirs-release.txt, tests-dirs-t.txt. LLM/build/devtest-diff files untouched.
- Step 1: moved v4.3.0 prior developer files to dev-attempt1/: dev-stdout.txt, dev-status.json, tests-dirs-release.txt, tests-dirs-t.txt. LLM/build/devtest-diff files untouched.
- Step 1: moved v4.4.0 prior developer files to dev-attempt1/: dev-stdout.txt, dev-status.json, tests-dirs-release.txt, tests-dirs-t.txt. LLM/build/devtest-diff files untouched.
- Step 1: moved v4.5.0 prior developer files to dev-attempt1/: dev-stdout.txt, dev-status.json, tests-dirs-release.txt, tests-dirs-t.txt. LLM/build/devtest-diff files untouched.
- Step 1: moved v4.6.0 prior developer files to dev-attempt1/: dev-stdout.txt, dev-status.json, tests-dirs-release.txt, tests-dirs-t.txt. LLM/build/devtest-diff files untouched.
- D-17: ignore nub packageManager project specification; use container pnpm. Container precondition: seven releases plus frozen snapshot, 81 .test.ts files.
- v4.6.0 HUSKY=0 COREPACK_ENABLE_PROJECT_SPEC=0 `pnpm install --frozen-lockfile`: exit 1; appended build.log.
- D-18: frozen install rejected; exact error retained in build.log; retry --no-frozen-lockfile.
- v4.6.0 HUSKY=0 COREPACK_ENABLE_PROJECT_SPEC=0 `pnpm install --no-frozen-lockfile`: exit 1; appended build.log.
- v4.6.0 environment `npx --no-install vitest --version`: exit 1; npm error npx canceled due to missing packages and no YES option: ["vitest@5.0.1"]
npm notice
npm notice New major version of npm available! 10.9.8 -> 12.0.2
npm notice Changelog: https://github.com/npm/cli/releases/tag/v12.0.2
npm notice To update run: npm install -g npm@12.0.2
npm notice
npm error A complete log of this run can be found in: /root/.npm/_logs/2026-09-19T15_36_15_051Z-debug-0.log
- v4.6.0 environment `node --version`: exit 0; v22.23.2
- v4.6.0 environment `pnpm --version`: exit 0; 10.12.1
- v4.6.0 build status: {"release": "v4.6.0", "install": false, "build": false, "probe": "not-run", "fallbacks": ["COREPACK_ENABLE_PROJECT_SPEC=0 (D-17)", "--no-frozen-lockfile (D-18)"], "error": "install failed: \u2009WARN\u2009 The \"workspaces\" field in package.json is not supported by pnpm. Create a \"pnpm-workspace.yaml\" file instead.\nLockfile is up to date, resolution step is skipped\n\u2009WARN\u2009 Broken lockfile: no entry for 'zod@4.5.4' in pnpm-lock.yaml\n\u2009ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY\u2009 The lockfile is broken! Resolution step will be performed to fix it.\nProgress: resolved 0, reused 1, downloaded 0, added 0\n\n   \u256d\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256e\n   \u2502                                              \u2502\n   \u2502     Update available! 10.12.1 \u2192 12.4.2.      \u2502\n   \u2502     Changelog: https://pnpm.io/v/12.4.2      \u2502\n   \u2502   To update, run: corepack use pnpm@12.4.2   \u2502\n   \u2502                                              \u2502\n   \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256f\n\n\u2009ERR_PNPM_WORKSPACE_PKG_NOT_FOUND\u2009 In : \"zod@workspace:*\" is in the dependencies but no package named \"zod\" is present in the workspace\n\nThis error happened while installing a direct dependency of /work/zod-versions/v4.6.0\n\nPackages found in the workspace: \n", "exports": {"@zod/source": "./src/index.ts", "types": "./index.d.cts", "import": "./index.js", "require": "./index.cjs"}, "requireEntry": "./index.cjs", "entryExists": false, "wallSeconds": 1.877260585000002}
- v4.0.5: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.0.5: developer command from repository root with explicit project; fallback order per addendum.
- v4.0.5: cwd `/work/zod-versions/v4.0.5` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.0.5/dev-run.json` -> exit 0, 8.178s; appended dev-stdout.txt.
- v4.0.5: `python3 /work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.0.5 --out /work/zod/experiments/testpilot-2026-09/results/survival/v4.0.5` -> exit 1; Traceback (most recent call last):
  File "/work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py", line 30, in <module>
    if __name__=='__main__':main()
                            ^^^^^^
  File "/work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py", line 9, in main
    data=json.loads((out/'dev-run.json').read_text());files=data['testResults'];assert len(files)==81, f'Expected 81 runtime files, found {len(files)}'
                                                                                       ^^^^^^^^^^^^^^
AssertionError: Expected 81 runtime files, found 162

- Step 2: D-17 selected container pnpm 10.12.1 successfully. Frozen install failed: ERR_PNPM_LOCKFILE_MISSING_DEPENDENCY, missing zod@4.5.4. D-18 --no-frozen-lockfile also failed: ERR_PNPM_WORKSPACE_PKG_NOT_FOUND for zod@workspace:* (no pnpm workspace declaration). Exact outputs appended to build.log. Per explicit Step 2 fallback, stop v4.6.0 branch: no build, dev run, probe or LLM run; continue v4.0.5–v4.5.0. No workspace or manifest changes.
- `docker compose run --rm tp bash -c 'set -e; for t in v4.0.5 v4.1.0 v4.2.0 v4.3.0 v4.4.0 v4.5.0; do python3 .../scripts/run-survival-dev.py --release "$t"; done'`: per-release outcomes follow; set -e enforces gates before later releases.

- v4.0.5 root primary command exited 0 but included 162 files (runtime + typecheck) despite accepting --typecheck.enabled=false. Initial summarizer assertion: Expected 81 runtime files, found 162. D-20: apply the addendum's supplied runtime split rule to this existing JSON; exactly 81 unique baseline files have assertion durations and non-typecheck names/meta, so the split is unambiguous. Original JSON preserved as dev-run-unsplit.json; no test rerun. Runner now also applies this provided split when a successful primary command returns duplicate typecheck entries.
- v4.0.5 gate after unambiguous runtime split: 81 files, 888 cases, 888 passed. Host summarizer exit 0; JSON postprocessing only. Continue at v4.1.0 without rerunning control.
- v4.1.0: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.1.0: developer command from repository root with explicit project; fallback order per addendum.
- v4.1.0: cwd `/work/zod-versions/v4.1.0` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.1.0/dev-run.json` -> exit 1, 8.775s; appended dev-stdout.txt.
- D-20 v4.1.0: apply prescribed runtime/typecheck split; root command may emit typecheck entries even when the flag is accepted.
- v4.1.0: split runtime JSON: 81 unique baseline files; all assertionResults.duration values non-null; name/projectName excludes typecheck; original retained in dev-run-unsplit.json.
- v4.1.0: `python3 /work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.1.0 --out /work/zod/experiments/testpilot-2026-09/results/survival/v4.1.0` -> exit 0; v4.1.0 {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 871, "failed": 17, "skipped": 0}
- v4.1.0 gate comparison: {"passed": 871, "failed": 17, "identicalFailingSet": true, "removed": [], "added": []}
- v4.2.0: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.2.0: developer command from repository root with explicit project; fallback order per addendum.
- v4.2.0: cwd `/work/zod-versions/v4.2.0` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.2.0/dev-run.json` -> exit 1, 11.729s; appended dev-stdout.txt.
- D-20 v4.2.0: apply prescribed runtime/typecheck split; root command may emit typecheck entries even when the flag is accepted.
- v4.2.0: Runtime/typecheck split ambiguous; 80 candidate entries.
- v4.2.0: dev harness failed after fallbacks; exact errors retained.
- v4.3.0: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.3.0: developer command from repository root with explicit project; fallback order per addendum.
- v4.3.0: cwd `/work/zod-versions/v4.3.0` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.3.0/dev-run.json` -> exit 1, 13.509s; appended dev-stdout.txt.
- D-20 v4.3.0: apply prescribed runtime/typecheck split; root command may emit typecheck entries even when the flag is accepted.
- v4.3.0: Runtime/typecheck split ambiguous; 80 candidate entries.
- v4.3.0: dev harness failed after fallbacks; exact errors retained.
- v4.4.0: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.4.0: developer command from repository root with explicit project; fallback order per addendum.
- v4.4.0: cwd `/work/zod-versions/v4.4.0` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.4.0/dev-run.json` -> exit 1, 13.267s; appended dev-stdout.txt.
- D-20 v4.4.0: apply prescribed runtime/typecheck split; root command may emit typecheck entries even when the flag is accepted.
- v4.4.0: Runtime/typecheck split ambiguous; 80 candidate entries.
- v4.4.0: dev harness failed after fallbacks; exact errors retained.
- v4.5.0: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.5.0: developer command from repository root with explicit project; fallback order per addendum.
- v4.5.0: cwd `/work/zod-versions/v4.5.0` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.5.0/dev-run.json` -> exit 1, 11.783s; appended dev-stdout.txt.
- D-20 v4.5.0: apply prescribed runtime/typecheck split; root command may emit typecheck entries even when the flag is accepted.
- v4.5.0: Runtime/typecheck split ambiguous; 80 candidate entries.
- v4.5.0: dev harness failed after fallbacks; exact errors retained.

- Both root-command gates passed; v4.1.0 dev-attempt-compare.txt records 871/17 and identical failing set. All executed releases used primary --project zod command; no command fallback needed. Typecheck duplicates occurred despite the accepted flag. D-20 runtime projection was applied unambiguously at v4.0.5/v4.1.0.
- v4.2.0–v4.5.0 root commands executed but supplied duration-based split selects only 80 of 81 files. classic/tests/json.test.ts runtime entry has fullName <anonymous>, status todo, meta {}, no duration; counterpart is meta.typecheck=true. This also changes the baseline case name/status, so no identity inferred. Under addendum split-validation failure path, mark harness failed and retain unsplit raw JSON; no test retries. Exact diagnostic added to dev-status.json for each release.

## Computed per-release results

| Release | Build | Probe | LLM P/F/load/timeout/other | Dev loaded/passed/failed | Wall seconds |
| --- | --- | --- | --- | --- | --- |
| v4.0.5 | ok | ok | 139/0/0/0/0 | 81/888/0 | 93.175 |
| v4.1.0 | ok | ok | 139/0/0/0/0 | 81/871/17 | 68.867 |
| v4.2.0 | ok | ok | 139/0/0/0/0 | unavailable | 80.02 |
| v4.3.0 | ok | ok | 139/0/0/0/0 | unavailable | 83.589 |
| v4.4.0 | ok | ok | 139/0/0/0/0 | unavailable | 80.071 |
| v4.5.0 | ok | ok | 138/1/0/0/0 | unavailable | 94.381 |
| v4.6.0 | failed | not-run | unavailable | unavailable | 1.877 |

- Analysis script extended with ordered developer failure categories, individual failed-case lists grouped by file, and matched-function cross tables per release. Existing pair-map and unmatched list preserved; prior handover retained with appended Continuation 2. `python3 -B scripts/analyze-survival.py` exit 0; regression checks 3/3 pass.
- Integrity verification (continuation2-checks.json): all dev-attempt1 files byte-identical to 1fd2e532 predecessors; LLM through v4.5.0 untouched; original v4.6.0 build log is a prefix of appended log; prior handover preserved; pair-map unchanged; exported source/config/lockfiles match tags; all frozen test copies still match snapshot; matrices 139/888/54 rows. v4.1.0 failures: 12 snapshot candidates and 5 assertions.

## Continuation 2 finalization

- Cleanup Docker command: readlink wrapper = ../../../../../packages/zod; Node package probe = 4.0.5; scratch-absent; du -sh /work/zod-versions = 2.3G; exit 0.
- Stage only experiments/ work and explicitly force-add v4.6.0/build.log (global *.log ignore). Preserve raw output whitespace. Commit with prescribed subject and Codex trailer, push experiment branch, verify final synchronization. No report or archive branch.

## Continuation 3 (addendum 3)

Read supplied addendum and Continuation 2 handover; branch synchronized at 98ef551e, only pre-existing Claude outputs/ untracked. D-21 replaces duration/name filtering with meta.typecheck only in runner and summarizer. Added --input to summarize preserved unsplit controls without rewriting raw JSON. json.test.ts baseline identity is already <anonymous>, occurrence 1; later todo status is retained as skipped, a runner reporting difference for an assertion-free case. No previous test runs will be repeated.
- `python3 -B experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.0.5 --out experiments/testpilot-2026-09/results/survival/v4.0.5 --input experiments/testpilot-2026-09/results/survival/v4.0.5/dev-run-unsplit.json`: exit 0; {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 888, "failed": 0, "skipped": 0}; expected counts and 888 baseline identity triples verified. Original attempts retained; no test execution.
- `python3 -B experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.1.0 --out experiments/testpilot-2026-09/results/survival/v4.1.0 --input experiments/testpilot-2026-09/results/survival/v4.1.0/dev-run-unsplit.json`: exit 0; {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 871, "failed": 17, "skipped": 0}; expected counts and 888 baseline identity triples verified. Original attempts retained; no test execution.
- `python3 -B experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.2.0 --out experiments/testpilot-2026-09/results/survival/v4.2.0`: exit 0; {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 868, "failed": 19, "skipped": 1}; expected counts and 888 baseline identity triples verified. Original attempts retained; no test execution.
- `python3 -B experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.3.0 --out experiments/testpilot-2026-09/results/survival/v4.3.0`: exit 0; {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 864, "failed": 23, "skipped": 1}; expected counts and 888 baseline identity triples verified. Original attempts retained; no test execution.
- `python3 -B experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.4.0 --out experiments/testpilot-2026-09/results/survival/v4.4.0`: exit 0; {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 853, "failed": 34, "skipped": 1}; expected counts and 888 baseline identity triples verified. Original attempts retained; no test execution.
- `python3 -B experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.5.0 --out experiments/testpilot-2026-09/results/survival/v4.5.0`: exit 0; {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 838, "failed": 49, "skipped": 1}; expected counts and 888 baseline identity triples verified. Original attempts retained; no test execution.
- D-22: added export-only pnpm-workspace.yaml mirroring workspaces ["packages/*"]. Resolve dependencies afresh; record resolved lockfile and versions.
- v4.6.0 HUSKY=0 COREPACK_ENABLE_PROJECT_SPEC=0 `pnpm install --no-frozen-lockfile`: exit 1; appended build.log.
- Installation failed; exact error retained for fallback assessment. No automatic unrelated retry.
- environment `node --version`: exit 0; v22.23.2
- environment `pnpm --version`: exit 0; 10.12.1

- `docker compose run --rm tp python3 .../scripts/build-survival-v460-addendum3.py`: added exact workspace pattern ["packages/*"], resolved dependencies and installed package links, then install exit 1: `packages/docs postinstall: sh: 1: nub: not found`, `ELIFECYCLE Command failed`. Full output appended to build.log. D-23 not applicable: missing executable, not a pnpm feature incompatibility. No build or test run attempted for v4.6.0; stop that branch under the no-fallback rule.
- Recorded installed package versions despite incomplete lifecycle: vitest 4.1.5, typescript 5.5.4, zshy 0.8.0, @biomejs/biome 1.9.4; Node v22.23.2, pnpm 10.12.1. Newly resolved pnpm-lock.yaml copied to pnpm-lock.resolved.yaml. This differs from the addendum's Vitest 5 expectation; actual package metadata retained.

## Computed per-release results

| Release | Build | Probe | LLM P/F/load/timeout/other | Dev loaded/passed/failed/skipped | Wall seconds |
| --- | --- | --- | --- | --- | --- |
| v4.0.5 | ok | ok | 139/0/0/0/0 | 81/888/0/0 | 93.175 |
| v4.1.0 | ok | ok | 139/0/0/0/0 | 81/871/17/0 | 68.867 |
| v4.2.0 | ok | ok | 139/0/0/0/0 | 81/868/19/1 | 80.02 |
| v4.3.0 | ok | ok | 139/0/0/0/0 | 81/864/23/1 | 83.589 |
| v4.4.0 | ok | ok | 139/0/0/0/0 | 81/853/34/1 | 80.071 |
| v4.5.0 | ok | ok | 138/1/0/0/0 | 81/838/49/1 | 94.381 |
| v4.6.0 | failed | not-run | unavailable | unavailable | 44.327 |

- `python3 -B scripts/test-survival-analysis.py`: all four regression checks pass, including meta-only split retaining a duration-less todo and todo-neutral first-break/rebound behavior. `python3 -B scripts/analyze-survival.py`: exit 0; regenerated tables/matrices with skipped totals and appended Continuation 3 handover.
- Artifact audit (continuation3-checks.json): raw test artifacts and original attempts unchanged; control summaries unchanged; all 888 developer identities retained, json.test.ts has no first break; pair-map and earlier handover preserved; original build log retained; copied resolved lockfile matches export; source/config files unchanged except the authorized v4.6.0 lockfile resolution and workspace addition.

## Continuation 3 finalization

- Final cleanup Docker command: original wrapper target ../../../../../packages/zod; package probe 4.0.5; scratch-absent; export size 2.3G; exit 0.
- CSV validation: 888 developer cases / 139 LLM tests / 54 function pairs, each row matches its header, including new skipped columns.
- Stage experiments/ files only, force-add v4.6.0/build.log, commit with prescribed subject and Codex attribution, push and confirm status. No report or archive branch. v4.6.0 remains blocked by missing nub in install lifecycle, not represented as test failure.

## Continuation 4 (addendum 4)

Read addendum and Continuation 3 handover. Branch synchronized at 0cfc947d; only pre-existing Claude outputs/ untracked. Earlier developer/LLM results are complete through v4.5.0 and untouched. D-24 disables lifecycle scripts; D-25 runs the underlying zshy build directly, with no postbuild stub writer or formatting. No nub installation, model calls or credentials read.
- `docker compose run --rm tp python3 .../scripts/build-survival-v460-addendum4.py`: command outcomes follow.
- v4.6.0 HUSKY=0 COREPACK_ENABLE_PROJECT_SPEC=0 cwd `/work/zod-versions/v4.6.0` `pnpm install --no-frozen-lockfile --ignore-scripts`: exit 0; appended build.log.
- v4.6.0 HUSKY=0 COREPACK_ENABLE_PROJECT_SPEC=0 cwd `/work/zod-versions/v4.6.0/packages/zod` `npx --no-install zshy --project tsconfig.build.json`: exit 0; appended build.log.
- Resolved lockfile comparison: identical to addendum 3 resolution.
- environment `npx --no-install zshy --version`: exit 1; »  ❌ unknown or unexpected option: --version
Use --help for usage information
- environment `node --version`: exit 0; v22.23.2
- environment `pnpm --version`: exit 0; 10.12.1
- v4.6.0 HUSKY=0 COREPACK_ENABLE_PROJECT_SPEC=0 cwd `/work/zod-versions/v4.6.0/packages/zod` `node -e console.log(require('./package.json').exports['.']); const z=require('./index.cjs'); console.log(typeof z.z, typeof z.z.string, require('./package.json').version)`: exit 0; appended build.log.
- v4.6.0: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.6.0: developer command from repository root with explicit project; fallback order per addendum.
- v4.6.0: cwd `/work/zod-versions/v4.6.0` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.6.0/dev-run.json` -> exit 1, 12.337s; appended dev-stdout.txt.
- D-21 v4.6.0: runtime entries exclude only those with any assertion meta.typecheck=true; 81 runtime entries; raw JSON unchanged.
- v4.6.0: `python3 /work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.6.0 --out /work/zod/experiments/testpilot-2026-09/results/survival/v4.6.0` -> exit 0; v4.6.0 {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 834, "failed": 53, "skipped": 1}
- cwd `/work/zod/experiments/testpilot-2026-09` `python3 scripts/run-survival-dev.py --release v4.6.0` -> exit 0, 12.560s; {"release": "v4.6.0", "harness": "ok", "fallbackUsed": 0, "attempts": [{"command": "npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.6.0/dev-run.json", "cwd": "/work/zod-versions/v4.6.0", "fallback": 0, "exitCode": 1, "wallSeconds": 12.337490172999999}], "command": "npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival/v4.6.0/dev-run.json", "cwd": "/work/zod-versions/v4.6.0", "vitestExitCode": 1, "typecheckFlagAccepted": true, "runtimeSplit": "meta.typecheck", "typecheckFlagEffective": false, "wallSeconds": 12.496082797}
- Wrapper original target: ../../../../../packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod` `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.066s; 4.6.0 object function
- cwd `/work/zod/experiments/testpilot-2026-09` `python3 scripts/run-survival-llm.py --release v4.6.0 --out results/survival/v4.6.0` -> exit 0, 30.070s; v4.6.0 pass=138 / fail=1 / load-error=0 / timeout=0 / other=0 wall=30.036s
- v4.6.0 LLM: 139 entries, 278 raw files verified.
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod` `node -e console.log(require('zod/package.json').version)` -> exit 0, 0.017s; 4.0.5
- Original wrapper restored, 4.0.5 probe verified, scratch absent.

## Computed per-release results

| Release | Build | Probe | LLM P/F/load/timeout/other | Dev loaded/passed/failed/skipped | Wall seconds |
| --- | --- | --- | --- | --- | --- |
| v4.0.5 | ok | ok | 139/0/0/0/0 | 81/888/0/0 | 93.175 |
| v4.1.0 | ok | ok | 139/0/0/0/0 | 81/871/17/0 | 68.867 |
| v4.2.0 | ok | ok | 139/0/0/0/0 | 81/868/19/1 | 80.02 |
| v4.3.0 | ok | ok | 139/0/0/0/0 | 81/864/23/1 | 83.589 |
| v4.4.0 | ok | ok | 139/0/0/0/0 | 81/853/34/1 | 80.071 |
| v4.5.0 | ok | ok | 138/1/0/0/0 | 81/838/49/1 | 94.381 |
| v4.6.0 | ok | ok | 138/1/0/0/0 | 81/834/53/1 | 50.918 |

- `python3 -B scripts/test-survival-analysis.py`: all 4 checks pass. `python3 -B scripts/analyze-survival.py`: exit 0; regenerated full release table, developer categories and second-pass candidates including v4.6.0; appended Continuation 4 without changing prior sections.
- zshy does not implement --version (environment inspection printed unknown option); its version was confirmed by reading node_modules/zshy/package.json in Docker and appended to env.txt: 0.8.0. Build runner updated to use package metadata for this inspection. No extra build or tests executed.
- Final artifact validation (continuation4-checks.json): earlier-release artifacts unchanged; 139 LLM rows/278 raw files match frozen manifest and Mocha output; 81 dev files/888 case identities match baseline; 834 passed/53 failed/1 skipped; resolved lock identical to D-22; frozen tests and release source/config/package manifests unchanged; prior handover/log content preserved.

## Continuation 4 finalization

- Cleanup Docker probe: wrapper target ../../../../../packages/zod; version 4.0.5; scratch-absent; du -sh /work/zod-versions = 2.3G; exit 0. All seven release time points now have validated LLM and developer results.
- Stage experiments/ work only, force-add v4.6.0/build.log, preserve raw-output whitespace; commit with prescribed subject and Codex trailer, push experiment branch and verify synchronization. No report or archive branch.
