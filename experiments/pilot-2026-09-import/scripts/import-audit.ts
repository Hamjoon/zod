/** Phase 5 import audit for week 2 and the archived week-1 structured files. */
import * as fs from "node:fs";
import * as path from "node:path";
import * as ts from "typescript";

const ROOT = process.cwd();
const EXP = path.join(ROOT, "experiments/pilot-2026-09-import");
const W1 = path.resolve(ROOT, "../zod-week1-archive/experiments/pilot-2026-09");
const RESULTS = path.join(EXP, "results");

type Unit = { unit_id: string; class_name: string; file: string };
type ImportedName = { kind: "named" | "default" | "namespace"; imported: string; local: string; type_only: boolean; exported: boolean | null };

const allUnits = JSON.parse(fs.readFileSync(path.join(RESULTS, "units-all.json"), "utf8"));
const byId = new Map<string, Unit>(allUnits.units.map((u: Unit) => [u.unit_id, u]));
const sampled = JSON.parse(fs.readFileSync(path.join(RESULTS, "units-sampled.json"), "utf8")).sampled as Unit[];
const sampleOrder = new Map(sampled.map((u, i) => [u.unit_id, i]));
const configPath = path.join(ROOT, "packages/zod/tsconfig.test.json");
const configRead = ts.readConfigFile(configPath, ts.sys.readFile);
if (configRead.error) throw new Error(ts.flattenDiagnosticMessageText(configRead.error.messageText, "\n"));
const parsed = ts.parseJsonConfigFileContent(configRead.config, ts.sys, path.dirname(configPath));
const options = { ...parsed.options, noEmit: true };

function rel(p: string | undefined): string | null {
  if (!p) return null;
  const r = path.relative(ROOT, p);
  return r.startsWith("..") ? p : r.split(path.sep).join("/");
}

function moduleSpecifierFor(unit: Unit): string {
  return "./" + path.posix.basename(unit.file, ".ts") + ".js";
}

const exportCache = new Map<string, Set<string>>();
function exportedNames(_program: ts.Program, resolvedFile: string | undefined): Set<string> {
  if (!resolvedFile) return new Set();
  const key = path.resolve(resolvedFile);
  if (exportCache.has(key)) return exportCache.get(key)!;
  const program = ts.createProgram([resolvedFile], options);
  const sf = program.getSourceFile(resolvedFile) || program.getSourceFiles().find((x) => path.resolve(x.fileName) === key);
  if (!sf) return new Set();
  const checker = program.getTypeChecker();
  const sym = checker.getSymbolAtLocation(sf) || (sf as any).symbol;
  if (!sym) return new Set();
  const out = new Set(checker.getExportsOfModule(sym).map((x) => x.getName()));
  exportCache.set(key, out);
  return out;
}

function analyze(run: "week1" | "week2", sourcePath: string, unit: Unit, technique: string) {
  const sourceText = fs.readFileSync(sourcePath, "utf8");
  const inPlace = path.join(ROOT, path.dirname(unit.file), `${unit.class_name}.pilot.test.ts`);
  const host = ts.createCompilerHost(options, true);
  const originalFileExists = host.fileExists.bind(host);
  const originalReadFile = host.readFile.bind(host);
  const same = (a: string, b: string) => path.resolve(a) === path.resolve(b);
  host.fileExists = (f) => same(f, inPlace) || originalFileExists(f);
  host.readFile = (f) => same(f, inPlace) ? sourceText : originalReadFile(f);
  host.getSourceFile = (f, languageVersion, onError, shouldCreateNewSourceFile) => {
    if (same(f, inPlace)) return ts.createSourceFile(f, sourceText, languageVersion, true, ts.ScriptKind.TS);
    const text = originalReadFile(f);
    if (text === undefined) { if (onError) onError(`Cannot read ${f}`); return undefined; }
    return ts.createSourceFile(f, text, languageVersion, true);
  };
  const program = ts.createProgram([inPlace], options, host);
  const sf = program.getSourceFile(inPlace);
  if (!sf) throw new Error(`virtual source missing: ${inPlace}`);
  const checker = program.getTypeChecker();
  const statics: any[] = [];
  const dynamic: any[] = [];

  function resolve(specifier: string) {
    const rr = ts.resolveModuleName(specifier, inPlace, options, ts.sys).resolvedModule;
    return { resolves: !!rr, resolved_file: rel(rr?.resolvedFileName), resolved_abs: rr?.resolvedFileName };
  }

  function visit(n: ts.Node) {
    if (ts.isImportDeclaration(n) && ts.isStringLiteral(n.moduleSpecifier)) {
      const specifier = n.moduleSpecifier.text;
      const rr = resolve(specifier);
      const moduleSymbol = checker.getSymbolAtLocation(n.moduleSpecifier);
      const semanticExports = moduleSymbol ? new Set(checker.getExportsOfModule(moduleSymbol).map((x) => x.getName())) : new Set<string>();
      const exports = semanticExports.size ? semanticExports : exportedNames(program, rr.resolved_abs);
      const names: ImportedName[] = [];
      const clause = n.importClause;
      if (clause?.name) names.push({ kind: "default", imported: "default", local: clause.name.text, type_only: clause.isTypeOnly, exported: exports.has("default") });
      if (clause?.namedBindings && ts.isNamespaceImport(clause.namedBindings)) {
        names.push({ kind: "namespace", imported: "*", local: clause.namedBindings.name.text, type_only: clause.isTypeOnly, exported: rr.resolves ? true : null });
      } else if (clause?.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const el of clause.namedBindings.elements) {
          const imported = el.propertyName?.text || el.name.text;
          names.push({ kind: "named", imported, local: el.name.text, type_only: clause.isTypeOnly || el.isTypeOnly, exported: rr.resolves ? exports.has(imported) : null });
        }
      }
      const importsClass = names.some((x) => x.kind === "named" && x.imported === unit.class_name);
      statics.push({ kind: "static", specifier, imported_names: names, resolves: rr.resolves, resolved_file: rr.resolved_file,
        module_exports_class_under_test: rr.resolves ? exports.has(unit.class_name) : false,
        imports_class_under_test: importsClass, relative: specifier.startsWith("."), ends_in_js: specifier.endsWith(".js") });
    } else if (ts.isCallExpression(n) && n.arguments.length && ts.isStringLiteralLike(n.arguments[0])) {
      let kind: string | null = null;
      if (n.expression.kind === ts.SyntaxKind.ImportKeyword && ts.isAwaitExpression(n.parent)) kind = "await_import";
      if (ts.isPropertyAccessExpression(n.expression) && ts.isIdentifier(n.expression.expression) && n.expression.expression.text === "vi" && n.expression.name.text === "mock") kind = "vi.mock";
      if (kind) {
        const specifier = n.arguments[0].text;
        const rr = resolve(specifier);
        dynamic.push({ kind, specifier, resolves: rr.resolves, resolved_file: rr.resolved_file, relative: specifier.startsWith("."), ends_in_js: specifier.endsWith(".js") });
      }
    }
    ts.forEachChild(n, visit);
  }
  visit(sf);

  const given = moduleSpecifierFor(unit);
  const cut = statics.filter((x) => x.imports_class_under_test);
  const cutBindings = new Set<string>(cut.flatMap((x) => x.imported_names
    .filter((n: ImportedName) => n.kind === "named" && n.imported === unit.class_name)
    .map((n: ImportedName) => n.local)));
  let callsWithoutNew = 0;
  let newExpressions = 0;
  function countCutUse(n: ts.Node) {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && cutBindings.has(n.expression.text)) callsWithoutNew++;
    if (ts.isNewExpression(n) && ts.isIdentifier(n.expression) && cutBindings.has(n.expression.text)) newExpressions++;
    ts.forEachChild(n, countCutUse);
  }
  countCutUse(sf);
  let cutImport: "given_specifier_resolves" | "other_specifier_resolves" | "present_unresolved" | "absent" = "absent";
  if (cut.some((x) => x.specifier === given && x.resolves && x.module_exports_class_under_test)) cutImport = "given_specifier_resolves";
  else if (cut.some((x) => x.resolves && x.module_exports_class_under_test)) cutImport = "other_specifier_resolves";
  else if (cut.length) cutImport = "present_unresolved";

  const nonCut = statics.filter((x) => !x.imports_class_under_test);
  const notExported = nonCut.flatMap((x) => x.imported_names
    .filter((n: ImportedName) => n.kind === "named" && n.exported === false)
    .map((n: ImportedName) => ({ specifier: x.specifier, imported: n.imported, local: n.local })));
  const importedCounts = new Map<string, number>();
  for (const x of statics) for (const n of x.imported_names as ImportedName[]) {
    if (n.kind !== "namespace") importedCounts.set(n.imported, (importedCounts.get(n.imported) || 0) + 1);
  }
  const duplicates = [...importedCounts].filter(([, count]) => count > 1).map(([name, count]) => ({ name, count }));
  return {
    run, unit_id: unit.unit_id, class_name: unit.class_name, technique,
    generated_file: rel(sourcePath), in_place_path: rel(inPlace), given_specifier: given,
    static_imports: statics, dynamic_modules: dynamic, cut_import: cutImport,
    non_cut_imports: {
      total: nonCut.length,
      resolved: nonCut.filter((x) => x.resolves).length,
      unresolved: nonCut.filter((x) => !x.resolves).length,
      named_imports_not_exported: notExported.length,
      named_imports_not_exported_details: notExported,
      relative_with_js: nonCut.filter((x) => x.relative && x.ends_in_js).length,
      relative_without_js: nonCut.filter((x) => x.relative && !x.ends_in_js).length,
    },
    duplicate_imported_names: duplicates,
    cut_constructor_usage: { bindings: [...cutBindings].sort(), calls_without_new: callsWithoutNew, new_expressions: newExpressions },
  };
}

const inputs: { run: "week1" | "week2"; file: string }[] = [];
for (const file of fs.readdirSync(path.join(EXP, "generated")).filter((x) => x.endsWith(".test.ts"))) inputs.push({ run: "week2", file: path.join(EXP, "generated", file) });
for (const file of fs.readdirSync(path.join(W1, "generated")).filter((x) => x.endsWith(".test.ts"))) inputs.push({ run: "week1", file: path.join(W1, "generated", file) });
const rows = inputs.map(({ run, file }) => {
  const m = path.basename(file).match(/^(.+)\.(COT|TOT|GTOT)\.test\.ts$/);
  if (!m) throw new Error(`unexpected generated filename: ${file}`);
  const unit = byId.get(m[1]);
  if (!unit) throw new Error(`unknown unit: ${m[1]}`);
  return analyze(run, file, unit, m[2]);
}).sort((a, b) => a.run.localeCompare(b.run) || (sampleOrder.get(a.unit_id)! - sampleOrder.get(b.unit_id)!) || a.technique.localeCompare(b.technique));

const summary: any = {};
for (const run of ["week1", "week2"] as const) {
  const rs = rows.filter((r) => r.run === run);
  const cutCounts: Record<string, number> = {};
  for (const r of rs) cutCounts[r.cut_import] = (cutCounts[r.cut_import] || 0) + 1;
  summary[run] = {
    files: rs.length,
    cut_import_counts: cutCounts,
    non_cut_imports_total: rs.reduce((n, r) => n + r.non_cut_imports.total, 0),
    non_cut_imports_unresolved: rs.reduce((n, r) => n + r.non_cut_imports.unresolved, 0),
    non_cut_named_imports_not_exported: rs.reduce((n, r) => n + r.non_cut_imports.named_imports_not_exported, 0),
    relative_non_cut_with_js: rs.reduce((n, r) => n + r.non_cut_imports.relative_with_js, 0),
    relative_non_cut_without_js: rs.reduce((n, r) => n + r.non_cut_imports.relative_without_js, 0),
    files_with_cut_calls_without_new: rs.filter((r) => r.cut_constructor_usage.calls_without_new > 0).length,
    cut_calls_without_new: rs.reduce((n, r) => n + r.cut_constructor_usage.calls_without_new, 0),
    files_using_new_on_cut: rs.filter((r) => r.cut_constructor_usage.new_expressions > 0).length,
    cut_new_expressions: rs.reduce((n, r) => n + r.cut_constructor_usage.new_expressions, 0),
  };
}
fs.writeFileSync(path.join(RESULTS, "rq2-import-audit.json"), JSON.stringify({ definition: "TypeScript compiler API resolution using packages/zod/tsconfig.test.json options; generated content is hosted virtually at its D6 in-place path.", summary, rows }, null, 2));

const md = [
  "# RQ2 import audit", "",
  "| run | unit | technique | CUT import | non-CUT total | resolved | unresolved | named not exported | relative .js | relative no .js | CUT calls without `new` | CUT `new` expressions | duplicate names |", "|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|",
  ...rows.map((r) => `| ${r.run} | ${r.unit_id} | ${r.technique} | ${r.cut_import} | ${r.non_cut_imports.total} | ${r.non_cut_imports.resolved} | ${r.non_cut_imports.unresolved} | ${r.non_cut_imports.named_imports_not_exported} | ${r.non_cut_imports.relative_with_js} | ${r.non_cut_imports.relative_without_js} | ${r.cut_constructor_usage.calls_without_new} | ${r.cut_constructor_usage.new_expressions} | ${r.duplicate_imported_names.map((x: any) => `${x.name}×${x.count}`).join(", ") || "—"} |`),
  "", "## Summary", "", "```json", JSON.stringify(summary, null, 2), "```", "",
];
fs.writeFileSync(path.join(RESULTS, "rq2-import-audit.md"), md.join("\n"));
console.log(JSON.stringify(summary, null, 2));
