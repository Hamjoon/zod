#!/bin/bash
# run-case.sh <case-id> — single-shot gpt-oss-120b run for one v2 case.
# API key is injected from the keychain at call time only; never written anywhere.
set -u
ROOT=/Users/donggi/_projects/etc-projects/zod-thesis
EXP=$ROOT/experiments/zod-repair-classification-v2
ID=$1
CASEDIR=$EXP/cases/$ID
cd "$ROOT" || exit 1
[ -s "$CASEDIR/fixture.patch" ] && [ -s "$CASEDIR/test-output.txt" ] || { echo "MODEL: FAIL $ID missing-fixture-inputs"; exit 1; }
if OPENROUTER_API_KEY=$(security find-generic-password -s openrouter-api-key -w) \
  python3 scripts/run-gptoss-test-maintenance.py \
    --mode v2-unified \
    --case "$ID" \
    --cases-file "$EXP/cases.json" \
    --repo ".worktrees/$ID" \
    --recent-change-diff "$CASEDIR/fixture.patch" \
    --test-output "$CASEDIR/test-output.txt" \
    --artifact-dir "$CASEDIR" > /dev/null 2> "$CASEDIR/run.err"; then
  rm -f "$CASEDIR/run.err"
  echo "MODEL: OK $ID $(head -1 "$CASEDIR/gptoss-response.md" | head -c 60)"
else
  echo "MODEL: FAIL $ID api-error $(tail -1 "$CASEDIR/run.err" | head -c 120)"
  exit 1
fi
