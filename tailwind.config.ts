import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        rule: "var(--rule)",
        heading: "var(--heading)",
        body: "var(--body)",
        muted: "var(--muted)",
        card: "var(--card)",
      },
      maxWidth: {
        frame: "var(--frame-w)",
        column: "var(--column-w)",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
