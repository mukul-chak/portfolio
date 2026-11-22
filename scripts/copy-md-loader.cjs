// Webpack loader for src/content/copy.md (see next.config.mjs). Exports the
// file as a string with its <!-- comments --> removed, so editorial notes
// never reach the browser bundle.
module.exports = function copyMdLoader(source) {
  return `export default ${JSON.stringify(source.replace(/<!--[\s\S]*?-->/g, ""))};`;
};
