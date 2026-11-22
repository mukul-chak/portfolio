/**
 * Fails when copy.md has a missing, misspelled or unused entry, or when a
 * component carries copy of its own instead of reading it from copy.md.
 * Runs with `npm run lint`.
 *
 * Flags:
 *   - text written between JSX tags (<p>Hello</p>)
 *   - string literals in text-bearing props (title, label, placeholder,
 *     aria-label, alt), including inside a ternary
 *   - string literals passed to showSuccessToast
 *   - string literals written as JSX children ({"Hello"})
 *   - string literals in text-bearing object keys (label, title, …)
 *
 * A single character is allowed: the hotkey badges (<Kbd>L</Kbd>).
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
// Loading the copy module validates copy.md itself: missing, misspelled or
// unused entries throw here.
import "@/content/copy";

const ROOTS = ["src/app", "src/components", "src/lib"];
const TEXT_PROPS = new Set(["title", "label", "placeholder", "aria-label", "alt"]);
const WORDS = /[A-Za-z]{2,}/;
const TEXT_KEYS = new Set(["label", "title", "placeholder", "caption", "text", "description"]);

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) return files(p);
    return /\.tsx?$/.test(name) ? [p] : [];
  });
}

const problems: string[] = [];

for (const file of ROOTS.flatMap(files)) {
  const sf = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const report = (node: ts.Node, text: string) => {
    const { line } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
    problems.push(`${file}:${line + 1}  ${JSON.stringify(text.trim().replace(/\s+/g, " "))}`);
  };
  const literals = (node: ts.Node | undefined) => {
    if (!node) return;
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && WORDS.test(node.text)) {
      report(node, node.text);
    } else if (ts.isTemplateExpression(node) && WORDS.test(node.head.text + node.templateSpans.map((s) => s.literal.text).join(""))) {
      report(node, node.getText(sf));
    } else if (ts.isConditionalExpression(node)) {
      literals(node.whenTrue);
      literals(node.whenFalse);
    } else if (ts.isParenthesizedExpression(node) || ts.isJsxExpression(node)) {
      literals(node.expression);
    }
  };

  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node) && WORDS.test(node.text)) report(node, node.text);
    if (ts.isJsxExpression(node) && node.parent && (ts.isJsxElement(node.parent) || ts.isJsxFragment(node.parent))) {
      literals(node.expression);
    }
    if (ts.isPropertyAssignment(node) && TEXT_KEYS.has(node.name.getText(sf).replace(/["']/g, ""))) {
      literals(node.initializer);
    }
    if (ts.isJsxAttribute(node) && TEXT_PROPS.has(node.name.getText(sf))) literals(node.initializer);
    if (ts.isCallExpression(node) && node.expression.getText(sf) === "showSuccessToast") {
      node.arguments.forEach(literals);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

if (problems.length) {
  console.error(`copy: ${problems.length} piece(s) of copy outside src/content/copy.md:\n`);
  console.error(problems.map((p) => `  ${p}`).join("\n"));
  console.error("\nMove each into copy.md and read it through `copy` (src/content/copy.ts).");
  process.exit(1);
}
console.log("copy: every string on the site comes from copy.md");
