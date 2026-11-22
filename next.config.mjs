import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // A stray package-lock.json in the home folder made Next guess the wrong
  // workspace root. This project is the root.
  outputFileTracingRoot: import.meta.dirname,
  // src/content/copy.md is imported as a string, comments stripped (see
  // src/content/copy.ts and scripts/copy-md-loader.cjs).
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: path.resolve("scripts/copy-md-loader.cjs"),
    });
    return config;
  },
};

export default nextConfig;
