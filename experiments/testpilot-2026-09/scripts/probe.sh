#!/bin/bash
set -euo pipefail
EXP=/work/zod/experiments/testpilot-2026-09
TP=/work/testpilot2
exec > >(tee -a "$EXP/docs/log-stage0-explore.md") 2>&1
set -x
mkdir -p /work/zod/packages/zod/tests-probe "$EXP/results/probe"
cp "$EXP/scripts/probe-test.js" /work/zod/packages/zod/tests-probe/
cd /work/zod/packages/zod
start=$(date +%s.%N)
set +e
"$TP/node_modules/.bin/nyc" --cwd=/work/zod/packages/zod --exclude=tests-probe --reporter=json --report-dir="$EXP/results/probe/coverage" --temp-dir="$EXP/results/probe/coverage" "$TP/node_modules/.bin/mocha" --full-trace --exit --allow-uncaught=false --reporter=json --reporter-option output="$EXP/results/probe/report.json" -- tests-probe/probe-test.js
rc=$?
set -e
end=$(date +%s.%N)
python3 -c 'import json,sys,pathlib; print(json.dumps(dict(exit=int(sys.argv[1]),seconds=float(sys.argv[3])-float(sys.argv[2]),coverageBytes=pathlib.Path(sys.argv[4]).stat().st_size)))' "$rc" "$start" "$end" "$EXP/results/probe/coverage/coverage-final.json" > "$EXP/results/probe/timing.json"
cat "$EXP/results/probe/timing.json"
jq '.stats' "$EXP/results/probe/report.json"
ls -la "$EXP/results/probe/coverage" | head
rm -rf /work/zod/packages/zod/tests-probe
exit "$rc"
