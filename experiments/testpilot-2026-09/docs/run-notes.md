# Run notes

D-01: mocha@10 installed at workspace root for package-level resolution; root package.json and pnpm-lock.yaml restored afterward. Installed modules retained locally.

Commit date: requested zod hash has author-local commit date July 10; July 11 in Asia/Seoul.

Tracked-status checks permit the running experiment log itself to be modified; upstream zod tracked files must remain unchanged.

D-02: Husky activated during install and blocked commit/push on untracked experiment logs. Addendum authorizes clone-local `git config core.hooksPath /dev/null`; applied without modifying tracked hook files. User separately authorized leaving `Claude outputs/` untracked.

D-03: Step 7 CommonJS .js probe failed in zod ESM scope; no authorized fallback. See handover.

D-03 resolved: Addendum 2 main CommonJS wrapper avoids zod ESM test scope without changing testpilot2 or tracked zod files.

L-01: nyc covers only wrappers/zod/index.js (467-byte coverage JSON); no zod implementation statement coverage is measured in this track.

Generation decisions: use website-doc snippets with a cap to be specified later; main string has 807 snippets and parse has 250. Attached doc comments are zero, so no doc-comment template slot is needed for this stage.
