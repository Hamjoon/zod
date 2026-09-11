/**
 * check-syntax.ts: Phase 5 step 1. Parse each file with ts.createSourceFile and report parseDiagnostics.
 * Usage (repo root): npx tsx experiments/pilot-2026-09-import/scripts/check-syntax.ts <file> [<file> ...]
 * Prints one JSON array: [{file, syntax_ok, error_count, first_messages: [{code, line, message}]}]
 */
import * as ts from "typescript";
import * as fs from "node:fs";
const files = process.argv.slice(2);
const out = files.map((f) => {
  const text = fs.readFileSync(f, "utf8");
  const sf = ts.createSourceFile(f, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const diags = ((sf as any).parseDiagnostics as ts.Diagnostic[]) || [];
  return {
    file: f,
    syntax_ok: diags.length === 0,
    error_count: diags.length,
    first_messages: diags.slice(0, 3).map((d) => ({
      code: "TS" + d.code,
      line: d.start != null ? sf.getLineAndCharacterOfPosition(d.start).line + 1 : null,
      message: ts.flattenDiagnosticMessageText(d.messageText, "\n"),
    })),
  };
});
console.log(JSON.stringify(out));
