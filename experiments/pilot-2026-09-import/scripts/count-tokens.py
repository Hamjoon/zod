"""count-tokens.py: add tiktoken o200k_base token counts to results/units-all.json (units, example unit,
example test file). Run from the repo root with the pilot venv:
  ../.venv/bin/python experiments/pilot-2026-09-import/scripts/count-tokens.py
"""
import json, sys, pathlib, tiktoken
ROOT = pathlib.Path.cwd()
P = ROOT / "experiments/pilot-2026-09-import/results/units-all.json"
EXAMPLE_TEST = ROOT / "packages/zod/src/v4/classic/tests/registries.test.ts"
enc = tiktoken.get_encoding("o200k_base")
def n(s): return len(enc.encode(s, disallowed_special=()))
d = json.loads(P.read_text())
for u in d["units"]:
    u["tokens"] = n(u["source_text"])
if d.get("example_unit"):
    d["example_unit"]["tokens"] = n(d["example_unit"]["source_text"])
et = EXAMPLE_TEST.read_text()
d["example_test_file"] = {"file": "packages/zod/src/v4/classic/tests/registries.test.ts", "loc": et.count("\n") + (0 if et.endswith("\n") else 1), "tokens": n(et)}
d["tokenizer"] = {"library": "tiktoken", "version": tiktoken.__version__, "encoding": "o200k_base"}
P.write_text(json.dumps(d, indent=2, ensure_ascii=False))
toks = sorted(u["tokens"] for u in d["units"])
q = lambda p: toks[min(len(toks)-1, int(p*len(toks)))]
print(json.dumps({"units": len(toks), "min": toks[0], "p25": q(.25), "median": q(.5), "p75": q(.75), "p90": q(.9), "max": toks[-1],
                  "example_unit_tokens": d["example_unit"]["tokens"] if d.get("example_unit") else None,
                  "example_test_tokens": d["example_test_file"]["tokens"], "tiktoken": tiktoken.__version__}))
