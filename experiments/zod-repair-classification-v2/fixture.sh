#!/bin/bash
# fixture.sh <case-id> — build the v2 fixture worktree for one case and capture test output.
# Prints "FIXTURE: <OK|FAIL> <id> <detail>" as the last line.
set -u
ROOT=/Users/donggi/_projects/etc-projects/zod-thesis
EXP=$ROOT/experiments/zod-repair-classification-v2
SCRATCH=${V2_SCRATCH:-/private/tmp/claude-501/-Users-donggi--projects-etc-projects-zod-thesis/d3931c70-456e-417b-9afb-2f6b808ef4e9/scratchpad}
ID=$1
LOG=$SCRATCH/logs/$ID
CASEDIR=$EXP/cases/$ID
WT=$ROOT/.worktrees/$ID
mkdir -p "$LOG" "$CASEDIR"

CASE=$(jq -c ".[] | select(.id == \"$ID\")" "$EXP/cases.json")
[ -z "$CASE" ] && { echo "FIXTURE: FAIL $ID unknown-case"; exit 1; }
CAT=$(jq -r .category <<<"$CASE")
SHA=$(jq -r .upstream_sha <<<"$CASE")
BASE=$(jq -r .base_sha <<<"$CASE")
DIST=$(jq -r .dist_mode <<<"$CASE")
TESTS=(); while IFS= read -r f; do [ -n "$f" ] && TESTS[${#TESTS[@]}]=$f; done < <(jq -r '.test_paths[]' <<<"$CASE")
PRODS=(); while IFS= read -r f; do [ -n "$f" ] && PRODS[${#PRODS[@]}]=$f; done < <(jq -r '.prod_paths[]' <<<"$CASE")

fail() { echo "FIXTURE: FAIL $ID $1"; exit 1; }

# 1. worktree at base
if [ ! -d "$WT" ]; then
  ( cd "$ROOT" && git worktree add --detach "$WT" "$BASE" > "$LOG/worktree.log" 2>&1 ) || fail worktree-add
fi
cd "$WT" || fail cd-worktree

# 2. fixture diff: S/N apply production files, P applies test files
case "$CAT" in
  S|N) FIXPATHS=(${PRODS[@]+"${PRODS[@]}"}) ;;
  P)   FIXPATHS=(${TESTS[@]+"${TESTS[@]}"}) ;;
esac
[ ${#FIXPATHS[@]} -eq 0 ] && fail no-fixture-paths
git diff --no-renames --binary "${SHA}^" "$SHA" -- "${FIXPATHS[@]}" > "$CASEDIR/fixture.patch" || fail fixture-diff
if ! git apply --check "$CASEDIR/fixture.patch" 2> "$LOG/apply.err"; then
  git diff --quiet || fail worktree-dirty-and-patch-conflict
  fail fixture-apply-check
fi
git apply --whitespace=nowarn "$CASEDIR/fixture.patch" 2>> "$LOG/apply.err" || fail fixture-apply

# 3. install (restore lockfile afterwards; it is never part of the fixture)
if ! pnpm install > "$LOG/install.log" 2>&1; then
  pnpm install --no-frozen-lockfile >> "$LOG/install.log" 2>&1 || fail install
fi
git checkout -q -- pnpm-lock.yaml 2>/dev/null

# 4. dist-mode build
if [ "$DIST" = "true" ]; then
  ( cd packages/zod && pnpm build > "$LOG/build_base.log" 2>&1 ) || fail dist-build
fi

run_tests() { # $1=logname, rest=paths (repo-relative); falls back to repo root cwd
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

# 5. smoke check + test-output capture
case "$CAT" in
S|P)
  TF=()
  for f in ${TESTS[@]+"${TESTS[@]}"}; do [ -f "$f" ] && TF[${#TF[@]}]=$f; done
  [ ${#TF[@]} -eq 0 ] && fail no-test-files-at-base
  run_tests fixture "${TF[@]}"
  RC=$(cat "$LOG/fixture.rc")
  FAILED=$(failed_count "$LOG/fixture.log")
  TYPEERR=$(strip_ansi "$LOG/fixture.log" | grep -c "TypeCheckError" || true)
  if [ "$RC" = "0" ] || { [ -z "$FAILED" ] && [ "$TYPEERR" = "0" ]; }; then
    fail "expected-red-got-rc=$RC-failed=${FAILED:-0}"
  fi
  strip_ansi "$LOG/fixture.log" | tail -400 > "$CASEDIR/test-output.txt"
  echo "FIXTURE: OK $ID red-confirmed failed=${FAILED:-typecheck} tests=${TF[*]}"
  ;;
N)
  SCOPE="packages/zod/src/v4"; [ -d "$SCOPE" ] || SCOPE="packages/zod/src"
  run_tests fixture "$SCOPE"
  RC=$(cat "$LOG/fixture.rc")
  FAILED=$(failed_count "$LOG/fixture.log")
  if [ "$RC" != "0" ]; then
    # root-run noise tolerance: only "Tests N failed" counts as failure
    if [ -n "$FAILED" ] && [ "$FAILED" -gt 0 ]; then fail "expected-green-got-$FAILED-failed"; fi
    strip_ansi "$LOG/fixture.log" | grep -q "Unhandled Error" && \
      strip_ansi "$LOG/fixture.log" | grep -A3 "Unhandled" | grep "❯" | grep -qvE "packages/(bench|resolution|docs|tsc)/" && fail unhandled-error-in-zod
  fi
  strip_ansi "$LOG/fixture.log" | grep -E "Test Files|Tests  |Duration" | tail -4 > "$CASEDIR/test-output.txt"
  echo "FIXTURE: OK $ID green-confirmed $(grep 'Tests ' "$CASEDIR/test-output.txt" | head -1 | xargs)"
  ;;
esac
