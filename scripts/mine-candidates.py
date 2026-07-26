#!/usr/bin/env python3
"""mine-candidates.py — S/P/N 후보 채굴 및 검증 큐 생성.

2026-07 3주차 Zod 30케이스 스크리닝에 사용된 로직의 스크립트화.
zod-30case-screening.md의 제외 기준 1~6과 분류 휴리스틱을 그대로 구현한다.

사용:
  python3 mine-candidates.py --repo /path/to/zod --since 2025-01-01 \
      --seed 20260715 --output screening_queues.json

재현 검증: 클론 상태 912f0f51 + 위 파라미터로 실행 시 기존
screening_queues.json과 동일한 큐가 나와야 한다 (diff로 확인 권장).
"""
import argparse, json, random, re, subprocess

# 제외 기준 1: 지난 6케이스 upstream 커밋 (신규 실험에서는 채택된 30건 sha로 교체/확장)
PRIOR_SHAS = {"0fe88407", "ae68f62f", "f32ddf9e", "cede2c63", "61d7bedb", "b5ab55e4"}
# 제외 기준 4: 버전 릴리스 커밋 메시지 패턴
VER_RE = re.compile(r"^(v?\d+\.\d+\.\d+|publish\b|release\b)", re.I)

def is_test(f):    return "/tests/" in f or f.endswith(".test.ts")
def is_locale(f):  return "/locales/" in f
def is_prod(f):
    return f.startswith("packages/zod/src/") and f.endswith(".ts") and not is_test(f)

def collect_commits(repo, since):
    log = subprocess.run(
        ["git", "-C", repo, "log", f"--since={since}", "--no-merges",
         "--format=COMMIT\t%H\t%cs\t%s", "--numstat"],
        capture_output=True, text=True, check=True).stdout
    commits, cur = [], None
    for line in log.splitlines():
        if line.startswith("COMMIT\t"):
            if cur: commits.append(cur)
            _, sha, date, msg = line.split("\t", 3)
            cur = {"sha": sha[:8], "date": date, "msg": msg,
                   "prod_add": 0, "prod_del": 0, "prod_files": set(),
                   "test_add": 0, "test_del": 0}
        elif line.strip() and cur is not None:
            p = line.split("\t")
            if len(p) != 3: continue
            try: a, d = int(p[0]), int(p[1])
            except ValueError: continue  # binary
            f = p[2]
            if is_prod(f):
                cur["prod_add"] += a; cur["prod_del"] += d; cur["prod_files"].add(f)
            elif is_test(f) and f.startswith("packages/zod/"):
                cur["test_add"] += a; cur["test_del"] += d
    if cur: commits.append(cur)
    return commits

def classify(commits, max_lines=250, max_files=4):
    pools = {"S": [], "P": [], "N": []}
    excl = {k: 0 for k in ["prior", "no_code", "locale_only",
                           "version_msg", "non_v4", "oversize"]}
    for c in commits:
        if c["sha"] in PRIOR_SHAS: excl["prior"] += 1; continue
        pl = c["prod_add"] + c["prod_del"]
        tl = c["test_add"] + c["test_del"]
        if pl == 0 and tl == 0: excl["no_code"] += 1; continue
        pf = c["prod_files"]
        if pf and all(is_locale(f) for f in pf): excl["locale_only"] += 1; continue
        if VER_RE.match(c["msg"].strip()): excl["version_msg"] += 1; continue
        if pf and not any("/src/v4/" in f for f in pf): excl["non_v4"] += 1; continue
        if pl > max_lines or len(pf) > max_files: excl["oversize"] += 1; continue
        e = {"sha": c["sha"], "date": c["date"], "msg": c["msg"][:80],
             "pl": pl, "pf": len(pf), "ta": c["test_add"], "td": c["test_del"]}
        fix = c["msg"].lower().startswith(("fix", "bug"))
        if pl > 0 and tl > 0:
            # P-viable: fix + 테스트 주로 추가(신규 oracle)
            if fix and c["test_add"] >= 3 and c["test_del"] <= c["test_add"] * 0.3:
                pools["P"].append(e)
            # S-viable: 기존 기대값 재작성 흔적(테스트 삭제 라인)
            elif c["test_del"] >= 2:
                pools["S"].append(e)
            # 그 외 미세 변경은 어느 쪽도 확신 불가 → 버림
        elif pl > 0 and tl == 0:
            pools["N"].append(e)
    return pools, excl

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--repo", required=True)
    ap.add_argument("--since", default="2025-01-01")
    ap.add_argument("--seed", type=int, default=20260715)
    ap.add_argument("--output", default="screening_queues.json")
    args = ap.parse_args()

    commits = collect_commits(args.repo, args.since)
    pools, excl = classify(commits)

    head = subprocess.run(["git", "-C", args.repo, "rev-parse", "--short=8", "HEAD"],
                          capture_output=True, text=True).stdout.strip()
    out = {"seed": args.seed, "since": args.since, "repo_head": head,
           "scanned": len(commits), "excluded": excl, "pools": {}}
    for name in ["S", "P", "N"]:
        pool = pools[name][:]
        random.Random(args.seed).shuffle(pool)  # 셔플 순서 = 검증 큐
        out["pools"][name] = pool
        print(f"{name} 풀: {len(pool)}건")
    print("제외:", excl)

    with open(args.output, "w", encoding="utf-8") as fh:
        json.dump(out, fh, ensure_ascii=False, indent=1)
    print(f"저장: {args.output}")

if __name__ == "__main__":
    main()
