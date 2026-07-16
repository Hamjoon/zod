#!/bin/bash
# archive.sh — build the orphan archive branch for the week-3 v2 30-case batch.
# Creates experiment/2026-07-week3-v2-30case-archive in a temp worktree:
# one commit per case packet (adoption order), then a final commit with the
# report, runner, signal script, cases.json, helper scripts, results summary.
set -eu
ROOT=${ZOD_THESIS_ROOT:-$(git rev-parse --show-toplevel)}
EXP=$ROOT/experiments/zod-repair-classification-v2
BRANCH=experiment/2026-07-week3-v2-30case-archive
AWT=$ROOT/.worktrees/archive-week3

cd "$ROOT"
git worktree remove --force "$AWT" 2>/dev/null || true
git branch -D "$BRANCH" 2>/dev/null || true
git worktree add --detach "$AWT" 2>/dev/null
cd "$AWT"
git checkout --orphan "$BRANCH"
git rm -rfq . 2>/dev/null || true
git clean -qfdx

for id in $(jq -r '.[].id' "$EXP/cases.json"); do
  SRC=$EXP/cases/$id
  DST=experiments/zod-repair-classification-v2/cases/$id
  mkdir -p "$DST"
  for f in fixture.patch test-output.txt gptoss-prompt.md gptoss-response.md gptoss-usage.json \
           gptoss-repair.patch applied-repair.diff result.json validation.log; do
    [ -f "$SRC/$f" ] && cp "$SRC/$f" "$DST/$f"
  done
  if [ -d "$SRC/signal" ]; then
    cp -R "$SRC/signal" "$DST/signal"
    # coverage-final.json is bulky and redundant next to coverage-summary.json
    find "$DST/signal" -name coverage-final.json -delete
  fi
  for d in "$SRC"/signal-*; do
    [ -d "$d" ] && cp -R "$d" "$DST/$(basename "$d")" && find "$DST/$(basename "$d")" -name coverage-final.json -delete
  done
  git add -A
  git commit -qm "experiment packet: $id"
done

mkdir -p docs scripts experiments/zod-repair-classification-v2
cp "$ROOT/docs/zod-v2-30case-report.md" docs/
cp "$ROOT/docs/zod-v2-30case-batch-instructions.md" docs/ 2>/dev/null || true
cp "$ROOT/scripts/run-gptoss-test-maintenance.py" scripts/
cp "$ROOT/scripts/run-zod-signal-eval.mjs" scripts/
cp "$EXP/cases.json" experiments/zod-repair-classification-v2/
cp "$EXP"/*.sh "$EXP"/*.py experiments/zod-repair-classification-v2/
cp "$EXP/results-summary.json" experiments/zod-repair-classification-v2/ 2>/dev/null || true
git add -A
git commit -qm "docs: week3 v2 30-case unified-protocol report and tooling"

git log --oneline | head -5
echo "READY: push with  git push origin $BRANCH:refs/heads/$BRANCH"
