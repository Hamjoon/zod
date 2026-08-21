# Zod test generation·survival·repair main experiment — Full report (2026-08 weeks 2–3)

This is the authoritative record; the summary report (`zod-2026-08-week2-3-main-report.md`)
is an excerpt of it. All numbers are identical between the two documents.

## 1. Environment and verification

- Clone: fork `Hamjoon/zod`. t = v4.0.5 = `45afab0f` (2025-07-11), verified against the
  upstream tag. A fork clone does not carry upstream tags, so reproduction must use the
  hash or fetch upstream tags explicitly.
- HEAD at clone time: `3c9ca1d9` (2026-08-18). Window =
  `git rev-list --reverse 45afab0f..3c9ca1d9 -- packages/zod` = exactly **316 commits**.
  The unfiltered range t..HEAD is 533 commits; the `packages/zod` path filter is part of
  the window definition and must always be stated.
- Harness: `experiments/vitest.gate.mts` — `resolve.conditions: ["@zod/source"]` (tests
  run against the source tree, no build step), include
  `experiments/generated-tests/**/*.test.ts`, typecheck off. Upstream configs untouched.
- Install: `pnpm install --frozen-lockfile` (~30 s). During the survival walk,
  dependencies are reinstalled whenever `pnpm-lock.yaml` changes against the previously
  visited commit, plus a forced install at each resume point (§9): 23 installs across the
  316-commit walk.
- Model: `openai/gpt-oss-120b`, temperature 0, single shot, no retries, via OpenRouter
  (calls issued from Gary's Mac).
- Run branch `experiment/2026-08-week4-main` existed only in the (discarded) execution
  container; nothing was committed or pushed. The canonical archive is the experiment
  folder (`gen-out/`, `repair/`, and the evidence bundle indexed in §12).

## 2. Target files

Seven files, **10,931 LOC at t**. Six were chosen at planning time by LOC ranking, on the
premise that generation yields roughly 1 case per 40 LOC, so the largest files would clear
the 100–200 case target. `mini/schemas.ts` was designated as the reserve file and added
during the run (§3). The premise failed empirically — see Limitations (§10.3).

Per-file change volume inside the window (churn = added + deleted lines), measured for the
six planned files:

| file | LOC (t) | window commits | churn | churn/LOC |
|---|---|---|---|---|
| core/schemas.ts | 3,846 | 83 | 2,672 | 0.69 |
| classic/schemas.ts | 2,045 | 61 | 1,711 | 0.84 |
| core/checks.ts | 1,283 | 8 | 25 | 0.02 |
| core/to-json-schema.ts | 977 | 29 | 1,964 | 2.01 |
| core/util.ts | 775 | 38 | 1,055 | 1.36 |
| core/errors.ts | 426 | 16 | 338 | 0.79 |

File-level change volume and test breakage turned out to be uncorrelated in this run: the
largest-churn file (`core/schemas.ts`, 2,672 changed lines over 83 commits) produced zero
breakages among 18 tracked cases, while the three breakages (§5) came from files with
mid-to-low churn. Note also that churn cannot separate semantic change from surface change
(formatting, comments, type signatures), so it is recorded here as context, not as a
predictor.

## 3. Generation

Prompt per file: the full file source at t, plus instructions — cover the file's main
logic; one test per behavior; import everything used explicitly; the exact relative import
path prescribed; public entry points forbidden; output inside a single ```ts fence only.
**No case-count guidance**: the "around 5 test cases is typical" reference phrase used in
the previous prompt wording was removed at Gary's direction, and nothing about counts
remained.

Seven calls, all `finish_reason=stop`, no truncation. **105 cases** total, $0.0169,
233 s of model time.

| id | file | LOC (t) | cases | prompt tok | completion tok (reasoning) | s | cost |
|---|---|---|---|---|---|---|---|
| 01-core-util | core/util.ts | 775 | 23 | 6,547 | 3,088 (1,197) | 33 | $0.00176 |
| 02-core-schemas | core/schemas.ts | 3,846 | 18 | 30,778 | 4,703 (2,978) | 32 | $0.00446 |
| 03-classic-schemas | classic/schemas.ts | 2,045 | 11 | 20,737 | 1,899 (918) | 30 | $0.00271 |
| 04-core-checks | core/checks.ts | 1,283 | 22 | 9,932 | 4,088 (1,361) | 23 | $0.00237 |
| 05-core-to-json-schema | core/to-json-schema.ts | 977 | 8 | 7,707 | 2,625 (1,924) | 90 | $0.00073 |
| 06-core-errors | core/errors.ts | 426 | 13 | 3,876 | 2,235 (767) | 8 | $0.00115 |
| 07-mini-schemas | mini/schemas.ts | 1,579 | 10 | 14,769 | 2,447 (998) | 17 | $0.00368 |
| **total** | | **10,931** | **105** | 94,346 | 21,085 | 233 | $0.0169 |

**The seventh file was added mid-run.** The six planned files produced 95 cases, under the
100–200 floor, so the designated reserve `mini/schemas.ts` was generated as a seventh
target (+10 → 105). mini had originally been excluded because it is a thin surface API
over core and overlaps `classic` in logic; that overlap is recorded in Limitations
(§10.2). During the run Gary fixed the unit of the 100–200 target as **generated cases**
(the initially selected case count), so the target is met at 105; the alternative reading
(gate-passing cases, 86) is an open item for the Monday meeting (§11).

Records: `gen-out/` (per-file prompt, request, raw response, response, run and usage
records; `manifest.json`; `generated-tests/`).

## 4. Pass-at-t gate

**86 / 105 pass; 19 dropped (18.1%).** Protocol: a case that does not hold at t is
recorded and left unmodified — no regeneration, no editing. Dropped cases stay in the test
files but are excluded from survival tracking, so every later breakage is attributable to
code evolution alone.

| file | passed | dropped |
|---|---|---|
| core-schemas | 18 | 0 |
| checks | 21 | 1 |
| util | 21 | 2 |
| errors | 11 | 2 |
| classic-schemas | 10 | 1 |
| mini-schemas | 5 | 5 |
| to-json-schema | 0 | 8 |

All 19 drops are model comprehension errors evaluated against the code at t; zero were
caused by the harness or environment. Cause categories (per-case record in
`t-gate-drops.md` / `t-gate-drops.json`):

| category | count | description |
|---|---|---|
| A. non-existent import | 8 | imported a name the module does not export at t |
| B. wrong internal shape | 4 | asserted an internal structure the value does not have |
| C. wrong expected value | 5 | called the real API but predicted the wrong result |
| D. wrong API name | 1 | called a function under a name that is not exported |
| E. wrong runtime assumption | 1 | assumed a property was writable when it is not |

Category A is all eight `to-json-schema` cases and doubles as a protocol deviation
(§9.3): the file added a third import the prompt did not permit,
`import { z } from ".../core/index.js"`. At t, `core/index.ts` has 239 exports and `z` is
not one of them, so the module loads, `z` is `undefined`, and every case dies on first
use. The proximate cause is the comprehension error, not the rule violation: the name does
not exist, so these cases could not have held at t under any import rule.

Two observations:

1. **Drops cluster by file, not by case.** Two files account for 13 of the 19 drops
   (to-json-schema 8, mini-schemas 5), and within each file the drops share a single root
   cause. core-schemas had none at all. The 18.1% per-case average misrepresents a
   distribution that is closer to per-file all-or-nothing.
2. **The two worst files are the two whose module surface is indirect.** to-json-schema
   consumes schemas built elsewhere, so the model reached for a constructor the prompt did
   not give it; mini is a thin delegation layer over core, so its observable behavior is
   mostly the internal shape of objects core builds. In both, the file alone does not
   carry enough information to write a correct test, and the model filled the gap wrong.

## 5. Survival tracking

Loop per commit: checkout → conditional install → run the generated tests under the gate
config (JSON reporter) → append one log line (index, commit, elapsed, installed, alive
count, newly broken). A case is recorded as broken at the first commit where it does not
pass and leaves the tracked set; a case passing at commit 316 is censored.

**316 / 316 commits completed** — log contiguous (indices 1..316), zero duplicate or
missing commits, zero harness errors. Working time 19.5 min, mean 3.7 s per commit.
Result: **3 of 86 broke (3.5%); 83 censored (96.5%)**.

| file | survived | broke |
|---|---|---|
| core-schemas | 18 | 0 |
| checks | 21 | 0 |
| errors | 11 | 0 |
| util | 20 | 1 |
| classic-schemas | 9 | 1 |
| mini-schemas | 4 | 1 |

| # | case | first failure | index | survived |
|---|---|---|---|---|
| 1 | classic-schemas :: object schema with shape, partial and required | `7dd74848` (2025-07-23, "v4.0.6 (#4941)") | 9/316 | 8 commits |
| 2 | mini-schemas :: object schema shape and keyof utility | `d589186c` (2025-08-05, "fix: ensure keyof returns enum (#5045)") | 32/316 | 31 commits |
| 3 | util :: floatSafeRemainder works with decimals | `5b7ed214` (2026-04-28, "fix: correct multipleOf float validation using tolerance-based comparison (#5793)") | 200/316 | 199 commits |

Records: `survival-log.jsonl` (316 lines), `survival-summary.json`, `window-commits.txt`.

## 6. Stale vs production-bug judgment (human-confirmed)

All three judgments were made per case and confirmed by Gary. Full evidence, including the
probe matrix for case 1: `phase6-judgment-brief.md`.

- **Case 1 — production bug.** The library throws
  `TypeError: Cannot redefine property: checks` on `Obj.partial().required()`. Only the
  chained path throws, and only for 3 commits (#9–#11); `3048d14b` ("Fix #4961", #12)
  replaced `cloneDef` with `mergeDefs` and the call works again. The test asserted
  behavior that held at t, holds at HEAD, and was correct throughout; the library was
  briefly broken. Recorded, not repaired (protocol).
- **Case 2 — stale.** `keyof` deliberately changed its return schema from literal to
  enum; the commit title states the intent and it ships its own tests. The test pinned the
  old contract.
- **Case 3 — stale.** `floatSafeRemainder` was rewritten from decimal-string remainder
  arithmetic (result in input units) to a tolerance-based ratio comparison (result is the
  residual of `val / step`); for `(5.7, 0.2)` the old value was `0.1`, the new value is
  `-0.5`. Intent stated in the commit message, new tests shipped with it. The test pinned
  the old contract.

## 7. Repair

Protocol: one call per stale case. Prompt = the failing case verbatim + the production
diff at the breaking commit + the actual failure output + intent-preserving instructions
(update the test to the current behavior; production code is not a modification target).
Single shot, **no retries** — Gary's ruling during the run: the 0/2 outcome *is* the
result, and retrying until success would blur it; retry conditions are a design variable
for a future experiment. Final prompts: 2,482 and 2,926 chars (§9.2).

Both calls returned `finish_reason=stop`; both outputs were spliced into their test files
and validated at the breaking commit. **Both failed validation (repair 0/2).** In both,
production code was untouched and the assertion count was preserved (6→6, 2→2) — the
failures are not weakening or scope violations; the repaired tests simply do not pass.

- **repair-01 — mini keyof** (716 prompt / 598 completion tok, 13 s, $0.00013). The model
  changed only the asserted type from `literal` to `enum` and left the rest of the case
  as it was:

  ```ts
  expect(keys._zod.def.type).toBe("enum");        // correct
  expect(keys._zod.def.values).toContain("a");    // fails
  ```

  The actual enum def has `entries` (`{"a":"a","b":"b"}`) and no `values`
  (`values === undefined`); the literal def had `values`. The failure output named only
  the `type` mismatch, and the model fixed exactly that line. Deriving the rest of the
  new shape required reading the diff, which it did not do.
- **repair-02 — util floatSafeRemainder** (905 prompt / 1,188 completion tok, 34 s,
  $0.00058). The model read the contract change correctly and even annotated it ("the
  function now returns the fractional part of the ratio"), but missed the sign:

  ```ts
  expect(rem2).toBeCloseTo(0.5);   // actual value is -0.5
  ```

  The failure output included in its prompt stated the value verbatim —
  `expected -0.5 to be close to 0.1` — and the assertion still came back positive.

The two failures differ in kind — one is a wrong value on a correctly-understood
contract, the other a minimal local edit that never re-derived the case from the diff —
but both are edits confined to the exact line the error message pointed at.
Records: `repair/` (per-case prompt, request, raw response, response, repaired case, run
and usage records), `repair-manifest.json`, `repair-validation.json`.

## 8. HEAD probe

All 105 cases were re-run once at HEAD (`3c9ca1d9`): 85 pass / 20 fail
(`head-check.json`). Of the three window breakages, case 1 (the production bug) **passes
at HEAD** — its in-window recovery is invisible to the survival record (§10.1) and was
located by probing HEAD and bisecting to #12. Cases 2 and 3 still fail at HEAD, consistent
with the stale judgments. One footnote: a t-gate drop (`defineLazy` overwrite, category E)
also passes at HEAD — the behavior the model wrongly assumed at t does hold at HEAD. Drop
status is anchored to t and does not transfer to other commits.

## 9. Run notes (protocol deviations)

1. **The survival loop died at commit 115** — an external SIGKILL, not a Python
   exception, and not resource pressure (7 GB RAM and 29 GB disk free at the time);
   background processes in the execution container did not survive turn boundaries.
   Resume support was added to the runner (with a forced reinstall at each resume point)
   and the remaining window was completed in three segments of 65–70 commits. The final
   log was verified contiguous: 316 lines, zero duplicates, zero gaps.
2. **The repair prompt was corrected twice before the calls.** First, the failure output
   was initially extracted as the test file's *first* failure, which selected a t-gate
   drop's output instead of the target case; fixed by selecting from the JSON reporter by
   test name. Second, stack traces carried container-absolute paths; runner-internal
   frames were stripped. The prompts as sent are archived under `repair/`.
3. **to-json-schema generation violated the import rule** (§4, category A). Per protocol
   the output was gated unmodified, and the drop is signed as a comprehension error (the
   imported name does not exist at t), not as a rule-enforcement artifact.

## 10. Limitations

1. **Tracking records first failures only.** The survival runner logs the commit where a
   case first fails and removes it from the tracked set, so a case that breaks and later
   recovers shows only the breakage. Case 1 did exactly this — broken for 3 commits,
   recovered at #12 — and the recovery was found only by probing HEAD and bisecting. With
   only 3 breakages, all individually examined, the numbers in this report are unaffected;
   at larger scale a first-failure-only record would understate survival, and "broken at
   the end of the window" cannot be distinguished from "broke once" without a follow-up
   probe. Recording the full pass/fail series per case would remove the ambiguity.
2. **mini/schemas.ts overlaps classic/schemas.ts.** Both delegate to the same core
   functions, so one change to a shared function could be counted as two breakage events.
   In this run the two breakages in those files came from different commits (`7dd74848`
   vs `d589186c`), so no simple double-count occurred — but the risk stands for scale-up.
3. **The file-selection premise failed empirically.** Planning assumed ~40 LOC per
   generated case; the measured rate is ~98 LOC/case over the six planned files (104 over
   all seven), with a per-file spread of 33–214 LOC/case — more than 4×. Completion
   tokens clustered at 1,899–4,703 regardless of input size: the model spends a roughly
   constant budget per file, so **larger files do not yield more cases**, and smaller
   files yield more per LOC. LOC ranking is not a valid volume-securing criterion for the
   next selection.
4. **The functions-vs-changes cross-check compares only two points in time.** Comparing
   function bodies at t and at the window end misses mid-window change-then-revert and
   changes routed through referenced functions. (This limitation existed in the previous
   smoke run as well but was recorded only internally; it is stated publicly here.)

## 11. Open items (Monday meeting)

- Rationale for free-count generation instead of the original 2–3-cases-per-file
  guidance: at 2–3 per file the realistic file pool (~25 files) caps out at ~75 cases,
  under the 100–200 target, and one-case-per-behavior generation keeps breakage
  attribution clean.
- Unit of the 100–200 target: generated cases (105 — met, per Gary's in-run ruling) vs
  gate-passing cases (86).
- Event-count reinforcement options for the next run: moving t into a beta window;
  running the C# track in parallel.
- Repair retry conditions: the two failures differ in kind (sign error on an understood
  contract vs surface-minimal edit); whether a bounded retry (and under what evidence)
  becomes a condition in the next design.
- File selection criteria for the next run: generation volume does not scale with LOC
  (§10.3), and churn neither predicts breakage (§2) nor separates semantic from surface
  change.

## 12. File index

- `gen-out/` — generation records: per-file `llm-prompt.md`, `llm-request.json`,
  `llm-raw-response.json`, `llm-response.md`, `llm-run.json`, `llm-usage.json`;
  `manifest.json`; `generated-tests/` (7 files, 105 cases)
- `t-gate-result.json`, `t-gate-drops.md` / `t-gate-drops.json` — gate run and the 19
  drops, case by case
- `survival/survival-log.jsonl` (316 lines), `survival/survival-summary.json`,
  `window-commits.txt` — survival walk
- `phase6-judgment-brief.md` — judgment evidence for the three breakages
- `repair/` — per-case `repair-prompt.md`, `repair-request.json`,
  `repair-raw-response.json`, `repair-response.md`, `repaired-case.ts`,
  `repair-run.json`, `repair-usage.json`; `repair-manifest.json`
- `repair-validation.json` — validation of both repairs at their breaking commits
- `head-check.json` — the 105-case run at HEAD
- scripts: `run-generation.py`, `run-survival.py`, `build-repair.py`, `run-repair.py`,
  `validate-repair.py`, `vitest.gate.mts`

Reproduction:

```bash
git clone https://github.com/Hamjoon/zod.git
cd zod && git checkout 45afab0f          # v4.0.5; fetch upstream tags to use the tag name
pnpm install --frozen-lockfile           # ~30 s
# place experiments/vitest.gate.mts and generated-tests/, then:
npx vitest run --config experiments/vitest.gate.mts
```
