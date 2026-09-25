# Stage S (n124) command log

Instruction: `Claude outputs/testpilot-zod-n124-cc-instructions-stage-s-2026-09-week4.md`. Runs the n124 passing set unchanged at seven releases, next to the frozen v4.0.5 developer tests, reusing last week's release trees. No model calls. Read first: `docs/handover-stage-g-n124.md`, `docs/handover-stage-s.md`, and the Stage S scripts. Commands run from `$ROOT/zod-testpilot` unless they `cd`; `$ROOT=/Users/donggi/_projects/experiment-projects`. `docker/.env` is never read.

Authoritative generation result, per the Stage G handover: not a single run but the union `gen-n124-run2` (109 functions) + `gen-n124-tail` (15 functions). The passing list is `results/gen-n124-passing.json` (entries `{run, testName, api, testFile}`; file at `results/<run>/tests/<testFile>`). The instruction expected one run (RUN) with passing list `gen-n124-run2-passing.json` and distinct basenames; it also says to use the names the handover gives. Below, RUN = {gen-n124-run2, gen-n124-tail} and S124 = `results/gen-n124-passing.json`, with test identity `(run, testFile)` (D-31).

## 2026-09-25T03:17:55Z

```sh
git status -sb; git config --get core.hooksPath
git -C $ROOT/testpilot2 log -1 --format="%h %s"; git -C $ROOT/testpilot2 status -sb | head -1
ls $ROOT/zod-versions
cd experiments/testpilot-2026-09
python3 - <<'PY'
import json,collections
from pathlib import Path
S=json.load(open("results/gen-n124-passing.json"))
print("S124 entries:",len(S),"by run:",dict(collections.Counter(e["run"] for e in S)))
print("every testFile exists under results/<run>/tests/ (by basename):",all(Path("results",e["run"],"tests",Path(e["testFile"]).name).is_file() for e in S))
for r in sorted({e["run"] for e in S}):
    b=[Path(e["testFile"]).name for e in S if e["run"]==r]; print(f"  basenames distinct within {r}:",len(set(b))==len(b))
b=[Path(e["testFile"]).name for e in S]; pairs={(e["run"],Path(e["testFile"]).name) for e in S}
print("basenames distinct across the whole list:",len(set(b))==len(b),"| repeated basenames:",sorted(k for k,v in collections.Counter(b).items() if v>1))
print("(run, basename) pairs distinct:",len(pairs)==len(S))
print("testName == testFile basename for every entry:",all(e["testName"]==Path(e["testFile"]).name for e in S))
PY
ls -A wrappers/zod; readlink wrappers/zod/node_modules/zod; test -L wrappers/zod/node_modules/zod && echo IS_SYMLINK
```

```text
## experiment/2026-09-week4-testpilot-zod...origin/experiment/2026-09-week4-testpilot-zod
?? "Claude outputs/"
?? experiments/testpilot-2026-09/docs/log-stage-s-n124.md
/dev/null
2c0581c Treat a null completion from the API as an empty completion
## experiment/2026-09-week3-zod...origin/experiment/2026-09-week3-zod
frozen-v4.0.5-tests
v4.0.5
v4.1.0
v4.2.0
v4.3.0
v4.4.0
v4.5.0
v4.6.0
S124 entries: 266 by run: {'gen-n124-run2': 241, 'gen-n124-tail': 25}
every testFile exists under results/<run>/tests/ (by basename): True
  basenames distinct within gen-n124-run2: True
  basenames distinct within gen-n124-tail: True
basenames distinct across the whole list: False | repeated basenames: ['test_27.js', 'test_44.js', 'test_47.js', 'test_50.js', 'test_55.js', 'test_63.js', 'test_84.js']
(run, basename) pairs distinct: True
testName == testFile basename for every entry: True
index.js
node_modules
package.json
../../../../../packages/zod
IS_SYMLINK
```
Exit: 0; wall seconds: 0.211

## 2026-09-25T03:18:23Z

```sh
cd experiments/testpilot-2026-09/results
test ! -e survival-n124 && echo OUT_ROOT_ABSENT
grep -oE "D/t/.[a-z-]+\.(json|txt)|D/.[a-z-]+\.json|v4.6.0/[a-z-]+\.json" ../scripts/analyze-survival.py | sort -u
mkdir survival-n124 && cp -p survival/tags.json survival-n124/
for t in $(python3 -c "import json;print(\" \".join(r[\"tag\"] for r in json.load(open(\"survival/tags.json\"))))"); do
  mkdir survival-n124/$t
  for f in build-status.json build.log env.txt devtest-diff.txt; do cp -p survival/$t/$f survival-n124/$t/$f; done
done
echo "Copied (byte-for-byte copies of last week release metadata, not new results):"
find survival-n124 -type f | sort
for f in $(cd survival-n124 && find . -type f); do cmp -s survival-n124/$f survival/$f || echo "DIFF $f"; done; echo "all copies byte-identical to results/survival/"
git -C ../../.. tag -l "v4.*" | tr "\n" " "
```

```text
OUT_ROOT_ABSENT
D/'tags.json
D/t/'build-status.json
D/t/'dev-cases.json
D/t/'dev-status.json
D/t/'dev-summary.json
D/t/'devtest-diff.txt
D/t/'llm-results.json
D/t/'llm-summary.json
v4.6.0/build-status.json
v4.6.0/dev-status.json
v4.6.0/dev-summary.json
v4.6.0/llm-summary.json
Copied (byte-for-byte copies of last week release metadata, not new results):
survival-n124/tags.json
survival-n124/v4.0.5/build-status.json
survival-n124/v4.0.5/build.log
survival-n124/v4.0.5/devtest-diff.txt
survival-n124/v4.0.5/env.txt
survival-n124/v4.1.0/build-status.json
survival-n124/v4.1.0/build.log
survival-n124/v4.1.0/devtest-diff.txt
survival-n124/v4.1.0/env.txt
survival-n124/v4.2.0/build-status.json
survival-n124/v4.2.0/build.log
survival-n124/v4.2.0/devtest-diff.txt
survival-n124/v4.2.0/env.txt
survival-n124/v4.3.0/build-status.json
survival-n124/v4.3.0/build.log
survival-n124/v4.3.0/devtest-diff.txt
survival-n124/v4.3.0/env.txt
survival-n124/v4.4.0/build-status.json
survival-n124/v4.4.0/build.log
survival-n124/v4.4.0/devtest-diff.txt
survival-n124/v4.4.0/env.txt
survival-n124/v4.5.0/build-status.json
survival-n124/v4.5.0/build.log
survival-n124/v4.5.0/devtest-diff.txt
survival-n124/v4.5.0/env.txt
survival-n124/v4.6.0/build-status.json
survival-n124/v4.6.0/build.log
survival-n124/v4.6.0/devtest-diff.txt
survival-n124/v4.6.0/env.txt
all copies byte-identical to results/survival/
v4.0.0-beta v4.0.1 v4.0.10 v4.0.11 v4.0.12 v4.0.13 v4.0.14 v4.0.15 v4.0.16 v4.0.17 v4.0.3 v4.0.4 v4.0.5 v4.0.6 v4.0.7 v4.0.8 v4.0.9 v4.1.0 v4.1.1 v4.1.10 v4.1.11 v4.1.12 v4.1.13 v4.1.2 v4.1.3 v4.1.4 v4.1.5 v4.1.7 v4.1.8 v4.1.9 v4.2.0 v4.2.1 v4.3.0 v4.3.1 v4.3.2 v4.3.3 v4.3.4 v4.3.5 v4.3.6 v4.4.0 v4.4.1 v4.4.2 v4.4.3 v4.5.0 v4.5.1 v4.5.2 v4.5.3 v4.5.4 v4.6.0 v4.6.1 v4.6.2 v4.6.3 v4.6.4 v4.6.5 
```
Exit: 0; wall seconds: 0.243

## 2026-09-25T03:18:31Z

```sh
cd experiments/testpilot-2026-09
python3 scripts/check-release-trees-n124.py
python3 -c "
import json
a={r[\"release\"]:r[\"checkedFiles\"] for r in json.load(open(\"results/survival/source-integrity.json\"))}
b={r[\"release\"]:r[\"checkedFiles\"] for r in json.load(open(\"results/survival-n124/source-integrity.json\"))}
print(\"checkedFiles equal to last week per tag:\",a==b, a if a!=b else \"\")"
rm -rf scripts/__pycache__
```

```text
v4.0.5 checked 101 changed 0 missing 0 extra 0 index.cjs True 2a3455cecff4f7021c92d0a3e2e5fc170c0448dc5cc261160127e08f4888a9c2 tests files 81 == frozen True
v4.1.0 checked 104 changed 0 missing 0 extra 0 index.cjs True 2a3455cecff4f7021c92d0a3e2e5fc170c0448dc5cc261160127e08f4888a9c2 tests files 81 == frozen True
v4.2.0 checked 111 changed 0 missing 0 extra 0 index.cjs True 2a3455cecff4f7021c92d0a3e2e5fc170c0448dc5cc261160127e08f4888a9c2 tests files 81 == frozen True
v4.3.0 checked 113 changed 0 missing 0 extra 0 index.cjs True 2a3455cecff4f7021c92d0a3e2e5fc170c0448dc5cc261160127e08f4888a9c2 tests files 81 == frozen True
v4.4.0 checked 116 changed 0 missing 0 extra 0 index.cjs True 2a3455cecff4f7021c92d0a3e2e5fc170c0448dc5cc261160127e08f4888a9c2 tests files 81 == frozen True
v4.5.0 checked 133 changed 0 missing 0 extra 0 index.cjs True 9215109ec960156cd1417c8fb61b9d34d7fc534b03a6eba183b3aa4a133d8e85 tests files 81 == frozen True
v4.6.0 checked 133 changed 0 missing 0 extra 0 index.cjs True d93a8730d52c0fedab13619c8bc971cc99934c13d8dce7c97ee4d03a98d4096e tests files 81 == frozen True
frozen snapshot files: 81
INTEGRITY_OK
checkedFiles equal to last week per tag: False {'v4.0.5': 107, 'v4.1.0': 111, 'v4.2.0': 117, 'v4.3.0': 119, 'v4.4.0': 122, 'v4.5.0': 141, 'v4.6.0': 142}
```
Exit: 0; wall seconds: 0.444

Integrity scope note: this instruction limits the source check to `packages/zod/src/` outside `tests/` directories. Per `docs/log-stage-s.md` line 125, last week's check also covered the vitest configuration, root `package.json` and `pnpm-lock.yaml`. So `checkedFiles` is lower here (e.g. v4.0.5 101 vs 107). Every file in scope is identical; none is missing or extra.

## 2026-09-25T03:19:49Z

```sh
cd experiments/testpilot-2026-09
echo "Step 1.2 regression check (defaults; handover/log side outputs redirected to scratch copies so last week docs stay read-only, D-32)"
cp docs/handover-stage-s.md /private/tmp/claude-501/-Users-donggi--projects-experiment-projects-zod-testpilot/17af9af1-0286-47cb-80f8-8471fc718738/scratchpad/reg-handover.md; cp docs/log-stage-s.md /private/tmp/claude-501/-Users-donggi--projects-experiment-projects-zod-testpilot/17af9af1-0286-47cb-80f8-8471fc718738/scratchpad/reg-log.md
python3 scripts/analyze-survival.py --handover /private/tmp/claude-501/-Users-donggi--projects-experiment-projects-zod-testpilot/17af9af1-0286-47cb-80f8-8471fc718738/scratchpad/reg-handover.md --log /private/tmp/claude-501/-Users-donggi--projects-experiment-projects-zod-testpilot/17af9af1-0286-47cb-80f8-8471fc718738/scratchpad/reg-log.md > /dev/null && echo ANALYZE_DEFAULTS_OK
rm -rf scripts/__pycache__
git diff --exit-code --stat results/ && echo "RESULTS_NO_CHANGE (git diff --exit-code results/)"
git status --porcelain results/ | grep -v "survival-n124" || echo "no untracked/changed result paths besides survival-n124/"
git diff --exit-code --stat docs/handover-stage-s.md docs/log-stage-s.md && echo "LAST_WEEK_DOCS_UNTOUCHED"
cmp docs/handover-stage-s.md /private/tmp/claude-501/-Users-donggi--projects-experiment-projects-zod-testpilot/17af9af1-0286-47cb-80f8-8471fc718738/scratchpad/reg-handover.md && echo "HANDOVER_REGENERATED_BYTE_IDENTICAL"
python3 - <<'PY'
a=open("docs/log-stage-s.md").read(); b=open("/private/tmp/claude-501/-Users-donggi--projects-experiment-projects-zod-testpilot/17af9af1-0286-47cb-80f8-8471fc718738/scratchpad/reg-log.md").read()
assert b.startswith(a); new=b[len(a):]; last=a[a.rindex("\n## Computed per-release results\n"):]
print("appended log table identical to the last computed table in log-stage-s.md:", new==last or new.strip()==last.strip())
PY
```

```text
Step 1.2 regression check (defaults; handover/log side outputs redirected to scratch copies so last week docs stay read-only, D-32)
ANALYZE_DEFAULTS_OK
RESULTS_NO_CHANGE (git diff --exit-code results/)
no untracked/changed result paths besides survival-n124/
LAST_WEEK_DOCS_UNTOUCHED
HANDOVER_REGENERATED_BYTE_IDENTICAL
appended log table identical to the last computed table in log-stage-s.md: False
```
Exit: 0; wall seconds: 0.255

Correction to the last line above: `docs/log-stage-s.md` has six "Computed per-release results" tables, and the last one is followed by further notes. So comparing everything after it with the appended text was the wrong test. Compared table to table, the appended table is character-identical to last week's last table (all seven rows, including wall seconds). Regression check passed: `results/` unchanged; handover regenerated byte-identical; log table identical; last week's docs not touched.

## 2026-09-25T03:20:15Z

```sh
cd experiments/testpilot-2026-09
python3 -B scripts/test-survival-analysis.py 2>&1 | tail -3
git status --porcelain results/survival docs/handover-stage-s.md docs/log-stage-s.md results/pair-map.json | head; echo "(empty above = read-only paths untouched)"
```

```text
Ran 4 tests in 0.131s

OK
(empty above = read-only paths untouched)
```
Exit: 0; wall seconds: 0.236

## Step 2 driver run (replay-survival-n124.py)

- |S124| = 266; raw files expected per release: 532; control allowance: ceil(1% of 266) = 3 non-passes.
- v4.0.5: wrapper symlink -> /work/zod-versions/v4.0.5/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.184s; `results/survival-n124/v4.0.5/llm-probe.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.0.5 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.0.5 --passing results/gen-n124-passing.json --tests results/gen-n124-run2/tests` -> exit 0, 55.292s; v4.0.5 pass=266 / fail=0 / load-error=0 / timeout=0 / other=0 wall=55.229s
- v4.0.5: scratch absent; 532 raw files confirmed.
- LLM control non-passes (flaky at t, 0 of allowed 3): []
- v4.1.0: wrapper symlink -> /work/zod-versions/v4.1.0/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.056s; `results/survival-n124/v4.1.0/llm-probe.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.1.0 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.1.0 --passing results/gen-n124-passing.json --tests results/gen-n124-run2/tests` -> exit 0, 61.243s; v4.1.0 pass=265 / fail=1 / load-error=0 / timeout=0 / other=0 wall=61.172s
- v4.1.0: scratch absent; 532 raw files confirmed.
- v4.2.0: wrapper symlink -> /work/zod-versions/v4.2.0/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.062s; `results/survival-n124/v4.2.0/llm-probe.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.2.0 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.2.0 --passing results/gen-n124-passing.json --tests results/gen-n124-run2/tests` -> exit 0, 67.989s; v4.2.0 pass=266 / fail=0 / load-error=0 / timeout=0 / other=0 wall=67.918s
- v4.2.0: scratch absent; 532 raw files confirmed.
- v4.3.0: wrapper symlink -> /work/zod-versions/v4.3.0/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.059s; `results/survival-n124/v4.3.0/llm-probe.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.3.0 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.3.0 --passing results/gen-n124-passing.json --tests results/gen-n124-run2/tests` -> exit 0, 68.790s; v4.3.0 pass=263 / fail=3 / load-error=0 / timeout=0 / other=0 wall=68.722s
- v4.3.0: scratch absent; 532 raw files confirmed.
- v4.4.0: wrapper symlink -> /work/zod-versions/v4.4.0/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.082s; `results/survival-n124/v4.4.0/llm-probe.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.4.0 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.4.0 --passing results/gen-n124-passing.json --tests results/gen-n124-run2/tests` -> exit 0, 57.958s; v4.4.0 pass=263 / fail=3 / load-error=0 / timeout=0 / other=0 wall=57.896s
- v4.4.0: scratch absent; 532 raw files confirmed.
- v4.5.0: wrapper symlink -> /work/zod-versions/v4.5.0/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.074s; `results/survival-n124/v4.5.0/llm-probe.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.5.0 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.5.0 --passing results/gen-n124-passing.json --tests results/gen-n124-run2/tests` -> exit 0, 53.323s; v4.5.0 pass=261 / fail=5 / load-error=0 / timeout=0 / other=0 wall=53.264s
- v4.5.0: scratch absent; 532 raw files confirmed.
- v4.6.0: wrapper symlink -> /work/zod-versions/v4.6.0/packages/zod
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.073s; `results/survival-n124/v4.6.0/llm-probe.txt`
- cwd `/work/zod/experiments/testpilot-2026-09`: `python3 scripts/run-survival-llm.py --release v4.6.0 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.6.0 --passing results/gen-n124-passing.json --tests results/gen-n124-run2/tests` -> exit 0, 58.706s; v4.6.0 pass=258 / fail=8 / load-error=0 / timeout=0 / other=0 wall=58.651s
- v4.6.0: scratch absent; 532 raw files confirmed.
- cwd `/work/zod/experiments/testpilot-2026-09/wrappers/zod`: `node -e const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)` -> exit 0, 0.055s; 4.0.5 object function
- Original wrapper target restored and verified (4.0.5 object function); no test-s. Driver wall 423.994s.

## 2026-09-25T03:27:57Z

```sh
cd $ROOT/zod-testpilot/experiments/testpilot-2026-09/docker
docker compose run --rm -T tp python3 /work/zod/experiments/testpilot-2026-09/scripts/replay-survival-n124.py 2>&1 | grep -v -e orphan -e "Container docker-tp-run"; exit ${PIPESTATUS[0]}
```

```text
v4.0.5 pass=266 / fail=0 / load-error=0 / timeout=0 / other=0 wall=55.229s

v4.1.0 pass=265 / fail=1 / load-error=0 / timeout=0 / other=0 wall=61.172s

v4.2.0 pass=266 / fail=0 / load-error=0 / timeout=0 / other=0 wall=67.918s

v4.3.0 pass=263 / fail=3 / load-error=0 / timeout=0 / other=0 wall=68.722s

v4.4.0 pass=263 / fail=3 / load-error=0 / timeout=0 / other=0 wall=57.896s

v4.5.0 pass=261 / fail=5 / load-error=0 / timeout=0 / other=0 wall=53.264s

v4.6.0 pass=258 / fail=8 / load-error=0 / timeout=0 / other=0 wall=58.651s
```
Exit: 0; wall seconds: 427.059

## 2026-09-25T03:28:14Z

```sh
cd experiments/testpilot-2026-09
git status --porcelain | grep -E "results/survival/|results/survival-[a-z]+\.(md|csv)|results/pair-map.json|docs/log-stage-s.md|docs/handover-stage-s.md" || echo "read-only paths untouched"
ls -A wrappers/zod; readlink wrappers/zod/node_modules/zod
echo "Step 3 pre-check: first command run-survival-dev.py will try (primary, fallback 0) vs last week dev-status.json"
python3 - <<'PY'
import json
tags=[r["tag"] for r in json.load(open("results/survival-n124/tags.json"))]
for t in tags:
    out=f"/work/zod/experiments/testpilot-2026-09/results/survival-n124/{t}"
    primary=" ".join(["npx","vitest","run","--project","zod","packages/zod/src/v4","--typecheck.enabled=false","--reporter=default","--reporter=json","--outputFile.json="+out+"/dev-run.json"])
    s=json.load(open(f"results/survival/{t}/dev-status.json"))
    same=primary.replace("/survival-n124/","/survival/")==s["command"]
    print(t,"cwd",f"/work/zod-versions/{t}"==s["cwd"],"| command identical except output path:",same,"| last week fallbackUsed:",s["fallbackUsed"])
PY
```

```text
read-only paths untouched
index.js
node_modules
package.json
../../../../../packages/zod
Step 3 pre-check: first command run-survival-dev.py will try (primary, fallback 0) vs last week dev-status.json
v4.0.5 cwd True | command identical except output path: True | last week fallbackUsed: 0
v4.1.0 cwd True | command identical except output path: True | last week fallbackUsed: 0
v4.2.0 cwd True | command identical except output path: True | last week fallbackUsed: 0
v4.3.0 cwd True | command identical except output path: True | last week fallbackUsed: 0
v4.4.0 cwd True | command identical except output path: True | last week fallbackUsed: 0
v4.5.0 cwd True | command identical except output path: True | last week fallbackUsed: 0
v4.6.0 cwd True | command identical except output path: True | last week fallbackUsed: 0
```
Exit: 0; wall seconds: 0.084

## Step 3: developer corpus (run-survival-dev.py lines below are written by the script itself)
- v4.0.5: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.0.5: developer command from repository root with explicit project; fallback order per addendum.
- v4.0.5: cwd `/work/zod-versions/v4.0.5` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.0.5/dev-run.json` -> exit 0, 8.038s; appended dev-stdout.txt.
- D-21 v4.0.5: runtime entries exclude only those with any assertion meta.typecheck=true; 81 runtime entries; raw JSON unchanged.
- v4.0.5: `python3 /work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.0.5 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.0.5 --out-root results/survival-n124` -> exit 0; v4.0.5 {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 888, "failed": 0, "skipped": 0}
- v4.0.5 gate passed: 81 files / 888 cases / 888 passed.
- v4.1.0: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.1.0: developer command from repository root with explicit project; fallback order per addendum.
- v4.1.0: cwd `/work/zod-versions/v4.1.0` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.1.0/dev-run.json` -> exit 1, 9.944s; appended dev-stdout.txt.
- D-21 v4.1.0: runtime entries exclude only those with any assertion meta.typecheck=true; 81 runtime entries; raw JSON unchanged.
- v4.1.0: `python3 /work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.1.0 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.1.0 --out-root results/survival-n124` -> exit 0; v4.1.0 {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 871, "failed": 17, "skipped": 0}
- v4.2.0: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.2.0: developer command from repository root with explicit project; fallback order per addendum.
- v4.2.0: cwd `/work/zod-versions/v4.2.0` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.2.0/dev-run.json` -> exit 1, 8.654s; appended dev-stdout.txt.
- D-21 v4.2.0: runtime entries exclude only those with any assertion meta.typecheck=true; 81 runtime entries; raw JSON unchanged.
- v4.2.0: `python3 /work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.2.0 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.2.0 --out-root results/survival-n124` -> exit 0; v4.2.0 {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 868, "failed": 19, "skipped": 1}
- v4.3.0: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.3.0: developer command from repository root with explicit project; fallback order per addendum.
- v4.3.0: cwd `/work/zod-versions/v4.3.0` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.3.0/dev-run.json` -> exit 1, 8.784s; appended dev-stdout.txt.
- D-21 v4.3.0: runtime entries exclude only those with any assertion meta.typecheck=true; 81 runtime entries; raw JSON unchanged.
- v4.3.0: `python3 /work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.3.0 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.3.0 --out-root results/survival-n124` -> exit 0; v4.3.0 {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 864, "failed": 23, "skipped": 1}
- v4.4.0: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.4.0: developer command from repository root with explicit project; fallback order per addendum.
- v4.4.0: cwd `/work/zod-versions/v4.4.0` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.4.0/dev-run.json` -> exit 1, 8.614s; appended dev-stdout.txt.
- D-21 v4.4.0: runtime entries exclude only those with any assertion meta.typecheck=true; 81 runtime entries; raw JSON unchanged.
- v4.4.0: `python3 /work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.4.0 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.4.0 --out-root results/survival-n124` -> exit 0; v4.4.0 {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 853, "failed": 34, "skipped": 1}
- v4.5.0: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.5.0: developer command from repository root with explicit project; fallback order per addendum.
- v4.5.0: cwd `/work/zod-versions/v4.5.0` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.5.0/dev-run.json` -> exit 1, 6.935s; appended dev-stdout.txt.
- D-21 v4.5.0: runtime entries exclude only those with any assertion meta.typecheck=true; 81 runtime entries; raw JSON unchanged.
- v4.5.0: `python3 /work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.5.0 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.5.0 --out-root results/survival-n124` -> exit 0; v4.5.0 {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 838, "failed": 49, "skipped": 1}
- v4.6.0: replace all tests directories from frozen snapshot; SHA256 mapping identical, 81 test files; directory lists recorded.
- D-19 v4.6.0: developer command from repository root with explicit project; fallback order per addendum.
- v4.6.0: cwd `/work/zod-versions/v4.6.0` npm_config_yes=false `npx vitest run --project zod packages/zod/src/v4 --typecheck.enabled=false --reporter=default --reporter=json --outputFile.json=/work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.6.0/dev-run.json` -> exit 1, 9.574s; appended dev-stdout.txt.
- D-21 v4.6.0: runtime entries exclude only those with any assertion meta.typecheck=true; 81 runtime entries; raw JSON unchanged.
- v4.6.0: `python3 /work/zod/experiments/testpilot-2026-09/scripts/summarize-dev-run.py --release v4.6.0 --out /work/zod/experiments/testpilot-2026-09/results/survival-n124/v4.6.0 --out-root results/survival-n124` -> exit 0; v4.6.0 {"files": 81, "files_loaded": 81, "files_load_failed": 0, "cases": 888, "passed": 834, "failed": 53, "skipped": 1}

## 2026-09-25T03:29:26Z

```sh
cd $ROOT/zod-testpilot/experiments/testpilot-2026-09/docker
docker compose run --rm -T tp bash -c "cd /work/zod/experiments/testpilot-2026-09 && set -e && for t in v4.0.5 v4.1.0 v4.2.0 v4.3.0 v4.4.0 v4.5.0 v4.6.0; do python3 scripts/run-survival-dev.py --release \$t --out-root results/survival-n124 --log docs/log-stage-s-n124.md | python3 -c \"import json,sys;d=json.loads(sys.stdin.read());print(d[\\\"release\\\"],d[\\\"harness\\\"],\\\"fallback\\\",d[\\\"fallbackUsed\\\"],\\\"exit\\\",d[\\\"vitestExitCode\\\"],round(d[\\\"wallSeconds\\\"],1),\\\"s\\\")\"; done" 2>&1 | grep -v -e orphan -e "Container docker-tp-run"; exit ${PIPESTATUS[0]}
```

```text
v4.0.5 ok fallback 0 exit 0 8.4 s
v4.1.0 ok fallback 0 exit 1 10.1 s
v4.2.0 ok fallback 0 exit 1 8.8 s
v4.3.0 ok fallback 0 exit 1 8.9 s
v4.4.0 ok fallback 0 exit 1 8.7 s
v4.5.0 ok fallback 0 exit 1 7.1 s
v4.6.0 ok fallback 0 exit 1 9.7 s
```
Exit: 0; wall seconds: 62.82

## 2026-09-25T03:29:41Z

```sh
cd experiments/testpilot-2026-09
grep -c "v4.0.5 gate passed: 81 files / 888 cases / 888 passed" docs/log-stage-s-n124.md
cat results/survival-n124/v4.0.5/dev-summary.json | tr -d "\n "; echo
python3 scripts/compare-dev-week3.py
rm -rf scripts/__pycache__
git status --porcelain | grep -E "results/survival/|results/survival-[a-z]+\.(md|csv)|results/pair-map.json|docs/log-stage-s.md|docs/handover-stage-s.md" || echo "read-only paths untouched"
ls -A wrappers/zod
```

```text
1
{"files":81,"files_loaded":81,"files_load_failed":0,"cases":888,"passed":888,"failed":0,"skipped":0}
v4.0.5 identical 888/888 vs week3 888/888 status diffs 0 message diffs 0 same command True fallback 0
v4.1.0 identical 871/888 vs week3 871/888 status diffs 0 message diffs 0 same command True fallback 0
v4.2.0 identical 868/888 vs week3 868/888 status diffs 0 message diffs 0 same command True fallback 0
v4.3.0 identical 864/888 vs week3 864/888 status diffs 0 message diffs 0 same command True fallback 0
v4.4.0 identical 853/888 vs week3 853/888 status diffs 0 message diffs 0 same command True fallback 0
v4.5.0 identical 838/888 vs week3 838/888 status diffs 0 message diffs 0 same command True fallback 0
v4.6.0 identical 834/888 vs week3 834/888 status diffs 0 message diffs 0 same command True fallback 0
ALL_IDENTICAL
read-only paths untouched
index.js
node_modules
package.json
```
Exit: 0; wall seconds: 0.102

## Computed per-release results

| Release | Build | Probe | LLM P/F/load/timeout/other | Dev loaded/passed/failed/skipped | Wall seconds |
| --- | --- | --- | --- | --- | --- |
| v4.0.5 | ok | ok | 266/0/0/0/0 | 81/888/0/0 | 118.302 |
| v4.1.0 | ok | ok | 265/1/0/0/0 | 81/871/17/0 | 105.22 |
| v4.2.0 | ok | ok | 266/0/0/0/0 | 81/868/19/1 | 116.955 |
| v4.3.0 | ok | ok | 263/3/0/0/0 | 81/864/23/1 | 117.268 |
| v4.4.0 | ok | ok | 263/3/0/0/0 | 81/853/34/1 | 105.136 |
| v4.5.0 | ok | ok | 261/5/0/0/0 | 81/838/49/1 | 113.987 |
| v4.6.0 | ok | ok | 258/8/0/0/0 | 81/834/53/1 | 76.745 |

## 2026-09-25T03:29:51Z

```sh
cd experiments/testpilot-2026-09
echo "Step 4.1 (--handover \"\" skips the Continuation-4 rewrite, which belongs to last week handover; the per-release table goes to this log)"
python3 scripts/analyze-survival.py --survival-root results/survival-n124 --passing results/gen-n124-passing.json --api results/population-main.json --out-prefix results/survival-n124 --handover "" --log docs/log-stage-s-n124.md | python3 -c "import json,sys;d=json.load(sys.stdin);print(\"unmatched functions:\",len(d[\"unmatched\"]),d[\"unmatched\"]);print(\"recorded wall seconds:\",round(d[\"wallSeconds\"],3))"
rm -rf scripts/__pycache__
ls results | grep "^survival-n124"
wc -l results/survival-n124-llm-matrix.csv results/survival-n124-dev-matrix.csv results/survival-n124-pairs.csv
python3 -c "import json;print(\"pair-map functions:\",len(json.load(open(\"results/survival-n124-pair-map.json\"))))"
sed -n "1,40p" results/survival-n124-summary.md
git status --porcelain | grep -E "results/survival/|results/survival-(summary|llm-matrix|dev-matrix|pairs)|results/pair-map.json|docs/log-stage-s.md|docs/handover-stage-s.md" || echo "read-only paths untouched"
```

```text
Step 4.1 (--handover "" skips the Continuation-4 rewrite, which belongs to last week handover; the per-release table goes to this log)
unmatched functions: 73 ['zod.z.iso.time', 'zod.z.iso.duration', 'zod.z.coerce.boolean', 'zod.z.email', 'zod.z.guid', 'zod.z.uuid', 'zod.z.uuidv4', 'zod.z.uuidv6', 'zod.z.uuidv7', 'zod.z.url', 'zod.z.emoji', 'zod.z.nanoid', 'zod.z.cuid', 'zod.z.cuid2', 'zod.z.ulid', 'zod.z.ksuid', 'zod.z.ipv4', 'zod.z.ipv6', 'zod.z.cidrv4', 'zod.z.cidrv6', 'zod.z.base64', 'zod.z.base64url', 'zod.z.e164', 'zod.z.jwt', 'zod.z.int', 'zod.z.float32', 'zod.z.float64', 'zod.z.int32', 'zod.z.uint32', 'zod.z.boolean', 'zod.z.int64', 'zod.z.uint64', 'zod.z.symbol', 'zod.z.undefined', 'zod.z.null', 'zod.z.any', 'zod.z.unknown', 'zod.z.never', 'zod.z.strictObject', 'zod.z.looseObject', 'zod.z.partialRecord', 'zod.z.nativeEnum', 'zod.z.nullish', 'zod.z.success', 'zod.z.superRefine', 'zod.z.lte', 'zod.z.gt', 'zod.z.gte', 'zod.z.positive', 'zod.z.negative', 'zod.z.nonpositive', 'zod.z.multipleOf', 'zod.z.maxSize', 'zod.z.minSize', 'zod.z.size', 'zod.z.maxLength', 'zod.z.length', 'zod.z.regex', 'zod.z.lowercase', 'zod.z.uppercase', 'zod.z.includes', 'zod.z.endsWith', 'zod.z.overwrite', 'zod.z.normalize', 'zod.z.trim', 'zod.z.toLowerCase', 'zod.z.toUpperCase', 'zod.z.parse', 'zod.z.parseAsync', 'zod.z.safeParse', 'zod.z.safeParseAsync', 'zod.z.setErrorMap', 'zod.z.getErrorMap']
recorded wall seconds: 753.613
survival-n124
survival-n124-dev-matrix.csv
survival-n124-llm-matrix.csv
survival-n124-pair-map.json
survival-n124-pairs.csv
survival-n124-summary.md
     306 results/survival-n124-llm-matrix.csv
     889 results/survival-n124-dev-matrix.csv
     113 results/survival-n124-pairs.csv
    1308 total
pair-map functions: 112
# Stage S survival analysis

All tests are frozen at v4.0.5. LLM denominator is 266; developer denominator is 888 runtime cases. Harness failures are unavailable, never test failures. Developer file-load failures inherit the baseline cases as failed. Test-file A/M/D counts describe ignored upstream edits only.

| Tag | Commit | Date | Build | Probe | LLM P/F/load/timeout/other | LLM survival | Dev loaded/passed/failed/skipped | Dev survival | Dev A/M/D |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v4.0.5 | 45afab0f846dffd591362b6f770017507eb185b5 | 2025-07-10 | ok | ok | 266/0/0/0/0 | 266/266 (100.00%) | 81/888/0/0 | 888/888 (100.00%) | 0/0/0 |
| v4.1.0 | 2ca716d6313dcfab425d3555ac8bf85929bc57a4 | 2025-08-23 | ok | ok | 265/1/0/0/0 | 265/266 (99.62%) | 81/871/17/0 | 871/888 (98.09%) | 5/36/0 |
| v4.2.0 | dcef9734f55fc1c8e73795a2be80c60fa7a4a568 | 2025-12-14 | ok | ok | 266/0/0/0/0 | 266/266 (100.00%) | 81/868/19/1 | 868/888 (97.75%) | 16/42/0 |
| v4.3.0 | 1899684fc34d149ebb5d6f9fd95a588e94f27053 | 2025-12-30 | ok | ok | 263/3/0/0/0 | 263/266 (98.87%) | 81/864/23/1 | 864/888 (97.30%) | 20/49/0 |
| v4.4.0 | d05f026e9e6eae0e1e6c2efbf11c89007ca40494 | 2026-04-29 | ok | ok | 263/3/0/0/0 | 263/266 (98.87%) | 81/853/34/1 | 853/888 (96.06%) | 27/51/0 |
| v4.5.0 | 0a69bcb3d9554c6ec382ea9ba6b43c2421f3fa78 | 2026-08-28 | ok | ok | 261/5/0/0/0 | 261/266 (98.12%) | 81/838/49/1 | 838/888 (94.37%) | 49/61/0 |
| v4.6.0 | 1c51cbe0fe23d09f8d520b31487d50a01588fae5 | 2026-09-09 | ok | ok | 258/8/0/0/0 | 258/266 (96.99%) | 81/834/53/1 | 834/888 (93.92%) | 55/62/0 |

## Per stratum

| Stratum | Tests in S | v4.0.5 | v4.1.0 | v4.2.0 | v4.3.0 | v4.4.0 | v4.5.0 | v4.6.0 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S | 172 | 172/172 (100.00%) | 171/172 (99.42%) | 172/172 (100.00%) | 169/172 (98.26%) | 169/172 (98.26%) | 167/172 (97.09%) | 166/172 (96.51%) |
| C | 57 | 57/57 (100.00%) | 57/57 (100.00%) | 57/57 (100.00%) | 57/57 (100.00%) | 57/57 (100.00%) | 57/57 (100.00%) | 56/57 (98.25%) |
| Q | 37 | 37/37 (100.00%) | 37/37 (100.00%) | 37/37 (100.00%) | 37/37 (100.00%) | 37/37 (100.00%) | 37/37 (100.00%) | 36/37 (97.30%) |

## Per function

| Function | Tests in S | v4.1.0 | v4.2.0 | v4.3.0 | v4.4.0 | v4.5.0 | v4.6.0 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| zod.z.iso.datetime | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.iso.date | 3 | 3 | 3 | 3 | 3 | 3 | 2 |
| zod.z.iso.time | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.iso.duration | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.coerce.string | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.coerce.number | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.coerce.boolean | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.coerce.bigint | 4 | 4 | 4 | 4 | 4 | 4 | 4 |
| zod.z.coerce.date | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.stringbool | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.string | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
| zod.z.email | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
| zod.z.guid | 2 | 2 | 2 | 2 | 2 | 2 | 2 |
| zod.z.uuid | 1 | 1 | 1 | 1 | 1 | 1 | 1 |
read-only paths untouched
```
Exit: 0; wall seconds: 0.25

## 2026-09-25T03:30:06Z

```sh
cd experiments/testpilot-2026-09
echo "LLM matrix: 266 CSV rows (306 physical lines; error messages span lines, as in last week 139 rows / 146 lines)."
python3 scripts/compare-survival-runs.py
sed -n "/## Release table/,/^$/p" results/survival-n124-vs-n60.md; sed -n "/## Release table/,/## The/p" results/survival-n124-vs-n60.md | tail -12
grep -E "First break\b|≠" results/survival-n124-vs-n60.md | grep "≠" | cut -c1-200
sed -n "/## LLM tests that fail/,\$p" results/survival-n124-vs-n60.md
```

```text
LLM matrix: 266 CSV rows (306 physical lines; error messages span lines, as in last week 139 rows / 146 lines).
{"firstBreakDiffers": 10, "failingA": 1, "failingB": 9, "out": "results/survival-n124-vs-n60.md"}
## Release table


| Release | n60 LLM survivors | n124 LLM survivors | n60 dev passed | n124 dev passed |
| --- | ---: | ---: | ---: | ---: |
| v4.0.5 | 139/139 (100.00%) | 266/266 (100.00%) | 888/888 | 888/888 |
| v4.1.0 | 139/139 (100.00%) | 265/266 (99.62%) | 871/888 | 871/888 |
| v4.2.0 | 139/139 (100.00%) | 266/266 (100.00%) | 868/888 | 868/888 |
| v4.3.0 | 139/139 (100.00%) | 263/266 (98.87%) | 864/888 | 864/888 |
| v4.4.0 | 139/139 (100.00%) | 263/266 (98.87%) | 853/888 | 853/888 |
| v4.5.0 | 138/139 (99.28%) | 261/266 (98.12%) | 838/888 | 838/888 |
| v4.6.0 | 138/139 (99.28%) | 258/266 (96.99%) | 834/888 | 834/888 |

## The 60 shared functions
Survivors per release (survivors / tests of the function in S). "First break" is the first release at which any of the function's tests does not pass (the control v4.0.5 included). Functions whose fir
| zod.z.file | n124 | – | – | – | – | – | – | – | no tests in S | **≠** |
| zod.z.keyof | n124 | – | – | – | – | – | – | – | no tests in S | **≠** |
| zod.z.ksuid | n124 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | 1/1 | never | **≠** |
| zod.z.lt | n124 | – | – | – | – | – | – | – | no tests in S | **≠** |
| zod.z.maxSize | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never | **≠** |
| zod.z.minLength | n124 | – | – | – | – | – | – | – | no tests in S | **≠** |
| zod.z.number | n124 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | 3/3 | never | **≠** |
| zod.z.parse | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never | **≠** |
| zod.z.size | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never | **≠** |
| zod.z.templateLiteral | n124 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | 2/2 | never | **≠** |
## LLM tests that fail at any release

Every test of either run with a non-pass status at some release. The error line is the first line of the recorded error at the first break.

| Run | Test file | Function | First break | Status there | First error line |
| --- | --- | --- | --- | --- | --- |
| n60 | `results/gen-n60/tests/test_353.js` | zod.z.parse | v4.5.0 | fail | Got unwanted exception. |
| n124 | `results/gen-n124-run2/tests/test_10.js` | zod.z.iso.date | v4.6.0 | fail | Result should be a Date object |
| n124 | `results/gen-n124-run2/tests/test_117.js` | zod.z.emoji | v4.6.0 | fail | Cannot read properties of undefined (reading 'some') |
| n124 | `results/gen-n124-run2/tests/test_366.js` | zod.z.partialRecord | v4.1.0 | fail | Cannot read properties of undefined (reading 'has') |
| n124 | `results/gen-n124-run2/tests/test_370.js` | zod.z.partialRecord | v4.5.0 | fail | The input did not match the regular expression /Invalid key/. Input: |
| n124 | `results/gen-n124-run2/tests/test_371.js` | zod.z.partialRecord | v4.5.0 | fail | The input did not match the regular expression /Invalid/. Input: |
| n124 | `results/gen-n124-run2/tests/test_518.js` | zod.z.instanceof | v4.3.0 | fail | Should throw default error when input is not an instance of MyClass |
| n124 | `results/gen-n124-run2/tests/test_521.js` | zod.z.instanceof | v4.3.0 | fail | The input did not match the regular expression /Input not instance of Test/. Input: |
| n124 | `results/gen-n124-run2/tests/test_522.js` | zod.z.instanceof | v4.3.0 | fail | Expected a ZodError with the default message for non‑instance input |
| n124 | `results/gen-n124-tail/tests/test_50.js` | zod.z.toUpperCase | v4.6.0 | fail | Expected values to be strictly equal: |
```
Exit: 0; wall seconds: 0.066

## 2026-09-25T03:30:22Z

```sh
cd experiments/testpilot-2026-09
python3 - <<'PY'
import json,collections
R="results/survival-n124"; tags=[r["tag"] for r in json.load(open(R+"/tags.json"))]
S=json.load(open("results/gen-n124-passing.json")); shared={f["accessPath"] for f in json.load(open("results/api-sample-n60-s20260919.json"))}
uid=lambda s:s["run"]+"/"+s["testName"]
llm={t:{uid(r):r for r in json.load(open(f"{R}/{t}/llm-results.json"))} for t in tags}
sh=[s for s in S if s["api"] in shared]
print("Step 2 info: LLM statuses of the",len(sh),"S124 tests of the 60 shared functions (",len({s["api"] for s in sh}),"functions):")
for t in tags: print("  ",t,dict(collections.Counter(llm[t][uid(s)]["status"] for s in sh)))
print("non-shared:",len(S)-len(sh),"tests;", {t:sum(llm[t][uid(s)]["status"]=="pass" for s in S if s["api"] not in shared) for t in tags})
print("rebound (fail then pass again):",[ (uid(s), [llm[t][uid(s)]["status"] for t in tags]) for s in S if any(llm[t][uid(s)]["status"]!="pass" for t in tags) and llm[tags[-1]][uid(s)]["status"]=="pass"])
print("LLM wall seconds:",{t:round(json.load(open(f"{R}/{t}/llm-summary.json"))["wallSeconds"],1) for t in tags})
print("dev wall seconds:",{t:round(json.load(open(f"{R}/{t}/dev-status.json"))["wallSeconds"],1) for t in tags})
print("LLM mean duration ms per test at v4.0.5:",round(sum(r["durationMs"] for r in llm["v4.0.5"].values())/len(S),1))
PY
sed -n "/## First breaks and returns/,/^| LLM test/p" results/survival-n124-summary.md | grep "^| LLM\|^| Dev"
grep -A8 "## LLM failures: v4.6.0" results/survival-n124-summary.md | head -9
```

```text
Step 2 info: LLM statuses of the 133 S124 tests of the 60 shared functions ( 55 functions):
   v4.0.5 {'pass': 133}
   v4.1.0 {'pass': 133}
   v4.2.0 {'pass': 133}
   v4.3.0 {'pass': 133}
   v4.4.0 {'pass': 133}
   v4.5.0 {'pass': 133}
   v4.6.0 {'pass': 133}
non-shared: 133 tests; {'v4.0.5': 133, 'v4.1.0': 132, 'v4.2.0': 133, 'v4.3.0': 130, 'v4.4.0': 130, 'v4.5.0': 128, 'v4.6.0': 125}
rebound (fail then pass again): [('gen-n124-run2/test_366.js', ['pass', 'fail', 'pass', 'pass', 'pass', 'pass', 'pass'])]
LLM wall seconds: {'v4.0.5': 55.2, 'v4.1.0': 61.2, 'v4.2.0': 67.9, 'v4.3.0': 68.7, 'v4.4.0': 57.9, 'v4.5.0': 53.3, 'v4.6.0': 58.7}
dev wall seconds: {'v4.0.5': 8.4, 'v4.1.0': 10.1, 'v4.2.0': 8.8, 'v4.3.0': 8.9, 'v4.4.0': 8.7, 'v4.5.0': 7.1, 'v4.6.0': 9.7}
LLM mean duration ms per test at v4.0.5: 206.0
| LLM | 257 | 1 |
| Dev | 832 | 3 |
| LLM test | API | First break | Pass again |
## LLM failures: v4.6.0

| Category | Count |
| --- | --- |
| assertion | 7 |
| file-system | 0 |
| correctness | 1 |
| timeout | 0 |
| other | 0 |
```
Exit: 0; wall seconds: 0.053

## 2026-09-25T03:30:35Z

```sh
cd experiments/testpilot-2026-09
echo "Step 5.1/5.2 cleanup checks"
readlink wrappers/zod/node_modules/zod; ls -A wrappers/zod; test ! -e wrappers/zod/test-s && echo "no test-s"
cd docker && docker compose run --rm -T tp bash -c "cd /work/zod/experiments/testpilot-2026-09/wrappers/zod && node -e \"const z=require(\x27zod\x27); console.log(require(\x27zod/package.json\x27).version, typeof z.z, typeof z.z.string)\"" 2>&1 | grep -v -e orphan -e "Container docker-tp-run"
cd .. && python3 scripts/check-release-trees-n124.py | tail -2; rm -rf scripts/__pycache__
git -C ../.. status --porcelain | grep -v "^?? \"Claude outputs/\"$" | grep -v " experiments/testpilot-2026-09/" || echo "only experiments/testpilot-2026-09/ paths (plus Claude outputs/)"
git -C ../.. status --porcelain | grep -E "results/survival/|results/survival-(summary|llm-matrix|dev-matrix|pairs)\.|results/pair-map.json|docs/log-stage-s.md|docs/handover-stage-s.md" || echo "read-only paths untouched"
git -C ../.. status --porcelain
```

```text
Step 5.1/5.2 cleanup checks
../../../../../packages/zod
index.js
node_modules
package.json
no test-s
[eval]:1
const z=require(\x27zod\x27); console.log(require(\x27zod/package.json\x27).version, typeof z.z, typeof z.z.string)
                ^
Expected unicode escape

SyntaxError: Invalid or unexpected token
    at makeContextifyScript (node:internal/vm:185:14)
    at compileScript (node:internal/process/execution:383:10)
    at evalTypeScript (node:internal/process/execution:256:22)
    at node:internal/main/eval_string:74:3

Node.js v22.23.2

frozen snapshot files: 81
INTEGRITY_OK
only experiments/testpilot-2026-09/ paths (plus Claude outputs/)
read-only paths untouched
 M experiments/testpilot-2026-09/scripts/analyze-survival.py
 M experiments/testpilot-2026-09/scripts/run-survival-dev.py
 M experiments/testpilot-2026-09/scripts/run-survival-llm.py
 M experiments/testpilot-2026-09/scripts/summarize-dev-run.py
?? "Claude outputs/"
?? experiments/testpilot-2026-09/docs/log-stage-s-n124.md
?? experiments/testpilot-2026-09/results/survival-n124-dev-matrix.csv
?? experiments/testpilot-2026-09/results/survival-n124-llm-matrix.csv
?? experiments/testpilot-2026-09/results/survival-n124-pair-map.json
?? experiments/testpilot-2026-09/results/survival-n124-pairs.csv
?? experiments/testpilot-2026-09/results/survival-n124-summary.md
?? experiments/testpilot-2026-09/results/survival-n124-vs-n60.md
?? experiments/testpilot-2026-09/results/survival-n124/
?? experiments/testpilot-2026-09/scripts/check-release-trees-n124.py
?? experiments/testpilot-2026-09/scripts/compare-dev-week3.py
?? experiments/testpilot-2026-09/scripts/compare-survival-runs.py
?? experiments/testpilot-2026-09/scripts/replay-survival-n124.py
```
Exit: 0; wall seconds: 1.485

## 2026-09-25T03:30:42Z

```sh
echo 'Final wrapper probe (the previous attempt failed on shell quoting, not on the wrapper):'; cat /private/tmp/claude-501/-Users-donggi--projects-experiment-projects-zod-testpilot/17af9af1-0286-47cb-80f8-8471fc718738/scratchpad/probe.js
cd experiments/testpilot-2026-09/docker && docker compose run --rm -T -w /work/zod/experiments/testpilot-2026-09/wrappers/zod tp node - < /private/tmp/claude-501/-Users-donggi--projects-experiment-projects-zod-testpilot/17af9af1-0286-47cb-80f8-8471fc718738/scratchpad/probe.js 2>&1 | grep -v -e orphan -e 'Container docker-tp-run'
```

```text
Final wrapper probe (the previous attempt failed on shell quoting, not on the wrapper):
const z=require('zod'); console.log(require('zod/package.json').version, typeof z.z, typeof z.z.string)
4.0.5 object function
```
Exit: 0; wall seconds: 0.56

## Step 5: handover and commit

Handover written: `docs/handover-stage-s-n124.md`. Committing the edited and new scripts, this log, the handover, `results/survival-n124/` in full and `results/survival-n124-*`, all under `experiments/testpilot-2026-09/` only. The push and final status follow in the next commit.
