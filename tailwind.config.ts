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
        mospi: {
          saffron: {
            DEFAULT: "#FF9933",
            light: "#FFB366",
            dark: "#CC7A29",
          },
          navy: {
            DEFAULT: "#000080",
            light: "#1A1A99",
            dark: "#000066",
            deep: "#0B132B",
          },
          green: {
            DEFAULT: "#138808",
            light: "#28A745",
            dark: "#0E6606",
          },
          gold: "#D4AF37",
          ashoka: "#000088",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
