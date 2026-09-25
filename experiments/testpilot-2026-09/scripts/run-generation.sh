#!/bin/bash
set -euo pipefail
TP=/work/testpilot2
EXP=/work/zod/experiments/testpilot-2026-09
W=$EXP/wrappers/zod
condition="$1"
case "$condition" in
  gen-smoke|gen-smoke-2|gen-smoke-3|gen-smoke-4) API="$EXP/results/api-smoke-2.json" ;;
  gen-n60) API="$EXP/results/api-sample-n60-s20260919.json" ;;
  gen-n124|gen-n124-run2) API="$EXP/results/population-main.json" ;;
  gen-n124-tail) API="$EXP/results/api-n124-tail.json" ;;
  *) exit 2 ;;
esac
test ! -e "$EXP/results/$condition"
test -n "$OPENROUTER_API_KEY"
export TESTPILOT_LLM_API_ENDPOINT="https://openrouter.ai/api/v1/chat/completions"
export TESTPILOT_LLM_AUTH_HEADERS="{\"Authorization\":\"Bearer ${OPENROUTER_API_KEY}\"}"
test -n "$TESTPILOT_LLM_AUTH_HEADERS" && echo HEADERS_SET
GEN=(--package "$W" --model openai/gpt-oss-120b --template "$TP/templates/template-singletest.hb" --retryTemplate "$TP/templates/retry-template.hb" --snippets doc --numSnippets 3 --snippetLength 20 --temperatures 0.0 --numCompletions 1 --maxTokens 4000 --nrAttempts 3)
cd "$TP"
start=$(date +%s)
set +e
node benchmark/run.js --outputDir "$EXP/results/$condition" --api "$API" "${GEN[@]}" > "/tmp/$condition.stdout.txt" 2>&1
rc=$?
set -e
if test -d "$EXP/results/$condition"; then mv "/tmp/$condition.stdout.txt" "$EXP/results/$condition/stdout.txt"; fi
end=$(date +%s)
case "$condition" in gen-n124|gen-n124-run2|gen-n124-tail|gen-smoke-3|gen-smoke-4) LOG="$EXP/docs/log-stage-g-n124.md" ;; *) LOG="$EXP/docs/log-stage-g.md" ;; esac
printf '%s exit=%s wallSeconds=%s\n' "$condition" "$rc" "$((end-start))" | tee -a "$LOG"
exit "$rc"
