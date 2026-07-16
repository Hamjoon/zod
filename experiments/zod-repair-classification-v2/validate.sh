#!/bin/bash
# validate.sh <case-id> — score DECISION, apply the model patch if any, run targeted validation.
# Writes cases/<id>/result.json and validation.log. Last line: "VALIDATE: <id> <summary>".
set -u
ROOT=${ZOD_THESIS_ROOT:-$(git rev-parse --show-toplevel)}
EXP=$ROOT/experiments/zod-repair-classification-v2
SCRATCH=${V2_SCRATCH:-$ROOT/.v2-scratch}
ID=$1
CASEDIR=$EXP/cases/$ID
WT=$ROOT/.worktrees/$ID
LOG=$SCRATCH/logs/$ID

CASE=$(jq -c ".[] | select(.id == \"$ID\")" "$EXP/cases.json")
CAT=$(jq -r .category <<<"$CASE")
DIST=$(jq -r .dist_mode <<<"$CASE")
case "$CAT" in S) EXPECTED=fix_tests ;; P) EXPECTED=fix_production ;; N) EXPECTED=no_change ;; esac

PARSED=$(python3 "$EXP/parse-response.py" "$CASEDIR/gptoss-response.md" "$CASEDIR/gptoss-repair.patch")
DECISION=$(jq -r .decision <<<"$PARSED")
FIRSTOK=$(jq -r .first_line_ok <<<"$PARSED")
HASDIFF=$(jq -r .has_diff <<<"$PARSED")
MATCH=$([ "$DECISION" = "$EXPECTED" ] && echo true || echo false)

emit() { # $1=validation $2=apply_method $3=note
  jq -n --arg id "$ID" --arg cat "$CAT" --arg expected "$EXPECTED" --arg decision "$DECISION" \
    --argjson first_line_ok "$FIRSTOK" --argjson has_diff "$HASDIFF" --argjson decision_match "$MATCH" \
    --arg validation "$1" --arg apply_method "$2" --arg note "$3" \
    '{id: $id, category: $cat, expected: $expected, decision: $decision, decision_match: $decision_match,
      first_line_ok: $first_line_ok, has_diff: $has_diff, validation: $validation, apply_method: $apply_method, note: $note}' \
    > "$CASEDIR/result.json"
  echo "VALIDATE: $ID decision=$DECISION expected=$EXPECTED match=$MATCH validation=$1 $3"
}

if [ "$HASDIFF" = "false" ]; then
  rm -f "$CASEDIR/gptoss-repair.patch"
  if [ "$DECISION" = "no_change" ]; then
    if [ "$CAT" = "N" ]; then emit none none "correct-no-change"; else emit none none "no-diff-model-declined-fix"; fi
  else
    emit none none "decision-without-diff"
  fi
  exit 0
fi

cd "$WT" || { emit error none missing-worktree; exit 1; }

# apply model patch on top of the fixture state (committed in the worktree, so
# each failed attempt can be reset away cleanly)
reset_fixture() { git reset --hard -q HEAD; git clean -qfd -e node_modules -e .openclaw-signal 2>/dev/null; }
METHOD=none
if git apply --whitespace=nowarn "$CASEDIR/gptoss-repair.patch" 2> "$LOG/repair-apply.err"; then
  METHOD=git-apply
else
  reset_fixture
  if git apply --whitespace=nowarn --recount "$CASEDIR/gptoss-repair.patch" 2>> "$LOG/repair-apply.err"; then
    METHOD=git-apply-recount
  else
    reset_fixture
    if patch -p1 --forward --fuzz=3 --no-backup-if-mismatch < "$CASEDIR/gptoss-repair.patch" > "$LOG/repair-apply.out" 2>> "$LOG/repair-apply.err"; then
      METHOD=patch-fuzz
    else
      reset_fixture
      CANDIDATES=()
      while IFS= read -r f; do [ -n "$f" ] && CANDIDATES[${#CANDIDATES[@]}]=$f; done \
        < <(jq -r '.prod_paths[], .test_paths[]' <<<"$CASE")
      if python3 "$EXP/apply-patch.py" "$CASEDIR/gptoss-repair.patch" "$WT" ${CANDIDATES[@]+"${CANDIDATES[@]}"} >> "$LOG/repair-apply.out" 2>> "$LOG/repair-apply.err"; then
        METHOD=context-match
      else
        reset_fixture
        emit apply_failed none "patch-does-not-apply"
        exit 0
      fi
    fi
  fi
fi
# record what was actually applied, normalized as a git diff against the fixture
git add -A >/dev/null 2>&1 && git diff --cached --no-color > "$CASEDIR/applied-repair.diff"; git reset -q >/dev/null 2>&1

# rebuild when a dist-mode case touched production code
TOUCHED=$(grep -E '^\+\+\+ ' "$CASEDIR/gptoss-repair.patch" | sed 's|^+++ [ab]/||' | sort -u)
PROD_TOUCHED=false
while IFS= read -r f; do
  [ -n "$f" ] || continue
  echo "$f" | grep -qE '\.test\.ts$|/tests/' || PROD_TOUCHED=true
done <<<"$TOUCHED"
if [ "$DIST" = "true" ] && [ "$PROD_TOUCHED" = "true" ]; then
  ( cd packages/zod && pnpm build > "$LOG/build_repair.log" 2>&1 ) || { emit error "$METHOD" rebuild-failed; exit 1; }
fi

run_tests() { # $1=logname, rest=paths
  local name=$1; shift
  local zargs=() rc
  for p in "$@"; do zargs+=("${p#packages/zod/}"); done
  ( cd packages/zod && pnpm vitest run "${zargs[@]}" > "$LOG/$name.log" 2>&1 ); rc=$?
  if grep -q "No projects were found" "$LOG/$name.log"; then
    pnpm vitest run "$@" > "$LOG/$name.log" 2>&1; rc=$?
  fi
  echo "$rc" > "$LOG/$name.rc"
  return "$rc"
}
strip_ansi() { sed 's/\x1b\[[0-9;]*m//g' "$1"; }
failed_count() { strip_ansi "$1" | sed -n 's/^ *Tests[^0-9]*\([0-9][0-9]*\) failed.*/\1/p' | head -1; }

if [ "$CAT" = "N" ]; then
  SCOPE="packages/zod/src/v4"; [ -d "$SCOPE" ] || SCOPE="packages/zod/src"
  run_tests validation "$SCOPE"; RC=$?
else
  TF=()
  while IFS= read -r f; do [ -n "$f" ] && [ -f "$f" ] && TF[${#TF[@]}]=$f; done < <(jq -r '.test_paths[]' <<<"$CASE")
  run_tests validation ${TF[@]+"${TF[@]}"}; RC=$?
fi
strip_ansi "$LOG/validation.log" | tail -200 > "$CASEDIR/validation.log"
FAILED=$(failed_count "$LOG/validation.log")

if [ "$RC" = "0" ]; then
  emit green "$METHOD" ""
elif [ -n "$FAILED" ] && [ "$FAILED" -gt 0 ]; then
  emit red "$METHOD" "failed=$FAILED"
else
  # nonzero exit without counted failures: typecheck error or infra noise
  if strip_ansi "$LOG/validation.log" | grep -q "TypeCheckError"; then
    emit red "$METHOD" typecheck-error
  else
    emit green "$METHOD" "nonzero-exit-no-test-failures"
  fi
fi
