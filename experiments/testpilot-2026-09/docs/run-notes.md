# Run notes

D-01: mocha@10 installed at workspace root for package-level resolution; root package.json and pnpm-lock.yaml restored afterward. Installed modules retained locally.

Commit date: requested zod hash has author-local commit date July 10; July 11 in Asia/Seoul.

Tracked-status checks permit the running experiment log itself to be modified; upstream zod tracked files must remain unchanged.

D-02: Husky activated during install and blocked commit/push on untracked experiment logs. Addendum authorizes clone-local `git config core.hooksPath /dev/null`; applied without modifying tracked hook files. User separately authorized leaving `Claude outputs/` untracked.
