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
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config
