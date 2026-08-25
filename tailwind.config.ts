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
        brand: {
          navy: "#142446",
          "navy-light": "#1e3460",
          slate: "#475A6F",
          "slate-light": "#5c7080",
          dusty: "#B7C7D9",
          "dusty-light": "#cdd9e5",
          ivory: "#F3E7D1",
          "ivory-dark": "#e8d8b8",
          saffron: "#D8921E",
          "saffron-light": "#e8a835",
          stone: "#C7C2BA",
          "stone-dark": "#a8a39b",
        },
        mospi: {
          saffron: {
            DEFAULT: "#FF9933",
            light: "#FFB366",
            dark: "#CC7A29",
          },
          navy: {
            DEFAULT: "#142446",
            light: "#1e3460",
            dark: "#0d1a33",
            deep: "#0a1225",
          },
          green: {
            DEFAULT: "#138808",
            light: "#28A745",
            dark: "#0E6606",
          },
          gold: "#D8921E",
          ashoka: "#142446",
        },
      },
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        display: ["'Playfair Display'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        devanagari: ["'Noto Sans Devanagari'", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-right": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "underline-grow": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-up-delay-1": "fade-up 0.6s ease-out 0.1s forwards",
        "fade-up-delay-2": "fade-up 0.6s ease-out 0.2s forwards",
        "fade-up-delay-3": "fade-up 0.6s ease-out 0.3s forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "count-up": "count-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
