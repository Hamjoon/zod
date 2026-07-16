#!/bin/bash
# signal-case.sh <case-id> [--source upstream|repair] [--out-suffix <name>]
# Coverage + focused StrykerJS for a green repair, scoped to the production change.
# Multiple production files → one sub-run per file under signal/<filebase>/.
set -u
ROOT=${ZOD_THESIS_ROOT:-$(git rev-parse --show-toplevel)}
EXP=$ROOT/experiments/zod-repair-classification-v2
SCRATCH=${V2_SCRATCH:-$ROOT/.v2-scratch}
ID=$1; shift
SCOPE_ARGS=()
OUT_SUFFIX=""
while [ $# -gt 0 ]; do
  case "$1" in
    --before-repair) SCOPE_ARGS=(--before-repair); shift ;;
    --out-suffix) OUT_SUFFIX=$2; shift 2 ;;
    *) echo "unknown arg $1"; exit 1 ;;
  esac
done
CASEDIR=$EXP/cases/$ID
WT=$ROOT/.worktrees/$ID
LOG=$SCRATCH/logs/$ID
CASE=$(jq -c ".[] | select(.id == \"$ID\")" "$EXP/cases.json")

# targeted tests present in the worktree; N cases have none → whole v4 test glob
TESTS=""
while IFS= read -r f; do
  [ -n "$f" ] && [ -f "$WT/$f" ] && TESTS="$TESTS,$f"
done < <(jq -r '.test_paths[]' <<<"$CASE")
TESTS=${TESTS#,}
if [ -z "$TESTS" ]; then
  CAT=$(jq -r .category <<<"$CASE")
  [ "$CAT" = "N" ] && TESTS="packages/zod/src/v4/**/*.test.ts" || { echo "SIGNAL: FAIL $ID no-tests"; exit 1; }
fi

# stryker + coverage provider in the worktree (idempotent); coverage-v8 must match the era's vitest major
if ! grep -q '@stryker-mutator/vitest-runner' "$WT/package.json"; then
  VITEST_VER=$(jq -r '.devDependencies.vitest' "$WT/package.json" | tr -d '^~')
  ( cd "$WT" && pnpm add -w -D -E @stryker-mutator/core @stryker-mutator/vitest-runner "@vitest/coverage-v8@${VITEST_VER}" > "$LOG/stryker-install.log" 2>&1 ) \
    || { echo "SIGNAL: FAIL $ID stryker-install"; exit 1; }
fi

SCOPES=$(python3 "$EXP/compute-mutate.py" "$ID" ${SCOPE_ARGS[@]+"${SCOPE_ARGS[@]}"})
[ -z "$SCOPES" ] && { echo "SIGNAL: FAIL $ID empty-mutate-scope"; exit 1; }
NPROD=$(wc -l <<<"$SCOPES" | xargs)

FAILED=0
while IFS=$'\t' read -r PROD MUTATE; do
  [ -z "$PROD" ] && continue
  if [ "$NPROD" -gt 1 ]; then
    OUT=$CASEDIR/signal${OUT_SUFFIX}/$(basename "$PROD" .ts)
  else
    OUT=$CASEDIR/signal${OUT_SUFFIX}
  fi
  node "$ROOT/scripts/run-zod-signal-eval.mjs" \
    --case "$ID$OUT_SUFFIX" --repo "$WT" --out "$OUT" \
    --tests "$TESTS" --prod "$PROD" --mutate "$MUTATE" \
    > "$LOG/signal$OUT_SUFFIX-$(basename "$PROD" .ts).log" 2>&1
  V=$(jq -r .verdict "$OUT/signal-summary.json" 2>/dev/null || echo run-error)
  K=$(jq -r '.mutation.summary.totals.Killed // 0' "$OUT/signal-summary.json" 2>/dev/null)
  S=$(jq -r '.mutation.summary.totals.Survived // 0' "$OUT/signal-summary.json" 2>/dev/null)
  NC=$(jq -r '.mutation.summary.totals.NoCoverage // 0' "$OUT/signal-summary.json" 2>/dev/null)
  echo "SIGNAL-RUN: $ID $PROD verdict=$V killed=$K survived=$S nocov=$NC"
  [ "$V" = "run-error" ] || [ "$V" = "signal_unknown" ] && FAILED=1
done <<<"$SCOPES"
[ "$FAILED" = "0" ] && echo "SIGNAL: OK $ID" || echo "SIGNAL: WARN $ID some-runs-unknown"
