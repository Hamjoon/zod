"""run-generation.py: Phase 3, model calls for the sampled units x called techniques.
POST {"model": "openai/gpt-oss-120b", "temperature": 0, "messages": [{"role": "user", "content": prompt}]}
to OpenRouter. One call per (unit, technique), no retries, concurrency 2. Per call, under llm/{unit_id}/{TECH}/:
request.json (body only, never headers), raw-response.json, response.md (assistant content verbatim),
usage.json, run.json. The API key is read from OPENROUTER_API_KEY, checked for presence only, never written.
Run from the zod repo root: ../.venv/bin/python experiments/pilot-2026-09-import/scripts/run-generation.py
"""
import concurrent.futures, datetime, json, os, pathlib, sys, time, urllib.error, urllib.request

ROOT = pathlib.Path.cwd(); EXP = ROOT / "experiments/pilot-2026-09-import"
MODEL = "openai/gpt-oss-120b"; URL = "https://openrouter.ai/api/v1/chat/completions"
TECHS = ["COT", "TOT", "GTOT"]; CONCURRENCY = 2; TIMEOUT_S = 900

key = os.environ.get("OPENROUTER_API_KEY")
if not key:
    sys.exit("OPENROUTER_API_KEY is not set in the process environment; aborting before any call")
units = [s["unit_id"] for s in json.loads((EXP / "results/units-sampled.json").read_text(encoding="utf-8"))["sampled"]]
jobs = [(u, t) for u in units for t in TECHS]

def call(u, t):
    d = EXP / "llm" / u / t
    prompt = (d / "prompt.md").read_text(encoding="utf-8")
    body = {"model": MODEL, "temperature": 0, "messages": [{"role": "user", "content": prompt}]}
    (d / "request.json").write_text(json.dumps(body, indent=2, ensure_ascii=False), encoding="utf-8")
    req = urllib.request.Request(URL, data=json.dumps(body).encode("utf-8"), method="POST",
                                 headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"})
    ts = datetime.datetime.now(datetime.timezone.utc).isoformat()
    status = None; raw = None; err = None
    t0 = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT_S) as r:
            status = r.status; raw = r.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        status = e.code; err = f"HTTPError {e.code}"
        try: raw = e.read().decode("utf-8", "replace")
        except Exception: raw = None
    except Exception as e:
        err = f"{type(e).__name__}: {e}"
    latency = time.perf_counter() - t0
    parsed = None
    if raw:
        try: parsed = json.loads(raw)
        except Exception as e: err = (err or "") + f" | non-JSON body: {e}"
    (d / "raw-response.json").write_text(raw if raw is not None else json.dumps({"transport_error": err}), encoding="utf-8")
    content = None; finish = None; native = None; model_reported = None; usage = None; rid = None; provider = None
    if isinstance(parsed, dict):
        ch = (parsed.get("choices") or [None])[0]
        if isinstance(ch, dict):
            content = (ch.get("message") or {}).get("content"); finish = ch.get("finish_reason"); native = ch.get("native_finish_reason")
        model_reported = parsed.get("model"); usage = parsed.get("usage"); rid = parsed.get("id"); provider = parsed.get("provider")
        if parsed.get("error"): err = (err or "") + " | api error: " + json.dumps(parsed["error"])[:300]
    (d / "response.md").write_text(content if isinstance(content, str) else "", encoding="utf-8")
    (d / "usage.json").write_text(json.dumps(usage, indent=2) if usage is not None else "null", encoding="utf-8")
    run = {"unit_id": u, "technique": t, "timestamp_utc": ts, "latency_s": round(latency, 3), "http_status": status,
           "finish_reason": finish, "native_finish_reason": native, "model_requested": MODEL, "model_reported": model_reported,
           "provider": provider, "response_id": rid, "content_chars": len(content) if isinstance(content, str) else 0,
           "content_empty": not content, "completion_tokens": (usage or {}).get("completion_tokens") if isinstance(usage, dict) else None,
           "prompt_tokens_reported": (usage or {}).get("prompt_tokens") if isinstance(usage, dict) else None, "error": err}
    (d / "run.json").write_text(json.dumps(run, indent=2), encoding="utf-8")
    return run

print(f"Phase 3 start {datetime.datetime.now(datetime.timezone.utc).isoformat()} jobs={len(jobs)} concurrency={CONCURRENCY}", flush=True)
results = []
with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENCY) as ex:
    futs = {ex.submit(call, u, t): (u, t) for u, t in jobs}
    for f in concurrent.futures.as_completed(futs):
        r = f.result(); results.append(r)
        print(f"{r['unit_id']:<24} {r['technique']:<5} http={r['http_status']} finish={r['finish_reason']} native={r['native_finish_reason']} "
              f"completion_tokens={r['completion_tokens']} chars={r['content_chars']} latency={r['latency_s']}s err={r['error']}", flush=True)
results.sort(key=lambda r: (units.index(r["unit_id"]), TECHS.index(r["technique"])))
(EXP / "results/phase3-runs.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
flags = [r for r in results if r["finish_reason"] == "length" or r["content_empty"] or r["error"] or r["http_status"] != 200]
print("Phase 3 done. flagged:", [(r["unit_id"], r["technique"], r["finish_reason"], r["http_status"], r["error"]) for r in flags] or "none", flush=True)
