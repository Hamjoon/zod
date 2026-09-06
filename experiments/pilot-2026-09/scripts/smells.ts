/**
 * smells.ts: Phase 7 test smells (two rules, see results/smell-rules.md), TypeScript AST based.
 * Usage (repo root): npx tsx experiments/pilot-2026-09/scripts/smells.ts <file> [<file> ...]
 * Prints one JSON array with one entry per file.
 */
import * as ts from "typescript";
import * as fs from "node:fs";

function calleeRoot(e: ts.Expression): string | null {
  for (;;) {
    if (ts.isIdentifier(e)) return e.text;
    if (ts.isPropertyAccessExpression(e) || ts.isCallExpression(e) || ts.isParenthesizedExpression(e) || ts.isNonNullExpression(e)) { e = e.expression; continue; }
    return null;
  }
}
function isFn(n: ts.Node): n is ts.ArrowFunction | ts.FunctionExpression { return ts.isArrowFunction(n) || ts.isFunctionExpression(n); }

/** outermost node of an expect chain: expect(x).not.toBe(y) etc. */
function chainTop(call: ts.CallExpression): ts.Node {
  let n: ts.Node = call;
  for (;;) {
    const p = n.parent;
    if (p && ((ts.isPropertyAccessExpression(p) && p.expression === n) || (ts.isCallExpression(p) && p.expression === n) || ts.isNonNullExpression(p))) { n = p; continue; }
    return n;
  }
}
function numericText(n: ts.NumericLiteral | ts.BigIntLiteral): string {
  const p = n.parent;
  const neg = p && ts.isPrefixUnaryExpression(p) && p.operator === ts.SyntaxKind.MinusToken;
  return (neg ? "-" : "") + n.text;
}
const TRIVIAL = new Set(["0", "1", "-1", "0n", "1n", "-1n"]);

function analyzeFile(file: string) {
  const text = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const tests: any[] = [];
  function visit(n: ts.Node) {
    if (ts.isCallExpression(n)) {
      const root = calleeRoot(n.expression);
      const fnArg = [...n.arguments].reverse().find(isFn);
      if ((root === "test" || root === "it") && fnArg) {
        const nameArg = n.arguments[0];
        const name = nameArg && (ts.isStringLiteral(nameArg) || ts.isNoSubstitutionTemplateLiteral(nameArg)) ? nameArg.text : (nameArg ? nameArg.getText(sf).slice(0, 60) : null);
        const t = { name, line: sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1, expect_calls: 0, expects_with_message: 0, magic_literals: [] as string[], assertion_roulette: false, magic_number: false };
        const seenTops = new Set<ts.Node>();
        function inner(m: ts.Node) {
          if (ts.isCallExpression(m) && ts.isIdentifier(m.expression) && m.expression.text === "expect") {
            t.expect_calls++;
            if (m.arguments.length >= 2) t.expects_with_message++;
            const top = chainTop(m);
            if (!seenTops.has(top)) {
              seenTops.add(top);
              const walk = (k: ts.Node) => {
                if (ts.isNumericLiteral(k) || ts.isBigIntLiteral(k)) { const v = numericText(k); if (!TRIVIAL.has(v)) t.magic_literals.push(v); }
                ts.forEachChild(k, walk);
              };
              walk(top);
            }
          }
          ts.forEachChild(m, inner);
        }
        inner(fnArg.body);
        t.assertion_roulette = t.expect_calls >= 2 && t.expects_with_message === 0;
        t.magic_number = t.magic_literals.length > 0;
        tests.push(t);
      }
    }
    ts.forEachChild(n, visit);
  }
  visit(sf);
  const n = tests.length;
  const ar = tests.filter((t) => t.assertion_roulette).length;
  const mn = tests.filter((t) => t.magic_number).length;
  return { file, test_count: n, expect_calls: tests.reduce((s, t) => s + t.expect_calls, 0), file_loc: text.split("\n").length,
           assertion_roulette_tests: ar, assertion_roulette_share: n ? +(ar / n).toFixed(4) : null,
           magic_number_tests: mn, magic_number_share: n ? +(mn / n).toFixed(4) : null, tests };
}
console.log(JSON.stringify(process.argv.slice(2).map(analyzeFile)));
