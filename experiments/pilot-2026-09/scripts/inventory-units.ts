/**
 * inventory-units.ts: list every class unit in packages/zod/src/v4 per §1.1 of the
 * pilot instructions (2026-09-05). Run from the repo root:
 *   npx tsx experiments/pilot-2026-09/scripts/inventory-units.ts
 * Output: experiments/pilot-2026-09/results/units-all.json (tokens added later by count-tokens.py)
 */
import * as ts from "typescript";
import * as fs from "node:fs";
import * as path from "node:path";
import { execSync } from "node:child_process";

const REPO = process.cwd();
const SRC_ROOT = path.join(REPO, "packages/zod/src/v4");
const OUT = path.join(REPO, "experiments/pilot-2026-09/results/units-all.json");
const EXAMPLE = { file: "core/registries.ts", class_name: "$ZodRegistry" }; // D2
const SUFFIXES = ["Def", "Internals", "Params", "Config", "Issue", "Fn"];

if (!fs.existsSync(SRC_ROOT)) throw new Error("run from the zod repo root");

function walk(dir: string, out: string[] = []): string[] {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "tests" || ent.name === "locales") continue;
      walk(p, out);
    } else if (ent.isFile() && ent.name.endsWith(".ts") && !ent.name.endsWith(".d.ts")) {
      out.push(p);
    }
  }
  return out;
}

type Stmt = {
  name: string;
  syntax: string; // class | $constructor | interface | type
  role: "declaring" | "related_type";
  exported: boolean;
  start_line: number; // first line incl. attached leading comment
  code_start_line: number; // first line of the statement proper
  end_line: number;
  text: string;
};

function isExported(node: ts.Node): boolean {
  return (ts.getCombinedModifierFlags(node as ts.Declaration) & ts.ModifierFlags.Export) !== 0;
}

/** Start offset of the comment block attached to `node` (no blank line between it and the node). */
function attachedStart(sf: ts.SourceFile, text: string, node: ts.Node): number {
  const start = node.getStart(sf);
  const ranges = ts.getLeadingCommentRanges(text, node.getFullStart()) || [];
  let attach = start;
  for (let i = ranges.length - 1; i >= 0; i--) {
    const r = ranges[i];
    const between = text.slice(r.end, attach);
    const newlines = (between.match(/\n/g) || []).length;
    if (newlines <= 1) attach = r.pos;
    else break;
  }
  // do not swallow the leading whitespace of the line
  while (attach > 0 && (text[attach - 1] === " " || text[attach - 1] === "\t")) attach--;
  return attach;
}

function mkStmt(sf: ts.SourceFile, text: string, node: ts.Node, name: string, syntax: string, role: Stmt["role"]): Stmt {
  const a = attachedStart(sf, text, node);
  const s = node.getStart(sf);
  const e = node.getEnd();
  return {
    name,
    syntax,
    role,
    exported: isExported(node),
    start_line: sf.getLineAndCharacterOfPosition(a).line + 1,
    code_start_line: sf.getLineAndCharacterOfPosition(s).line + 1,
    end_line: sf.getLineAndCharacterOfPosition(e - 1).line + 1,
    text: text.slice(a, e).replace(/\s+$/, ""),
  };
}

type Candidate = {
  name: string;
  kind: "a" | "b";
  kind_label: "class" | "$constructor";
  node: ts.Node;
  ctor_name_arg?: string | null;
  initializer_kind?: string | null;
  initializer_identifier?: string | null;
  exported: boolean;
};

const files = walk(SRC_ROOT).sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
const units: any[] = [];
const nonExported: any[] = [];
let example: any = null;

for (const abs of files) {
  const rel = path.relative(SRC_ROOT, abs);
  const text = fs.readFileSync(abs, "utf8");
  const sf = ts.createSourceFile(rel, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const typeDecls: { name: string; node: ts.Node; syntax: string }[] = [];
  const cands: Candidate[] = [];

  for (const stmt of sf.statements) {
    if (ts.isClassDeclaration(stmt) && stmt.name) {
      cands.push({ name: stmt.name.text, kind: "a", kind_label: "class", node: stmt, exported: isExported(stmt) });
    } else if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name) || !decl.initializer) continue;
        let init: ts.Expression = decl.initializer;
        while (ts.isParenthesizedExpression(init)) init = init.expression;
        if (!ts.isCallExpression(init)) continue;
        const callee = init.expression;
        const calleeName = ts.isIdentifier(callee) ? callee.text : ts.isPropertyAccessExpression(callee) ? callee.name.text : null;
        if (calleeName !== "$constructor") continue;
        const a0 = init.arguments[0];
        const a1 = init.arguments[1];
        const ctorNameArg = a0 && ts.isStringLiteral(a0) ? a0.text : null;
        let initKind: string | null = null;
        let initIdent: string | null = null;
        if (!a1) initKind = "missing";
        else if (ts.isArrowFunction(a1) || ts.isFunctionExpression(a1)) initKind = "inline_function";
        else if (ts.isIdentifier(a1)) { initKind = "identifier"; initIdent = a1.text; }
        else initKind = ts.SyntaxKind[a1.kind];
        cands.push({ name: decl.name.text, kind: "b", kind_label: "$constructor", node: stmt, ctor_name_arg: ctorNameArg, initializer_kind: initKind, initializer_identifier: initIdent, exported: isExported(stmt) });
      }
    } else if (ts.isInterfaceDeclaration(stmt)) {
      typeDecls.push({ name: stmt.name.text, node: stmt, syntax: "interface" });
    } else if (ts.isTypeAliasDeclaration(stmt)) {
      typeDecls.push({ name: stmt.name.text, node: stmt, syntax: "type" });
    }
  }

  for (const c of cands) {
    const X = c.name;
    const matches = (n: string) => n === X || SUFFIXES.some((s) => n.startsWith(X + s));
    const stmts: Stmt[] = [mkStmt(sf, text, c.node, X, c.kind_label, "declaring")];
    for (const t of typeDecls) if (matches(t.name)) stmts.push(mkStmt(sf, text, t.node, t.name, t.syntax, "related_type"));
    stmts.sort((p, q) => p.start_line - q.start_line);
    const source_text = stmts.map((s) => s.text).join("\n\n");
    const decl = stmts.find((s) => s.role === "declaring")!;
    const unit = {
      class_name: X,
      file: path.posix.join("packages/zod/src/v4", rel.split(path.sep).join("/")),
      dir: rel.includes(path.sep) ? rel.split(path.sep)[0] : "root",
      kind: c.kind,
      kind_label: c.kind_label,
      exported: c.exported,
      ctor_name_arg: c.ctor_name_arg ?? null,
      ctor_name_matches: c.kind === "b" ? c.ctor_name_arg === X : null,
      initializer_kind: c.initializer_kind ?? null,
      initializer_identifier: c.initializer_identifier ?? null,
      declaring_statement: { start_line: decl.start_line, code_start_line: decl.code_start_line, end_line: decl.end_line },
      statements: stmts.map(({ text, ...rest }) => rest),
      included_statement_names: stmts.map((s) => s.name),
      loc: source_text.split("\n").length,
      source_text,
    };
    if (!c.exported) { nonExported.push({ ...unit, source_text: undefined }); continue; }
    if (rel.split(path.sep).join("/") === EXAMPLE.file && X === EXAMPLE.class_name) { example = unit; continue; }
    units.push(unit);
  }
}

units.forEach((u, i) => {
  u.index = i + 1;
  u.unit_id = String(i + 1).padStart(3, "0") + "-" + u.class_name;
});
// put id fields first for readability
const ordered = units.map((u) => ({ unit_id: u.unit_id, index: u.index, ...u }));

const byKind: Record<string, number> = {};
const byDir: Record<string, number> = {};
const byDirKind: Record<string, number> = {};
for (const u of ordered) {
  byKind[u.kind_label] = (byKind[u.kind_label] || 0) + 1;
  byDir[u.dir] = (byDir[u.dir] || 0) + 1;
  byDirKind[u.dir + "/" + u.kind_label] = (byDirKind[u.dir + "/" + u.kind_label] || 0) + 1;
}

const out = {
  generated_at: new Date().toISOString(),
  anchor_commit: execSync("git rev-parse HEAD", { encoding: "utf8" }).trim(),
  typescript_version: ts.version,
  rule: {
    population: "packages/zod/src/v4/**/*.ts excluding **/tests/**, **/locales/**, *.d.ts; exported class declarations (a) and exported `const X = [/*@__PURE__*/] [core.]$constructor(...)` (b)",
    related_types: "top-level interface / type alias in the same file whose name is X or starts with X + one of " + JSON.stringify(SUFFIXES),
    leading_comment: "comment ranges immediately preceding an included statement with no blank line in between",
    source_text: "included statements in file order, verbatim, joined by one blank line; no imports, nothing else",
    ordering: "files sorted by path (classic < core < mini), then by statement position; unit_id = 3-digit 1-based index + class_name",
    example_excluded: EXAMPLE,
    path_mapping: "none ($ kept in unit_id and file names)",
  },
  files_scanned: files.map((f) => path.relative(REPO, f)),
  totals: { units_population: ordered.length, by_kind: byKind, by_dir: byDir, by_dir_kind: byDirKind, non_exported_candidates: nonExported.length, example_unit_excluded: example ? 1 : 0 },
  example_unit: example,
  non_exported_candidates: nonExported,
  units: ordered,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(JSON.stringify(out.totals, null, 1));
console.log("example:", example ? { class_name: example.class_name, file: example.file, loc: example.loc, statements: example.included_statement_names } : null);
console.log("written", path.relative(REPO, OUT));
