import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        indeterminate: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        indeterminate: "indeterminate 1.5s infinite linear",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "custom-link": "#1791AC",
        'border-muted': '#242b3d',
        'bg-base': '#0E1525',
        'bg-muted': '#0E1525',
        'bg-header': '#0E1525',
        'bg-footer': '#0E1525',
        'text-nav-link': '#D6CAF1',
      },
    },
  },
  plugins: [],
  important: true,
};
export default config;
