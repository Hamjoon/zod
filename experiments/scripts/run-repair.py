#!/usr/bin/env python3
"""
Zod main experiment (2026-08 week4) - Phase 7: repair

Posts the prepared repair requests to OpenRouter and saves the evidence bundle.
The prompts were assembled beforehand; this script only issues the calls.

Usage:
  export OPENROUTER_API_KEY=...
  python3 run-repair.py --dir ./repair
"""

import argparse
import json
import os
import re
import subprocess
import time
from datetime import datetime, timezone
from pathlib import Path

ENDPOINT = "https://openrouter.ai/api/v1/chat/completions"


def call(request_path: Path, raw_out: Path) -> dict:
    api_key = os.environ.get("OPENROUTER_API_KEY", "")
    if not api_key:
        raise SystemExit("[error] OPENROUTER_API_KEY is not set.")
    start = time.time()
    start_utc = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    proc = subprocess.run(
        ["curl", "-sS", "-w", "%{http_code}", "-o", str(raw_out),
         "-X", "POST", ENDPOINT,
         "-H", f"Authorization: Bearer {api_key}",
         "-H", "Content-Type: application/json",
         "--data-binary", f"@{request_path}"],
        capture_output=True, text=True,
    )
    return {
        "start_utc": start_utc,
        "duration_seconds": int(time.time() - start),
        "http_code": proc.stdout.strip()[-3:] if proc.stdout.strip() else "000",
        "curl_exit": proc.returncode,
        "curl_stderr": proc.stderr.strip()[:500],
        "endpoint": ENDPOINT,
        "request_file": request_path.name,
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True, help="directory holding the repair-* subfolders")
    args = ap.parse_args()

    root = Path(args.dir).expanduser().resolve()
    dirs = sorted(d for d in root.iterdir() if d.is_dir() and (d / "repair-request.json").exists())
    if not dirs:
        raise SystemExit(f"[error] no repair requests under {root}")

    summary = []
    for d in dirs:
        print(f"\n=== {d.name} ===", flush=True)
        if (d / "repair-response.md").exists():
            print("  already done; skipping.", flush=True)
            summary.append({"id": d.name, "status": "skipped"})
            continue

        meta = call(d / "repair-request.json", d / "repair-raw-response.json")
        try:
            raw = json.loads((d / "repair-raw-response.json").read_text())
        except Exception as e:
            meta["error"] = f"failed to parse response JSON: {e}"
            (d / "repair-run.json").write_text(json.dumps(meta, indent=2))
            print(f"  [failed] {meta['error']}  http={meta['http_code']}", flush=True)
            summary.append({"id": d.name, "status": "failed"})
            continue

        if "error" in raw or "choices" not in raw:
            meta["error"] = json.dumps(raw.get("error", raw))[:500]
            (d / "repair-run.json").write_text(json.dumps(meta, indent=2))
            print(f"  [failed] API error: {meta['error'][:200]}", flush=True)
            summary.append({"id": d.name, "status": "failed"})
            continue

        choice = raw["choices"][0]
        text = choice["message"]["content"]
        meta.update({"model_reported": raw.get("model"),
                     "finish_reason": choice.get("finish_reason"),
                     "response_id": raw.get("id")})
        (d / "repair-run.json").write_text(json.dumps(meta, indent=2))
        (d / "repair-usage.json").write_text(json.dumps(raw.get("usage", {}), indent=2))
        (d / "repair-response.md").write_text(text)

        m = re.search(r"```ts\n(.*?)```", text, re.DOTALL) or \
            re.search(r"```(?:typescript)?\n(.*?)```", text, re.DOTALL)
        if m:
            (d / "repaired-case.ts").write_text(m.group(1))
            status = "ok"
        else:
            status = "no-code-fence"
            print("  [warning] no code fence found; check repair-response.md", flush=True)

        u = raw.get("usage", {})
        print(f"  finish_reason={meta['finish_reason']}  prompt={u.get('prompt_tokens')}  "
              f"completion={u.get('completion_tokens')}  cost=${u.get('cost', 0):.5f}  "
              f"{meta['duration_seconds']}s", flush=True)
        summary.append({"id": d.name, "status": status,
                        "finish_reason": meta["finish_reason"],
                        "prompt_tokens": u.get("prompt_tokens"),
                        "completion_tokens": u.get("completion_tokens"),
                        "cost": u.get("cost"),
                        "duration_seconds": meta["duration_seconds"]})

    (root / "repair-manifest.json").write_text(json.dumps(summary, indent=2))
    print("\n=== Summary ===")
    for s in summary:
        print(f"  {s['id']:36s} {s['status']}")
    print(f"\nOutput: {root}")


if __name__ == "__main__":
    main()
