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
