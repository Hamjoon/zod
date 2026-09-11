"""render-prompts.py: render the five prompt templates for class units.

Modes (run from the zod repo root with the pilot venv):
  count  : render all five prompts for every population unit, count tokens (tiktoken o200k_base),
           apply the paper token rule (max over techniques <= 4096) -> results/units-selected.json
  write  : write llm/{unit_id}/{TECH}/prompt.md for the units listed in --units (default: results/units-sampled.json)
           and a token table -> results/prompt-tokens.json  (Phase 2)
Substitution is a single regex pass over the placeholders, so text inside a substituted value is never re-substituted.
Template files end with one newline, which is stripped before substitution.
"""
import argparse, hashlib, json, pathlib, re, sys
import tiktoken

ROOT = pathlib.Path.cwd()
EXP = ROOT / "experiments/pilot-2026-09-import"
TECHS = ["ZSL", "FSL", "COT", "TOT", "GTOT"]
TOKEN_LIMIT = 4096
EXAMPLE_TEST = ROOT / "packages/zod/src/v4/classic/tests/registries.test.ts"
PLACEHOLDER = re.compile(r"\{(class_name|module_specifier|source_code|example_class_name|example_source|example_test_source)\}")
enc = tiktoken.get_encoding("o200k_base")

def ntok(s): return len(enc.encode(s, disallowed_special=()))
def sha(s): return hashlib.sha256(s.encode("utf-8")).hexdigest()

def load_templates():
    t = {}
    for tech in TECHS:
        raw = (EXP / "prompts" / f"{tech}.txt").read_text(encoding="utf-8")
        t[tech] = {"raw": raw, "text": raw[:-1] if raw.endswith("\n") else raw, "sha256_file": sha(raw)}
    return t

def render(template_text, values):
    return PLACEHOLDER.sub(lambda m: values[m.group(1)], template_text)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mode", choices=["count", "write"])
    ap.add_argument("--units", default=str(EXP / "results/units-sampled.json"))
    a = ap.parse_args()
    all_units = json.loads((EXP / "results/units-all.json").read_text(encoding="utf-8"))
    templates = load_templates()
    ex = all_units["example_unit"]
    example_test_source = EXAMPLE_TEST.read_text(encoding="utf-8")
    base_values = {"example_class_name": ex["class_name"], "example_source": ex["source_text"], "example_test_source": example_test_source}

    def prompts_for(u):
        module_specifier = "./" + pathlib.PurePosixPath(u["file"]).stem + ".js"
        v = dict(base_values, class_name=u["class_name"], module_specifier=module_specifier, source_code=u["source_text"])
        return {tech: render(templates[tech]["text"], v) for tech in TECHS}

    if a.mode == "count":
        rows, kept = [], []
        for u in all_units["units"]:
            p = prompts_for(u)
            toks = {tech: ntok(p[tech]) for tech in TECHS}
            mx = max(toks.values()); mt = max(toks, key=toks.get)
            row = {"unit_id": u["unit_id"], "class_name": u["class_name"], "file": u["file"], "dir": u["dir"], "kind": u["kind"],
                   "kind_label": u["kind_label"], "initializer_kind": u["initializer_kind"], "loc": u["loc"], "unit_tokens": u["tokens"],
                   "prompt_tokens": toks, "max_prompt_tokens": mx, "max_technique": mt, "kept": mx <= TOKEN_LIMIT}
            rows.append(row)
            if row["kept"]: kept.append(row)
        ut = sorted(r["unit_tokens"] for r in kept)
        q = lambda p: ut[min(len(ut) - 1, int(p * len(ut)))]
        by_dir = {}
        for r in kept: by_dir[r["dir"]] = by_dir.get(r["dir"], 0) + 1
        out = {
            "rule": f"keep units whose maximum rendered prompt token count over {TECHS} is <= {TOKEN_LIMIT} (paper token rule; FSL includes the D2 example)",
            "tokenizer": {"library": "tiktoken", "version": tiktoken.__version__, "encoding": "o200k_base"},
            "templates": {tech: {"sha256": templates[tech]["sha256_file"], "template_tokens_without_placeholders": ntok(render(templates[tech]["text"], {k: "" for k in ["class_name","module_specifier","source_code","example_class_name","example_source","example_test_source"]}))} for tech in TECHS},
            "example": {"class_name": ex["class_name"], "unit_tokens": ex["tokens"], "test_file": all_units["example_test_file"]},
            "totals": {"population": len(rows), "kept": len(kept), "excluded_over_limit": len(rows) - len(kept), "kept_by_dir": by_dir},
            "kept_unit_tokens_distribution": {"min": ut[0], "p25": q(.25), "median": q(.5), "p75": q(.75), "p90": q(.9), "max": ut[-1]},
            "excluded": [r for r in rows if not r["kept"]],
            "units": rows,
        }
        (EXP / "results/units-selected.json").write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
        print(json.dumps({"totals": out["totals"], "dist": out["kept_unit_tokens_distribution"], "templates": {k: v["template_tokens_without_placeholders"] for k, v in out["templates"].items()},
                          "excluded": [(r["unit_id"], r["max_prompt_tokens"]) for r in out["excluded"]],
                          "closest_kept": [(r["unit_id"], r["max_prompt_tokens"]) for r in sorted(kept, key=lambda r: -r["max_prompt_tokens"])[:5]]}))
    else:
        sel = json.loads(pathlib.Path(a.units).read_text(encoding="utf-8"))
        ids = [s["unit_id"] for s in sel["sampled"]] if "sampled" in sel else [s["unit_id"] for s in sel["units"]]
        by_id = {u["unit_id"]: u for u in all_units["units"]}
        table = {}
        for uid in ids:
            u = by_id[uid]; p = prompts_for(u); table[uid] = {}
            for tech in TECHS:
                d = EXP / "llm" / uid / tech; d.mkdir(parents=True, exist_ok=True)
                (d / "prompt.md").write_text(p[tech], encoding="utf-8")
                table[uid][tech] = {"tokens": ntok(p[tech]), "sha256": sha(p[tech]), "chars": len(p[tech])}
        (EXP / "results/prompt-tokens.json").write_text(json.dumps({"tokenizer": {"library": "tiktoken", "version": tiktoken.__version__, "encoding": "o200k_base"}, "units": table}, indent=2), encoding="utf-8")
        for uid in ids: print(uid, {t: table[uid][t]["tokens"] for t in TECHS})

if __name__ == "__main__":
    main()
