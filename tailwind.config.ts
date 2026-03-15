import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: "#030305",
        neonCyan: "#00f3ff",
        electricBlue: "#003cff",
        violet: "#b026ff",
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      }
    },
  },
  plugins: [],
};
export default config;
