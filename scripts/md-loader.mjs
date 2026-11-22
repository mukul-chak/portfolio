// Lets the tsx build scripts import .md files as strings, comments stripped,
// as webpack does for the site (next.config.mjs, copy-md-loader.cjs).
// Registered with `tsx --import`. An ES module hook: it relies on
// package.json's "type": "module".
import { register } from "node:module";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export async function load(url, context, nextLoad) {
  if (!url.endsWith(".md")) return nextLoad(url, context);
  const source = (await readFile(fileURLToPath(url), "utf8")).replace(/<!--[\s\S]*?-->/g, "");
  return { format: "module", source: `export default ${JSON.stringify(source)};`, shortCircuit: true };
}

if (!process.env.__MD_LOADER) {
  process.env.__MD_LOADER = "1";
  register(import.meta.url);
}
