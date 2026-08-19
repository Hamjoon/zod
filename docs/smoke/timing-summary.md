# Per-commit execution timing (deliverable 6)

Full per-commit records (checkout / install / vitest smoke / vitest canary seconds) are in
`survival-log.jsonl` (one JSON line per commit, 316 rows). Summary:

| metric | median | max | total |
|---|---|---|---|
| checkout | 0.01s | 0.14s | 0.1 min |
| vitest (generated tests) | 0.88s | 2.13s | 4.7 min |
| vitest (canary) | 0.81s | 1.56s | 5.2 min |
| pnpm install (20 commits, lockfile-md5 rule) | — | 2s | 32s |

Whole-loop working time ≈ 10.4 min for 316 commits. Checkout medians are ~0.01s
because blobs were already present locally; a cold blob:none clone pays lazy blob fetches on
first traversal instead.
