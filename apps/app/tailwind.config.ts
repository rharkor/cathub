import { heroui } from "@heroui/react"
import type { Config } from "tailwindcss"

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#ffffff",
        primary: {
          DEFAULT: "#ff9000",
          hover: "#ff7300",
        },
        secondary: {
          DEFAULT: "#1b1b1b",
          hover: "#2d2d2d",
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui(),
    function ({ addBase }: { addBase: any }) {
      addBase({
        body: { color: "#ffffff", fontWeight: "normal", fontSize: "1rem" },
        h1: { color: "#ff9000", fontWeight: "700", fontSize: "2rem" },
        h2: { color: "#ff9000", fontWeight: "700", fontSize: "1.5rem" },
        h3: { color: "#ff9000", fontWeight: "700", fontSize: "1.25rem" },
        p: { color: "#ffffff", fontWeight: "normal", fontSize: "1rem" },
        span: { color: "#ffffff", fontWeight: "normal", fontSize: "1rem" },
        label: { color: "#ffffff", fontWeight: "normal", fontSize: "1rem" },
      })
    },
  ],
} satisfies Config
