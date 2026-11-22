import path from "node:path";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
