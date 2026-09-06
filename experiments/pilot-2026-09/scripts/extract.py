"""extract.py: Phase 4 (RQ1). Two-stage extraction of the test file from each model response.

Stage 1 (delimiter-first): the block between `###Test START##` and `###Test END##`, accepting 2 or 3 trailing
`#` on either marker. If several marker pairs exist, each END marker is paired with the last START marker
before it (innermost pair) and the longest resulting block is taken. If a markdown fence wraps the block,
the fence lines only are stripped.
Stage 2 (fallback, when no pair exists): among fenced code blocks, the single best candidate that
(i) imports from `vitest`, (ii) contains `test(`, `it(` or `describe(`, (iii) has balanced curly braces;
if several, the longest.
Records per (unit, technique): delimiters_found, detected (MSR: a block obtained by stage 1 or 2), method,
extracted_structured (CSR: >=1 import, >=1 test(/it(, >=1 expect(, balanced curly braces, no fence lines,
no HTML tags inside). Structured extractions are saved as generated/{unit_id}.{TECH}.test.ts; detected but
unstructured blocks go to generated/_unstructured/ for audit only. Output: results/rq1-extraction.json.
Run from the zod repo root: ../.venv/bin/python experiments/pilot-2026-09/scripts/extract.py
"""
import json, pathlib, re
ROOT = pathlib.Path.cwd(); EXP = ROOT / "experiments/pilot-2026-09"
TECHS = ["COT", "TOT", "GTOT"]
# Markers may be wrapped in markdown emphasis or inline code (`**###Test START##**`); the wrapper is part of the
# marker decoration, not of the file, and is consumed with the marker (J-02). `decoration` records what was seen.
WRAP = r"(?:\*\*|__|`)?"
START = re.compile(WRAP + r"###Test START#{2,3}" + WRAP); END = re.compile(WRAP + r"###Test END#{2,3}" + WRAP)
FENCE_LINE = re.compile(r"^[ \t]*```[^\n]*$", re.M)
FENCED_BLOCK = re.compile(r"^[ \t]*```[^\n]*\n(.*?)^[ \t]*```[ \t]*$", re.M | re.S)
HTML_TAG = re.compile(r"</?(html|body|div|p|br|span|pre|code|b|i|ul|ol|li|h[1-6]|table|tr|td)\b[^>]*>", re.I)

def brace_balance(code):
    depth = {"{": 0, "(": 0, "[": 0}; pairs = {"}": "{", ")": "(", "]": "["}; neg = False
    i, n = 0, len(code)
    while i < n:
        c = code[i]
        if c == "/" and i + 1 < n and code[i + 1] == "/":
            j = code.find("\n", i); i = n if j < 0 else j; continue
        if c == "/" and i + 1 < n and code[i + 1] == "*":
            j = code.find("*/", i + 2); i = n if j < 0 else j + 2; continue
        if c in "\"'`":
            q = c; i += 1
            while i < n and code[i] != q:
                if code[i] == "\\": i += 1
                if q != "`" and code[i:i+1] == "\n": break
                i += 1
            i += 1; continue
        if c in depth: depth[c] += 1
        elif c in pairs:
            depth[pairs[c]] -= 1
            if depth[pairs[c]] < 0: neg = True
        i += 1
    return depth, neg

def strip_wrapping_fences(block):
    lines = block.split("\n"); stripped = 0
    i = 0
    while i < len(lines) and lines[i].strip() == "": i += 1
    if i < len(lines) and FENCE_LINE.match(lines[i]): lines = lines[i + 1:]; stripped += 1
    j = len(lines)
    while j > 0 and lines[j - 1].strip() == "": j -= 1
    if j > 0 and FENCE_LINE.match(lines[j - 1]): lines = lines[:j - 1]; stripped += 1
    return "\n".join(lines).strip("\n"), stripped

def stage1(text):
    starts = [m for m in START.finditer(text)]; ends = [m for m in END.finditer(text)]
    if not starts or not ends: return None, {"start_markers": len(starts), "end_markers": len(ends), "pairs": 0}
    pairs = []
    for e in ends:
        prior = [s for s in starts if s.end() <= e.start()]
        if prior: s = prior[-1]; pairs.append((s, e))
    if not pairs: return None, {"start_markers": len(starts), "end_markers": len(ends), "pairs": 0}
    s, e = max(pairs, key=lambda p: p[1].start() - p[0].end())
    block = text[s.end():e.start()]
    code, stripped = strip_wrapping_fences(block)
    deco = sorted({m.group(0).replace("###Test START", "").replace("###Test END", "").replace("#", "") for m in (s, e)} - {""})
    return code, {"start_markers": len(starts), "end_markers": len(ends), "pairs": len(pairs), "fence_lines_stripped": stripped, "marker_decoration": deco}

def stage2(text):
    cands = []
    for m in FENCED_BLOCK.finditer(text):
        code = m.group(1).strip("\n")
        imp = re.search(r"""from\s+["']vitest["']|require\(\s*["']vitest["']\s*\)""", code) is not None
        has_test = re.search(r"\b(test|it|describe)\s*\(", code) is not None
        depth, neg = brace_balance(code)
        cands.append({"len": len(code), "imports_vitest": imp, "has_test": has_test, "balanced": depth["{"] == 0 and not neg, "code": code})
    ok = [c for c in cands if c["imports_vitest"] and c["has_test"] and c["balanced"]]
    if not ok: return None, {"fenced_blocks": len(cands), "eligible": 0}
    best = max(ok, key=lambda c: c["len"])
    return best["code"], {"fenced_blocks": len(cands), "eligible": len(ok)}

def structure_checks(code):
    depth, neg = brace_balance(code)
    c = {
        "has_import": re.search(r"^[ \t]*import\b", code, re.M) is not None,
        "has_test_call": re.search(r"\b(test|it)(\.[A-Za-z]+)?\s*\(", code) is not None,
        "has_expect": re.search(r"\bexpect\s*\(", code) is not None,
        "braces_balanced": depth["{"] == 0 and not neg,
        "parens_balanced": depth["("] == 0, "brackets_balanced": depth["["] == 0,
        "no_fence_lines": FENCE_LINE.search(code) is None,
        "no_html": HTML_TAG.search(code) is None,
    }
    c["structured"] = all(c[k] for k in ["has_import", "has_test_call", "has_expect", "braces_balanced", "no_fence_lines", "no_html"])
    return c

units = json.loads((EXP / "results/units-sampled.json").read_text(encoding="utf-8"))["sampled"]
rows = []
(EXP / "generated").mkdir(exist_ok=True); (EXP / "generated/_unstructured").mkdir(exist_ok=True)
for u in units:
    for t in TECHS:
        d = EXP / "llm" / u["unit_id"] / t
        text = (d / "response.md").read_text(encoding="utf-8") if (d / "response.md").exists() else ""
        run = json.loads((d / "run.json").read_text()) if (d / "run.json").exists() else {}
        code, info1 = stage1(text); method = "delimiter" if code is not None else None; info2 = None
        if code is None:
            code, info2 = stage2(text); method = "fallback" if code is not None else None
        row = {"unit_id": u["unit_id"], "class_name": u["class_name"], "technique": t, "http_status": run.get("http_status"),
               "finish_reason": run.get("finish_reason"), "response_chars": len(text), "response_empty": len(text.strip()) == 0,
               "delimiters_found": info1["pairs"] > 0, "stage1": info1, "stage2": info2, "detected": code is not None, "method": method,
               "extracted_structured": False, "extracted_structured_strict": False, "checks": None, "extracted_chars": None, "extracted_loc": None, "saved_path": None}
        if code is not None:
            chk = structure_checks(code); row["checks"] = chk; row["extracted_structured"] = chk["structured"]
            row["extracted_chars"] = len(code); row["extracted_loc"] = code.count("\n") + 1
            row["extracted_structured_strict"] = chk["structured"] and not info1.get("marker_decoration")
            name = f"{u['unit_id']}.{t}.test.ts"
            out = (EXP / "generated" / name) if chk["structured"] else (EXP / "generated/_unstructured" / name)
            out.write_text(code + ("\n" if not code.endswith("\n") else ""), encoding="utf-8")
            row["saved_path"] = str(out.relative_to(EXP))
        rows.append(row)

def rate(rs, k): return {"n": len(rs), "k": sum(1 for r in rs if r[k]), "rate": round(sum(1 for r in rs if r[k]) / len(rs), 4) if rs else None}
per_tech = {t: {"delimiters_found": rate([r for r in rows if r["technique"] == t], "delimiters_found"),
               "MSR_detected": rate([r for r in rows if r["technique"] == t], "detected"),
               "CSR_structured": rate([r for r in rows if r["technique"] == t], "extracted_structured"),
               "CSR_structured_strict_no_marker_decoration": rate([r for r in rows if r["technique"] == t], "extracted_structured_strict")} for t in TECHS}
pooled = {"delimiters_found": rate(rows, "delimiters_found"), "MSR_detected": rate(rows, "detected"), "CSR_structured": rate(rows, "extracted_structured"),
          "CSR_structured_strict_no_marker_decoration": rate(rows, "extracted_structured_strict")}
out = {"definitions": __doc__.strip(), "techniques_called": TECHS, "techniques_pending": ["ZSL", "FSL"], "per_technique": per_tech, "pooled": pooled, "rows": rows}
(EXP / "results/rq1-extraction.json").write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
print(f"{'unit':<24} {'tech':<5} {'delim':<6} {'detected':<9} {'method':<10} {'structured':<11} {'loc':>5} {'deco':<6} failed_checks")
for r in rows:
    fails = [k for k, v in (r["checks"] or {}).items() if v is False] if r["checks"] else []
    print(f"{r['unit_id']:<24} {r['technique']:<5} {str(r['delimiters_found']):<6} {str(r['detected']):<9} {str(r['method']):<10} {str(r['extracted_structured']):<11} {str(r['extracted_loc']):>5} {''.join(r['stage1'].get('marker_decoration') or []) or '-':<6} {','.join(fails)}")
print("per technique:", json.dumps({t: {k: v['rate'] for k, v in per_tech[t].items()} for t in TECHS}))
print("pooled:", json.dumps({k: v['rate'] for k, v in pooled.items()}))
