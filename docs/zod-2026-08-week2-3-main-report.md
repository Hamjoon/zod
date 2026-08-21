# Zod test generation·survival·repair main experiment: Report (2026-08 weeks 2–3)

## Experiment question

Scaling the smoke pipeline from one file to seven (10,931 LOC, 105 generated cases): what
fraction of LLM-generated tests holds at the anchor commit, how do the survivors behave
across 13 months of upstream history, and does one-shot LLM repair succeed on the
naturally-arising stale breakages?

## Setup

- Repository: `colinhacks/zod` (fork `Hamjoon/zod`), tested from source (no build step in
  the loop).
- Anchor **t = v4.0.5** (`45afab0f`, 2025-07-11); observation window: **316 commits**
  touching `packages/zod`, t to `3c9ca1d9` (2026-08-18).
- Target files: 7 files, 10,931 LOC at t — six chosen at planning time by size ranking,
  plus a designated reserve added during the run (see Case composition).
- Generator/repairer: `openai/gpt-oss-120b` (temperature 0, single shot, no retries).
  Each call saw one full file source and chose what to test; no case count was given or
  suggested.

## Case composition

| file | LOC (t) | cases |
|---|---|---|
| core/util.ts | 775 | 23 |
| core/checks.ts | 1,283 | 22 |
| core/schemas.ts | 3,846 | 18 |
| core/errors.ts | 426 | 13 |
| classic/schemas.ts | 2,045 | 11 |
| mini/schemas.ts | 1,579 | 10 |
| core/to-json-schema.ts | 977 | 8 |
| **total** | **10,931** | **105** |

The six planned files produced 95 cases, under the 100–200 floor, so the designated
reserve `mini/schemas.ts` was added as a seventh target (+10 → 105). The target unit was
fixed as generated cases, so 105 meets it. mini overlaps `classic` (both are surfaces over
the same core logic) — see Limitations.

## Protocol

Three stages after generation. (1) Pass-at-t gate: a case that does not hold at t is
recorded and dropped unmodified, so every later breakage is attributable to code evolution
alone. (2) Survival tracking: every gated case runs at each of the 316 window commits,
oldest first; a case is recorded as broken at its first failing commit, and a case passing
at the final commit is censored. (3) Each breakage is judged by hand as stale vs
production bug; stale cases get exactly one repair call (the failing case + the production
diff at the breaking commit + the failure output, with intent-preserving instructions),
validated at the breaking commit.

## Results

| outcome | cases | detail |
|---|---|---|
| generated | 105 | 7 files, all responses complete (no truncation) |
| passing at t | 86 / 105 | 19 dropped (18.1%), all model comprehension errors; zero harness failures |
| broke during window | 3 / 86 (3.5%) | at commits 9, 32 and 200 of 316; survived 8, 31 and 199 commits |
| censored (passing through window end) | 83 / 86 (96.5%) | |
| stale vs bug at first failure | 2 stale, 1 production bug (human-confirmed) | the bug: a transient `TypeError` on `partial().required()`, broken for 3 commits, fixed upstream; recorded, not repaired |
| repair requested / succeeded | 2 / **0** | both responses well-formed (production untouched, assertion counts preserved: 6→6, 2→2) — but neither repaired test passes |

Headline: **the pipeline held at scale — repair did not.** 316 commits × 86 cases ran
with zero harness errors and every breakage attributable, but one-shot repair went 0 for
2, and both failures are individually informative (below).

## Observations

- **Gate drops cluster by file, not by case.** Two files account for 13 of the 19 drops,
  each file with a single root cause, while core/schemas.ts (the largest file) had none.
  Both bad files have indirect module surfaces — to-json-schema consumes schemas built
  elsewhere, mini delegates to core — so the file alone under-determines a correct test,
  and the model filled the gap wrong.
- **Breakage is rare and uncorrelated with file change volume.** The largest-churn file
  (core/schemas.ts, 2,672 changed lines over 83 window commits) produced zero breakages
  among 18 tracked cases; the three breakages came from files with mid-to-low churn.
  (Churn — added+deleted lines — also cannot separate semantic from surface change.)
- **The production-bug branch of the protocol was exercised.** One breakage was a real
  library bug: the asserted behavior held at t, holds at HEAD, and was broken for exactly
  3 commits in between. The judgment step separated it from the two stale cases.
- **Both repair failures are edits confined to the line the error message pointed at.**
  One repair read the changed contract correctly, annotated it in a comment, and still
  asserted +0.5 where its own prompt's failure output said `-0.5`. The other fixed exactly
  the assertion named in the error message and left the neighboring assertion pinned to
  the old internal shape, which the diff — included in the prompt — had changed. Neither
  re-derived the case from the diff. Per protocol there were no retries; 0/2 is recorded
  as the result.
- **Generation volume does not scale with file size.** 33–214 LOC per case across files;
  completion tokens clustered at 1,899–4,703 regardless of input size. Cost stayed
  negligible: generation $0.0169 total, repairs $0.0007, and the 316-commit loop ran in
  19.5 min of working time.

## Limitations

1. **Tracking records first failures only.** A case that breaks and later recovers shows
   only the breakage; the production-bug case recovered 3 commits after breaking, found
   only by probing HEAD and bisecting. With 3 breakages, all individually examined, this
   run's numbers are unaffected; at larger scale it would understate survival.
2. **mini/schemas.ts overlaps classic/schemas.ts.** Both delegate to the same core
   functions, so one shared-function change could count as two breakage events. Not
   observed here (the two breakages came from different commits), but the risk stands.
3. **The file-selection premise failed.** Planning assumed ~40 LOC per generated case;
   measured: ~98 LOC/case over the six planned files, spread 33–214 per file. Larger
   files do not yield more cases, so LOC ranking is not a valid selection criterion for
   securing volume.
4. **The functions-vs-changes cross-check compares only two points in time** (t and
   window end), so it misses mid-window change-then-revert and changes routed through
   referenced functions.

Full record (authoritative, identical numbers): `zod-2026-08-week2-3-main-report-full.md`.
