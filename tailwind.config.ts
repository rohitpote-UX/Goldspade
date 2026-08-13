import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "var(--color-canvas)",
        "primary-dark": "var(--color-primary-dark)",
        "secondary-dark": "var(--color-secondary-dark)",
        mint: "#73F3C5",
        "editorial-border": "var(--color-editorial-border)",
        "nav-border": "var(--color-nav-border)",
        white: "var(--color-white)",
        "pure-white": "#FFFFFF",
        black: "#000000",
        "near-black": "#0A0A0A",
        "dark-gray": "#111111",
        "mid-gray": "#666666",
        "light-gray": "#EAEAEA",
        "off-white": "#F7F7F7",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.055em",
        tight: "-0.04em",
        normal: "0em",
        wide: "0.05em",
        wider: "0.1em",
        widest: "0.2em",
      },
      borderRadius: {
        "3xl": "1.75rem", // 28px
        "4xl": "2.25rem",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
        "36": "9rem",
      },
    },
  },
  plugins: [],
};

export default config;
